#!/bin/sh
# Start command for Render (or any Node host). When a database is configured, create or update the tables first
# (drizzle-kit push is idempotent), then start the production server, which seeds sample data into empty tables.
set -e
if [ -n "$DATABASE_URL" ] || [ -n "$SQL_HOST" ]; then
  npx drizzle-kit push --config src/db/drizzle.config.ts --force
else
  echo "No database configured (set DATABASE_URL). The API will start, but bookings and accounts will not work."
fi
NODE_ENV=production exec node dist/server.cjs
