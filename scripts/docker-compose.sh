#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

for env_file in api/.env client/.env admin/.env; do
  if [[ ! -f "$env_file" ]]; then
    echo "Missing $env_file" >&2
    exit 1
  fi
done

exec docker compose \
  --env-file api/.env \
  --env-file client/.env \
  --env-file admin/.env \
  "$@"
