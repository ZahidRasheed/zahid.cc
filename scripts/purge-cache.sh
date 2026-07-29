#!/usr/bin/env bash
# Purge Cloudflare CDN cache for zahid.cc (custom domain zone).
#
# Wrangler / Pages deploy does not clear edge cache for /images/* etc.
# Create an API token: Zone → Cache Purge → Purge (+ Zone Read), scope: zahid.cc
#   https://dash.cloudflare.com/profile/api-tokens
#
# Usage:
#   CLOUDFLARE_API_TOKEN=... npm run purge-cache
#   CLOUDFLARE_API_TOKEN=... npm run purge-cache -- --files /images/favicon/favicon.ico

set -euo pipefail

ZONE_NAME="${CLOUDFLARE_ZONE_NAME:-zahid.cc}"
TOKEN="${CLOUDFLARE_API_TOKEN:-${CF_API_TOKEN:-}}"

if [[ -z "${TOKEN}" ]]; then
  echo "Set CLOUDFLARE_API_TOKEN (API token with Zone.Cache Purge for ${ZONE_NAME})." >&2
  echo "Wrangler login alone cannot purge cache; use a dedicated API token." >&2
  exit 1
fi

api() {
  curl -fsS -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" "$@"
}

if [[ -n "${CLOUDFLARE_ZONE_ID:-}" ]]; then
  ZONE_ID="${CLOUDFLARE_ZONE_ID}"
else
  ZONE_ID="$(api "https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if not data.get('success') or not data.get('result'):
    raise SystemExit(data.get('errors') or data)
print(data['result'][0]['id'])
")"
fi

if [[ "${1:-}" == "--files" ]]; then
  shift
  if [[ $# -lt 1 ]]; then
    echo "Pass one or more URL paths, e.g. /images/favicon/favicon.ico" >&2
    exit 1
  fi
  FILES_JSON="$(python3 -c 'import json,sys; print(json.dumps({"files": sys.argv[1:]}))' "$@")"
  api -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" --data "${FILES_JSON}"
else
  api -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" --data '{"purge_everything":true}'
fi

echo ""
echo "Cache purge requested for zone ${ZONE_NAME} (${ZONE_ID})."
