# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

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
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxt

# Copy only what's needed
COPY --from=builder --chown=nuxt:nodejs /app/.output ./.output
COPY --from=builder --chown=nuxt:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nuxt:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nuxt:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nuxt:nodejs /app/package.json ./package.json

# Create uploads dir
RUN mkdir -p /app/uploads && chown -R nuxt:nodejs /app/uploads

USER nuxt

EXPOSE 3000
ENV PORT=3000 HOST=0.0.0.0

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["sh", "-c", "npx prisma db push --skip-generate && node .output/server/index.mjs"]
