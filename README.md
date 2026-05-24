<div align="center">

# तत्त्व Tattva

**तत्त्व** *(tattva)* — essence, truth, the fundamental principle.

---

### Open-source NCERT-aligned learning infrastructure for India

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](./tsconfig.base.json)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo&logoColor=white)](./turbo.json)
[![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)](./package.json)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C53829?logo=drizzle&logoColor=white)](https://orm.drizzle.team)

---

*Imagine if Wikipedia and GitHub had a child raised in India — that's Tattva.*

</div>

<br />

## Vision

India educates **250 million** K-12 students. Most rely on NCERT textbooks — a remarkable corpus of knowledge, but one that exists only as static PDFs and printed pages. There is no version history, no community errata, no interactive layer, no search, no translations at scale.

**Tattva exists to change that.**

We are building **GitHub/Wikipedia-level infrastructure for Indian education** — an open-source platform where:

- Every NCERT chapter is a **version-controlled, reviewable, attributable** unit of knowledge
- Teachers, students, and experts **contribute improvements** through the same pull-request workflow that powers the world's best software
- Content is **multilingual** (9+ Indian languages), **offline-first**, and **accessible**
- An **AI-ready** structured knowledge system enables the next generation of educational tools
- **Institutional-grade** review and governance ensures content accuracy and pedagogical soundness

This isn't another ed-tech app. This is **infrastructure** — public, transparent, and built to last.

---

## Key Features

| Feature | Description |
|---|---|
| **Version-controlled content** | Every chapter is an MDX file with Git history, semantic versioning, and full attribution |
| **Community contributions** | Pull-request workflow for content, code, and translations — with review and governance |
| **AI-ready knowledge system** | Structured frontmatter, Zod-validated schemas, and indexed content for LLM consumption |
| **Multilingual** | 9+ Indian languages with translation mirroring and sync detection |
| **Offline-first** | Content is file-based (MDX), statically generated, and CDN-deployable |
| **Institutional-grade** | Drizzle ORM + PostgreSQL, NextAuth, role-based access, contribution reviews |
| **Interactive learning** | MDX components (`<Quiz />`, `<Simulation />`) embedded in prose |
| **KaTeX math** | Full LaTeX/KaTeX support for inline ($E=mc^2$) and display math |
| **NCERT-aligned** | Every chapter references its NCERT textbook source; content tracks NCERT updates |

---

## Architecture Overview

```
tattva/
├── apps/                           # Next.js applications
│   ├── web/                        # 🌐  Public platform (port 3000)
│   ├── docs/                       # 📖  Documentation site (port 3001)
│   ├── admin/                      # ⚙️  Admin dashboard (port 3002)
│   └── api/                        # 🔌  API server (port 3003)
│
├── packages/                       # Shared packages
│   ├── ui/                         # 🎨  Component library (CVA + Tailwind)
│   ├── database/                   # 🐘  Drizzle ORM + PostgreSQL schemas
│   ├── auth/                       # 🔐  NextAuth v5 + Drizzle adapter
│   ├── content/                    # 📝  MDX parser, pipeline, renderer
│   ├── editor/                     # ✏️  Rich-text editor with extensions
│   ├── search/                     # 🔍  Content indexer + query engine
│   ├── analytics/                  # 📊  Event tracking + providers
│   ├── config/                     # ⚙️  Shared Tailwind + TypeScript configs
│   ├── logger/                     # 🪵  Structured logging (transports + formatters)
│   └── shared-types/               # 📦  Zod schemas + shared TypeScript types
│
├── content/                        # Version-controlled educational content
│   ├── physics/                    #   physics/class-11/chapter-01-.../index.mdx
│   ├── chemistry/                  #   chemistry/class-11/chapter-01-.../index.mdx
│   ├── mathematics/                #   mathematics/class-11/chapter-01-.../index.mdx
│   ├── biology/                    #   biology/class-11/chapter-01-.../index.mdx
│   ├── metadata/                   #   subjects.json, schema.json, contributors.json
│   └── translations/               #   translations/{hi,mr,ta,te,kn,bn,gu,ur}/
│
├── tooling/                        # Dev tooling (shared across monorepo)
│   ├── eslint/                     #   Shared ESLint config
│   ├── typescript/                 #   Shared tsconfig presets (base, next, react-lib)
│   ├── prettier/                   #   Shared Prettier config
│   └── generators/                 #   Plop.js scaffolding generators
│
├── scripts/                        # Operational scripts
│   ├── content/                    #   validate-content.ts, build-index.ts
│   ├── indexing/                   #   index-content.ts
│   └── migration/                  #   migrate.ts
│
├── infra/                          # Infrastructure as code
│   ├── docker/                     #   Dockerfile, docker-compose.yml, init-db.sql
│   ├── caching/                    #   Redis configuration
│   ├── monitoring/                 #   Health checks
│   └── deployment/                 #   Vercel config
│
├── turbo.json                      # Turborepo pipeline configuration
├── pnpm-workspace.yaml             # pnpm workspace definition
├── tsconfig.base.json              # TypeScript strict base config + path aliases
└── package.json                    # Root package with workspace scripts
```

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-15-black) | App Router, Turbopack, Server Components |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6) | Strict mode, `noUncheckedIndexedAccess` |
| **Monorepo** | ![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444) | Cached builds, task pipelines |
| **Package Manager** | ![pnpm](https://img.shields.io/badge/pnpm-11-F69220) | Workspaces, strict hoisting |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4) | v4, shared config package |
| **UI Components** | CVA + Tailwind Merge | Variant-based design system |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1) | Via Drizzle ORM |
| **ORM** | ![Drizzle](https://img.shields.io/badge/Drizzle_ORM-0.38-C53829) | Type-safe queries, migrations, studio |
| **Auth** | NextAuth v5 Beta | Drizzle adapter, OAuth providers |
| **Content** | MDX + gray-matter + rehype/remark | Interactive components, KaTeX math |
| **Validation** | Zod | Frontmatter schemas, API validation |
| **Search** | Custom indexer | Structured content indexing |
| **Logging** | Custom logger | Structured JSON, pluggable transports |
| **Containerization** | Docker + Compose | Multi-stage Next.js build, PostgreSQL 16, Redis 7 |
| **CI/CD** | Husky + lint-staged | Pre-commit hooks, Conventional Commits |

---

## Quick Start

### Prerequisites

| Requirement | Version | Check |
|---|---|---|
| **Node.js** | >= 20.18.0 | `node -v` |
| **pnpm** | >= 9.0.0 | `pnpm -v` |
| **PostgreSQL** | >= 16 | `psql --version` |
| **Redis** | >= 7 | `redis-cli --version` |
| **Git** | >= 2.40 | `git --version` |

### 1. Clone

```bash
git clone https://github.com/tattva-edu/tattva.git
cd tattva
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

Required environment variables:

```bash
# Database
DATABASE_URL="postgresql://tattva:tattva_dev@localhost:5432/tattva"

# Authentication
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Start infrastructure (PostgreSQL + Redis)

```bash
# Using Docker Compose (recommended)
cd infra/docker && docker compose up -d

# This starts:
#   PostgreSQL 16   → localhost:5432
#   Redis 7         → localhost:6379
#   Adminer UI      → localhost:8080
#   Redis Commander → localhost:8081
```

### 5. Set up the database

```bash
pnpm db:generate    # Generate Drizzle migrations
pnpm db:migrate     # Run migrations
# or
pnpm db:push        # Push schema directly (dev only)
```

### 6. Start development

```bash
pnpm dev
```

This starts all apps in parallel via Turborepo:

| App | URL | Description |
|---|---|---|
| `@tattva/web` | http://localhost:3000 | Public learning platform |
| `@tattva/docs` | http://localhost:3001 | Documentation |
| `@tattva/admin` | http://localhost:3002 | Admin dashboard |
| `@tattva/api` | http://localhost:3003 | API server |

---

## Available Scripts

All commands are run from the repository root unless noted otherwise.

### Build & Development

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode (Turbopack) |
| `pnpm build` | Build all apps and packages |
| `pnpm start` | Start production builds |

### Code Quality

| Command | Description |
|---|---|
| `pnpm lint` | Run ESLint across the monorepo |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without writing |
| `pnpm clean` | Remove all build artifacts and node_modules |

### Database

| Command | Description |
|---|---|
| `pnpm db:generate` | Generate Drizzle ORM migrations |
| `pnpm db:push` | Push schema to database (dev) |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:studio` | Open Drizzle Studio (DB GUI) |

### Content

| Command | Description |
|---|---|
| `pnpm content:build` | Build content index from MDX files |
| `pnpm content:validate` | Validate all MDX frontmatter against Zod schemas |

### Per-Package Commands

You can target a specific package using `--filter`:

```bash
pnpm --filter @tattva/web dev          # Dev only the web app
pnpm --filter @tattva/database build   # Build only the database package
pnpm --filter @tattva/content validate # Validate content only
```

---

## Project Structure in Detail

### Apps

| App | Package | Port | Description |
|---|---|---|---|
| **Web** | `@tattva/web` | 3000 | The public-facing learning platform. Students browse subjects, read chapters, solve exercises, and track progress. Uses MDX rendering with interactive components. |
| **Docs** | `@tattva/docs` | 3001 | Project documentation, contributor guides, API references, and content authoring tutorials. Also built with MDX. |
| **Admin** | `@tattva/admin` | 3002 | Administrative dashboard for content moderation, user management, analytics, and institutional controls. |
| **API** | `@tattva/api` | 3003 | RESTful API server built with Next.js Route Handlers. Handles auth, content CRUD, search, and analytics. |

### Packages

| Package | Import | Description |
|---|---|---|
| **UI** | `@tattva/ui` | Shared component library built on CVA + Tailwind Merge. Includes `Button`, `Card`, and utility functions. |
| **Database** | `@tattva/database` | Drizzle ORM schemas for PostgreSQL — users, subjects, chapters, lessons, exercises, contributions, reviews, comments. Full type safety with inferred types. |
| **Auth** | `@tattva/auth` | NextAuth v5 configuration with Drizzle adapter. OAuth providers, session management, role-based access. |
| **Content** | `@tattva/content` | MDX processing pipeline — frontmatter parsing (gray-matter), rendering (next-mdx-remote), rehype/remark plugins (slug, autolink, GFM). |
| **Editor** | `@tattva/editor` | Rich-text editor with custom extensions for educational content authoring. |
| **Search** | `@tattva/search` | Content indexer and query engine for full-text search across all MDX content. |
| **Analytics** | `@tattva/analytics` | Event tracking abstraction with pluggable providers. |
| **Config** | `@tattva/config` | Shared Tailwind CSS and TypeScript configurations consumed across the monorepo. |
| **Logger** | `@tattva/logger` | Structured logging with configurable transports and formatters. |
| **Shared Types** | `@tattva/shared-types` | Zod schemas and shared TypeScript types for API contracts, content models, user roles, and common types. |

### Content

The `content/` directory is the heart of Tattva. It contains **version-controlled, NCERT-aligned educational content** as MDX files:

```
content/
├── physics/class-11/chapter-01-units-and-measurements/
│   ├── index.mdx          # Chapter content
│   └── exercises.mdx      # Exercises & problems
├── metadata/
│   ├── subjects.json      # Subject registry, chapter listings, color themes
│   ├── schema.json        # Frontmatter JSON Schema
│   └── contributors.json  # Contributor registry
└── translations/
    ├── hi/                 # Hindi
    ├── mr/                 # Marathi
    ├── ta/                 # Tamil
    ├── te/                 # Telugu
    ├── kn/                 # Kannada
    ├── bn/                 # Bengali
    ├── gu/                 # Gujarati
    └── ur/                 # Urdu
```

See [`content/README.md`](./content/README.md) for the full content architecture, frontmatter schema, and contribution workflow.

### Tooling

Shared development tooling ensures consistency across the monorepo:

| Tool | Package | Description |
|---|---|---|
| **ESLint** | `@tattva/eslint-config` | Shared ESLint rules |
| **TypeScript** | `@tattva/typescript-config` | Shared tsconfig presets: `base.json`, `next.json`, `react-library.json` |
| **Prettier** | `@tattva/prettier-config` | Shared formatting rules |
| **Generators** | `@tattva/generators` | Plop.js scaffolding for new packages, apps, and content |

### Infrastructure

| Component | Path | Description |
|---|---|---|
| **Docker** | `infra/docker/` | Multi-stage `Dockerfile` for production, `docker-compose.yml` for local dev (PostgreSQL 16 + Redis 7 + Adminer + Redis Commander) |
| **Caching** | `infra/caching/` | Redis configuration and client |
| **Monitoring** | `infra/monitoring/` | Health check endpoints |
| **Deployment** | `infra/deployment/` | Vercel deployment configuration |

---

## Contributing

We welcome contributions of all kinds — code, content, translations, design, and ideas. Tattva is built by the community, for the community.

👉 **See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contributor guide.**

Quick links:

- 🐛 [Report a bug](../../issues/new?template=bug_report.md)
- ✨ [Request a feature](../../issues/new?template=feature_request.md)
- 📝 [Contribute content](./content/README.md)
- 🌐 [Help translate](./CONTRIBUTING.md#translation-contributions)
- 💬 [Join the discussion](../../discussions)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

All educational content is also licensed under MIT, ensuring it remains free and open for everyone.

---

<div align="center">

**तत्त्व** — Because every student deserves world-class learning infrastructure.

[⭐ Star us on GitHub](../../stargazers) · [🐛 Report a Bug](../../issues) · [💬 Discuss](../../discussions) · [🐦 Follow Us](https://twitter.com/tattva_edu)

</div>
