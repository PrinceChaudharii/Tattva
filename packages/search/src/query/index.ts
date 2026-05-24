import { z } from "zod";

// ─── Search Query ────────────────────────────────────────────────────────────

export const searchQuerySchema = z.object({
  /** Search text */
  query: z.string().min(1),
  /** Filter by document type */
  type: z.enum(["subject", "chapter", "lesson", "exercise"]).optional(),
  /** Filter by tags */
  tags: z.array(z.string()).optional(),
  /** Filter by locale */
  locale: z.string().optional(),
  /** Filter by parent ID */
  parentId: z.string().optional(),
  /** Maximum number of results */
  limit: z.number().int().positive().max(100).default(20),
  /** Offset for pagination */
  offset: z.number().int().nonnegative().default(0),
  /** Minimum relevance score (0-1) */
  minScore: z.number().min(0).max(1).optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// ─── Search Result ───────────────────────────────────────────────────────────

export interface SearchResult {
  /** Document ID */
  id: string;
  /** Document type */
  type: string;
  /** Matched title */
  title: string;
  /** Relevance excerpt with highlighting markers */
  excerpt: string;
  /** Relevance score (0-1) */
  score: number;
  /** Hierarchy path */
  path: string[];
  /** Highlighted text fragments */
  highlights: Array<{
    field: string;
    snippet: string;
  }>;
}

// ─── Search Response ─────────────────────────────────────────────────────────

export interface SearchResponse {
  /** Search results */
  results: SearchResult[];
  /** Total number of matching documents */
  total: number;
  /** Applied query parameters */
  query: SearchQuery;
  /** Search processing time in ms */
  processingTimeMs: number;
  /** Facet counts if requested */
  facets?: Record<string, Record<string, number>>;
}

// ─── Search Engine Interface ─────────────────────────────────────────────────

/**
 * Abstract search engine interface.
 * Implementations can target different backends (Meilisearch, Algolia, pg-vector, etc.)
 */
export interface SearchEngine {
  /** Execute a search query */
  search(query: SearchQuery): Promise<SearchResponse>;
  /** Get search suggestions / autocomplete */
  suggest(prefix: string, options?: { limit?: number; type?: string }): Promise<string[]>;
}

// ─── Query Builder ───────────────────────────────────────────────────────────

/**
 * Fluent search query builder.
 *
 * @example
 * ```ts
 * const results = await searchEngine.search(
 *   createQueryBuilder("newton")
 *     .withType("lesson")
 *     .withLocale("en")
 *     .withLimit(10)
 *     .build()
 * );
 * ```
 */
export class SearchQueryBuilder {
  private readonly params: Partial<SearchQuery> = {};

  private constructor(query: string) {
    this.params.query = query;
  }

  /** Start building a query */
  static create(query: string): SearchQueryBuilder {
    return new SearchQueryBuilder(query);
  }

  /** Filter by document type */
  withType(type: SearchQuery["type"]): this {
    this.params.type = type;
    return this;
  }

  /** Filter by tags */
  withTags(tags: string[]): this {
    this.params.tags = tags;
    return this;
  }

  /** Filter by locale */
  withLocale(locale: string): this {
    this.params.locale = locale;
    return this;
  }

  /** Filter by parent ID */
  withParentId(parentId: string): this {
    this.params.parentId = parentId;
    return this;
  }

  /** Set result limit */
  withLimit(limit: number): this {
    this.params.limit = limit;
    return this;
  }

  /** Set result offset */
  withOffset(offset: number): this {
    this.params.offset = offset;
    return this;
  }

  /** Set minimum relevance score */
  withMinScore(score: number): this {
    this.params.minScore = score;
    return this;
  }

  /** Build the final SearchQuery object */
  build(): SearchQuery {
    return searchQuerySchema.parse(this.params);
  }
}
