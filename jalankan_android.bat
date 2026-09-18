@echo off
title yawscent indonesia - Android Runner
color 0A

echo ====================================================================
echo             YAWSCENT INDONESIA - ANDROID RUNNER
echo ====================================================================
echo.

:: 1. Memastikan Backend / Server Lokal Aktif
powershell -Command "Test-NetConnection -ComputerName 127.0.0.1 -Port 3000 -InformationLevel Quiet" | findstr /i "True" >nul
if %errorlevel% neq 0 (
    echo [1/3] Menyalakan Server Lokal Yawscent di background...
    set "NODE_CMD=node"
    if exist "C:\Program Files\nodejs\node.exe" set "NODE_CMD=C:\Program Files\nodejs\node.exe"
    start "Yawscent Server" /min "%NODE_CMD%" web/server.js
    timeout /t 2 >nul
) else (
    echo [1/3] Server lokal aktif di port 3000.
)

echo.
echo [2/3] Memeriksa Emulator / Perangkat Android (MuMu / ADB)...

set "ADB_CMD=adb"
if exist "C:\Program Files\Netease\MuMuPlayer\nx_main\adb.exe" (
    set "ADB_CMD=C:\Program Files\Netease\MuMuPlayer\nx_main\adb.exe"
)

:: Jalankan MuMu Player jika terpasang dan belum terbuka
tasklist /fi "imagename eq MuMuNxMain.exe" 2>nul | findstr /i "MuMuNxMain.exe" >nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\Netease\MuMuPlayer\nx_main\MuMuNxLauncher.exe" (
        echo Membuka MuMu Player Android Emulator...
        start "" "C:\Program Files\Netease\MuMuPlayer\nx_main\MuMuNxLauncher.exe"
        echo Menunggu emulator siap 10 detik...
        ping 127.0.0.1 -n 2 >nul
    )
) else (
    echo MuMu Player sudah berjalan.
)

echo.
echo [3/3] Memeriksa Flutter SDK...
where flutter >nul 2>nul
if %errorlevel% equ 0 (
    echo Flutter terdeteksi di sistem! Menjalankan aplikasi mobile_flutter...
    cd mobile_flutter
    flutter run
) else (
    echo.
    echo [INFO] Flutter SDK belum terdaftar di PATH sistem.
    echo Menjalankan Mode Android Mobile di Google Chrome secara otomatis...
    call "%~dp0jalankan_android_di_chrome.bat"
)

echo.
pause
