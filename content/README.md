# Tattva Content Architecture

This directory contains the structured educational content for **Tattva** — an open-source, NCERT-aligned education platform. Every textbook chapter is treated as a versioned, translatable, attributable unit of knowledge.

---

## Directory Structure

```
content/
├── README.md                          # This file
├── physics/                           # Subject root
│   ├── class-11/                      # Class (grade) level
│   │   └── chapter-01-units-and-measurements/
│   │       ├── index.mdx              # Chapter content
│   │       └── exercises.mdx          # Exercises & problems
│   └── class-12/
│       └── ...
├── chemistry/
│   ├── class-11/
│   └── class-12/
├── mathematics/
│   ├── class-11/
│   └── class-12/
├── biology/
│   ├── class-11/
│   └── class-12/
├── metadata/
│   ├── subjects.json                  # Subject registry & themes
│   ├── schema.json                    # Frontmatter JSON Schema
│   └── contributors.json             # Contributor registry
└── translations/
    ├── hi/                            # Hindi
    │   └── physics/class-11/chapter-01/
    │       └── index.mdx
    ├── mr/                            # Marathi
    ├── ta/                            # Tamil
    ├── te/                            # Telugu
    ├── kn/                            # Kannada
    ├── bn/                            # Bengali
    └── gu/                            # Gujarati
```

### Conventions

| Convention | Rule | Example |
|---|---|---|
| **Subject slug** | Lowercase, kebab-case | `physics`, `mathematics` |
| **Class directory** | `class-{number}` | `class-11`, `class-12` |
| **Chapter directory** | `chapter-{nn}-{slug}` | `chapter-01-units-and-measurements` |
| **Content file** | `index.mdx` | Main chapter body |
| **Exercises file** | `exercises.mdx` | Problems, questions, solutions |
| **Locale code** | ISO 639-1 | `hi`, `mr`, `ta` |
| **Figures** | PNG/SVG in `figures/` subdir | `figures/fig-2.1-parallax.png` |

---

## Frontmatter Schema

Every MDX file **must** include YAML frontmatter conforming to the schema in `metadata/schema.json`. Key fields:

```yaml
---
title: "Units and Measurements"        # Display title (required)
subject: physics                        # Subject slug (required)
class: 11                               # Class number 6–12 (required)
chapter: 1                              # Chapter number (required)
ncertReference: "Physics XI, Ch 2"     # NCERT textbook citation (required)
locale: en                              # ISO 639-1 language code (required)
status: draft                           # draft | review | published (required)
version: 1.0.0                          # Semver (required)
lastReviewed: "2024-01-15"             # ISO 8601 date
contributors:                           # Attributions (at least one required)
  - name: "Author Name"
    role: author                        # author | reviewer | translator | editor
  - name: "Reviewer Name"
    role: reviewer
tags: [physics, units, measurements]    # Freeform tags
difficulty: foundational                # foundational | intermediate | advanced
estimatedReadingTime: 45                # Minutes
---
```

### Status Lifecycle

```
draft ──► review ──► published
  ▲                            │
  └──────── revised ───────────┘
```

- **draft** — Initial submission or major revision; not shown to students.
- **review** — Under community/expert review; visible to reviewers only.
- **published** — Live on the platform; students can access it.

When a published chapter is substantially edited, its status reverts to **draft** and the version is bumped.

---

## MDX Content Guidelines

### Structure

Each `index.mdx` chapter should follow this outline:

```mdx
## 1.1 Section Title
Explanation text...

### 1.1.1 Subsection
Deeper detail...

> **Key Idea:** Highlighted concept summary.

## 1.2 Next Section
...
```

### Supported MDX Features

| Feature | Syntax | Notes |
|---|---|---|
| **Math (inline)** | `$E = mc^2$` | KaTeX rendering |
| **Math (block)** | `$$\int_0^\infty e^{-x} dx = 1$$` | Display-mode equations |
| **Callouts** | `> **Key Idea:** ...` | Styled blockquote |
| **Tables** | Standard Markdown table | Responsive styling |
| **Figures** | `![Alt](./figures/fig-1.png)` | Local figures dir |
| **Interactive** | `<Quiz questionId="..." />` | Custom MDX component |
| **Cross-ref** | `[See Ch 3](../chapter-03-.../)` | Relative links |

### Equations

