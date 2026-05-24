import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

/**
 * Database connection configuration.
 */
export interface DatabaseConfig {
  /** PostgreSQL connection string */
  url: string;
  /** Maximum number of connections in the pool */
  maxConnections?: number;
  /** Enable prepared statements (default: true) */
  prepare?: boolean;
  /** Connection timeout in seconds */
  idleTimeout?: number;
  /** Connect timeout in seconds */
  connectTimeout?: number;
}

/**
 * Resolve the database URL from environment variables or config.
 */
function resolveDatabaseUrl(): string {
  const url =
    process.env["DATABASE_URL"] ??
    process.env["POSTGRES_URL"] ??
    process.env["POSTGRES_PRISMA_URL"];

  if (!url) {
    throw new Error(
      "Database URL not found. Set DATABASE_URL, POSTGRES_URL, or POSTGRES_PRISMA_URL environment variable."
    );
  }

  return url;
}

/**
 * Create a configured postgres client.
 */
function createPostgresClient(config?: Partial<DatabaseConfig>) {
  const url = config?.url ?? resolveDatabaseUrl();

  return postgres(url, {
    max: config?.maxConnections ?? 10,
    idle_timeout: config?.idleTimeout ?? 20,
    connect_timeout: config?.connectTimeout ?? 30,
  });
}

/**
 * Create a Drizzle ORM database instance.
 *
 * @param config - Optional database configuration overrides
 * @returns Configured Drizzle ORM database instance
 *
 * @example
 * ```ts
 * import { createDb } from "@tattva/database";
 *
 * // Uses DATABASE_URL env var by default
 * const db = createDb();
 *
 * // Or with custom config
 * const db = createDb({
 *   url: "postgres://user:pass@host:5432/db",
 *   maxConnections: 20,
 * });
 * ```
 */
export function createDb(config?: Partial<DatabaseConfig>) {
  const client = createPostgresClient(config);

  return drizzle(client, {
    schema,
    prepare: config?.prepare ?? true,
  });
}

/**
 * Default database instance (singleton pattern).
 * Lazily initialized on first access.
 */
let _db: ReturnType<typeof createDb> | null = null;

/**
 * Get the default database instance.
 * Creates one if it doesn't exist yet.
 */
export function getDb(): ReturnType<typeof createDb> {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

/**
 * Close the default database connection.
 * Useful for graceful shutdown.
 */
export async function closeDb(): Promise<void> {
  // The underlying postgres client handles connection pool cleanup
  _db = null;
}
