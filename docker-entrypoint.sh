#!/bin/sh
set -e

echo "🚀 Starting Docker entrypoint..."

# Create uploads directory
mkdir -p /app/uploads

# Run database migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "📊 Running database migrations..."
  cd /app
  npx prisma db push --skip-generate

  echo "👤 Creating admin user if not exists..."
  npx tsx scripts/create-user.ts
else
  echo "⚠️  DATABASE_URL not set, skipping migrations"
fi

echo "✅ Starting application..."
# Execute the CMD from Dockerfile
exec "$@"
