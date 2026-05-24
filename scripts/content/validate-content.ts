#!/usr/bin/env npx tsx
/**
 * @tattva/scripts — Content Validator
 *
 * Validates MDX content files against Zod schemas to ensure
 * frontmatter integrity, link validity, and structural correctness.
 *
 * Usage:
 *   pnpm content:validate
 *   npx tsx scripts/content/validate-content.ts --dir content
 *   npx tsx scripts/content/validate-content.ts --fix
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { z, type ZodType } from "zod";

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const contentDir = getArg("--dir") ?? resolveContentDir();
const fix = args.includes("--fix");
const verbose = args.includes("--verbose") || args.includes("-v");
const strict = args.includes("--strict");

// ---------------------------------------------------------------------------
// Zod Schemas for content frontmatter
// ---------------------------------------------------------------------------

const SubjectEnum = z.enum([
  "mathematics",
  "physics",
  "chemistry",
  "biology",
  "english",
  "hindi",
  "social-science",
  "history",
  "geography",
  "civics",
  "economics",
  "computer-science",
  "sanskrit",
]);

const DifficultyEnum = z.enum(["beginner", "intermediate", "advanced"]);
const ContentStatusEnum = z.enum(["draft", "review", "published", "archived"]);
const ContentTypeEnum = z.enum(["lesson", "guide", "concept", "exercise", "quiz"]);

/** Base frontmatter shared by all content types */
const BaseFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  subject: SubjectEnum,
  class: z.coerce.number().int().min(1).max(12),
  type: ContentTypeEnum,
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case (lowercase, hyphens, no spaces)"),
  chapter: z.string().min(1, "Chapter reference is required"),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required").max(20),
  difficulty: DifficultyEnum,
  status: ContentStatusEnum,
  author: z.string().optional(),
  contributors: z.array(z.string()).optional(),
  lastUpdated: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  order: z.number().int().min(0).optional(),
  prerequisites: z.array(z.string()).optional(),
  relatedContent: z.array(z.string()).optional(),
  ncertReference: z
    .object({
      book: z.string(),
      chapter: z.string(),
      page: z.number().int().optional(),
    })
    .optional(),
});

/** Lesson-specific schema */
const LessonFrontmatterSchema = BaseFrontmatterSchema.extend({
  type: z.literal("lesson"),
  duration: z.string().optional(), // e.g. "30 min"
  learningObjectives: z.array(z.string()).optional(),
});

/** Guide-specific schema */
const GuideFrontmatterSchema = BaseFrontmatterSchema.extend({
  type: z.literal("guide"),
  targetAudience: z.string().optional(),
});

/** Concept-specific schema */
const ConceptFrontmatterSchema = BaseFrontmatterSchema.extend({
  type: z.literal("concept"),
  formulae: z.array(z.string()).optional(),
  diagrams: z.array(z.string()).optional(),
});

/** Exercise-specific schema */
const ExerciseFrontmatterSchema = BaseFrontmatterSchema.extend({
  type: z.literal("exercise"),
  totalMarks: z.number().int().min(0).optional(),
  questions: z.array(z.string()).optional(),
});

/** Quiz-specific schema */
const QuizFrontmatterSchema = BaseFrontmatterSchema.extend({
  type: z.literal("quiz"),
  totalQuestions: z.number().int().min(0).optional(),
  timeLimit: z.number().int().min(0).optional(), // seconds
});

/** Discriminated union of all content type schemas */
const FrontmatterSchema: ZodType<z.infer<typeof BaseFrontmatterSchema>> = z.discriminatedUnion(
  "type",
  [
    LessonFrontmatterSchema,
    GuideFrontmatterSchema,
    ConceptFrontmatterSchema,
    ExerciseFrontmatterSchema,
    QuizFrontmatterSchema,
  ],
);

// ---------------------------------------------------------------------------
// MDX Parsing
// ---------------------------------------------------------------------------

