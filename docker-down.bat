@echo off
title yawscent indonesia - Stop Docker Containers
color 0C

echo ====================================================================
echo        YAWSCENT INDONESIA - STOPPING DOCKER CONTAINERS
echo ====================================================================
echo.
echo Menghentikan seluruh kontainer dan jaringan...
docker compose -f docker-compose.yml down
docker compose -f docker-compose.dev.yml down 2>nul
echo.
echo Seluruh layanan telah berhasil dihentikan.
pause
