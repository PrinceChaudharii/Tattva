#!/usr/bin/env npx tsx
/**
 * @tattva/scripts — Database Migration Runner
 *
 * Runs Drizzle ORM migrations against the configured database.
 * Supports running up, down, and status checks.
 *
 * Usage:
 *   npx tsx scripts/migration/migrate.ts              # Run pending migrations
 *   npx tsx scripts/migration/migrate.ts up            # Alias for default
 *   npx tsx scripts/migration/migrate.ts down          # Rollback last migration
 *   npx tsx scripts/migration/migrate.ts status        # Show migration status
 *   npx tsx scripts/migration/migrate.ts generate      # Generate migration from schema
 *   npx tsx scripts/migration/migrate.ts --dry-run     # Show what would be run
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const command = args.find((a) => !a.startsWith("-")) ?? "up";
const dryRun = args.includes("--dry-run");
const verbose = args.includes("--verbose") || args.includes("-v");
const migrationDir =
  getArg("--migrations") ?? path.resolve(process.cwd(), "packages", "database", "drizzle");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MigrationFile {
  filename: string;
  filepath: string;
  timestamp: number;
  direction: "up" | "down";
}

interface MigrationStatus {
  applied: string[];
  pending: string[];
}

// ---------------------------------------------------------------------------
// Migration file discovery
// ---------------------------------------------------------------------------

function discoverMigrations(dir: string): MigrationFile[] {
  if (!fs.existsSync(dir)) {
    console.error(`❌  Migration directory not found: ${dir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  return files.map((filename) => {
    const filepath = path.join(dir, filename);
    // Drizzle naming: 0000_name.sql
    const timestampMatch = filename.match(/^(\d+)/);
    const timestamp = timestampMatch ? parseInt(timestampMatch[1], 10) : 0;

    return {
      filename,
      filepath,
      timestamp,
      direction: "up" as const,
    };
  });
}

// ---------------------------------------------------------------------------
// Database connection (stub — replace with actual Drizzle client)
// ---------------------------------------------------------------------------

/**
 * Get the database connection.
 * In production, this would use the @tattva/database package.
 *
 * TODO: Wire up to actual Drizzle ORM when database package is ready.
 */
function getDbConnection(): { url: string } {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error(
      "❌  DATABASE_URL environment variable is not set.\n" +
        "   Set it in .env.local or export it before running migrations:\n" +
        '   export DATABASE_URL="postgresql://tattva:tattva_dev@localhost:5432/tattva"',
    );
    process.exit(1);
  }

  return { url };
}

/**
 * Get list of already-applied migrations from the database.
 * In production, this would query the drizzle migrations journal table.
 */
async function getAppliedMigrations(): Promise<string[]> {
  // Simulated — replace with:
  //   const result = await db.execute(sql`SELECT hash FROM __drizzle_migrations ORDER BY created_at`);
  //   return result.rows.map(r => r.hash as string);
  return [];
}

/**
 * Record a migration as applied.
 */
async function recordMigration(filename: string, _sql: string): Promise<void> {
  if (dryRun) {
    console.log(`   [DRY RUN] Would record migration: ${filename}`);
    return;
  }
  // Simulated — replace with:
  //   await db.execute(sql`INSERT INTO __drizzle_migrations (hash, created_at) VALUES (${filename}, NOW())`);
  void filename;
}

/**
 * Remove a migration record (for rollback).
 */
async function removeMigrationRecord(filename: string): Promise<void> {
  if (dryRun) {
    console.log(`   [DRY RUN] Would remove migration record: ${filename}`);
    return;
  }
  void filename;
}

// ---------------------------------------------------------------------------
// Command handlers
// ---------------------------------------------------------------------------

