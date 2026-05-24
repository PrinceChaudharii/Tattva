# Contributing to Tattva

> **तत्त्व** *(tattva)* — essence, truth, the fundamental principle.

First of all: **thank you for being here.** Whether you're fixing a typo in a physics chapter, translating a mathematics lesson into Tamil, building a new UI component, or architecting a database migration — your contribution matters. Tattva is built on the belief that India's educational content deserves the same collaborative infrastructure that powers the world's best open-source software.

This guide will help you make your first contribution and become a productive member of the Tattva community.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Conventions](#commit-message-conventions)
- [Pull Request Process](#pull-request-process)
- [Content Contributions](#content-contributions)
- [Translation Contributions](#translation-contributions)
- [Review Process](#review-process)
- [Style Guide](#style-guide)
- [Architecture Overview](#architecture-overview-for-contributors)
- [Community Resources](#community-resources)

---

## Code of Conduct

This project and everyone participating in it is governed by our **Code of Conduct**. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for the full text.

**In short:** Be respectful, be inclusive, be constructive. We are building educational infrastructure for 250 million students — act accordingly.

---

## Getting Started

### 1. Fork the repository

Click the **Fork** button on the [Tattva GitHub repository](https://github.com/tattva-edu/tattva) to create your own copy.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/tattva.git
cd tattva
```

### 3. Add the upstream remote

```bash
git remote add upstream https://github.com/tattva-edu/tattva.git
```

### 4. Install dependencies

```bash
pnpm install
```

> **Note:** Tattva uses pnpm workspaces. Always use `pnpm` — not `npm` or `yarn`. If you don't have pnpm: `corepack enable && corepack prepare pnpm@latest --activate`

### 5. Set up environment variables

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

Fill in the required values (see [README: Quick Start](./README.md#quick-start) for details).

### 6. Start the infrastructure

```bash
cd infra/docker && docker compose up -d
```

### 7. Set up the database

```bash
pnpm db:generate
pnpm db:push
```

### 8. Start developing

```bash
pnpm dev
```

### 9. Keep your fork up to date

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## Development Workflow

### Typical workflow

1. **Create a branch** from `main` (see [Branch Naming](#branch-naming-conventions))
2. **Make your changes** — write code, content, or translations
3. **Validate locally** — run linting, type checking, and content validation
4. **Commit** with a descriptive message (see [Commit Conventions](#commit-message-conventions))
5. **Push** to your fork
6. **Open a Pull Request** (see [PR Process](#pull-request-process))

### Essential commands

```bash
# Development
pnpm dev                        # Start all apps

# Code quality
pnpm lint                       # Lint all packages
pnpm typecheck                  # Type-check all packages
pnpm format                     # Format all files
pnpm format:check               # Check formatting (CI uses this)

# Content
pnpm content:validate           # Validate all MDX frontmatter
pnpm content:build              # Build the search index

# Database
pnpm db:generate                # Generate Drizzle migrations
pnpm db:push                    # Push schema changes (dev only)
pnpm db:studio                  # Open Drizzle Studio GUI

# Target a specific package
pnpm --filter @tattva/web dev
pnpm --filter @tattva/database build
```

### Pre-commit hooks

Tattva uses **Husky** + **lint-staged** to enforce quality on every commit:

- `*.ts`, `*.tsx` → ESLint fix + Prettier write
- `*.md`, `*.mdx` → Prettier write
- `*.json`, `*.yaml`, `*.yml`, `*.css` → Prettier write

These run automatically. If a hook fails, fix the issues and re-commit.

---

## Branch Naming Conventions

Use descriptive, lowercase, kebab-case branch names prefixed by category:

| Prefix | Use for | Example |
|---|---|---|
| `feat/` | New features | `feat/quiz-component` |
| `fix/` | Bug fixes | `fix/chapter-routing-error` |
| `content/` | Educational content | `content/physics-class11-ch01-update` |
| `i18n/` | Translations | `i18n/hi-physics-ch01` |
| `refactor/` | Code refactoring | `refactor/database-schema` |
| `docs/` | Documentation | `docs/api-reference` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |
| `test/` | Adding or updating tests | `test/content-validator` |

**Examples:**

```bash
git checkout -b feat/interactive-quiz-component
git checkout -b content/chemistry-class11-ch02-structure-of-atom
git checkout -b i18n/mr-mathematics-class11-sets
```

---

## Commit Message Conventions

Tattva follows [Conventional Commits](https://www.conventionalcommits.org/). This enables automatic changelog generation and semantic versioning.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Example |
|---|---|---|
| `feat` | New feature | `feat(web): add interactive quiz component` |
| `fix` | Bug fix | `fix(api): correct chapter pagination offset` |
| `content` | Educational content change | `content(physics): add Class 11 Chapter 1 exercises` |
| `i18n` | Translation change | `i18n(hi): translate Physics Ch 1 to Hindi` |
| `docs` | Documentation only | `docs: update API authentication guide` |
| `style` | Formatting, no logic change | `style(ui): fix button alignment` |
| `refactor` | Code restructuring | `refactor(database): normalize lesson schema` |
| `perf` | Performance improvement | `perf(search): optimize content indexer` |
| `test` | Adding or updating tests | `test(content): add frontmatter validation tests` |
| `chore` | Maintenance, tooling | `chore: update pnpm to 11.3` |
| `ci` | CI/CD changes | `ci: add content validation to PR checks` |
| `revert` | Revert a previous commit | `revert: revert feat(web): add quiz component` |

### Scopes

Use the package or app name as the scope:

- `web` — `@tattva/web`
- `api` — `@tattva/api`
- `admin` — `@tattva/admin`
- `docs` — `@tattva/docs`
- `ui` — `@tattva/ui`
- `database` — `@tattva/database`
- `auth` — `@tattva/auth`
- `content` — `@tattva/content`
- `editor` — `@tattva/editor`
- `search` — `@tattva/search`
- `analytics` — `@tattva/analytics`
- `logger` — `@tattva/logger`

### Rules

- **Subject line:** Max 72 characters, imperative mood ("add" not "added")
- **Body:** Wrap at 72 characters, explain *what* and *why* (not *how*)
- **Breaking changes:** Use `!` after type or add `BREAKING CHANGE:` in footer

### Examples

```
feat(web): add chapter progress tracking

Add a progress bar component that tracks which sections a student
has read within a chapter. Progress is persisted to localStorage
and synced to the server when authenticated.

Closes #142
```

```
content(physics): add Units and Measurements chapter

Add Class 11 Physics Chapter 1 content covering SI units,
measurement techniques, errors, and dimensional analysis.
Includes exercises with difficulty-tagged problems.

NCERT Reference: Physics Textbook for Class XI, Chapter 2
```

```
fix(database)!: change lesson slug to unique per chapter

BREAKING CHANGE: Lesson slugs are now unique per chapter instead
of globally. Migration will re-index existing lessons.
```

---

## Pull Request Process

### Before opening a PR

1. **Sync with main:** `git fetch upstream && git merge upstream/main`
2. **Run all checks locally:**
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm format:check
   pnpm content:validate   # if changing content
   ```
3. **Test your changes** in the relevant app(s)
4. **Write clear commit messages** following Conventional Commits

### Opening the PR

1. Push your branch to your fork
2. Open a PR against the `main` branch of `tattva-edu/tattva`
3. Fill out the PR template completely

### PR title

Use the same Conventional Commits format:

```
feat(web): add chapter progress tracking
fix(api): correct chapter pagination offset
content(physics): add Units and Measurements exercises
i18n(hi): translate Mathematics Ch 1 to Hindi
```

### PR description should include

- **What** — what does this PR change?
- **Why** — what problem does it solve or what feature does it add?
- **How** — how was it implemented? (brief, for reviewers)
- **Testing** — how was it tested? (manual, automated, screenshots)
- **Related issues** — `Closes #123` or `Relates to #456`
- **Screenshots** — for UI changes, include before/after screenshots
- **Breaking changes** — if any, describe migration path

### PR checklist

Before requesting review, confirm:

- [ ] Branch is up to date with `main`
- [ ] All CI checks pass (lint, typecheck, format, content validate)
- [ ] Commit messages follow Conventional Commits
- [ ] New code has appropriate TypeScript types (no `any`)
- [ ] Database changes include a migration (`pnpm db:generate`)
- [ ] Content changes validate successfully (`pnpm content:validate`)
- [ ] New content has proper frontmatter and `ncertReference`
- [ ] UI changes are responsive and accessible
- [ ] No unrelated changes in the PR

### After review

- Address review feedback with new commits (do not squash during review)
- Once approved, a maintainer will merge your PR
- PRs are typically squash-merged to keep history clean

---

## Content Contributions

Content is the soul of Tattva. Every chapter, exercise, and explanation is a contribution that directly impacts students.

### Content structure

```
content/
├── {subject}/class-{n}/chapter-{nn}-{slug}/
│   ├── index.mdx          # Main chapter content
│   ├── exercises.mdx      # Problems and solutions
│   └── figures/           # Images and diagrams
└── metadata/
    ├── subjects.json      # Subject registry
    ├── schema.json        # Frontmatter schema
    └── contributors.json  # Contributor registry
```

### Content contribution workflow

1. **Check existing content** — browse the `content/` directory and existing issues
2. **Claim an issue** — comment on the issue to let others know you're working on it
3. **Create a branch** — `content/{subject}-class{nn}-ch{nn}-{description}`
4. **Write or edit content** — follow the frontmatter schema and MDX guidelines below
5. **Validate** — `pnpm content:validate`
6. **Open a PR** — use `content` type in the PR title

### Frontmatter schema

Every MDX file **must** include YAML frontmatter. See the full schema in [`content/metadata/schema.json`](./content/metadata/schema.json).

```yaml
---
title: "Units and Measurements"        # Required — Display title
subject: physics                        # Required — Subject slug
class: 11                               # Required — Class number (1-12)
chapter: 1                              # Required — Chapter number
ncertReference: "Physics XI, Ch 2"     # Required — NCERT textbook citation
locale: en                              # Required — ISO 639-1 language code
status: draft                           # Required — draft | review | published
version: 1.0.0                          # Required — Semver
lastReviewed: "2024-01-15"             # ISO 8601 date
contributors:
  - name: "Your Name"
    role: author                        # author | reviewer | translator | editor
tags: [physics, units, measurements]    # Freeform tags
difficulty: foundational                # foundational | intermediate | advanced
estimatedReadingTime: 45                # Minutes
---
```

### Content status lifecycle

```
draft ──► review ──► published
  ▲                            │
  └──────── revised ───────────┘
```

- **draft** — Initial submission; not visible to students
- **review** — Under community/expert review; visible to reviewers
- **published** — Live on the platform

### MDX writing guidelines

#### Structure

```mdx
## 1.1 Section Title

Explanation text with **bold** for key terms.

### 1.1.1 Subsection

Deeper detail...

> **Key Idea:** Highlighted concept summary in a blockquote.
```

#### Math (KaTeX)

```mdx
Inline: The kinetic energy is $K = \frac{1}{2}mv^2$.

Block:
$$\int_0^\infty e^{-x} dx = 1$$
```

#### Interactive components

```mdx
<Quiz questionId="physics-11-1-1" />
<Simulation id="projectile-motion" />
```

#### Cross-references

```mdx
[See Chapter 3](../chapter-03-motion-in-a-plane/)
```

#### Exercises

Exercises go in a companion `exercises.mdx` file, tagged by difficulty:

```mdx
### Exercise 1.1 — Foundational
Calculate the number of significant figures in 0.00750.

### Exercise 1.2 — Intermediate
A physical quantity is measured as $4.5 \pm 0.2$ cm. Find the percentage error.

### Exercise 1.3 — Advanced
...
```

### NCERT alignment rules

- Every chapter **must** reference the exact NCERT textbook and chapter number
- Content should follow the NCERT chapter structure and scope
- Additional explanations, examples, and exercises are encouraged beyond what NCERT provides
- When NCERT updates a textbook, a tracking issue is created and content is revised

### Content versioning

Content uses **Semantic Versioning**:

| Change | Version bump | Example |
|---|---|---|
| Typo fix, formatting | Patch | `1.0.0 → 1.0.1` |
| New section, expanded explanation | Minor | `1.0.0 → 1.1.0` |
| Restructured chapter, rewritten content | Major | `1.0.0 → 2.0.0` |

**Always** bump the `version` field in frontmatter when editing content.

### Contributor roles

| Role | Description |
|---|---|
| **author** | Writes or substantially revises content |
| **reviewer** | Reviews for accuracy, NCERT alignment, and pedagogy |
| **editor** | Copy-edits for style, grammar, and formatting |
| **translator** | Creates or maintains a locale translation |

Add yourself to the `contributors` array in the frontmatter with the appropriate role. Significant contributors are also added to `metadata/contributors.json`.

---

## Translation Contributions

Tattva aims to make NCERT-aligned content available in **9+ Indian languages**. Translations mirror the English source structure under `content/translations/{locale}/`.

### Supported locales

| Code | Language | Native |
|---|---|---|
| `hi` | Hindi | हिंदी |
| `mr` | Marathi | मराठी |
| `ta` | Tamil | தமிழ் |
| `te` | Telugu | తెలుగు |
| `kn` | Kannada | ಕನ್ನಡ |
| `bn` | Bengali | বাংলা |
| `gu` | Gujarati | ગુજરાતી |
| `ur` | Urdu | اردو (RTL) |

### Translation workflow

1. **Find the English source** — locate the chapter in `content/{subject}/class-{n}/chapter-{nn}-*/`
2. **Check existing translations** — look in `content/translations/{locale}/{subject}/class-{n}/`
3. **Create the directory structure** — mirror the English path:
   ```
   content/translations/hi/physics/class-11/chapter-01/index.mdx
   ```
4. **Translate the content** — maintain the same section structure and math
5. **Add translation frontmatter** — include additional fields:
   ```yaml
   locale: hi                    # Target language
   sourceVersion: 1.0.0          # Version of the English source being translated
   contributors:
     - name: "Your Name"
       role: translator
   ```
6. **Validate** — `pnpm content:validate`
7. **Open a PR** — use `i18n` type: `i18n(hi): translate Physics Ch 1 to Hindi`

### Translation guidelines

- **Preserve structure:** Maintain the same heading hierarchy, section numbers, and math expressions
- **Translate meaning, not words:** Use natural phrasing in the target language
- **Keep technical terms:** Some terms (like "SI units") may be better left untranslated
- **Preserve math:** LaTeX/KaTeX expressions remain the same across languages
- **NCERT alignment:** Reference the Hindi/regional language NCERT textbook if available
- **RTL support:** For Urdu and other RTL languages, ensure content renders correctly

### Sync detection

When the English source chapter is updated to a new version, translations should:
1. Revert status to `draft` if previously `published`
2. Update `sourceVersion` to match the new English version
3. Revise the translation to reflect source changes

---

## Review Process

### Who reviews?

- **Code changes** — At least one maintainer or core contributor with expertise in the relevant package
- **Content changes** — At least one reviewer with subject-matter expertise
- **Translation changes** — At least one native speaker of the target language

### Review criteria

Reviewers evaluate:

1. **Correctness** — Does it work? Is the content accurate?
2. **NCERT alignment** — Does it match the referenced NCERT textbook? (content only)
3. **Code quality** — Is it well-typed, well-structured, and maintainable?
4. **Style** — Does it follow the project's style guide?
5. **Tests** — Are there sufficient tests? Do they pass?
6. **Breaking changes** — Are migrations provided? Is the changelog updated?
7. **Accessibility** — Are UI changes accessible (keyboard nav, screen readers, contrast)?
8. **Performance** — Does it avoid unnecessary re-renders, large bundles, or N+1 queries?

### Review turnaround

We aim to review PRs within **3 business days**. If you haven't heard back, please politely ping the PR or reach out on discussions.

### Responding to reviews

- Address every comment (even if just "done")
- Push new commits — don't force-push during review
- If you disagree with feedback, explain your reasoning respectfully
- Mark conversations as resolved when addressed

---

## Style Guide

### TypeScript

Tattva uses **TypeScript strict mode** with additional safety flags. See [`tsconfig.base.json`](./tsconfig.base.json) for the full configuration.

```jsonc
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitOverride": true,
  "noPropertyAccessFromIndexSignature": true,
  "noFallthroughCasesInSwitch": true
}
```

**Rules:**

- **No `any`.** Use `unknown` and narrow with type guards, or define a proper type.
- **Prefer interfaces** for object shapes, **types** for unions/intersections/utility types.
- **Use `as const`** for literal types and tuple types.
- **Use exhaustive `switch`** with `never` default for discriminated unions.
- **Prefer Zod schemas** for runtime validation; infer types from schemas with `z.infer<>`.
- **Use path aliases** — import from `@tattva/ui`, not relative paths across packages.
- **Explicit return types** on exported functions.
- **No non-null assertions** (`!`). Use optional chaining and nullish coalescing.

```typescript
// ✅ Good
import { buttonVariants } from "@tattva/ui";
const chapter = chapters.find((c) => c.slug === slug);
if (!chapter) throw new Error(`Chapter not found: ${slug}`);

// ❌ Bad
import { buttonVariants } from "../../../packages/ui/src";
const chapter = chapters.find((c) => c.slug === slug)!;
```

### React

- **Server Components by default** — only add `"use client"` when you need interactivity
- **Colocate components** — keep component files next to their usage
- **Named exports** — prefer named exports over default exports
- **Composition over props** — use `children` and composition patterns over bloated prop objects
- **Extract custom hooks** for reusable stateful logic
- **Use `useActionState`** for form actions and mutations
- **Keep components small** — one responsibility per component

```tsx
// ✅ Good — Server Component, named export, single responsibility
export function ChapterHeader({ title, chapter }: ChapterHeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <ChapterMeta chapter={chapter} />
    </header>
  );
}
```

### Tailwind CSS

- **Use the design system** — prefer `@tattva/ui` components over raw Tailwind classes
- **Use CVA (Class Variance Authority)** for component variants
- **Use `cn()` utility** from `@tattva/ui/lib/utils` for conditional classes
- **No arbitrary values** — use theme tokens (`text-blue-500` not `text-[#3b82f6]`)
- **Responsive-first** — design for mobile, enhance for desktop (`sm:`, `md:`, `lg:`)
- **No `@apply`** in component files; use it only in global CSS for resets

```tsx
// ✅ Good — CVA variant with cn() utility
import { cn } from "@tattva/ui/lib/utils";
import { buttonVariants } from "@tattva/ui";

function SubmitButton({ className, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant: "primary", size: "lg" }), className)}
      {...props}
    />
  );
}

// ❌ Bad — hardcoded color, arbitrary value
<button className="bg-[#3b82f6] text-white px-[24px]">Submit</button>
```

### File naming

| Type | Convention | Example |
|---|---|---|
| Components | kebab-case | `chapter-header.tsx` |
| Utilities | kebab-case | `format-date.ts` |
| Types | kebab-case | `content-types.ts` |
| Hooks | kebab-case with `use-` prefix | `use-chapter-progress.ts` |
| Pages | Next.js App Router convention | `page.tsx`, `layout.tsx`, `loading.tsx` |
| Content | `index.mdx`, `exercises.mdx` | See content conventions |

### Import order

Organize imports in this order, separated by blank lines:

```typescript
// 1. Node built-ins
import { readFile } from "node:fs/promises";

// 2. External packages
import { z } from "zod";
import { NextResponse } from "next/server";

// 3. Internal packages (using path aliases)
import { db } from "@tattva/database";
import { Button } from "@tattva/ui";

// 4. Local imports (relative)
import { formatChapter } from "./format";
import type { ChapterMeta } from "./types";
```

---

## Architecture Overview for Contributors

Understanding the monorepo structure will help you navigate and contribute effectively.

### Monorepo architecture

Tattva uses **Turborepo** with **pnpm workspaces**. The key insight: packages declare dependencies on each other using `workspace:*` protocol, and Turborepo orchestrates builds in dependency order.

```
                    ┌─────────────────┐
                    │  @tattva/web    │  ← Consumer apps
                    │  @tattva/api    │
                    │  @tattva/admin  │
                    │  @tattva/docs   │
                    └────────┬────────┘
                             │ depends on
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
    ┌─────────────┐  ┌────────────┐  ┌───────────┐
    │ @tattva/ui  │  │ @tattva/   │  │ @tattva/  │  ← Feature packages
    │             │  │ auth       │  │ content   │
    └──────┬──────┘  └─────┬──────┘  └─────┬─────┘
           │               │               │
           └───────────────┼───────────────┘
                           ▼
                  ┌─────────────────┐
                  │ @tattva/        │  ← Foundation packages
                  │ shared-types    │
                  │ database        │
                  │ config          │
                  │ logger          │
                  └─────────────────┘
```

### Data flow

```
[MDX Files] → @tattva/content (parse + validate) → @tattva/search (index)
                                                       │
[Users] → @tattva/auth (authenticate) → @tattva/api (serve) → @tattva/web (render)
                     │                                      │
              @tattva/database                          @tattva/ui
```

### Database schema relationships

```
users ──< accounts
      ──< sessions
      ──< contributions ──< reviews
                        ──< comments

subjects ──< chapters ──< lessons ──< exercises
```

### Path aliases

All internal packages are importable via path aliases defined in `tsconfig.base.json`:

```typescript
import { Button } from "@tattva/ui";
import { db, users, chapters } from "@tattva/database";
import { auth } from "@tattva/auth";
import { parseMDX } from "@tattva/content";
import { searchContent } from "@tattva/search";
import { logger } from "@tattva/logger";
```

### Turborepo task pipeline

Tasks are defined in [`turbo.json`](./turbo.json) and run in dependency order:

```
build: dependsOn ["^build"]  →  packages build before apps
lint:  dependsOn ["^typecheck"]
typecheck: dependsOn ["^build"]
db:migrate: dependsOn ["db:generate"]
content:build: dependsOn ["^build"]
```

---

## Community Resources

| Resource | Link |
|---|---|
| **GitHub Discussions** | [tattva-edu/tattva/discussions](https://github.com/tattva-edu/tattva/discussions) |
| **Bug Reports** | [Open an issue](https://github.com/tattva-edu/tattva/issues/new?template=bug_report.md) |
| **Feature Requests** | [Open an issue](https://github.com/tattva-edu/tattva/issues/new?template=feature_request.md) |
| **Content Architecture** | [`content/README.md`](./content/README.md) |
| **Project Board** | [GitHub Projects](https://github.com/orgs/tattva-edu/projects) |

### Getting help

- **Stuck?** Open a [Discussion](https://github.com/tattva-edu/tattva/discussions) with the "Q&A" category
- **Found a bug?** Open an [Issue](https://github.com/tattva-edu/tattva/issues) with the bug template
- **Want to discuss an idea?** Open a Discussion with the "Ideas" category
- **Need a code walkthrough?** Ask in Discussions — we're happy to help

### Recognition

Contributors are recognized in several ways:

- Added to `content/metadata/contributors.json` for content contributions
- Listed in release notes for significant code contributions
- Invited to become a maintainer after sustained, high-quality contributions
- Featured on the Tattva website contributor page

---

<div align="center">

**Every contribution — from a one-character typo fix to a full chapter translation — moves Indian education forward.**

Thank you for being part of Tattva. 🙏

[⬆ Back to top](#contributing-to-tattva)

</div>
