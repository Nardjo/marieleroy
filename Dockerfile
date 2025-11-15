# Multi-stage build for production
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Ensure Prisma schema exists for postinstall
COPY prisma ./prisma

# Install dependencies with Prisma postinstall support
RUN pnpm install --frozen-lockfile --prod=false --config.ignore-scripts=false

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the Nuxt application for production
RUN pnpm build

# Production stage - minimal Node.js image
FROM node:20-alpine AS runner

# Install curl and pnpm
RUN apk add --no-cache curl && npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy Prisma schema (needed for runtime)
COPY --from=builder /app/prisma ./prisma

# Copy scripts directory (needed for migrations)
COPY --from=builder /app/scripts ./scripts

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy generated Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy built application from builder stage
COPY --from=builder /app/.output ./

# Create uploads directory with proper permissions
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set port environment variable
ENV PORT=81

# Set Nitro to listen on all interfaces (required for Docker)
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=81

# Set upload directory environment variable
ENV UPLOAD_DIR=/app/uploads

# Expose port
EXPOSE 81

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:81/api/health || exit 1

# Declare volume for persistent file storage
VOLUME ["/app/uploads"]

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the application
CMD ["node", "server/index.mjs", "--port", "81"]
