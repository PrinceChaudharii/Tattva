import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { subjects, chapters, lessons } from "./content.js";

// ─── Contributions ───────────────────────────────────────────────────────────

export const contributions = pgTable(
  "contributions",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    authorId: varchar("author_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 64 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("pending"),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description").notNull(),
    subjectId: varchar("subject_id", { length: 128 }).references(() => subjects.id, {
      onDelete: "set null",
    }),
    chapterId: varchar("chapter_id", { length: 128 }).references(() => chapters.id, {
      onDelete: "set null",
    }),
    lessonId: varchar("lesson_id", { length: 128 }).references(() => lessons.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(),
    diff: text("diff"),
    reviewerId: varchar("reviewer_id", { length: 128 }).references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewNotes: text("review_notes"),
    locale: varchar("locale", { length: 10 }).notNull().default("en"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_contributions_author_id").on(table.authorId),
    index("idx_contributions_type").on(table.type),
    index("idx_contributions_status").on(table.status),
    index("idx_contributions_subject_id").on(table.subjectId),
    index("idx_contributions_chapter_id").on(table.chapterId),
    index("idx_contributions_lesson_id").on(table.lessonId),
    index("idx_contributions_reviewer_id").on(table.reviewerId),
    index("idx_contributions_created_at").on(table.createdAt),
  ]
);

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviews = pgTable(
  "reviews",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    contributionId: varchar("contribution_id", { length: 128 })
      .notNull()
      .references(() => contributions.id, { onDelete: "cascade" }),
    reviewerId: varchar("reviewer_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 32 }).notNull().default("pending"),
    rating: integer("rating"),
    notes: text("notes"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_reviews_contribution_id").on(table.contributionId),
    index("idx_reviews_reviewer_id").on(table.reviewerId),
    index("idx_reviews_status").on(table.status),
  ]
);

// ─── Comments ────────────────────────────────────────────────────────────────

export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 128 })
      .$defaultFn(() => createId())
      .primaryKey(),
    contributionId: varchar("contribution_id", { length: 128 })
      .notNull()
      .references(() => contributions.id, { onDelete: "cascade" }),
    authorId: varchar("author_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: varchar("parent_id", { length: 128 }),
    content: text("content").notNull(),
    isResolved: integer("is_resolved", { mode: "boolean" }).notNull().default(false),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_comments_contribution_id").on(table.contributionId),
    index("idx_comments_author_id").on(table.authorId),
    index("idx_comments_parent_id").on(table.parentId),
    index("idx_comments_created_at").on(table.createdAt),
  ]
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const contributionsRelations = relations(contributions, ({ one, many }) => ({
  author: one(users, {
    fields: [contributions.authorId],
    references: [users.id],
    relationName: "contributionAuthor",
  }),
  reviewer: one(users, {
    fields: [contributions.reviewerId],
    references: [users.id],
    relationName: "contributionReviewer",
  }),
  subject: one(subjects, {
    fields: [contributions.subjectId],
    references: [subjects.id],
  }),
  chapter: one(chapters, {
    fields: [contributions.chapterId],
    references: [chapters.id],
  }),
  lesson: one(lessons, {
    fields: [contributions.lessonId],
    references: [lessons.id],
  }),
  reviews: many(reviews),
  comments: many(comments),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  contribution: one(contributions, {
    fields: [reviews.contributionId],
    references: [contributions.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: "reviewReviewer",
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  contribution: one(contributions, {
    fields: [comments.contributionId],
    references: [contributions.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
    relationName: "commentAuthor",
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "commentReplies",
  }),
}));

// ─── Type Exports ────────────────────────────────────────────────────────────

export type Contribution = typeof contributions.$inferSelect;
export type NewContribution = typeof contributions.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
