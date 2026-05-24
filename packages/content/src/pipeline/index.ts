import { parseMdx, type ParseResult } from "../parser/index.js";
import {
  extractToc,
  estimateReadingTime,
  serializeMdx,
  type RenderedContent,
  type TableOfContentsItem,
} from "../renderer/index.js";
import type { MdxFrontmatter } from "../schema/index.js";

// ─── Pipeline Stages ─────────────────────────────────────────────────────────

export type PipelineStage = "parse" | "validate" | "transform" | "render";

export interface PipelineResult {
  /** Original source identifier */
  source: string;
  /** Parsed frontmatter */
  frontmatter: MdxFrontmatter;
  /** Processed content body */
  content: string;
  /** Table of contents */
  toc: TableOfContentsItem[];
  /** Estimated reading time */
  readingTime: number;
  /** Serialized MDX (only if render stage was executed) */
  rendered?: RenderedContent;
  /** Pipeline stage that was last completed */
  completedStage: PipelineStage;
  /** Any validation errors */
  errors?: Array<{ stage: PipelineStage; message: string }>;
}

// ─── Pipeline Options ────────────────────────────────────────────────────────

export interface PipelineOptions {
  /** Which stages to run (default: all) */
  stages?: PipelineStage[];
  /** Whether to include MDX rendering (expensive) */
  render?: boolean;
  /** Custom frontmatter schema */
  frontmatterSchema?: import("zod").ZodType;
  /** Base path for content resolution */
  contentDir?: string;
}

// ─── Content Pipeline ────────────────────────────────────────────────────────

/**
 * Run the full content processing pipeline on raw MDX content.
 *
 * Stages:
 * 1. **Parse** — Extract frontmatter and content body
 * 2. **Validate** — Validate frontmatter against schema
 * 3. **Transform** — Extract TOC, compute reading time
 * 4. **Render** — Serialize MDX for client rendering
 *
 * @param rawContent - Raw MDX content with frontmatter
 * @param source - Source file identifier
 * @param options - Pipeline configuration
 * @returns Processed content with metadata
 *
 * @example
 * ```ts
 * import { processContent } from "@tattva/content";
 *
 * const result = await processContent(rawMdx, "physics/ch1/lesson1.mdx", {
 *   render: true,
 * });
 *
 * console.log(result.frontmatter.title);
 * console.log(result.readingTime, "min read");
 * ```
 */
export async function processContent(
  rawContent: string,
  source: string,
  options?: PipelineOptions
): Promise<PipelineResult> {
  const errors: Array<{ stage: PipelineStage; message: string }> = [];
  const stages = options?.stages ?? ["parse", "validate", "transform", "render"];

  // ── Stage 1: Parse ────────────────────────────────────────────────────
  if (!stages.includes("parse")) {
    throw new Error("Pipeline must include at least the 'parse' stage");
  }

  const parseResult: ParseResult = parseMdx(rawContent, source, {
    schema: options?.frontmatterSchema,
  });

  if (!parseResult.success || !parseResult.data) {
    return {
      source,
      frontmatter: {} as MdxFrontmatter,
      content: "",
      toc: [],
      readingTime: 0,
      completedStage: "parse",
      errors: [
        {
          stage: "parse",
          message: parseResult.errors?.issues.map((i) => i.message).join("; ") ?? "Parse failed",
        },
      ],
    };
  }

  const { frontmatter, content } = parseResult.data;

  // ── Stage 2: Validate ─────────────────────────────────────────────────
  if (stages.includes("validate")) {
    // Validation already happened during parse via Zod schema
    // Additional custom validation can be added here
  }

  // ── Stage 3: Transform ────────────────────────────────────────────────
  let toc: TableOfContentsItem[] = [];
  let readingTime = 0;

  if (stages.includes("transform")) {
    toc = extractToc(content);
    readingTime = estimateReadingTime(content);
  }

  const result: PipelineResult = {
    source,
    frontmatter,
    content,
    toc,
    readingTime,
    completedStage: stages.includes("transform") ? "transform" : "validate",
    errors: errors.length > 0 ? errors : undefined,
  };

  // ── Stage 4: Render ───────────────────────────────────────────────────
  if (stages.includes("render") && (options?.render ?? false)) {
    try {
      const serialized = await serializeMdx(content);
      result.rendered = {
        serialized,
        toc,
        readingTime,
      };
      result.completedStage = "render";
    } catch (err) {
      errors.push({
        stage: "render",
        message: err instanceof Error ? err.message : "Render failed",
      });
      result.errors = errors;
    }
  }

  return result;
}

/**
 * Batch process multiple content files.
 */
export async function processContentBatch(
  items: Array<{ content: string; source: string }>,
  options?: PipelineOptions
): Promise<PipelineResult[]> {
  return Promise.all(
    items.map((item) => processContent(item.content, item.source, options))
  );
}
