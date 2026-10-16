[CmdletBinding()]
param(
    [switch]$OpenPrivateUrl
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$privatePort = 4174
$privateHost = "melissadesktop.taile197db.ts.net"
$privateUrl = "https://$privateHost/"
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDirectory
$playerRoot = Join-Path $projectRoot "apps\player"
$stateDirectory = Join-Path $projectRoot ".local-dev\tailscale-dev"
$statePath = Join-Path $stateDirectory "private-game-server.json"
$outputLog = Join-Path $stateDirectory "private-game-server-output.log"
$errorLog = Join-Path $stateDirectory "private-game-server-error.log"
$tailscaleCommand = Join-Path $env:ProgramFiles "Tailscale\tailscale.exe"
$viteEntry = Join-Path $projectRoot "node_modules\vite\bin\vite.js"
$privateConfig = Join-Path $projectRoot "scripts\vite\private-tailscale.config.ts"
$healthPath = "/gamify-surgery-launcher-health.json"

function Get-ServerState {
    if (-not (Test-Path -LiteralPath $statePath -PathType Leaf)) { return $null }
    try { return Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json }
    catch { throw "The private-game state file is invalid: $statePath" }
}

function Get-ProcessIdentity {
    param([int]$ProcessId)
    $process = Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue
    if ($null -eq $process) { return $null }
    $managed = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    if ($null -eq $managed) { return $null }
    return [pscustomobject]@{
        Id = $ProcessId
        StartedUtcTicks = $managed.StartTime.ToUniversalTime().Ticks
        CommandLine = [string]$process.CommandLine
    }
}

function Test-OwnedServer {
    param($State)
    if ($null -eq $State) { return $false }
    $identity = Get-ProcessIdentity -ProcessId ([int]$State.processId)
    if ($null -eq $identity) { return $false }
    return (
        $identity.StartedUtcTicks -eq [int64]$State.startedUtcTicks -and
        $identity.CommandLine -like "*$viteEntry*" -and
        $identity.CommandLine -like "*$privateConfig*" -and
        $identity.CommandLine -like "*--port $privatePort*"
    )
}

function Test-PortInUse {
    return $null -ne (Get-NetTCPConnection -LocalAddress "127.0.0.1" -LocalPort $privatePort -State Listen -ErrorAction SilentlyContinue)
}

function Get-ServeConfig {
    if (-not (Test-Path -LiteralPath $tailscaleCommand -PathType Leaf)) {
        throw "Tailscale CLI was not found at $tailscaleCommand."
    }
    $status = & $tailscaleCommand serve status --json 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Could not read Tailscale Serve status: $status" }
    try { return ([string]($status -join "`n") | ConvertFrom-Json) }
    catch { throw "Tailscale Serve returned invalid JSON: $status" }
}

function Test-EmptyServeConfig {
    param($Config)
    return @($Config.PSObject.Properties).Count -eq 0
}

function Test-OwnServeRoute {
    param($Config)
    $tcpCollection = $Config.PSObject.Properties["TCP"]
    $webCollection = $Config.PSObject.Properties["Web"]
    if ($null -eq $tcpCollection -or $null -eq $webCollection) { return $false }
    $funnelCollection = $Config.PSObject.Properties["AllowFunnel"]
    $allowFunnel = if ($null -eq $funnelCollection) { $false } else { $funnelCollection.Value.PSObject.Properties["$privateHost`:443"].Value }
    $tcp = $tcpCollection.Value.PSObject.Properties["443"].Value
    $web = $webCollection.Value.PSObject.Properties["$privateHost`:443"].Value
    if ($null -eq $tcp -or $null -eq $web) { return $false }
    $handler = $web.Handlers.PSObject.Properties["/"].Value
    return (
        $tcp.HTTPS -eq $true -and
        $allowFunnel -ne $true -and
        $null -ne $handler -and
        $handler.Proxy -eq "http://127.0.0.1:$privatePort"
    )
}

function Test-PrivateBackendReady {
    param([int]$ProcessId)
    $listener = Get-NetTCPConnection -LocalAddress "127.0.0.1" -LocalPort $privatePort -State Listen -ErrorAction SilentlyContinue |
        Where-Object { $_.OwningProcess -eq $ProcessId } |
        Select-Object -First 1
    if ($null -eq $listener) { return $false }
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$privatePort$healthPath" -Headers @{ Host = $privateHost } -TimeoutSec 2
        $health = $response.Content | ConvertFrom-Json
        return $response.StatusCode -eq 200 -and $health.applicationId -eq "gamify-surgery-player" -and $health.launcherProtocol -eq 1
    }
    catch { return $false }
}

