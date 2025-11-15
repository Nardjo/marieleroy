# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
# Copier le schéma Prisma pour le postinstall
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
# Installer avec les scripts pour générer Prisma
RUN pnpm install --frozen-lockfile --prod=false --config.ignore-scripts=false

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN pnpm build

# Stage 3: Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache curl
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxt

# Copy package files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy Prisma schema (nécessaire pour runtime)
COPY --from=builder /app/prisma ./prisma

# Copy scripts directory for user creation
COPY --from=builder /app/scripts ./scripts

# Installer les dépendances de production + tsx pour les scripts
RUN pnpm install --frozen-lockfile --prod --ignore-scripts && \
    pnpm add tsx --ignore-scripts

# Copy built application from builder stage
COPY --from=builder --chown=nuxt:nodejs /app/.output ./

# Create uploads dir
RUN mkdir -p /app/uploads && chown -R nuxt:nodejs /app/uploads

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nuxt

EXPOSE 3000
ENV PORT=3000 HOST=0.0.0.0
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the application
CMD ["node", "server/index.mjs"]
