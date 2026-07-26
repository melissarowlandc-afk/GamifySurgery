@echo off
setlocal
title Gamify Surgery - Clinical Context Workbench
cd /d "%~dp0"

echo.
echo ============================================================
echo   GAMIFY SURGERY - CLINICAL CONTEXT WORKBENCH
echo ============================================================
echo.

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\Start-ClinicalWorkbench.ps1"
set "GS_WORKBENCH_EXIT=%ERRORLEVEL%"

if not "%GS_WORKBENCH_EXIT%"=="0" (
  echo.
  echo The Workbench launcher stopped because something needs attention.
  echo Read the message above, then press any key to close this window.
  pause >nul
)

exit /b %GS_WORKBENCH_EXIT%
