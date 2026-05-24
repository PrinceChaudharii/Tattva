import { z } from "zod";

// ─── Pagination ──────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  cursor: z.string().optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNext: boolean;
    readonly hasPrev: boolean;
    readonly nextCursor?: string;
  };
}

export interface CursorPaginatedResponse<T> {
  readonly data: readonly T[];
  readonly nextCursor: string | null;
  readonly hasMore: boolean;
}

// ─── Sort ────────────────────────────────────────────────────────────────────

export type SortOrder = "asc" | "desc";

export interface SortOption<T extends string = string> {
  readonly field: T;
  readonly order: SortOrder;
}

export const sortOrderSchema = z.enum(["asc", "desc"]);

// ─── Locale ──────────────────────────────────────────────────────────────────

export const localeSchema = z.enum(["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "or", "as", "ur", "sa"]);
export type Locale = z.infer<typeof localeSchema>;

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
    readonly details?: unknown;
  };
  readonly meta?: Record<string, unknown>;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly statusCode: number;
  readonly details?: unknown;
}

// ─── Timestamps ──────────────────────────────────────────────────────────────

export interface TimestampFields {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const timestampSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ─── ID ──────────────────────────────────────────────────────────────────────

export const idSchema = z.string().cuid2();
export type Id = z.infer<typeof idSchema>;

// ─── Status ──────────────────────────────────────────────────────────────────

export type Status = "draft" | "published" | "archived" | "review";

export const statusSchema = z.enum(["draft", "published", "archived", "review"]);

// ─── Difficulty ──────────────────────────────────────────────────────────────

export type Difficulty = "beginner" | "intermediate" | "advanced";

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);

// ─── NCERT Alignment ─────────────────────────────────────────────────────────

export type NCERTBoard = "CBSE" | "ICSE" | "State";

export const ncertBoardSchema = z.enum(["CBSE", "ICSE", "State"]);

export interface NCERTAlignment {
  readonly board: NCERTBoard;
  readonly class: number;
  readonly subject: string;
  readonly chapter: string;
}

// ─── Generic Key-Value ───────────────────────────────────────────────────────

export interface KeyValue {
  readonly key: string;
  readonly value: string;
}

// ─── Deep Partial ────────────────────────────────────────────────────────────

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
