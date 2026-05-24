import { NextResponse } from "next/server";

interface HealthCheckResponse {
  status: "ok" | "degraded" | "down";
  timestamp: string;
  version: string;
  uptime: number;
  services: {
    database: "connected" | "disconnected" | "unknown";
    auth: "operational" | "degraded" | "down";
  };
}

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const startTime = Date.now();

  // In production, these would check actual service health
  const dbStatus = "connected" as const;
  const authStatus = "operational" as const;

  const overallStatus: HealthCheckResponse["status"] =
    dbStatus === "connected" && authStatus === "operational"
      ? "ok"
      : "degraded";

  const response: HealthCheckResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: "0.1.0",
    uptime: process.uptime(),
    services: {
      database: dbStatus,
      auth: authStatus,
    },
  };

  return NextResponse.json(response, {
    status: overallStatus === "ok" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Response-Time": `${Date.now() - startTime}ms`,
    },
  });
}
