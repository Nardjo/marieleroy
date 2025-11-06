FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm db:generate

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start command (will be overridden by docker-compose for dev)
CMD ["sh", "-c", "pnpm db:push && pnpm dev"]
