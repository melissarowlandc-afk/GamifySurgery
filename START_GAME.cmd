@echo off
setlocal
title Gamify Surgery - Local Prototype
cd /d "%~dp0"

echo.
echo ============================================================
echo   GAMIFY SURGERY - ONE-CLICK LOCAL LAUNCHER
echo ============================================================
echo.

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\Start-Prototype.ps1"
set "GS_LAUNCH_EXIT=%ERRORLEVEL%"

if not "%GS_LAUNCH_EXIT%"=="0" (
  echo.
  echo The launcher stopped because something needs attention.
  echo Read the message above, then press any key to close this window.
  pause >nul
)

exit /b %GS_LAUNCH_EXIT%
