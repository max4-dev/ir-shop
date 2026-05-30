#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

COMPOSE="./scripts/docker-compose.sh"

log() {
  printf '[deploy] %s\n' "$*"
}

log "Building backend, admin"
"$COMPOSE" build backend admin

log "Starting postgres, redis, backend"
"$COMPOSE" up -d postgres redis backend

log "Waiting for backend healthcheck"
BACKEND_HEALTHY=false
for _ in {1..30}; do
  if "$COMPOSE" ps backend | grep -q "(healthy)"; then
    BACKEND_HEALTHY=true
    break
  fi
  sleep 2
done

if [[ "$BACKEND_HEALTHY" != "true" ]]; then
  log "Backend healthcheck failed"
  "$COMPOSE" logs --tail=50 backend >&2 || true
  exit 1
fi

log "Building frontend"
"$COMPOSE" build frontend

log "Starting all services"
"$COMPOSE" up -d

"$COMPOSE" ps
log "Done"
