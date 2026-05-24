import { z } from "zod";
import {
  statusSchema,
  difficultySchema,
  localeSchema,
  ncertBoardSchema,
} from "@tattva/shared-types";

// ─── Subject Schema ──────────────────────────────────────────────────────────

export const contentSubjectSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  board: ncertBoardSchema.default("CBSE"),
  locale: localeSchema.default("en"),
  sortOrder: z.number().int().default(0),
  status: statusSchema.default("published"),
});

export type ContentSubject = z.infer<typeof contentSubjectSchema>;

// ─── Chapter Schema ──────────────────────────────────────────────────────────

export const contentChapterSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  ncertChapterNumber: z.number().int().positive().optional(),
  sortOrder: z.number().int().default(0),
  status: statusSchema.default("published"),
});

export type ContentChapter = z.infer<typeof contentChapterSchema>;

// ─── Lesson Schema ───────────────────────────────────────────────────────────

export const contentLessonSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  contentType: z.enum(["mdx", "html", "plain"]).default("mdx"),
  difficulty: difficultySchema.default("intermediate"),
  estimatedMinutes: z.number().int().positive().optional(),
  ncertPageReference: z.string().optional(),
  sortOrder: z.number().int().default(0),
  status: statusSchema.default("draft"),
  isFree: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  locale: localeSchema.default("en"),
});

export type ContentLesson = z.infer<typeof contentLessonSchema>;

// ─── Exercise Schema ─────────────────────────────────────────────────────────

export const exerciseTypeSchema = z.enum([
  "multiple_choice",
  "true_false",
  "fill_in_blank",
  "short_answer",
  "long_answer",
  "match_following",
  "numerical",
]);

export const contentExerciseSchema = z.object({
  type: exerciseTypeSchema,
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional(),
  hint: z.string().optional(),
  difficulty: difficultySchema.default("intermediate"),
  points: z.number().int().nonnegative().default(1),
  sortOrder: z.number().int().default(0),
  ncertReference: z.string().optional(),
  tags: z.array(z.string()).default([]),
  locale: localeSchema.default("en"),
});

export type ContentExercise = z.infer<typeof contentExerciseSchema>;

// ─── Frontmatter Schema (MDX) ────────────────────────────────────────────────

export const mdxFrontmatterSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  slug: z.string().min(1).max(255).optional(),
  difficulty: difficultySchema.optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
  isFree: z.boolean().default(true),
  status: statusSchema.default("draft"),
  locale: localeSchema.default("en"),
  ncertReference: z.string().optional(),
  author: z.string().optional(),
  lastUpdated: z.coerce.date().optional(),
});

export type MdxFrontmatter = z.infer<typeof mdxFrontmatterSchema>;
