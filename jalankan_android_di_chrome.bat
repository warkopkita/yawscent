@echo off
title yawscent indonesia - Android Mobile Mode di Google Chrome
color 0A

echo ====================================================================
echo        YAWSCENT INDONESIA - ANDROID MOBILE DI GOOGLE CHROME
echo ====================================================================
echo.

:: 1. Pastikan Server Lokal Aktif
netstat -ano | findstr :3000 >nul
if %errorlevel% neq 0 (
    echo [1/2] Menyalakan server lokal Yawscent...
    start /min node web/server.js
    timeout /t 2 >nul
) else (
    echo [1/2] Server lokal aktif di port 3000.
)

echo.
echo [2/2] Membuka Google Chrome dalam Tampilan Mobile Android Smartphone...

set "CHROME_PATH="
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else (
    set "CHROME_PATH=chrome"
)

:: Jalankan Chrome dengan ukuran layar Android Smartphone (412x915)
start "" "%CHROME_PATH%" --window-size=412,915 --user-agent="Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36" "http://localhost:3000"

echo.
echo ====================================================================
echo [BERHASIL] Tampilan Android Yawscent telah dibuka di Google Chrome!
echo Ukuran layar otomatis disesuaikan ke resolusi Smartphone Android.
echo ====================================================================
echo.
ping 127.0.0.1 -n 2 >nul
