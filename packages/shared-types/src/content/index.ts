import { z } from "zod";
import { idSchema, timestampSchema, statusSchema, difficultySchema, localeSchema, ncertBoardSchema } from "../common/index.js";

// ─── Subject ─────────────────────────────────────────────────────────────────

export const subjectSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  board: ncertBoardSchema.default("CBSE"),
  locale: localeSchema.default("en"),
  sortOrder: z.number().int().default(0),
  status: statusSchema.default("published"),
  chapterCount: z.number().int().nonnegative().default(0),
  ...timestampSchema.shape,
});

export type Subject = z.infer<typeof subjectSchema>;

export const createSubjectSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  board: ncertBoardSchema.default("CBSE"),
  locale: localeSchema.default("en"),
  sortOrder: z.number().int().default(0),
});

export type CreateSubject = z.infer<typeof createSubjectSchema>;

// ─── Chapter ─────────────────────────────────────────────────────────────────

export const chapterSchema = z.object({
  id: idSchema,
  subjectId: idSchema,
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  ncertChapterNumber: z.number().int().positive().optional(),
  sortOrder: z.number().int().default(0),
  status: statusSchema.default("published"),
  lessonCount: z.number().int().nonnegative().default(0),
  ...timestampSchema.shape,
});

export type Chapter = z.infer<typeof chapterSchema>;

export const createChapterSchema = z.object({
  subjectId: idSchema,
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  ncertChapterNumber: z.number().int().positive().optional(),
  sortOrder: z.number().int().default(0),
});

export type CreateChapter = z.infer<typeof createChapterSchema>;

// ─── Lesson ──────────────────────────────────────────────────────────────────

export const lessonSchema = z.object({
  id: idSchema,
  chapterId: idSchema,
  subjectId: idSchema,
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  content: z.string().optional(),
  contentType: z.enum(["mdx", "html", "plain"]).default("mdx"),
  difficulty: difficultySchema.default("intermediate"),
  estimatedMinutes: z.number().int().positive().optional(),
  ncertPageReference: z.string().optional(),
  sortOrder: z.number().int().default(0),
  status: statusSchema.default("draft"),
  isFree: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  locale: localeSchema.default("en"),
  ...timestampSchema.shape,
});

export type Lesson = z.infer<typeof lessonSchema>;

export const createLessonSchema = z.object({
  chapterId: idSchema,
  subjectId: idSchema,
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  content: z.string().optional(),
  contentType: z.enum(["mdx", "html", "plain"]).default("mdx"),
  difficulty: difficultySchema.default("intermediate"),
  estimatedMinutes: z.number().int().positive().optional(),
  ncertPageReference: z.string().optional(),
  sortOrder: z.number().int().default(0),
  isFree: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  locale: localeSchema.default("en"),
});

export type CreateLesson = z.infer<typeof createLessonSchema>;

// ─── Exercise ────────────────────────────────────────────────────────────────

export const exerciseTypeSchema = z.enum([
  "multiple_choice",
  "true_false",
  "fill_in_blank",
  "short_answer",
  "long_answer",
  "match_following",
  "numerical",
]);

export type ExerciseType = z.infer<typeof exerciseTypeSchema>;

export const exerciseSchema = z.object({
  id: idSchema,
  lessonId: idSchema,
  chapterId: idSchema,
  subjectId: idSchema,
  type: exerciseTypeSchema,
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  hint: z.string().optional(),
  difficulty: difficultySchema.default("intermediate"),
  points: z.number().int().nonnegative().default(1),
  sortOrder: z.number().int().default(0),
  ncertReference: z.string().optional(),
  tags: z.array(z.string()).default([]),
  locale: localeSchema.default("en"),
  ...timestampSchema.shape,
});

export type Exercise = z.infer<typeof exerciseSchema>;

export const createExerciseSchema = z.object({
  lessonId: idSchema,
  chapterId: idSchema,
  subjectId: idSchema,
  type: exerciseTypeSchema,
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  hint: z.string().optional(),
  difficulty: difficultySchema.default("intermediate"),
  points: z.number().int().nonnegative().default(1),
  sortOrder: z.number().int().default(0),
  ncertReference: z.string().optional(),
  tags: z.array(z.string()).default([]),
  locale: localeSchema.default("en"),
});

export type CreateExercise = z.infer<typeof createExerciseSchema>;

// ─── Quiz ────────────────────────────────────────────────────────────────────

export const quizSchema = z.object({
  id: idSchema,
  lessonId: idSchema.optional(),
  chapterId: idSchema.optional(),
  subjectId: idSchema,
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  timeLimitMinutes: z.number().int().positive().optional(),
  passingScore: z.number().min(0).max(100).default(60),
  isPublished: z.boolean().default(false),
  ...timestampSchema.shape,
});

export type Quiz = z.infer<typeof quizSchema>;

// ─── Contribution ────────────────────────────────────────────────────────────

export const contributionStatusSchema = z.enum([
  "pending",
  "in_review",
  "approved",
  "rejected",
  "merged",
]);

export type ContributionStatus = z.infer<typeof contributionStatusSchema>;

export const contributionTypeSchema = z.enum([
  "new_content",
  "edit",
  "correction",
  "translation",
  "exercise",
  "review",
]);

export type ContributionType = z.infer<typeof contributionTypeSchema>;

export const contributionSchema = z.object({
  id: idSchema,
  authorId: idSchema,
  type: contributionTypeSchema,
  status: contributionStatusSchema.default("pending"),
  title: z.string().min(1).max(500),
  description: z.string().max(5000),
  subjectId: idSchema.optional(),
  chapterId: idSchema.optional(),
  lessonId: idSchema.optional(),
  content: z.string(),
  reviewerId: idSchema.optional(),
  reviewedAt: z.date().optional(),
  reviewNotes: z.string().optional(),
  locale: localeSchema.default("en"),
  ...timestampSchema.shape,
});

export type Contribution = z.infer<typeof contributionSchema>;

export const createContributionSchema = z.object({
  type: contributionTypeSchema,
  title: z.string().min(1).max(500),
  description: z.string().max(5000),
  subjectId: idSchema.optional(),
  chapterId: idSchema.optional(),
  lessonId: idSchema.optional(),
  content: z.string(),
  locale: localeSchema.default("en"),
});

export type CreateContribution = z.infer<typeof createContributionSchema>;
