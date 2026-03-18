#!/bin/bash
# Clone production Supabase DB into local Docker PostgreSQL
# Usage: bash scripts/clone-prod-db.sh

set -e

# Load production URL from .env
PROD_URL=$(grep '^DIRECT_URL=' .env | cut -d'=' -f2- | tr -d '"')

# Local DB config (matches docker-compose.yml)
LOCAL_HOST="localhost"
LOCAL_PORT="5432"
LOCAL_USER="salsa"
LOCAL_PASS="salsa"
LOCAL_DB="salsa_rayo"

if [ -z "$PROD_URL" ]; then
  echo "Error: DIRECT_URL not found in .env"
  exit 1
fi

echo "1/3 Dumping production database..."
PGPASSWORD="" pg_dump "$PROD_URL" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  --format=custom \
  --file=prod-dump.dump

echo "2/3 Restoring to local database..."
PGPASSWORD="$LOCAL_PASS" pg_restore \
  --host="$LOCAL_HOST" \
  --port="$LOCAL_PORT" \
  --username="$LOCAL_USER" \
  --dbname="$LOCAL_DB" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  prod-dump.dump || true

echo "3/3 Cleaning up dump file..."
rm -f prod-dump.dump

echo "Done! Local DB now has production data."
echo "Connect: postgresql://$LOCAL_USER:$LOCAL_PASS@$LOCAL_HOST:$LOCAL_PORT/$LOCAL_DB"
