import { eq, and, or, like, desc, asc, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import type { PaginatedResponse, SortOrder } from "@tattva/shared-types";

// ─── Pagination Helper ───────────────────────────────────────────────────────

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Calculate pagination metadata from total count and options.
 */
export function calculatePagination(
  total: number,
  options: PaginationOptions
): PaginationMeta {
  const totalPages = Math.ceil(total / options.limit);
  return {
    page: options.page,
    limit: options.limit,
    total,
    totalPages,
    hasNext: options.page < totalPages,
    hasPrev: options.page > 1,
  };
}

/**
 * Build a paginated response.
 */
export function createPaginatedResponse<T>(
  data: readonly T[],
  total: number,
  options: PaginationOptions
): PaginatedResponse<T> {
  return {
    data,
    pagination: calculatePagination(total, options),
  };
}

/**
 * Calculate OFFSET from page and limit.
 */
export function pageToOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

// ─── Query Builders ──────────────────────────────────────────────────────────

/**
 * Build a WHERE clause from filter conditions.
 * Only includes conditions where the value is not undefined.
 */
export function buildFilters<T extends Record<string, unknown>>(
  filters: T,
  mapper: (key: keyof T, value: T[keyof T]) => SQL | undefined
): SQL[] {
  return Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => mapper(key as keyof T, value as T[keyof T]))
    .filter((sql): sql is SQL => sql !== undefined);
}

// ─── Re-exports from Drizzle ─────────────────────────────────────────────────

export { eq, and, or, like, desc, asc, sql };