interface ParsedFrontmatter {
  data: Record<string, unknown>;
  content: string;
  filePath: string;
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, content: raw };

  const frontmatterStr = match[1];
  const content = raw.slice(match[0].length);

  // Simple YAML-ish parser (avoids adding yaml dependency)
  const data: Record<string, unknown> = {};
  let currentKey = "";
  let inArray = false;
  let arrayValues: string[] = [];

  for (const line of frontmatterStr.split("\n")) {
    const arrayItemMatch = line.match(/^-\s+(.+)$/);
    if (arrayItemMatch && inArray) {
      arrayValues.push(arrayItemMatch[1].replace(/^["']|["']$/g, ""));
      continue;
    }

    if (inArray && currentKey) {
      data[currentKey] = arrayValues;
      inArray = false;
    }

    const kvMatch = line.match(/^(\w[\w]*):\s*(.+)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      if (value === "" || value === "[]") {
        data[key] = [];
      } else if (value.startsWith("[") && value.endsWith("]")) {
        // Inline array
        data[key] = value
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      } else if (value === "true" || value === "false") {
        data[key] = value === "true";
      } else if (/^\d+$/.test(value)) {
        data[key] = parseInt(value, 10);
      } else {
        data[key] = value.replace(/^["']|["']$/g, "");
      }
      currentKey = kvMatch[1];
      inArray = false;
      arrayValues = [];
    } else if (line.trim() === "") {
      continue;
    } else {
      // Might be start of array
      inArray = true;
    }
  }

  if (inArray && currentKey) {
    data[currentKey] = arrayValues;
  }

  return { data, content };
}

// ---------------------------------------------------------------------------
// Content structure validation
// ---------------------------------------------------------------------------

function validateContentStructure(content: string, type: string): string[] {
  const warnings: string[] = [];

  // All content types should have at least one heading
  if (!content.match(/^#\s+/m)) {
    warnings.push("Missing top-level heading (#)");
  }

  // Lessons should have learning objectives section
  if (type === "lesson" && !content.match(/##\s+.*(?:objective|learning|goal)/i)) {
    warnings.push("Lesson content should include a 'Learning Objectives' section");
  }

  // Exercises should have questions
  if (type === "exercise" && !content.match(/\d+\.\s/)) {
    warnings.push("Exercise content should include numbered questions");
  }

  // Check for broken internal links [text](./missing-file)
  const internalLinkPattern = /\[([^\]]*)\]\((\.\/[^)]+)\)/g;
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = internalLinkPattern.exec(content)) !== null) {
    warnings.push(`Potentially broken internal link: [${linkMatch[1]}](${linkMatch[2]})`);
  }

  // Check for TODO/FIXME markers
  if (strict) {
    const todoPattern = /(?:TODO|FIXME|HACK|XXX):?\s/i;
    if (todoPattern.test(content)) {
      warnings.push("Content contains TODO/FIXME markers (strict mode)");
    }
  }

  return warnings;
}

// ---------------------------------------------------------------------------
// Main validation logic
// ---------------------------------------------------------------------------

interface ValidationOutcome {
  filePath: string;
  valid: boolean;
  errors: z.ZodIssue[];
  warnings: string[];
}

function validateFile(filePath: string): ValidationOutcome {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);

  // Validate frontmatter against Zod schema
  const result = FrontmatterSchema.safeParse(data);

  const warnings: string[] = [];

  if (result.success) {
    // Validate content structure
    warnings.push(...validateContentStructure(content, result.data.type));
  }

  return {
    filePath,
    valid: result.success,
    errors: result.success ? [] : result.error.issues,
    warnings,
  };
}

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
// CLI helpers
// ---------------------------------------------------------------------------

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
}

function resolveContentDir(): string {
  // Walk up from CWD to find the content directory
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(dir, "content"))) {
      return path.join(dir, "content");
    }
    dir = path.dirname(dir);
  }
  return path.resolve(process.cwd(), "content");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  console.log("🔍  Validating content files…\n");
  console.log(`   Directory: ${contentDir}\n`);

  const files = collectMdxFiles(contentDir);

  if (files.length === 0) {
    console.log("ℹ️  No MDX/MD files found. Nothing to validate.");
    process.exit(0);
  }

  console.log(`   Found ${files.length} content file(s).\n`);

  const results: ValidationOutcome[] = [];
  let validCount = 0;
  let invalidCount = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const result = validateFile(file);
    results.push(result);

    if (result.valid) {
      validCount++;
    } else {
      invalidCount++;
    }
    totalWarnings += result.warnings.length;
  }

  // ── Report errors ──────────────────────────────────────────────────────
  for (const result of results) {
    if (!result.valid) {
      console.log(`❌  ${path.relative(process.cwd(), result.filePath)}`);
      for (const issue of result.errors) {
        const field = issue.path.join(".");
        console.log(`    ↳ ${field ? `${field}: ` : ""}${issue.message}`);
      }
    }

    if (result.warnings.length > 0 && (verbose || !result.valid)) {
      for (const warning of result.warnings) {
        console.log(`⚠️   ${path.relative(process.cwd(), result.filePath)}: ${warning}`);
      }
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(50));
  console.log(`✅  Valid: ${validCount}`);
  console.log(`❌  Invalid: ${invalidCount}`);
  console.log(`⚠️   Warnings: ${totalWarnings}`);
  console.log(`📄  Total: ${files.length}`);

  if (invalidCount > 0) {
    console.log("\n💡  Fix frontmatter errors and re-run validation.");
    if (fix) {
      console.log("   --fix is not yet implemented for schema errors. Manual fix required.");
    }
    process.exit(1);
  }

  console.log("\n🎉  All content files are valid!");
}

main();
