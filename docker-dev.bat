@echo off
title yawscent indonesia - Docker Development Mode
color 0B

echo ====================================================================
echo        YAWSCENT INDONESIA - DOCKER DEVELOPMENT ENVIRONMENT
echo ====================================================================
echo.
echo [1/3] Memeriksa instalasi Docker...
docker --version >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker tidak terdeteksi atau Docker Desktop belum berjalan.
    echo Pastikan Docker Desktop sudah dibuka dan running.
    pause
    exit /b 1
)

echo [2/3] Membangun dan menjalankan kontainer development (Hot-Reload)...
echo       - Web & Admin : http://localhost:3000
echo       - Backend API : http://localhost:5000
echo       - PostgreSQL  : localhost:5432
echo       - Redis Cache : localhost:6379
echo.

docker compose -f docker-compose.dev.yml up --build

pause
