@echo off
title yawscent indonesia - Online Sharing Gratis (Cloudflare Tunnel)
color 0B

echo =======================================================
echo    YAWSCENT INDONESIA - PUBLIKASI ONLINE GRATIS
echo =======================================================
echo.
echo [1/2] Menjalankan server lokal di background...

set "NODE_CMD=node"
where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_CMD=C:\Program Files\nodejs\node.exe"
    )
)

:: Cek apakah port 3000 sudah aktif (misal dari Docker)
powershell -Command "Test-NetConnection -ComputerName 127.0.0.1 -Port 3000 -InformationLevel Quiet" | findstr /i "True" >nul
if %errorlevel% neq 0 (
    echo Menyalakan server lokal Node.js di background...
    start "Yawscent Server" /min "%NODE_CMD%" web/server.js
    timeout /t 2 >nul
) else (
    echo Server lokal sudah aktif di port 3000 (Docker / Node.js).
)

echo.
echo [2/2] Menghubungkan ke Cloudflare Tunnel (HTTPS Publik Gratis)...
echo.
echo --------------------------------------------------------------------
echo URL Publik Anda akan muncul di bawah ini (Link berawalan https://...):
echo Kirim link tersebut ke HP atau teman untuk membuka website dari mana saja!
echo --------------------------------------------------------------------
echo.

set "CF_CMD=cloudflared"
if exist "C:\Program Files (x86)\cloudflared\cloudflared.exe" set "CF_CMD=C:\Program Files (x86)\cloudflared\cloudflared.exe"
if exist "C:\Program Files\cloudflared\cloudflared.exe" set "CF_CMD=C:\Program Files\cloudflared\cloudflared.exe"

"%CF_CMD%" tunnel --edge-ip-version 4 --protocol http2 --url http://localhost:3000

pause