function Assert-ConfiguredTailnetHost {
    $status = & $tailscaleCommand status --json 2>&1
    if ($LASTEXITCODE -ne 0) { throw "Could not read Tailscale node status: $status" }
    try { $node = ([string]($status -join "`n") | ConvertFrom-Json).Self }
    catch { throw "Tailscale node status was not valid JSON: $status" }
    if ([string]$node.DNSName.TrimEnd(".") -ne $privateHost) {
        throw "This desktop's Tailscale DNS name does not match the configured private host $privateHost."
    }
}

New-Item -ItemType Directory -Path $stateDirectory -Force | Out-Null
Assert-ConfiguredTailnetHost
$state = Get-ServerState
if (Test-OwnedServer -State $state) {
    Write-Host "The private Vite server is already running on 127.0.0.1:$privatePort." -ForegroundColor Green
}
else {
    if (Test-PortInUse) {
        throw "Port $privatePort is already used by another process. It was not changed."
    }
    if (-not (Test-Path -LiteralPath $viteEntry -PathType Leaf)) {
        throw "Vite is not installed at $viteEntry. Run the normal project setup before starting private development."
    }
    $nodeCommand = Get-Command "node.exe" -ErrorAction SilentlyContinue
    if ($null -eq $nodeCommand) { throw "Node.js was not found on PATH." }
    $arguments = @(
        ('"{0}"' -f $viteEntry),
        "--config", ('"{0}"' -f $privateConfig),
        "--host", "127.0.0.1",
        "--port", "$privatePort",
        "--strictPort"
    )
    $server = Start-Process -FilePath $nodeCommand.Source -ArgumentList $arguments -WorkingDirectory $playerRoot -WindowStyle Hidden -RedirectStandardOutput $outputLog -RedirectStandardError $errorLog -PassThru
    $state = [pscustomobject]@{
        processId = $server.Id
        startedUtcTicks = $server.StartTime.ToUniversalTime().Ticks
        config = "vite.private-tailscale.config.ts"
        port = $privatePort
    }
    $state | ConvertTo-Json | Set-Content -LiteralPath $statePath -Encoding utf8
    $deadline = [DateTime]::UtcNow.AddSeconds(30)
    do {
        Start-Sleep -Milliseconds 250
        $server.Refresh()
        if ($server.HasExited) {
            throw "The private Vite server stopped unexpectedly. See $errorLog"
        }
    } while (-not (Test-PrivateBackendReady -ProcessId $server.Id) -and [DateTime]::UtcNow -lt $deadline)
    if (-not (Test-PrivateBackendReady -ProcessId $server.Id)) { throw "The private Vite server did not pass its loopback health check within 30 seconds." }
    Write-Host "Private Vite server is ready on 127.0.0.1:$privatePort." -ForegroundColor Green
}

$privateIdentity = Get-ProcessIdentity -ProcessId ([int]$state.processId)
if (-not (Test-PrivateBackendReady -ProcessId $privateIdentity.Id)) {
    throw "The recorded private Vite server is not the healthy loopback backend expected by this launcher. It was not changed."
}

$serveConfig = Get-ServeConfig
if (-not (Test-OwnServeRoute -Config $serveConfig)) {
    if (-not (Test-EmptyServeConfig -Config $serveConfig)) {
        throw "Tailscale Serve already has a different configuration. It was preserved; inspect it before adding this private route."
    }
    & $tailscaleCommand serve --bg "http://127.0.0.1:$privatePort"
    if ($LASTEXITCODE -ne 0) {
        throw "Tailscale Serve was not enabled. The local backend remains running; follow any Tailscale consent URL shown above, then run START_PRIVATE_GAME.cmd again."
    }
    $serveConfig = Get-ServeConfig
    if (-not (Test-OwnServeRoute -Config $serveConfig)) {
        throw "Tailscale Serve did not report the expected loopback route. The local backend remains running."
    }
}

Write-Host "Private tailnet URL: $privateUrl" -ForegroundColor Green
Write-Host "This URL uses a separate browser origin and has separate local saves from http://127.0.0.1:4173." -ForegroundColor Yellow
if ($OpenPrivateUrl) { Start-Process -FilePath $privateUrl }
