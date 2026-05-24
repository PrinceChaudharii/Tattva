// ─── @tattva/search ──────────────────────────────────────────────────────────
// Barrel export for search indexing and querying

// Indexer
export {
  searchDocumentSchema,
  subjectToDocument,
  chapterToDocument,
  lessonToDocument,
  exerciseToDocument,
} from "./indexer/index.js";
export type {
  SearchDocumentType,
  SearchDocument,
  SearchIndexer,
} from "./indexer/index.js";

// Query
export { searchQuerySchema, SearchQueryBuilder } from "./query/index.js";
export type {
  SearchQuery,
  SearchResult,
  SearchResponse,
  SearchEngine,
} from "./query/index.js";
