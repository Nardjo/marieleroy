#!/bin/sh
set -e

echo "🚀 Starting Docker entrypoint..."

# Create uploads directory
mkdir -p /app/uploads

# Run database migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "📊 Running database migrations..."
  cd /app
  # Prisma client already generated in builder stage, just run migrations
  # Use specific version to avoid Prisma 7.x breaking changes
  npx prisma@6.19.0 migrate deploy || true
fi

echo "✅ Starting application..."
# Execute the CMD from Dockerfile
exec "$@"
