@echo off
title yawscent indonesia - Localhost Server (100% Gratis)
color 0E

echo =======================================================
echo          YAWSCENT INDONESIA - LOCAL SERVER
echo =======================================================
echo.
echo [1/2] Menyiapkan server lokal yawscent (Gratis tanpa biaya)...
echo.

:: Cek lokasi node.exe
set "NODE_CMD=node"
where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_CMD=C:\Program Files\nodejs\node.exe"
    ) else (
        echo [ERROR] Node.js belum terdeteksi di sistem.
        echo Silakan pastikan Node.js terpasang.
        pause
        exit /b
    )
)

echo [2/2] Membuka browser ke http://localhost:3000 ...
start http://localhost:3000

echo.
echo =======================================================
echo  Server Sedang Berjalan!
echo  Alamat Web: http://localhost:3000
echo.
echo  - Storefront & Scent Finder : http://localhost:3000
echo  - Admin Omnichannel         : Klik tombol 'Admin' di kanan atas web
echo.
echo  (Jangan tutup jendela hitam ini selama menggunakan website)
echo =======================================================
echo.

"%NODE_CMD%" web/server.js

pause
