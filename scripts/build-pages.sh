#!/usr/bin/env bash
# Build a clean static export for Cloudflare Pages (no legacy server junk).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="${ROOT}/dist"

rm -rf "${DIST}"
mkdir -p "${DIST}"

rsync -a \
  --exclude '.git/' \
  --exclude '.github/' \
  --exclude 'dist/' \
  --exclude 'node_modules/' \
  --exclude '!domains/' \
  --exclude 'Documentation/' \
  --exclude 'sass/' \
  --exclude 'scripts/' \
  --exclude 'php/' \
  --exclude 'colors/' \
  --exclude 'Dockerfile' \
  --exclude 'docker-compose.yml' \
  --exclude '.rsync-excludes' \
  --exclude '.htaccess' \
  --exclude '.htacess' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude 'p.m3u' \
  --exclude 'index-normal.html' \
  --exclude 'index-video.html' \
  --exclude 'single-blog.html' \
  --exclude 'single-portfolio.html' \
  --exclude 'package-lock.json' \
  --exclude 'package.json' \
  --exclude 'wrangler.toml' \
  "${ROOT}/" "${DIST}/"

# Cloudflare Pages uses _headers (copied from repo root if present)
if [[ -f "${ROOT}/_headers" ]]; then
  cp "${ROOT}/_headers" "${DIST}/_headers"
fi

echo "Built ${DIST} ($(du -sh "${DIST}" | awk '{print $1}'))"
