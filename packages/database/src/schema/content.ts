import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { users } from "./users.js";

// ─── Subjects ────────────────────────────────────────────────────────────────

export const subjects = pgTable(
  "subjects",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 255 }),
    color: varchar("color", { length: 7 }),
    board: varchar("board", { length: 32 }).notNull().default("CBSE"),
    locale: varchar("locale", { length: 10 }).notNull().default("en"),
    sortOrder: integer("sort_order").notNull().default(0),
    status: varchar("status", { length: 32 }).notNull().default("published"),
    chapterCount: integer("chapter_count").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdBy: varchar("created_by", { length: 128 }).references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("idx_subjects_slug").on(table.slug, table.locale),
    index("idx_subjects_board").on(table.board),
    index("idx_subjects_status").on(table.status),
    index("idx_subjects_sort").on(table.sortOrder),
  ]
);

// ─── Chapters ────────────────────────────────────────────────────────────────

export const chapters = pgTable(
  "chapters",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    subjectId: varchar("subject_id", { length: 128 })
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    ncertChapterNumber: integer("ncert_chapter_number"),
    sortOrder: integer("sort_order").notNull().default(0),
    status: varchar("status", { length: 32 }).notNull().default("published"),
    lessonCount: integer("lesson_count").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdBy: varchar("created_by", { length: 128 }).references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_chapters_subject_id").on(table.subjectId),
    uniqueIndex("idx_chapters_slug").on(table.slug, table.subjectId),
    index("idx_chapters_ncert_num").on(table.ncertChapterNumber),
    index("idx_chapters_sort").on(table.subjectId, table.sortOrder),
    index("idx_chapters_status").on(table.status),
  ]
);

// ─── Lessons ─────────────────────────────────────────────────────────────────

export const lessons = pgTable(
  "lessons",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    chapterId: varchar("chapter_id", { length: 128 })
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    subjectId: varchar("subject_id", { length: 128 })
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    content: text("content"),
    contentType: varchar("content_type", { length: 32 }).notNull().default("mdx"),
    difficulty: varchar("difficulty", { length: 32 }).notNull().default("intermediate"),
    estimatedMinutes: integer("estimated_minutes"),
    ncertPageReference: varchar("ncert_page_reference", { length: 255 }),
    sortOrder: integer("sort_order").notNull().default(0),
    status: varchar("status", { length: 32 }).notNull().default("draft"),
    isFree: boolean("is_free").notNull().default(true),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    locale: varchar("locale", { length: 10 }).notNull().default("en"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdBy: varchar("created_by", { length: 128 }).references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_lessons_chapter_id").on(table.chapterId),
    index("idx_lessons_subject_id").on(table.subjectId),
    uniqueIndex("idx_lessons_slug").on(table.slug, table.chapterId),
    index("idx_lessons_status").on(table.status),
    index("idx_lessons_difficulty").on(table.difficulty),
    index("idx_lessons_sort").on(table.chapterId, table.sortOrder),
    index("idx_lessons_free").on(table.isFree),
    index("idx_lessons_tags").on(table.tags),
    index("idx_lessons_locale").on(table.locale),
  ]
);

// ─── Exercises ───────────────────────────────────────────────────────────────

export const exercises = pgTable(
  "exercises",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    lessonId: varchar("lesson_id", { length: 128 })
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    chapterId: varchar("chapter_id", { length: 128 })
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    subjectId: varchar("subject_id", { length: 128 })
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 64 }).notNull(),
    question: text("question").notNull(),
    options: jsonb("options").$type<string[]>(),
    correctAnswer: text("correct_answer").notNull(),
    explanation: text("explanation"),
    hint: text("hint"),
    difficulty: varchar("difficulty", { length: 32 }).notNull().default("intermediate"),
    points: integer("points").notNull().default(1),
    sortOrder: integer("sort_order").notNull().default(0),
    ncertReference: varchar("ncert_reference", { length: 255 }),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    locale: varchar("locale", { length: 10 }).notNull().default("en"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdBy: varchar("created_by", { length: 128 }).references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_exercises_lesson_id").on(table.lessonId),
    index("idx_exercises_chapter_id").on(table.chapterId),
    index("idx_exercises_subject_id").on(table.subjectId),
    index("idx_exercises_type").on(table.type),
    index("idx_exercises_difficulty").on(table.difficulty),
    index("idx_exercises_sort").on(table.lessonId, table.sortOrder),
  ]
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const subjectsRelations = relations(subjects, ({ many, one }) => ({
  chapters: many(chapters),
  lessons: many(lessons),
  exercises: many(exercises),
  creator: one(users, {
    fields: [subjects.createdBy],
    references: [users.id],
    relationName: "subjectCreator",
  }),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [chapters.subjectId],
    references: [subjects.id],
  }),
  lessons: many(lessons),
  exercises: many(exercises),
  creator: one(users, {
    fields: [chapters.createdBy],
    references: [users.id],
    relationName: "chapterCreator",
  }),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [lessons.chapterId],
    references: [chapters.id],
  }),
  subject: one(subjects, {
    fields: [lessons.subjectId],
    references: [subjects.id],
  }),
  exercises: many(exercises),
  creator: one(users, {
    fields: [lessons.createdBy],
    references: [users.id],
    relationName: "lessonCreator",
  }),
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
  lesson: one(lessons, {
    fields: [exercises.lessonId],
    references: [lessons.id],
  }),
  chapter: one(chapters, {
    fields: [exercises.chapterId],
    references: [chapters.id],
  }),
  subject: one(subjects, {
    fields: [exercises.subjectId],
    references: [subjects.id],
  }),
  creator: one(users, {
    fields: [exercises.createdBy],
    references: [users.id],
    relationName: "exerciseCreator",
  }),
}));

// ─── Type Exports ────────────────────────────────────────────────────────────

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
