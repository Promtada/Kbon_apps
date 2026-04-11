# ──────────────────────────────────────────────────────────────
# Stage 1 — Install dependencies
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

# Enable corepack so pnpm is available at the version pinned in package.json
RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

WORKDIR /app

# Copy workspace-level files required by pnpm install
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy the backend and database package manifests (for dependency resolution)
COPY apps/backend/package.json apps/backend/package.json
COPY packages/database/package.json packages/database/package.json

# Install all dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# ──────────────────────────────────────────────────────────────
# Stage 2 — Build 
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

WORKDIR /app

# Bring over node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules

# Copy workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy the database package (Prisma schemas + index.ts)
COPY packages/database ./packages/database

# Copy the backend source code
COPY apps/backend ./apps/backend

# Generate Prisma Client (reads schema from packages/database/prisma/schema/)
RUN cd packages/database && npx prisma generate

# Build NestJS
RUN cd apps/backend && pnpm run build

# ──────────────────────────────────────────────────────────────
# Stage 3 — Production image
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

WORKDIR /app

ENV NODE_ENV=production

# Copy workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy the built backend
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/backend/nest-cli.json ./apps/backend/nest-cli.json

# Copy the database package (needed at runtime for Prisma Client re-export)
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/index.ts ./packages/database/index.ts
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/packages/database/prisma.config.ts ./packages/database/prisma.config.ts

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Generate Prisma Client directly in the runner.
# We use pnpm exec (not npx) so it uses the locally installed prisma version
# from the workspace, not a random latest version from the registry.
# prisma is a prod dep of @kbon/database, so it's available here.
RUN cd packages/database && pnpm exec prisma generate

# Create uploads directory
RUN mkdir -p /app/apps/backend/uploads

EXPOSE 4000

WORKDIR /app/apps/backend

CMD ["node", "dist/src/main"]
