#!/bin/sh
set -e

if [ -n "${POSTGRES_USER:-}" ] && [ -n "${POSTGRES_PASSWORD:-}" ] && [ -n "${POSTGRES_DB:-}" ]; then
  export DATABASE_URL="$(node -e "
    const user = encodeURIComponent(process.argv[1]);
    const password = encodeURIComponent(process.argv[2]);
    const db = encodeURIComponent(process.argv[3]);
    process.stdout.write(\`postgresql://\${user}:\${password}@postgres:5432/\${db}?schema=public\`);
  " "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB")"
fi

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set" >&2
  exit 1
fi

npx prisma migrate deploy
exec node dist/main.js
