import { z } from "zod";
import type { Subject, Chapter, Lesson, Exercise } from "@tattva/shared-types";

// ─── Search Document ─────────────────────────────────────────────────────────

export type SearchDocumentType = "subject" | "chapter" | "lesson" | "exercise";

export const searchDocumentSchema = z.object({
  /** Unique document ID */
  id: z.string(),
  /** Document type */
  type: z.enum(["subject", "chapter", "lesson", "exercise"]),
  /** Primary title */
  title: z.string(),
  /** Searchable content body */
  content: z.string(),
  /** Description / excerpt */
  description: z.string().optional(),
  /** Hierarchy path (e.g., ["Physics", "Mechanics", "Newton's Laws"]) */
  path: z.array(z.string()),
  /** Parent IDs for hierarchy traversal */
  parentIds: z.array(z.string()),
  /** Tags for filtering */
  tags: z.array(z.string()),
  /** Locale */
  locale: z.string().default("en"),
  /** Custom metadata */
  metadata: z.record(z.unknown()).optional(),
});

export type SearchDocument = z.infer<typeof searchDocumentSchema>;

// ─── Indexer Interface ───────────────────────────────────────────────────────

/**
 * Abstract search indexer interface.
 * Implementations can target different search backends (Meilisearch, Algolia, etc.)
 */
export interface SearchIndexer {
  /** Index a single document */
  index(document: SearchDocument): Promise<void>;
  /** Index multiple documents in batch */
  indexBatch(documents: readonly SearchDocument[]): Promise<void>;
  /** Remove a document from the index */
  remove(id: string): Promise<void>;
  /** Remove all documents of a given type */
  removeByType(type: SearchDocumentType): Promise<void>;
  /** Update an existing document */
  update(document: SearchDocument): Promise<void>;
  /** Clear the entire index */
  clear(): Promise<void>;
}

// ─── Document Builders ───────────────────────────────────────────────────────

/**
 * Build a search document from a Subject.
 */
export function subjectToDocument(subject: Subject): SearchDocument {
  return {
    id: subject.id,
    type: "subject",
    title: subject.name,
    content: subject.description ?? "",
    description: subject.description ?? undefined,
    path: [subject.name],
    parentIds: [],
    tags: [],
    locale: subject.locale,
    metadata: { board: subject.board, slug: subject.slug },
  };
}

/**
 * Build a search document from a Chapter.
 */
export function chapterToDocument(
  chapter: Chapter,
  subjectName: string
): SearchDocument {
  return {
    id: chapter.id,
    type: "chapter",
    title: chapter.name,
    content: chapter.description ?? "",
    description: chapter.description ?? undefined,
    path: [subjectName, chapter.name],
    parentIds: [chapter.subjectId],
    tags: [],
    locale: "en",
    metadata: {
      subjectId: chapter.subjectId,
      ncertChapterNumber: chapter.ncertChapterNumber,
      slug: chapter.slug,
    },
  };
}

/**
 * Build a search document from a Lesson.
 */
export function lessonToDocument(
  lesson: Lesson,
  subjectName: string,
  chapterName: string
): SearchDocument {
  return {
    id: lesson.id,
    type: "lesson",
    title: lesson.title,
    content: lesson.content ?? lesson.description ?? "",
    description: lesson.description ?? undefined,
    path: [subjectName, chapterName, lesson.title],
    parentIds: [lesson.subjectId, lesson.chapterId],
    tags: lesson.tags,
    locale: lesson.locale,
    metadata: {
      subjectId: lesson.subjectId,
      chapterId: lesson.chapterId,
      difficulty: lesson.difficulty,
      estimatedMinutes: lesson.estimatedMinutes,
      slug: lesson.slug,
    },
  };
}

/**
 * Build a search document from an Exercise.
 */
export function exerciseToDocument(
  exercise: Exercise,
  pathNames: string[]
): SearchDocument {
  return {
    id: exercise.id,
    type: "exercise",
    title: exercise.question,
    content: [exercise.question, exercise.explanation, exercise.hint].filter(Boolean).join(" "),
    description: exercise.hint ?? undefined,
    path: pathNames,
    parentIds: [exercise.subjectId, exercise.chapterId, exercise.lessonId],
    tags: exercise.tags,
    locale: exercise.locale,
    metadata: {
      subjectId: exercise.subjectId,
      chapterId: exercise.chapterId,
      lessonId: exercise.lessonId,
      type: exercise.type,
      difficulty: exercise.difficulty,
    },
  };
}
