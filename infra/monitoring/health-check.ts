/**
 * @tattva/infra — Health Check Utility
 *
 * Provides structured health-check responses for API routes.
 * Designed to be used in Next.js Route Handlers (app/api/health/route.ts).
 *
 * Usage:
 *   import { createHealthHandler } from "@/infra/monitoring/health-check";
 *   export const GET = createHealthHandler({ checks: [dbCheck, redisCheck] });
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface HealthCheckResult {
  name: string;
  status: "healthy" | "degraded" | "unhealthy";
  latencyMs: number;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface HealthCheckConfig {
  /** Individual health checks to run */
  checks: HealthCheck[];
  /** Include system info (memory, uptime) in response */
  includeSystemInfo?: boolean;
  /** Custom version string */
  version?: string;
}

export type HealthCheck = () => Promise<Omit<HealthCheckResult, "latencyMs">>;

// ---------------------------------------------------------------------------
// System info
// ---------------------------------------------------------------------------
interface SystemInfo {
  timestamp: string;
  uptimeSeconds: number;
  memory: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
    arrayBuffers: string;
  };
  nodeVersion: string;
}

function getSystemInfo(): SystemInfo {
  const mem = process.memoryUsage();
  const toMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  return {
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      rss: toMB(mem.rss),
      heapTotal: toMB(mem.heapTotal),
      heapUsed: toMB(mem.heapUsed),
      external: toMB(mem.external),
      arrayBuffers: toMB(mem.arrayBuffers),
    },
    nodeVersion: process.version,
  };
}

// ---------------------------------------------------------------------------
// Built-in check helpers
// ---------------------------------------------------------------------------

/** Create a PostgreSQL health check */
export function createDbCheck(queryFn: (sql: string) => Promise<unknown>): HealthCheck {
  return async () => {
    try {
      const start = performance.now();
      await queryFn("SELECT 1");
      const latency = performance.now() - start;

      return {
        name: "postgresql",
        status: latency < 100 ? "healthy" : "degraded",
        message: `Query latency: ${latency.toFixed(1)}ms`,
        meta: { latencyMs: Math.round(latency) },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown database error";
      return {
        name: "postgresql",
        status: "unhealthy" as const,
        message,
      };
    }
  };
}

/** Create a Redis health check */
export function createRedisCheck(pingFn: () => Promise<string>): HealthCheck {
  return async () => {
    try {
      const start = performance.now();
      const result = await pingFn();
      const latency = performance.now() - start;

      return {
        name: "redis",
        status: result === "PONG" && latency < 50 ? "healthy" : "degraded",
        message: `PING latency: ${latency.toFixed(1)}ms`,
        meta: { latencyMs: Math.round(latency), pong: result },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown Redis error";
      return {
        name: "redis",
        status: "unhealthy" as const,
        message,
      };
    }
  };
}

// ---------------------------------------------------------------------------
// Core handler factory
// ---------------------------------------------------------------------------

/**
 * Create a Next.js Route Handler for health checks.
 *
 * Returns 200 if all checks are healthy/degraded, 503 if any is unhealthy.
 */
export function createHealthHandler(config: HealthCheckConfig) {
  return async function healthHandler(): Promise<Response> {
    const startTime = performance.now();

    // Run all checks in parallel
    const checkPromises = config.checks.map(async (check) => {
      const checkStart = performance.now();
      const result = await check();
      const latencyMs = Math.round(performance.now() - checkStart);
      return { ...result, latencyMs } satisfies HealthCheckResult;
    });

    const results = await Promise.allSettled(checkPromises);

    // Process results — handle both fulfilled and rejected promises
    const checks: HealthCheckResult[] = results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      return {
        name: `check-${index}`,
        status: "unhealthy",
        latencyMs: 0,
        message: result.reason?.message ?? "Check threw an error",
      };
    });

    const hasUnhealthy = checks.some((c) => c.status === "unhealthy");
    const hasDegraded = checks.some((c) => c.status === "degraded");

    const overall: "healthy" | "degraded" | "unhealthy" = hasUnhealthy
      ? "unhealthy"
      : hasDegraded
        ? "degraded"
        : "healthy";

    const totalLatencyMs = Math.round(performance.now() - startTime);

    const body: Record<string, unknown> = {
      status: overall,
      version: config.version ?? process.env.npm_package_version ?? "unknown",
      totalLatencyMs,
      checks,
    };

    if (config.includeSystemInfo !== false) {
      body.system = getSystemInfo();
    }

    const statusCode = overall === "unhealthy" ? 503 : 200;

    return new Response(JSON.stringify(body, null, 2), {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Health-Status": overall,
      },
    });
  };
}
