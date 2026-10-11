#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SSH_HOST="${ZAHID_SSH_HOST:-Zahid.cc}"
REMOTE="${ZAHID_REMOTE_PATH:-/var/www/html/}"
DRY_RUN=0

usage() {
  cat <<'EOF'
Deploy local site files to production via rsync.

Usage:
  ./scripts/deploy.sh           # deploy (with confirmation)
  ./scripts/deploy.sh --dry-run # preview changes only
  ./scripts/deploy.sh --yes     # deploy without confirmation

Environment:
  ZAHID_SSH_HOST      SSH config host (default: Zahid.cc)
  ZAHID_REMOTE_PATH   Remote web root (default: /var/www/html/)
EOF
}

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --yes) CONFIRM=0 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $arg"; usage; exit 1 ;;
  esac
done

CONFIRM="${CONFIRM:-1}"
RSYNC_FLAGS=(-avz --progress --exclude-from="${ROOT}/.rsync-excludes")

if [[ "$DRY_RUN" -eq 1 ]]; then
  RSYNC_FLAGS+=(--dry-run)
  echo "Dry run — no files will be changed on the server."
fi

echo "Deploy target: ${SSH_HOST}:${REMOTE}"
echo "Source: ${ROOT}/"
echo

if [[ "$DRY_RUN" -eq 0 && "$CONFIRM" -eq 1 ]]; then
  read -r -p "Deploy to production? [y/N] " reply
  if [[ ! "$reply" =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
  fi
fi

rsync "${RSYNC_FLAGS[@]}" \
  -e "ssh" \
  "${ROOT}/" \
  "${SSH_HOST}:${REMOTE}"

if [[ "$DRY_RUN" -eq 0 ]]; then
  echo
  echo "Deploy complete: https://zahid.cc"
fi
