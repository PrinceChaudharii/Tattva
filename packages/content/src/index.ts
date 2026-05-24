// ─── @tattva/content ─────────────────────────────────────────────────────────
// Barrel export for content pipeline, parser, renderer, schemas, and utilities

// Pipeline
export { processContent, processContentBatch } from "./pipeline/index.js";
export type {
  PipelineStage,
  PipelineResult,
  PipelineOptions,
} from "./pipeline/index.js";

// Parser
export {
  parseMdx,
  validateFrontmatter,
  extractExcerpt,
} from "./parser/index.js";
export type {
  ParsedContent,
  ParseResult,
  ParserOptions,
} from "./parser/index.js";

// Renderer
export {
  getDefaultPlugins,
  estimateReadingTime,
  extractToc,
  serializeMdx,
} from "./renderer/index.js";
export type {
  MdxRenderOptions,
  PluginConfig,
  RenderedContent,
  TableOfContentsItem,
} from "./renderer/index.js";

// Schema
export {
  contentSubjectSchema,
  contentChapterSchema,
  contentLessonSchema,
  exerciseTypeSchema,
  contentExerciseSchema,
  mdxFrontmatterSchema,
} from "./schema/index.js";
export type {
  ContentSubject,
  ContentChapter,
  ContentLesson,
  ContentExercise,
  MdxFrontmatter,
} from "./schema/index.js";

// Utilities
export {
  generateSlug,
  uniqueSlug,
  parseContentPath,
  buildContentPath,
  localeContentPath,
  contentHash,
  formatNCERTReference,
} from "./utils/index.js";
export type { ContentPath, NCERTRef } from "./utils/index.js";
