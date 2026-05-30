#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [[ ! -f api/.env ]]; then
  echo "api/.env not found" >&2
  exit 1
fi

set -a
source api/.env
set +a

BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/irshop_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

./scripts/docker-compose.sh exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-acl \
  | gzip > "$BACKUP_FILE"

echo "$BACKUP_FILE"

find "$BACKUP_DIR" -name "irshop_*.sql.gz" -mtime +14 -delete 2>/dev/null || true
