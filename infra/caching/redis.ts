/**
 * @tattva/infra — Redis Client Setup
 *
 * Connection factory with retry logic, graceful shutdown, and
 * environment-aware configuration for the Tattva platform.
 *
 * Usage:
 *   import { getRedisClient } from "@/infra/caching/redis";
 *   const redis = getRedisClient();
 *   await redis.set("key", "value", { EX: 3600 });
 */

import { createClient, type RedisClientType } from "redis";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface RedisConfig {
  /** Full Redis URL (redis://user:pass@host:port/db) */
  url?: string;
  /** Custom host (overridden by url if provided) */
  host?: string;
  /** Custom port (overridden by url if provided) */
  port?: number;
  /** Password (overridden by url if provided) */
  password?: string;
  /** Database number */
  db?: number;
  /** Maximum number of reconnection attempts */
  maxRetries?: number;
  /** Enable offline queue while disconnected */
  enableOfflineQueue?: boolean;
  /** Key prefix for namespacing (e.g. "tattva:") */
  keyPrefix?: string;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
const DEFAULT_CONFIG: Required<Pick<RedisConfig, "maxRetries" | "enableOfflineQueue" | "keyPrefix">> = {
  maxRetries: 10,
  enableOfflineQueue: true,
  keyPrefix: "tattva:",
};

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------
let client: RedisClientType | null = null;
let isShuttingDown = false;

// ---------------------------------------------------------------------------
// Connection factory
// ---------------------------------------------------------------------------

/**
 * Get or create the shared Redis client singleton.
 *
 * Resolves configuration from (in order of priority):
 * 1. Explicit `config` parameter
 * 2. Environment variables (REDIS_URL, REDIS_HOST, REDIS_PORT, etc.)
 * 3. Defaults (localhost:6379)
 */
export function getRedisClient(config?: RedisConfig): RedisClientType {
  if (client) return client;

  const url =
    config?.url ??
    process.env.REDIS_URL ??
    (process.env.REDIS_HOST || process.env.REDIS_PORT || process.env.REDIS_PASSWORD
      ? buildRedisUrl(config)
      : undefined);

  const maxRetries = config?.maxRetries ?? DEFAULT_CONFIG.maxRetries;
  const enableOfflineQueue = config?.enableOfflineQueue ?? DEFAULT_CONFIG.enableOfflineQueue;
  const keyPrefix = config?.keyPrefix ?? DEFAULT_CONFIG.keyPrefix;

  let retryCount = 0;

  client = createClient({
    url,
    password: config?.password ?? (url ? undefined : process.env.REDIS_PASSWORD),
    socket: {
      reconnectStrategy: (retries) => {
        if (isShuttingDown) return new Error("Shutting down — stop reconnecting");
        if (retries > maxRetries) {
          console.error(`[redis] Max reconnection attempts (${maxRetries}) reached. Giving up.`);
          return new Error("Max reconnection attempts reached");
        }

        // Exponential backoff with jitter: ~100ms, ~200ms, ~400ms, … max 5s
        const baseDelay = Math.min(retries * 100, 5000);
        const jitter = Math.random() * 100;
        const delay = baseDelay + jitter;

        console.warn(`[redis] Reconnecting in ${Math.round(delay)}ms (attempt ${retries}/${maxRetries})`);
        return delay;
      },
      enableOfflineQueue,
    },
    ...(keyPrefix ? { keyPrefix } : {}),
    ...(config?.db != null ? { database: config.db } : {}),
  }) as RedisClientType;

  // ── Event handlers ─────────────────────────────────────────────────────
  client.on("connect", () => {
    retryCount = 0;
    console.info("[redis] Connected");
  });

  client.on("ready", () => {
    console.info("[redis] Ready to accept commands");
  });

  client.on("disconnect", () => {
    console.warn("[redis] Disconnected");
  });

  client.on("reconnecting", () => {
    retryCount++;
    console.info(`[redis] Reconnecting (attempt ${retryCount})…`);
  });

  client.on("error", (err) => {
    console.error("[redis] Error:", err.message);
  });

  client.on("end", () => {
    console.info("[redis] Connection closed");
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────
  registerShutdownHook();

  return client;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildRedisUrl(config?: RedisConfig): string {
  const host = config?.host ?? process.env.REDIS_HOST ?? "localhost";
  const port = config?.port ?? Number(process.env.REDIS_PORT) || 6379;
  const password = config?.password ?? process.env.REDIS_PASSWORD;
  const db = config?.db ?? Number(process.env.REDIS_DB) || 0;

  const auth = password ? `:${password}@` : "";
  return `redis://${auth}${host}:${port}/${db}`;
}

function registerShutdownHook(): void {
  if (isShuttingDown) return;

  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.info(`\n[redis] Received ${signal}, closing connection…`);

    if (client) {
      try {
        await client.quit(); // Drain pending commands then close
        console.info("[redis] Connection closed gracefully");
      } catch {
        // Force disconnect if quit fails
        client.destroy();
        console.info("[redis] Connection force-closed");
      }
      client = null;
    }

    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

// ---------------------------------------------------------------------------
// Convenience: Cache helpers
// ---------------------------------------------------------------------------

interface CacheOptions {
  /** Time-to-live in seconds */
  ttl: number;
  /** Key prefix override */
  prefix?: string;
}

/**
 * Get a cached value, or compute and cache it if missing.
 *
 * @example
 *   const data = await cacheOrCompute("user:123", () => fetchUser(123), { ttl: 300 });
 */
export async function cacheOrCompute<T>(
  key: string,
  compute: () => Promise<T>,
  options: CacheOptions,
): Promise<T> {
  const redis = getRedisClient();
  const fullKey = options.prefix ? `${options.prefix}:${key}` : key;

  try {
    const cached = await redis.get(fullKey);
    if (cached !== null) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.warn(`[redis] Cache read error for key "${fullKey}":`, err);
  }

  const value = await compute();

  try {
    await redis.set(fullKey, JSON.stringify(value), { EX: options.ttl });
  } catch (err) {
    console.warn(`[redis] Cache write error for key "${fullKey}":`, err);
  }

  return value;
}

/**
 * Invalidate cache entries matching a pattern.
 */
export async function invalidateCache(pattern: string): Promise<number> {
  const redis = getRedisClient();
  const keys = await redis.keys(pattern);

  if (keys.length === 0) return 0;

  const deleted = await redis.del(keys);
  console.info(`[redis] Invalidated ${deleted} keys matching "${pattern}"`);
  return deleted;
}
