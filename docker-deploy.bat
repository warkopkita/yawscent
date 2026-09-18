@echo off
title yawscent indonesia - Docker Production Deployment
color 0A

echo ====================================================================
echo        YAWSCENT INDONESIA - DOCKER PRODUCTION DEPLOYMENT
echo ====================================================================
echo.
echo [1/4] Memeriksa Docker...
docker --version >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker tidak terdeteksi. Silakan jalankan Docker Desktop.
    pause
    exit /b 1
)

echo [2/4] Menyiapkan environment (.env)...
if not exist ".env" (
    echo File .env tidak ditemukan. Menyalin dari .env.example...
    copy .env.example .env
)

echo [3/4] Membangun image Docker produksi (Cache-Optimized)...
docker compose -f docker-compose.yml build

echo [4/4] Menjalankan layanan secara detached (Background Service)...
docker compose -f docker-compose.yml up -d

echo.
echo ====================================================================
echo   STATUS LAYANAN YAWSCENT INDONESIA TELAH AKTIF!
echo ====================================================================
echo   - Web Storefront : http://localhost:3000
echo   - Scent Finder   : http://localhost:3000
echo   - Admin Panel    : http://localhost:3000 (Klik Admin)
echo   - API Healthcheck: http://localhost:3000/api/v1/health
echo   - Backend Direct : http://localhost:5000/api/v1/health
echo ====================================================================
echo.
echo Menampilkan status kontainer:
docker compose ps
echo.
echo Tips: Untuk melihat logs secara realtime, jalankan:
echo       docker compose logs -f
echo.
pause
