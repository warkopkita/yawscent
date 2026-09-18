#!/usr/bin/env bash
# ==============================================================================
# YAWSCENT INDONESIA - LINUX / MAC DEVELOPMENT SCRIPT
# ==============================================================================

set -e

echo "===================================================================="
echo "       YAWSCENT INDONESIA - DEVELOPMENT HOT-RELOAD"
echo "===================================================================="

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed."
    exit 1
fi

docker compose -f docker-compose.dev.yml up --build
