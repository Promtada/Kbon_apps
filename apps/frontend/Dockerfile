# ──────────────────────────────────────────────────────────────
# Stage 1 — Install dependencies
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

WORKDIR /app

# Copy workspace-level files required by pnpm install
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy the frontend package manifest
COPY apps/frontend/package.json apps/frontend/package.json
# Also copy the frontend's own pnpm-workspace.yaml (ignoredBuiltDependencies)
COPY apps/frontend/pnpm-workspace.yaml apps/frontend/pnpm-workspace.yaml

# Install all dependencies
RUN pnpm install --frozen-lockfile

# ──────────────────────────────────────────────────────────────
# Stage 2 — Build Next.js
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

WORKDIR /app

# Bring over node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules

# Copy workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy the entire frontend source
COPY apps/frontend ./apps/frontend

# Accept build-time env var for the API URL
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Enable Next.js standalone output for smaller Docker images
RUN cd apps/frontend && \
    sed -i 's|const nextConfig: NextConfig = {|const nextConfig: NextConfig = {\n  output: "standalone",|' next.config.ts

# Build Next.js
RUN cd apps/frontend && pnpm run build

# ──────────────────────────────────────────────────────────────
# Stage 3 — Production image (standalone)
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy the standalone build
COPY --from=builder /app/apps/frontend/.next/standalone ./
# Copy the static assets
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
# Copy the public directory
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000

# The standalone server is at apps/frontend/server.js
CMD ["node", "apps/frontend/server.js"]
