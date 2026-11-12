@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Use the same Node.js installation as the game.
  pause
  exit /b 1
)
node "%~dp0beta-invites.mjs" --interactive
set "BETA_INVITES_EXIT=%ERRORLEVEL%"
echo.
pause
exit /b %BETA_INVITES_EXIT%
