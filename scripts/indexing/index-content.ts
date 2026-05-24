#!/usr/bin/env npx tsx
/**
 * @tattva/scripts — Content Indexing
 *
 * Indexes content into the database for runtime querying.
 * Processes MDX content files and upserts structured records
 * into the content table via the database package.
 *
 * This is the "real-time" indexer that keeps the DB in sync
 * with the filesystem content. Run after content changes or
 * as part of the deployment pipeline.
 *
 * Usage:
 *   npx tsx scripts/indexing/index-content.ts
 *   npx tsx scripts/indexing/index-content.ts --dry-run
 *   npx tsx scripts/indexing/index-content.ts --subject mathematics
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const verbose = args.includes("--verbose") || args.includes("-v");
const subjectFilter = getArg("--subject");
const classFilter = getArg("--class") ? Number(getArg("--class")) : undefined;
const contentDir = getArg("--dir") ?? resolveContentDir();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContentRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  subject: string;
  class: number;
  type: string;
  chapter: string;
  tags: string[];
  difficulty: string;
  status: string;
  contentHash: string;
  filePath: string;
  ncertReference: {
    book: string;
    chapter: string;
    page?: number;
  } | null;
  metadata: Record<string, unknown>;
  indexedAt: string;
}

interface IndexingResult {
  total: number;
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
  errors: number;
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data: Record<string, unknown> = {};

  for (const line of match[1].split("\n")) {
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
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return data;
}

function computeContentHash(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
}

// ---------------------------------------------------------------------------
// Document builder
// ---------------------------------------------------------------------------

function buildContentRecord(filePath: string): ContentRecord | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = parseFrontmatter(raw);

  const slug = String(data.slug ?? path.basename(filePath, path.extname(filePath)));
  const subject = String(data.subject ?? "unknown");
  const classNum = Number(data.class ?? 0);

  // Apply filters
  if (subjectFilter && subject !== subjectFilter) return null;
  if (classFilter && classNum !== classFilter) return null;

  // Skip archived
  if (data.status === "archived") return null;

  const contentHash = computeContentHash(filePath);

  return {
    id: `${subject}-class${classNum}-${slug}`,
    slug,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    subject,
    class: classNum,
    type: String(data.type ?? "lesson"),
    chapter: String(data.chapter ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    difficulty: String(data.difficulty ?? "beginner"),
    status: String(data.status ?? "draft"),
    contentHash,
    filePath: path.relative(process.cwd(), filePath),
    ncertReference: data.ncertReference
      ? (data.ncertReference as ContentRecord["ncertReference"])
      : null,
    metadata: {
      author: data.author ?? null,
      duration: data.duration ?? null,
      order: data.order ?? null,
    },
    indexedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Database operations (stub — replace with actual DB client)
// ---------------------------------------------------------------------------

/**
 * Upsert a content record into the database.
 * In production, this would use the @tattva/database package.
 *
 * TODO: Wire up to actual Drizzle ORM when database package is ready.
 */
async function upsertContentRecord(record: ContentRecord): Promise<"created" | "updated" | "unchanged"> {
  // Simulated logic — replace with real DB calls:
  //
  //   const existing = await db.select().from(contentTable).where(eq(contentTable.id, record.id));
  //   if (!existing) {
  //     await db.insert(contentTable).values(record);
  //     return "created";
  //   }
  //   if (existing.contentHash !== record.contentHash) {
  //     await db.update(contentTable).set(record).where(eq(contentTable.id, record.id));
  //     return "updated";
  //   }
  //   return "unchanged";

  if (dryRun) {
    console.log(`   [DRY RUN] Would upsert: ${record.id}`);
    return "created";
  }

  // Placeholder — in production, this would call the database package
  void record;
  return "created";
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
// Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("📇  Indexing content into database…\n");
  console.log(`   Content dir: ${contentDir}`);
  if (subjectFilter) console.log(`   Subject filter: ${subjectFilter}`);
  if (classFilter) console.log(`   Class filter: ${classFilter}`);
  if (dryRun) console.log(`   Mode: DRY RUN`);
  console.log();

  const files = collectMdxFiles(contentDir);

  if (files.length === 0) {
    console.log("ℹ️  No content files found. Nothing to index.");
    process.exit(0);
  }

  console.log(`   Found ${files.length} content file(s).\n`);

  const result: IndexingResult = {
    total: files.length,
    created: 0,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    errors: 0,
  };

  for (const file of files) {
    try {
      const record = buildContentRecord(file);

      if (!record) {
        result.skipped++;
        continue;
      }

      const outcome = await upsertContentRecord(record);

      switch (outcome) {
        case "created":
          result.created++;
          if (verbose) console.log(`   ✚ ${record.id}`);
          break;
        case "updated":
          result.updated++;
          if (verbose) console.log(`   ↻ ${record.id}`);
          break;
        case "unchanged":
          result.unchanged++;
          if (verbose) console.log(`   = ${record.id}`);
          break;
      }
    } catch (err) {
      result.errors++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`   ❌ Error indexing ${file}: ${message}`);
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(50));
  console.log(`✅  Created:   ${result.created}`);
  console.log(`↻   Updated:   ${result.updated}`);
  console.log(`=   Unchanged: ${result.unchanged}`);
  console.log(`⏭️   Skipped:   ${result.skipped}`);
  console.log(`❌  Errors:    ${result.errors}`);
  console.log(`📄  Total:     ${result.total}`);

  if (result.errors > 0) {
    process.exit(1);
  }
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

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