Use LaTeX/KaTeX syntax. Inline math with single `$`, display math with double `$$`:

```mdx
The kinetic energy is given by:

$$K = \frac{1}{2}mv^2$$

where $m$ is the mass and $v$ is the velocity.
```

### Exercises

Exercises live in a companion `exercises.mdx` file within the same chapter directory. They are structured with difficulty levels:

```mdx
### Exercise 1.1 — Foundational
...

### Exercise 1.2 — Intermediate
...
```

---

## Translation System

Translations mirror the source directory structure under `translations/{locale}/`:

```
content/
├── physics/class-11/chapter-01-units-and-measurements/index.mdx   ← source (en)
└── translations/
    └── hi/
        └── physics/class-11/chapter-01/index.mdx                  ← Hindi
```

### Translation Frontmatter

Translated files carry additional fields:

```yaml
---
title: "इकाइयाँ और मापन"
subject: physics
class: 11
chapter: 1
ncertReference: "Physics XI, Ch 2"
locale: hi                              # Target language
status: draft
version: 0.1.0                          # Often behind source version
sourceVersion: 1.0.0                    # Version of the English source
lastReviewed: "2024-02-01"
contributors:
  - name: "Translator Name"
    role: translator
---
```

**Rule:** When the source (`locale: en`) chapter is updated to a new version, all translations should flag themselves as out-of-date (status reverts to `draft` if previously `published`).

---

## Contribution Workflow

### 1. Fork & Branch

```bash
git checkout -b content/physics-class11-ch01-update
```

### 2. Edit Content

- Modify the relevant `index.mdx` or `exercises.mdx`.
- **Always** bump the `version` field (patch for typos, minor for new sections, major for rewrites).
- Add yourself to `contributors` in the frontmatter.

### 3. Validate

```bash
# From repo root — validates frontmatter against schema
pnpm --filter @tattva/content validate
```

This checks:
- All required frontmatter fields are present
- `status` is a valid enum value
- `class` is within 6–12
- `locale` is a valid ISO 639-1 code
- `version` follows semver

### 4. Build Index

```bash
pnpm --filter @tattva/content build-index
```

This generates a search index from all MDX content.

### 5. PR & Review

- Open a pull request with a clear description.
- At least one **reviewer** must approve before merging.
- The CI pipeline runs validation and index build checks automatically.

### Contributor Roles

| Role | Description |
|---|---|
| **author** | Writes or substantially revises content |
| **reviewer** | Reviews for accuracy, NCERT alignment, pedagogy |
| **editor** | Copy-edits for style, grammar, formatting |
| **translator** | Creates or maintains a locale translation |

Contributors are tracked in both per-file frontmatter and the central `metadata/contributors.json` registry.

---

## Versioning

Content uses **Semantic Versioning**:

- **Patch** `1.0.0 → 1.0.1` — Typo fixes, formatting, minor clarifications
- **Minor** `1.0.0 → 1.1.0` — New sections, additional exercises, expanded explanations
- **Major** `1.0.0 → 2.0.0` — Restructured chapter, rewritten content, changed scope

---

## NCERT Alignment

All content must align with the latest NCERT textbook editions. The `ncertReference` field must cite the exact textbook and chapter number. When NCERT updates a textbook:

1. A new issue is created tracking the update.
2. Content is revised and `version` is bumped.
3. `ncertReference` is updated to reflect the new edition.

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **MDX over Markdown** | Enables interactive components (`<Quiz />`, `<Simulation />`) inside prose |
| **File-per-chapter** | Git-friendly diffs; easy to assign review ownership |
| **Co-located exercises** | Exercises travel with their chapter; no cross-directory linking |
| **Flat metadata JSON** | Simple to parse, no database dependency for content discovery |
| **Translation mirroring** | Same path structure = predictable URLs, easy sync detection |
| **Semver on content** | Programmatic tracking of staleness; automation-friendly |

---

## Quick Reference

```bash
# Validate all content
pnpm --filter @tattva/content validate

# Build search index
pnpm --filter @tattva/content build-index

# Create a new chapter (scaffold)
pnpm --filter @tattva/generators content --subject physics --class 11 --chapter 2 --title "Motion in a Straight Line"
```

---

*This content system is part of the [Tattva](https://github.com/tattva-edu/tattva) open-source project. Contributions welcome!*
