import matter from "gray-matter";
import { z } from "zod";
import { mdxFrontmatterSchema, type MdxFrontmatter } from "../schema/index.js";

// ─── Parsed Content ──────────────────────────────────────────────────────────

export interface ParsedContent {
  /** Raw frontmatter data (validated) */
  frontmatter: MdxFrontmatter;
  /** MDX/Markdown content body (without frontmatter) */
  content: string;
  /** Raw frontmatter string */
  rawFrontmatter: string;
  /** Original raw content */
  raw: string;
  /** File path or identifier */
  source: string;
}

// ─── Parse Result ────────────────────────────────────────────────────────────

export interface ParseResult<T = MdxFrontmatter> {
  success: boolean;
  data?: ParsedContent & { frontmatter: T };
  errors?: z.ZodError;
}

// ─── Parser Options ──────────────────────────────────────────────────────────

export interface ParserOptions {
  /** Custom Zod schema for frontmatter validation */
  schema?: z.ZodType;
  /** Whether to strip excerpt from content */
  excerpt?: boolean;
  /** Excerpt separator string */
  excerptSeparator?: string;
}

// ─── Parse MDX ───────────────────────────────────────────────────────────────

/**
 * Parse MDX content with frontmatter validation.
 *
 * @param rawContent - Raw MDX string with YAML frontmatter
 * @param source - File path or identifier for error reporting
 * @param options - Parser configuration options
 * @returns Parsed and validated content
 *
 * @example
 * ```ts
 * import { parseMdx } from "@tattva/content/parser";
 *
 * const result = parseMdx(rawFile, "subjects/physics/ch1.mdx");
 * if (result.success) {
 *   console.log(result.data.frontmatter.title);
 *   console.log(result.data.content);
 * }
 * ```
 */
export function parseMdx(
  rawContent: string,
  source: string,
  options?: ParserOptions
): ParseResult {
  const schema = options?.schema ?? mdxFrontmatterSchema;

  const { data, content } = matter(rawContent, {
    excerpt: options?.excerpt ?? false,
    excerpt_separator: options?.excerptSeparator,
  });

  const validation = schema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error,
    };
  }

  return {
    success: true,
    data: {
      frontmatter: validation.data as MdxFrontmatter,
      content,
      rawFrontmatter: matter.stringify("", data).trim(),
      raw: rawContent,
      source,
    },
  };
}

/**
 * Validate frontmatter data against a Zod schema.
 */
export function validateFrontmatter<T>(
  data: unknown,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Extract plain text excerpt from MDX content.
 *
 * @param content - MDX content body (without frontmatter)
 * @param maxLength - Maximum excerpt length
 * @returns Plain text excerpt
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content
    .replace(/^#+\s+.*$/gm, "") // Remove headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Unwrap links
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // Unwrap bold/italic
    .replace(/`{1,3}[^`]+`{1,3}/g, "") // Remove code
    .replace(/\n{2,}/g, " ") // Collapse newlines
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength).replace(/\s+\S*$/, "…");
}
