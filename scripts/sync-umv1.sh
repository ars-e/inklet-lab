#!/usr/bin/env bash
set -euo pipefail

SITE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -n "${URBANMOR_FRONTEND:-}" ]]; then
  FRONTEND_PATH="$URBANMOR_FRONTEND"
elif [[ -d "$SITE_ROOT/../Morph/frontend" ]]; then
  FRONTEND_PATH="$SITE_ROOT/../Morph/frontend"
else
  FRONTEND_PATH="$SITE_ROOT/../UrbanMor/frontend"
fi

API_BASE_UMV1="${VITE_API_BASE_URL_UMV1:-${VITE_API_BASE_URL:-${1:-/umv1-api}}}"
API_BASE_URBANMORPH="${VITE_API_BASE_URL_URBANMORPH:-${VITE_API_BASE_URL:-${2:-/urbanmorph-api}}}"

if [[ ! -d "$FRONTEND_PATH" ]]; then
  echo "UrbanMor frontend not found at: $FRONTEND_PATH" >&2
  echo "Set URBANMOR_FRONTEND to your frontend path and rerun." >&2
  exit 1
fi

echo "[sync] frontend path: $FRONTEND_PATH"
echo "[sync] api base (/umv1): $API_BASE_UMV1"
echo "[sync] api base (/urbanmorph): $API_BASE_URBANMORPH"

pushd "$FRONTEND_PATH" >/dev/null
VITE_API_BASE_URL="$API_BASE_UMV1" npm run build:umv1
rm -rf "$SITE_ROOT/public/umv1"
mkdir -p "$SITE_ROOT/public/umv1"
cp -R "$FRONTEND_PATH/dist/." "$SITE_ROOT/public/umv1/"

VITE_API_BASE_URL="$API_BASE_URBANMORPH" npm run build:urbanmorph
popd >/dev/null

rm -rf "$SITE_ROOT/public/urbanmorph"
mkdir -p "$SITE_ROOT/public/urbanmorph"
cp -R "$FRONTEND_PATH/dist/." "$SITE_ROOT/public/urbanmorph/"

echo "[sync] synced to $SITE_ROOT/public/umv1 and $SITE_ROOT/public/urbanmorph"
