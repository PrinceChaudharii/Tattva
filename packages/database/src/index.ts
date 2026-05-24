// ─── @tattva/database ────────────────────────────────────────────────────────
// Barrel export for database schema, connection, and utilities

// Schema
export * from "./schema/index.js";

// Connection
export { createDb, getDb, closeDb } from "./connection.js";
export type { DatabaseConfig } from "./connection.js";

// Utilities
export {
  calculatePagination,
  createPaginatedResponse,
  pageToOffset,
  buildFilters,
  eq,
  and,
  or,
  like,
  desc,
  asc,
  sql,
} from "./utils/index.js";

export type { PaginationOptions, PaginationMeta } from "./utils/index.js";
