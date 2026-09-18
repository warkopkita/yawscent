@echo off
title yawscent indonesia - Auto Deploy ke GitHub & Render
color 0B

echo ====================================================================
echo        YAWSCENT INDONESIA - PENGIRIMAN KODE KE GITHUB (AUTO DEPLOY)
echo ====================================================================
echo.

:: 1. Cek Git executable
set "GIT_CMD=git"
where git >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Program Files\Git\cmd\git.exe" set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Git\cmd\git.exe" set "GIT_CMD=C:\Users\%USERNAME%\AppData\Local\Programs\Git\cmd\git.exe"
)

"%GIT_CMD%" --version >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git belum terpasang. Sedang mencoba menyelesaikan instalasi...
    timeout /t 5 >nul
)

:: 2. Inisialisasi Git Lokal jika belum
if not exist ".git" (
    echo [1/4] Menginisialisasi Git Repository...
    "%GIT_CMD%" init
    "%GIT_CMD%" branch -M main
) else (
    echo [1/4] Git repository lokal sudah aktif.
)

:: 3. Konfigurasi identitas Git bawaan
"%GIT_CMD%" config user.name >nul 2>nul
if %errorlevel% neq 0 (
    "%GIT_CMD%" config user.name "Yawscent Store"
    "%GIT_CMD%" config user.email "admin@yawscent.id"
)

:: 4. Tambahkan file dan commit
echo.
echo [2/4] Mengemas seluruh kode proyek (Frontend, Backend, SQL DB)...
"%GIT_CMD%" add .
"%GIT_CMD%" commit -m "Deploy Yawscent Indonesia (Haute Parfumerie, Real SQL & Multi-Role Auth)"

echo.
echo [3/4] Menghubungkan ke GitHub...
echo --------------------------------------------------------------------
echo Buka https://github.com/new di browser Anda dan buat repository baru (misal: 'yawscent').
echo Kemudian salin (copy) link repository Anda dari GitHub (https://github.com/...).
echo --------------------------------------------------------------------
echo.
set /p REPO_URL="Tempel (Paste) URL GitHub Anda di sini, lalu tekan Enter: "

if "%REPO_URL%"=="" (
    echo.
    echo [INFO] URL tidak diisi. Anda dapat mengunggahnya nanti kapan saja.
    pause
    exit /b
)

"%GIT_CMD%" remote remove origin 2>nul
"%GIT_CMD%" remote add origin "%REPO_URL%"

echo.
echo [4/4] Mengirim kode ke GitHub (Pushing to main)...
"%GIT_CMD%" push -u origin main

echo.
echo ====================================================================
echo [SELESAI] Kode proyek Yawscent Anda sudah tersimpan rapi di GitHub!
echo.
echo LANGKAH TERAKHIR DI RENDER.COM:
echo 1. Buka https://render.com dan Login with GitHub
echo 2. Klik "New +" -^> "Web Service"
echo 3. Pilih repository Anda yang baru saja di-push
echo 4. Klik "Create Web Service"
echo.
echo Website Anda akan langsung LIVE 24 jam nonstop gratis!
echo ====================================================================
echo.
pause
