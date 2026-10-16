[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$privatePort = 4174
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDirectory
$statePath = Join-Path $projectRoot ".local-dev\tailscale-dev\private-game-server.json"
$tailscaleCommand = Join-Path $env:ProgramFiles "Tailscale\tailscale.exe"
$playerRoot = Join-Path $projectRoot "apps\player"
$viteEntry = Join-Path $projectRoot "node_modules\vite\bin\vite.js"
$privateConfig = Join-Path $projectRoot "scripts\vite\private-tailscale.config.ts"

function Get-ServeConfig {
    $status = & $tailscaleCommand serve status --json 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Could not read Tailscale Serve status: $status" }
    try { return ([string]($status -join "`n") | ConvertFrom-Json) }
    catch { throw "Tailscale Serve returned invalid JSON: $status" }
}

function Test-OwnServeRoute {
    param($Config)
    $tcpCollection = $Config.PSObject.Properties["TCP"]
    $webCollection = $Config.PSObject.Properties["Web"]
    if ($null -eq $tcpCollection -or $null -eq $webCollection) { return $false }
    $funnelCollection = $Config.PSObject.Properties["AllowFunnel"]
    $allowFunnel = if ($null -eq $funnelCollection) { $false } else { $funnelCollection.Value.PSObject.Properties["melissadesktop.taile197db.ts.net:443"].Value }
    $tcp = $tcpCollection.Value.PSObject.Properties["443"].Value
    $web = $webCollection.Value.PSObject.Properties["melissadesktop.taile197db.ts.net:443"].Value
    if ($null -eq $tcp -or $null -eq $web) { return $false }
    $handler = $web.Handlers.PSObject.Properties["/"].Value
    return (
        $tcp.HTTPS -eq $true -and
        $allowFunnel -ne $true -and
        $null -ne $handler -and
        $handler.Proxy -eq "http://127.0.0.1:$privatePort"
    )
}

if (-not (Test-Path -LiteralPath $tailscaleCommand -PathType Leaf)) {
    throw "Tailscale CLI was not found at $tailscaleCommand."
}
$serveConfig = Get-ServeConfig
if (Test-OwnServeRoute -Config $serveConfig) {
    & $tailscaleCommand serve --https=443 --set-path=/ off
    if ($LASTEXITCODE -ne 0) { throw "Tailscale Serve could not remove the private route." }
    Write-Host "Removed the private Tailscale Serve route." -ForegroundColor Green
}
elseif (@($serveConfig.PSObject.Properties).Count -ne 0) {
    throw "Tailscale Serve has a configuration that is not exclusively this private game route. It was preserved."
}

if (Test-Path -LiteralPath $statePath -PathType Leaf) {
    $state = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
    $process = Get-CimInstance Win32_Process -Filter "ProcessId = $([int]$state.processId)" -ErrorAction SilentlyContinue
    $managed = Get-Process -Id ([int]$state.processId) -ErrorAction SilentlyContinue
    $isOwned = $null -ne $process -and $null -ne $managed -and
        $managed.StartTime.ToUniversalTime().Ticks -eq [int64]$state.startedUtcTicks -and
        [string]$process.CommandLine -like "*$viteEntry*" -and
        [string]$process.CommandLine -like "*$privateConfig*" -and
        [string]$process.CommandLine -like "*--port $privatePort*"
    if ($isOwned) {
        Stop-Process -Id $managed.Id -ErrorAction Stop
        Write-Host "Stopped the private Vite server." -ForegroundColor Green
    }
    else {
        Write-Warning "The recorded private Vite process was not running with the expected identity; it was not stopped."
    }
    Remove-Item -LiteralPath $statePath -Force
}
