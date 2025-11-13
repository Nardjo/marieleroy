# Base stage - install dependencies
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Dependencies stage
FROM base AS dependencies

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder

# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm db:generate

# Copy app source
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN pnpm db:generate

# Copy built application from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public

# Create uploads directory
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Set environment to production
ENV NODE_ENV=production

# Expose port (can be overridden by PORT env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["sh", "-c", "pnpm db:push && node .output/server/index.mjs"]
