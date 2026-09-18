#!/usr/bin/env bash
# ==============================================================================
# YAWSCENT INDONESIA - LINUX / VPS PRODUCTION DEPLOYMENT SCRIPT
# ==============================================================================

set -e

echo "===================================================================="
echo "       YAWSCENT INDONESIA - PRODUCTION DOCKER DEPLOYMENT"
echo "===================================================================="

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed on this server."
    echo "Please install Docker and Docker Compose before running this script."
    exit 1
fi

# Ensure .env exists
if [ ! -f ".env" ]; then
    echo "[INFO] .env not found, creating from .env.example..."
    cp .env.example .env
fi

# Pull base images & build
echo "[INFO] Building and starting production containers..."
docker compose -f docker-compose.yml up -d --build

echo ""
echo "===================================================================="
echo "  YAWSCENT INDONESIA IS NOW RUNNING!"
echo "===================================================================="
echo "  Web Storefront   : http://localhost:3000"
echo "  Backend API      : http://localhost:5000"
echo "  Healthcheck      : http://localhost:3000/api/v1/health"
echo "===================================================================="
echo ""
docker compose ps
