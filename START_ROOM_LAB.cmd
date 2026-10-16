@echo off
setlocal
cd /d "%~dp0"
rem Room mockups for phone review over the owner's private tailnet (not public).
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command ^
  "$listening = Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 4192 -State Listen -ErrorAction SilentlyContinue;" ^
  "if (-not $listening) { Start-Process -WindowStyle Hidden -FilePath python -ArgumentList '-I','tools/room-design/serve_room_lab.py' -WorkingDirectory '%~dp0'; Start-Sleep -Seconds 2 }" ^
  "& \"$env:ProgramFiles\Tailscale\tailscale.exe\" serve --bg --https=8443 http://127.0.0.1:4192 | Out-Null;" ^
  "Write-Host 'Room mockups (Tailscale devices only):';" ^
  "Write-Host 'https://melissadesktop.taile197db.ts.net:8443/tools/room-design/'"
exit /b %ERRORLEVEL%
