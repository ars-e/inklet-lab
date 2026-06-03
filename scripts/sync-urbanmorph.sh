#!/usr/bin/env bash
set -euo pipefail

echo "[sync-urbanmorph] Deprecated alias. Using /umv1 target instead."
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/sync-umv1.sh" "$@"
