import type { MDXRemoteSerializeResult } from "next-mdx-remote";

// ─── MDX Rendering Options ───────────────────────────────────────────────────

export interface MdxRenderOptions {
  /** Whether to parse frontmatter during serialization */
  parseFrontmatter?: boolean;
  /** Custom MDX components mapping */
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
  /** Scope data for MDX evaluation */
  scope?: Record<string, unknown>;
}

// ─── Rehype / Remark Plugins ─────────────────────────────────────────────────

export interface PluginConfig {
  /** Remark plugins for Markdown processing */
  remarkPlugins?: Array<{
    name: string;
    options?: Record<string, unknown>;
  }>;
  /** Rehype plugins for HTML processing */
  rehypePlugins?: Array<{
    name: string;
    options?: Record<string, unknown>;
  }>;
}

/**
 * Get the default plugin configuration for MDX rendering.
 *
 * Includes:
 * - remark-gfm for GitHub Flavored Markdown
 * - rehype-slug for heading IDs
 * - rehype-autolink-headings for heading links
 */
export function getDefaultPlugins(): PluginConfig {
  return {
    remarkPlugins: [
      { name: "remark-gfm" },
    ],
    rehypePlugins: [
      { name: "rehype-slug" },
      {
        name: "rehype-autolink-headings",
        options: {
          behavior: "wrap",
          properties: {
            className: "anchor-link",
          },
        },
      },
    ],
  };
}

// ─── Rendered Content ────────────────────────────────────────────────────────

export interface RenderedContent {
  /** Serialized MDX source ready for client rendering */
  serialized: MDXRemoteSerializeResult;
  /** Table of contents extracted from headings */
  toc: TableOfContentsItem[];
  /** Reading time estimate in minutes */
  readingTime: number;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  children?: TableOfContentsItem[];
}

// ─── Reading Time ────────────────────────────────────────────────────────────

const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time for content.
 *
 * @param content - Plain text or MDX content
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function estimateReadingTime(
  content: string,
  wordsPerMinute: number = WORDS_PER_MINUTE
): number {
  const words = content
    .replace(/<[^>]+>/g, "") // Strip HTML
    .replace(/```[\s\S]*?```/g, "") // Strip code blocks
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Extract table of contents from MDX content headings.
 *
 * @param content - MDX content body
 * @returns Nested table of contents structure
 */
export function extractToc(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const items: TableOfContentsItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1]!.length;
    const text = match[2]!.trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    items.push({ id, text, level });
  }

  return items;
}

// ─── Lazy Serialization Helper ───────────────────────────────────────────────

/**
 * Serialize MDX content for client-side rendering.
 *
 * This is a lazy wrapper around next-mdx-remote/serialize
 * to keep the import optional and reduce bundle size.
 *
 * @example
 * ```ts
 * import { serializeMdx } from "@tattva/content/renderer";
 *
 * const serialized = await serializeMdx(mdxString);
 * // Pass to <MDXRemote {...serialized} />
 * ```
 */
export async function serializeMdx(
  source: string,
  _options?: MdxRenderOptions
): Promise<MDXRemoteSerializeResult> {
  // Dynamic import to keep next-mdx-remote optional at build time
  const { serialize } = await import("next-mdx-remote/serialize");
  const remarkGfm = (await import("remark-gfm")).default;
  const rehypeSlug = (await import("rehype-slug")).default;
  const rehypeAutolinkHeadings = (await import("rehype-autolink-headings")).default;

  const serialized = await serialize(source, {
    parseFrontmatter: _options?.parseFrontmatter ?? true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          { behavior: "wrap", properties: { className: "anchor-link" } },
        ],
      ],
    },
    scope: _options?.scope,
  });

  return serialized;
}
