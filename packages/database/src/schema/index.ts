// ─── Schema Barrel Export ────────────────────────────────────────────────────
// Re-exports all schema modules for convenient access

// Users & Auth
export {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "./users.js";
export type {
  User,
  NewUser,
  Account,
  NewAccount,
  Session,
  NewSession,
  VerificationToken,
  NewVerificationToken,
} from "./users.js";

// Content
export {
  subjects,
  chapters,
  lessons,
  exercises,
  subjectsRelations,
  chaptersRelations,
  lessonsRelations,
  exercisesRelations,
} from "./content.js";
export type {
  Subject,
  NewSubject,
  Chapter,
  NewChapter,
  Lesson,
  NewLesson,
  Exercise,
  NewExercise,
} from "./content.js";

// Contributions
export {
  contributions,
  reviews,
  comments,
  contributionsRelations,
  reviewsRelations,
  commentsRelations,
} from "./contributions.js";
export type {
  Contribution,
  NewContribution,
  Review,
  NewReview,
  Comment,
  NewComment,
} from "./contributions.js";
