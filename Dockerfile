# syntax=docker/dockerfile:1
# ---- Image de production Ednah (monorepo pnpm : web React buildé + API Fastify) ----
# Utilisée par Coolify pour builder/déployer automatiquement.

# 1) Base avec pnpm
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm" PATH="/pnpm:$PATH"
RUN corepack enable
WORKDIR /app

# 2) Dépendances (cache optimisé)
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile || pnpm install

# 3) Build web + api
FROM deps AS build
COPY . .
RUN pnpm --filter ./apps/web build && pnpm --filter ./apps/api build

# 4) Runtime minimal (prod deps only)
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3000
# deps de prod de l'api
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/
RUN pnpm install --prod --frozen-lockfile --filter ./apps/api || pnpm install --prod --filter ./apps/api
# artefacts buildés
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/web/dist ./apps/web/dist
EXPOSE 3000
# healthcheck aligné sur /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1
WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
