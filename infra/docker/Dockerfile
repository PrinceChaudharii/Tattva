# ──────────────────────────────────────────────────────────────────────────────
# Tattva — Multi-stage Next.js Production Docker Build
#
# Usage:
#   docker build -f infra/docker/Dockerfile -t tattva-web .
#   docker run -p 3000:3000 tattva-web
#
# Based on: https://nextjs.org/docs/app/building-your-application/deploying#docker-image
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM node:26-alpine AS deps

RUN apk add --no-cache libc6-compat

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

WORKDIR /app

# Copy lockfile and workspace manifests first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tooling/eslint/package.json ./tooling/eslint/
COPY tooling/typescript/package.json ./tooling/typescript/
COPY tooling/prettier/package.json ./tooling/prettier/
COPY tooling/generators/package.json ./tooling/generators/

# Copy all package.json files for workspace resolution
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/database/package.json ./packages/database/
COPY packages/auth/package.json ./packages/auth/
COPY packages/content/package.json ./packages/content/
COPY packages/validators/package.json ./packages/validators/

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile --prefer-offline

# ── Stage 2: Builder ──────────────────────────────────────────────────────────
FROM node:26-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/tooling ./tooling

# Copy source code
COPY . .

# Next.js collects completely anonymous telemetry — disable it
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
# NOTE: If you use environment variables at build time, pass them here:
#   --build-arg NEXT_PUBLIC_API_URL=...
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

RUN pnpm --filter @tattva/web build

# ── Stage 3: Runner (production) ──────────────────────────────────────────────
FROM node:26-alpine AS runner

RUN apk add --no-cache curl

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy public assets
COPY --from=builder /app/apps/web/public ./public

# Copy Next.js standalone output (includes all required deps)
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=15s \
  CMD curl -f http://localhost:3000/api/health || exit 1

EXPOSE 3000

# Start Next.js standalone server
CMD ["node", "apps/web/server.js"]