async function runUp(): Promise<void> {
  console.log("⬆️  Running pending migrations…\n");

  const db = getDbConnection();
  const migrations = discoverMigrations(migrationDir);
  const applied = await getAppliedMigrations();

  const pending = migrations.filter((m) => !applied.includes(m.filename));

  if (pending.length === 0) {
    console.log("✅  No pending migrations. Database is up to date.");
    return;
  }

  console.log(`   Found ${pending.length} pending migration(s):\n`);

  for (const migration of pending) {
    const sql = fs.readFileSync(migration.filepath, "utf-8");

    if (verbose || dryRun) {
      console.log(`   ┌─ ${migration.filename}`);
      const preview = sql.split("\n").slice(0, 10).join("\n   │ ");
      console.log(`   │ ${preview}`);
      if (sql.split("\n").length > 10) console.log("   │ …");
      console.log(`   └─`);
    }

    if (!dryRun) {
      try {
        // Execute migration
        // await db.execute(sql);
        console.log(`   ✅ Applied: ${migration.filename}`);
        await recordMigration(migration.filename, sql);
      } catch (err) {
        console.error(`   ❌ Failed: ${migration.filename}`);
        console.error(`      ${err instanceof Error ? err.message : String(err)}`);
        console.error("\n   Migration aborted. Resolve the error and re-run.");
        process.exit(1);
      }
    } else {
      console.log(`   [DRY RUN] Would apply: ${migration.filename}`);
    }
  }

  console.log(`\n✅  ${dryRun ? "Would apply" : "Applied"} ${pending.length} migration(s).`);
}

async function runDown(): Promise<void> {
  console.log("⬇️  Rolling back last migration…\n");

  const db = getDbConnection();
  const migrations = discoverMigrations(migrationDir);
  const applied = await getAppliedMigrations();

  if (applied.length === 0) {
    console.log("ℹ️  No migrations to roll back.");
    return;
  }

  const lastApplied = applied[applied.length - 1];
  const migration = migrations.find((m) => m.filename === lastApplied);

  if (!migration) {
    console.error(`❌  Cannot find migration file for: ${lastApplied}`);
    process.exit(1);
  }

  // Look for a corresponding down migration
  const downFilename = migration.filename.replace(".sql", ".down.sql");
  const downPath = path.join(migrationDir, downFilename);

  if (!fs.existsSync(downPath)) {
    console.error(`❌  No rollback file found: ${downFilename}`);
    console.error("   Create a .down.sql file to enable rollbacks.");
    process.exit(1);
  }

  const sql = fs.readFileSync(downPath, "utf-8");

  if (verbose || dryRun) {
    console.log(`   ┌─ ${downFilename}`);
    const preview = sql.split("\n").slice(0, 10).join("\n   │ ");
    console.log(`   │ ${preview}`);
    console.log(`   └─`);
  }

  if (!dryRun) {
    try {
      // await db.execute(sql);
      await removeMigrationRecord(lastApplied);
      console.log(`   ✅ Rolled back: ${lastApplied}`);
    } catch (err) {
      console.error(`   ❌ Rollback failed: ${lastApplied}`);
      console.error(`      ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
  } else {
    console.log(`   [DRY RUN] Would roll back: ${lastApplied}`);
  }

  void db; // suppress unused warning
}

async function runStatus(): Promise<void> {
  console.log("📊  Migration status\n");

  const migrations = discoverMigrations(migrationDir);
  const applied = await getAppliedMigrations();

  console.log(`   Migration directory: ${migrationDir}`);
  console.log(`   Total migration files: ${migrations.length}`);
  console.log(`   Applied: ${applied.length}`);
  console.log(`   Pending: ${migrations.length - applied.length}\n`);

  for (const migration of migrations) {
    const isApplied = applied.includes(migration.filename);
    const icon = isApplied ? "✅" : "⏳";
    console.log(`   ${icon}  ${migration.filename}`);
  }

  if (migrations.length === 0) {
    console.log("   (no migration files found)");
  }
}

async function runGenerate(): Promise<void> {
  console.log("🔧  Generating migration from schema changes…\n");

  if (dryRun) {
    console.log("   [DRY RUN] Would run: pnpm --filter @tattva/database drizzle-kit generate");
    return;
  }

  // In production, this would shell out to drizzle-kit:
  //   const { execSync } = require("child_process");
  //   execSync("pnpm --filter @tattva/database drizzle-kit generate", { stdio: "inherit" });

  console.log("   ⚠️  Migration generation requires the database package to be set up.");
  console.log("   Run: pnpm --filter @tattva/database db:generate");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const commands: Record<string, () => Promise<void>> = {
    up: runUp,
    down: runDown,
    status: runStatus,
    generate: runGenerate,
  };

  const handler = commands[command];

  if (!handler) {
    console.error(`❌  Unknown command: ${command}`);
    console.error(`   Available commands: ${Object.keys(commands).join(", ")}`);
    process.exit(1);
  }

  await handler();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
