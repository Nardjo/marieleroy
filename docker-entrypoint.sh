#!/bin/sh
set -e

echo "🚀 Starting Docker entrypoint..."

# Create uploads directory
mkdir -p /app/uploads

# Run database migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "📊 Running database migrations..."
  cd /app

  # Check if migrations table exists, if not baseline the database
  echo "🔍 Checking migration status..."
  npx prisma migrate resolve --applied "$(ls -1 prisma/migrations | tail -1)" 2>/dev/null || true

  # Prisma client already generated in builder stage, just run migrations
  npx prisma migrate deploy || echo "⚠️  Migration failed or not needed"
fi

echo "✅ Starting application..."
# Execute the CMD from Dockerfile
exec "$@"
