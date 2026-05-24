import { z } from "zod";
import type { PaginatedResponse, ApiResponse, SortOrder } from "../common/index.js";

// ─── Request Base ────────────────────────────────────────────────────────────

export interface ListQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly sort?: string;
  readonly order?: SortOrder;
  readonly search?: string;
}

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

// ─── Subject API ─────────────────────────────────────────────────────────────

export interface SubjectListResponse extends PaginatedResponse<{
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  chapterCount: number;
}> {}

export interface SubjectDetailResponse extends ApiResponse<{
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  board: string;
  chapters: Array<{
    id: string;
    name: string;
    slug: string;
    lessonCount: number;
  }>;
}> {}

// ─── Chapter API ─────────────────────────────────────────────────────────────

export interface ChapterListResponse extends PaginatedResponse<{
  id: string;
  name: string;
  slug: string;
  description?: string;
  lessonCount: number;
}> {}

// ─── Lesson API ──────────────────────────────────────────────────────────────

export interface LessonListResponse extends PaginatedResponse<{
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  estimatedMinutes?: number;
}> {}

export interface LessonDetailResponse extends ApiResponse<{
  id: string;
  title: string;
  slug: string;
  content?: string;
  contentType: string;
  difficulty: string;
  exercises: Array<{
    id: string;
    type: string;
    question: string;
  }>;
}> {}

// ─── Exercise API ────────────────────────────────────────────────────────────

export interface ExerciseSubmitRequest {
  readonly answer: string;
}

export interface ExerciseSubmitResponse extends ApiResponse<{
  correct: boolean;
  correctAnswer?: string;
  explanation?: string;
}> {}

// ─── Contribution API ────────────────────────────────────────────────────────

export interface ContributionListResponse extends PaginatedResponse<{
  id: string;
  title: string;
  type: string;
  status: string;
  author: { id: string; name: string };
  createdAt: Date;
}> {}

export interface ContributionReviewRequest {
  readonly status: "approved" | "rejected";
  readonly notes?: string;
}

// ─── Auth API ────────────────────────────────────────────────────────────────

export interface AuthCallbackResponse extends ApiResponse<{
  user: { id: string; email: string; name: string; role: string };
  accessToken: string;
}> {}

export interface SessionResponse extends ApiResponse<{
  user: { id: string; email: string; name: string; role: string };
  expiresAt: Date;
}> {}
