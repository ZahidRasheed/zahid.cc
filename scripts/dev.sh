#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${ZAHID_DEV_PORT:-8081}"
HOST="${ZAHID_DEV_HOST:-127.0.0.1}"

usage() {
  cat <<EOF
Start the zahid.cc site locally for preview.

Usage:
  ./scripts/dev.sh              # Docker if available, else Python
  ./scripts/dev.sh --python     # force Python static server
  ./scripts/dev.sh --docker     # force Docker (requires Docker Desktop)

URL: http://${HOST}:${PORT}

Environment:
  ZAHID_DEV_PORT   (default: 8081)
  ZAHID_DEV_HOST   (default: 127.0.0.1)
EOF
}

MODE="auto"
for arg in "$@"; do
  case "$arg" in
    --python) MODE="python" ;;
    --docker) MODE="docker" ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $arg"; usage; exit 1 ;;
  esac
done

docker_ready() {
  command -v docker >/dev/null 2>&1 \
    && docker info >/dev/null 2>&1
}

start_docker() {
  echo "Starting via Docker on http://${HOST}:${PORT}"
  echo "Stop with Ctrl+C"
  docker compose up --build
}

start_python() {
  if ! command -v python3 >/dev/null 2>&1; then
    echo "python3 is required when Docker is unavailable."
    exit 1
  fi

  if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port ${PORT} is already in use."
    echo "Stop the other process or run: ZAHID_DEV_PORT=8082 ./scripts/dev.sh --python"
    exit 1
  fi

  echo "Starting static preview on http://${HOST}:${PORT}"
  echo "(PHP contact form will not work in this mode; HTML/CSS/JS preview is fine.)"
  echo "Stop with Ctrl+C"
  echo

  exec python3 -m http.server "$PORT" --bind "$HOST"
}

case "$MODE" in
  docker)
    if ! docker_ready; then
      echo "Docker is not running. Open Docker Desktop, then retry."
      echo "Or run: ./scripts/dev.sh --python"
      exit 1
    fi
    start_docker
    ;;
  python)
    start_python
    ;;
  auto)
    if docker_ready; then
      start_docker
    else
      echo "Docker is not running — using Python static server instead."
      echo "For Apache+PHP preview, start Docker Desktop and rerun ./scripts/dev.sh"
      echo
      start_python
    fi
    ;;
esac
