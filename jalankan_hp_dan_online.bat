@echo off
title yawscent indonesia - Akses dari HP ^& Online (Cloudflare Tunnel)
color 0B

echo ====================================================================
echo        YAWSCENT INDONESIA - AKSES DARI HP ^& INTERNET
echo ====================================================================
echo.

:: 1. Deteksi Cloudflared
set "CF_CMD=cloudflared"
if exist "C:\Program Files (x86)\cloudflared\cloudflared.exe" set "CF_CMD=C:\Program Files (x86)\cloudflared\cloudflared.exe"
if exist "C:\Program Files\cloudflared\cloudflared.exe" set "CF_CMD=C:\Program Files\cloudflared\cloudflared.exe"

:: 2. Deteksi Server Port 3000
powershell -Command "Test-NetConnection -ComputerName 127.0.0.1 -Port 3000 -InformationLevel Quiet" | findstr /i "True" >nul
if %errorlevel% neq 0 (
    echo [1/2] Menyiapkan server lokal...
    :: Cek apakah Docker berjalan
    docker info >nul 2>nul
    if %errorlevel% equ 0 (
        echo Menjalankan via Docker Compose...
        docker compose up -d
    ) else (
        echo Docker tidak aktif, menjalankan server mandiri Node.js...
        set "NODE_CMD=node"
        if exist "C:\Program Files\nodejs\node.exe" set "NODE_CMD=C:\Program Files\nodejs\node.exe"
        start "Yawscent Local Server" /min "%NODE_CMD%" web/server.js
        timeout /t 2 >nul
    )
) else (
    echo [1/2] Server lokal sudah aktif di http://localhost:3000
)

echo.
echo [2/2] Membuka jalur publik Cloudflare Tunnel (HTTPS Aman)...
echo.
echo --------------------------------------------------------------------
echo URL Publik untuk dibuka di HP Anda akan muncul di bawah ini (https://...):
echo Silakan scan QR / copy URL tersebut ke browser Chrome/Safari di HP!
echo --------------------------------------------------------------------
echo.

"%CF_CMD%" tunnel --edge-ip-version 4 --protocol http2 --url http://localhost:3000

pause
