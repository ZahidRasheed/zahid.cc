#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SSH_HOST="${ZAHID_SSH_HOST:-Zahid.cc}"
REMOTE="${ZAHID_REMOTE_PATH:-/var/www/html/}"

echo "Pulling production files from ${SSH_HOST}:${REMOTE}"
echo "Project root: ${ROOT}"
echo

rsync -avz --progress \
  --exclude-from="${ROOT}/.rsync-excludes" \
  -e "ssh" \
  "${SSH_HOST}:${REMOTE}" \
  "${ROOT}/"

echo
echo "Done. Local copy matches production (excluding blog and large binaries)."
