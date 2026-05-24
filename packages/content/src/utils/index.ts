import type { Locale } from "@tattva/shared-types";

// ─── Slug Generation ─────────────────────────────────────────────────────────

/**
 * Generate a URL-safe slug from a string.
 *
 * @param text - Input text
 * @returns URL-safe slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate a unique slug by appending a numeric suffix if needed.
 *
 * @param baseSlug - Base slug to uniquify
 * @param existingSlugs - Set of already-taken slugs
 * @returns Unique slug
 */
export function uniqueSlug(baseSlug: string, existingSlugs: Set<string>): string {
  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let slug = `${baseSlug}-${counter}`;
  while (existingSlugs.has(slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

// ─── Content Path Resolution ─────────────────────────────────────────────────

export interface ContentPath {
  /** Subject slug */
  subject: string;
  /** Chapter slug (optional for subject-level content) */
  chapter?: string;
  /** Lesson slug (optional for chapter-level content) */
  lesson?: string;
  /** File extension */
  ext: string;
}

/**
 * Parse a content file path into its components.
 *
 * @param filePath - Relative file path (e.g., "physics/mechanics/lesson1.mdx")
 * @returns Parsed content path
 */
export function parseContentPath(filePath: string): ContentPath {
  const parts = filePath.replace(/\\/g, "/").split("/");
  const filename = parts.pop() ?? "";

  const ext = filename.includes(".") ? `.${filename.split(".").pop()!}` : ".mdx";

  return {
    subject: parts[0] ?? "",
    chapter: parts[1],
    lesson: parts[2],
    ext,
  };
}

/**
 * Build a content file path from components.
 */
export function buildContentPath(path: ContentPath): string {
  const segments = [path.subject];
  if (path.chapter) segments.push(path.chapter);
  if (path.lesson) segments.push(path.lesson);
  return segments.join("/") + path.ext;
}

// ─── Locale Helpers ──────────────────────────────────────────────────────────

/**
 * Get the locale-specific path for content.
 */
export function localeContentPath(basePath: string, locale: Locale): string {
  if (locale === "en") return basePath;
  return `${locale}/${basePath}`;
}

// ─── Content Hashing ─────────────────────────────────────────────────────────

/**
 * Generate a simple content hash for cache invalidation.
 * Uses a fast, non-cryptographic approach.
 */
export function contentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}

// ─── NCERT Reference ─────────────────────────────────────────────────────────

export interface NCERTRef {
  class: number;
  subject: string;
  chapter: string;
  page?: number;
}

/**
 * Format an NCERT reference string.
 */
export function formatNCERTReference(ref: NCERTRef): string {
  let reference = `Class ${ref.class} ${ref.subject}, Ch. ${ref.chapter}`;
  if (ref.page) {
    reference += `, p. ${ref.page}`;
  }
  return reference;
}
