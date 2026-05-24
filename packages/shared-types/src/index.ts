// ─── @tattva/shared-types ────────────────────────────────────────────────────
// Barrel export for all shared types, schemas, and utilities

// Common types & schemas
export type {
  PaginatedResponse,
  CursorPaginatedResponse,
  SortOption,
  ApiResponse,
  ApiError,
  TimestampFields,
  DeepPartial,
  KeyValue,
} from "./common/index.js";

export {
  paginationSchema,
  sortOrderSchema,
  localeSchema,
  timestampSchema,
  idSchema,
  statusSchema,
  difficultySchema,
  ncertBoardSchema,
} from "./common/index.js";

export type {
  Pagination,
  SortOrder,
  Locale,
  Id,
  Status,
  Difficulty,
  NCERTBoard,
  NCERTAlignment,
} from "./common/index.js";

// User types & schemas
export type {
  User,
  UserProfile,
  CreateUser,
  UpdateUser,
  Session,
  Account,
  UserRole,
  AuthProvider,
} from "./user/index.js";

export {
  userSchema,
  userProfileSchema,
  createUserSchema,
  updateUserSchema,
  sessionSchema,
  accountSchema,
  userRoleSchema,
  authProviderSchema,
  ROLE_PERMISSIONS,
  hasPermission,
} from "./user/index.js";

// Content types & schemas
export type {
  Subject,
  CreateSubject,
  Chapter,
  CreateChapter,
  Lesson,
  CreateLesson,
  Exercise,
  CreateExercise,
  ExerciseType,
  Quiz,
  Contribution,
  ContributionStatus,
  ContributionType,
  CreateContribution,
} from "./content/index.js";

export {
  subjectSchema,
  createSubjectSchema,
  chapterSchema,
  createChapterSchema,
  lessonSchema,
  createLessonSchema,
  exerciseSchema,
  createExerciseSchema,
  exerciseTypeSchema,
  quizSchema,
  contributionSchema,
  contributionStatusSchema,
  contributionTypeSchema,
  createContributionSchema,
} from "./content/index.js";

// API types
export type {
  ListQueryParams,
  SubjectListResponse,
  SubjectDetailResponse,
  ChapterListResponse,
  LessonListResponse,
  LessonDetailResponse,
  ExerciseSubmitRequest,
  ExerciseSubmitResponse,
  ContributionListResponse,
  ContributionReviewRequest,
  AuthCallbackResponse,
  SessionResponse,
} from "./api/index.js";

export {
  listQuerySchema,
} from "./api/index.js";

export type { ListQuery } from "./api/index.js";
