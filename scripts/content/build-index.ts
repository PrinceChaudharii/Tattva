#!/usr/bin/env npx tsx
/**
 * @tattva/scripts — Search Index Builder
 *
 * Reads MDX content files and builds a search index (JSON)
 * that can be consumed by the frontend for full-text search.
 *
 * Produces: content/search-index.json
 *
 * Usage:
 *   pnpm content:build
 *   npx tsx scripts/content/build-index.ts
 *   npx tsx scripts/content/build-index.ts --outdir public/content
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const contentDir = getArg("--dir") ?? resolveContentDir();
const outDir = getArg("--outdir") ?? path.resolve(process.cwd(), "content");
const minisearch = args.includes("--minisearch");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchDocument {
  id: string;
  title: string;
  description: string;
  slug: string;
  subject: string;
  class: number;
  type: string;
  chapter: string;
  tags: string[];
  difficulty: string;
  /** Flattened text content for search (headings + body) */
  content: string;
  /** Heading hierarchy for snippet display */
  headings: string[];
  /** NCERT reference if available */
  ncertBook?: string;
  ncertChapter?: string;
  lastUpdated: string;
}

interface SearchIndex {
  version: string;
  builtAt: string;
  documentCount: number;
  documents: SearchDocument[];
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

function parseFrontmatter(raw: string): { data: Record<string, string | string[] | number>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, content: raw };

  const frontmatterStr = match[1];
  const content = raw.slice(match[0].length);
  const data: Record<string, string | string[] | number> = {};

  for (const line of frontmatterStr.split("\n")) {
    const kvMatch = line.match(/^(\w[\w]*):\s*(.+)$/);
    if (!kvMatch) continue;

    const [, key, value] = kvMatch;
    if (value === "[]") {
      data[key] = [];
    } else if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      (data as Record<string, unknown>)[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return { data, content };
}

function extractHeadings(content: string): string[] {
  const headings: string[] = [];
  const headingPattern = /^(#{1,4})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingPattern.exec(content)) !== null) {
    headings.push(match[2].trim());
  }

  return headings;
}

function stripMarkdown(content: string): string {
  return content
    .replace(/^---[\s\S]*?---/m, "") // frontmatter
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1") // links → text
    .replace(/#{1,6}\s+/g, "") // headings
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2") // bold/italic
    .replace(/>\s+/g, "") // blockquotes
    .replace(/[-*+]\s+/g, "") // unordered list markers
    .replace(/\d+\.\s+/g, "") // ordered list markers
    .replace(/\n{2,}/g, "\n") // excessive newlines
    .trim();
}

// ---------------------------------------------------------------------------
// Document builder
// ---------------------------------------------------------------------------

function buildDocument(filePath: string): SearchDocument | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);

  // Skip draft content
  if (data.status === "draft" || data.status === "archived") {
    return null;
  }

  const slug = String(data.slug ?? path.basename(filePath, path.extname(filePath)));
  const subject = String(data.subject ?? "unknown");
  const classNum = Number(data.class ?? 0);

  // Derive a stable ID from subject/class/slug
  const id = `${subject}-class${classNum}-${slug}`;

  const headings = extractHeadings(content);
  const plainContent = stripMarkdown(content);

  return {
    id,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    slug,
    subject,
    class: classNum,
    type: String(data.type ?? "lesson"),
    chapter: String(data.chapter ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    difficulty: String(data.difficulty ?? "beginner"),
    content: plainContent.slice(0, 5000), // Limit content size for index
    headings,
    ncertBook: data.ncertReference
      ? String((data.ncertReference as Record<string, string>)?.book ?? "")
      : undefined,
    ncertChapter: data.ncertReference
      ? String((data.ncertReference as Record<string, string>)?.chapter ?? "")
      : undefined,
    lastUpdated: String(data.lastUpdated ?? new Date().toISOString().split("T")[0]),
  };
}

// ---------------------------------------------------------------------------
// File collection
// ---------------------------------------------------------------------------

function collectMdxFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    console.error(`❌  Content directory not found: ${dir}`);
    process.exit(1);
  }

  function walk(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files.sort();
}

// ---------------------------------------------------------------------------
// MiniSearch format (optional)
// ---------------------------------------------------------------------------

function buildMiniSearchIndex(documents: SearchDocument[]): Record<string, unknown> {
  // Lightweight pre-built index structure compatible with MiniSearch
  // In production, you'd import and use MiniSearch directly.
  const index: Record<string, Record<string, number[]>> = {};

  for (const doc of documents) {
    const text = `${doc.title} ${doc.description} ${doc.content}`.toLowerCase();
    const tokens = text.split(/\W+/).filter((t) => t.length > 2);

    for (const token of tokens) {
      if (!index[token]) index[token] = {};
      if (!index[token][doc.id]) index[token][doc.id] = 0;
      index[token][doc.id]++;
    }
  }

  return {
    index,
    documentCount: documents.length,
  };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  console.log("🔨  Building search index…\n");
  console.log(`   Content dir: ${contentDir}`);
  console.log(`   Output dir:  ${outDir}\n`);

  const files = collectMdxFiles(contentDir);

  if (files.length === 0) {
    console.log("ℹ️  No content files found. Nothing to index.");
    process.exit(0);
  }

  console.log(`   Found ${files.length} content file(s).\n`);

  const documents: SearchDocument[] = [];
  let skipped = 0;

  for (const file of files) {
    const doc = buildDocument(file);
    if (doc) {
      documents.push(doc);
      if (process.argv.includes("--verbose")) {
        console.log(`   ✓ ${doc.id}`);
      }
    } else {
      skipped++;
    }
  }

  // ── Build index ────────────────────────────────────────────────────────
  const index: SearchIndex = {
    version: process.env.npm_package_version ?? "0.0.0",
    builtAt: new Date().toISOString(),
    documentCount: documents.length,
    documents,
  };

  // Ensure output directory exists
  fs.mkdirSync(outDir, { recursive: true });

  // Write main index
  const indexPath = path.join(outDir, "search-index.json");
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`\n📄  Search index written to: ${path.relative(process.cwd(), indexPath)}`);

  // Write MiniSearch index if requested
  if (minisearch) {
    const miniIndex = buildMiniSearchIndex(documents);
    const miniIndexPath = path.join(outDir, "minisearch-index.json");
    fs.writeFileSync(miniIndexPath, JSON.stringify(miniIndex));
    console.log(`📄  MiniSearch index written to: ${path.relative(process.cwd(), miniIndexPath)}`);
  }

  // ── Summary ────────────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(50));
  console.log(`✅  Indexed: ${documents.length} documents`);
  console.log(`⏭️   Skipped (draft/archived): ${skipped}`);
  console.log(`📄  Total files scanned: ${files.length}`);
  console.log(`📦  Index size: ${(fs.statSync(indexPath).size / 1024).toFixed(1)} KB`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
}

function resolveContentDir(): string {
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(dir, "content"))) {
      return path.join(dir, "content");
    }
    dir = path.dirname(dir);
  }
  return path.resolve(process.cwd(), "content");
}

main();
