[CmdletBinding()]
param(
    [switch]$NoBrowser,
    [switch]$ExitAfterReady
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$prototypeUrl = "http://127.0.0.1:4173"
$prototypeHealthUrl = "$prototypeUrl/gamify-surgery-launcher-health.json"
$minimumNodeVersion = [Version]"22.12.0"
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDirectory
. (Join-Path $scriptDirectory "Repair-LauncherEnvironment.ps1")
Repair-LauncherProcessEnvironment
$healthContractPath = Join-Path $projectRoot "apps\player\public\gamify-surgery-launcher-health.json"
$logDirectory = Join-Path $projectRoot ".local-dev\logs"
$installLog = Join-Path $logDirectory "npm-install.log"
$serverOutputLog = Join-Path $logDirectory "prototype-server-output.log"
$serverErrorLog = Join-Path $logDirectory "prototype-server-error.log"
$watcherScript = Join-Path $scriptDirectory "Watch-PrototypeServer.ps1"
$ownedServer = $null
$expectedHealthContract = $null

function Write-Step {
    param([Parameter(Mandatory = $true)][string]$Message)

    Write-Host ""
    Write-Host ("[Gamify Surgery] {0}" -f $Message) -ForegroundColor Cyan
}

function Get-PrototypeEndpointState {
    $response = $null

    try {
        $probeUrl = "{0}?launcher_probe={1}" -f $prototypeHealthUrl, ([Guid]::NewGuid().ToString("N"))
        $response = Invoke-WebRequest `
            -Uri $probeUrl `
            -UseBasicParsing `
            -TimeoutSec 2 `
            -Headers @{ "Cache-Control" = "no-cache" }
    }
    catch {
        if ($null -ne $_.Exception.Response) {
            return "Other"
        }

        return "Unavailable"
    }

    try {
        $actualHealthContract = $response.Content | ConvertFrom-Json
    }
    catch {
        return "Other"
    }

    if (
        $response.StatusCode -eq 200 -and
        [string]$actualHealthContract.applicationId -eq [string]$expectedHealthContract.applicationId -and
        [string]$actualHealthContract.launcherProtocol -eq [string]$expectedHealthContract.launcherProtocol
    ) {
        return "Prototype"
    }

    return "Other"
}

function Test-PrototypePortInUse {
    $prototypeUri = [Uri]$prototypeUrl
    $tcpClient = New-Object System.Net.Sockets.TcpClient

    try {
        $connectTask = $tcpClient.ConnectAsync($prototypeUri.Host, $prototypeUri.Port)
        if (-not $connectTask.Wait(500)) {
            return $false
        }

        return $tcpClient.Connected
    }
    catch {
        return $false
    }
    finally {
        $tcpClient.Dispose()
    }
}

function Open-PrototypeBrowser {
    if ($NoBrowser) {
        Write-Step "Browser launch skipped for this readiness check."
        return
    }

    Write-Step "Opening the game in your default web browser..."
    try {
        Start-Process -FilePath $prototypeUrl
    }
    catch {
        Write-Warning ("The browser did not open automatically. Open this address yourself: {0}" -f $prototypeUrl)
    }
}

function Show-LogTail {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [int]$LineCount = 25
    )

    if (Test-Path -LiteralPath $Path) {
        Write-Host ""
        Write-Host ("Last lines from {0}:" -f $Path) -ForegroundColor Yellow
        Get-Content -LiteralPath $Path -Tail $LineCount
    }
}

function Stop-OwnedPrototypeServer {
    if ($null -eq $script:ownedServer) {
        return
    }

    try {
        $script:ownedServer.Refresh()
        if (-not $script:ownedServer.HasExited) {
            Write-Step "Stopping the local game server..."
            $taskKill = Join-Path $env:SystemRoot "System32\taskkill.exe"
            & $taskKill /PID $script:ownedServer.Id /T /F 2>&1 | Out-Null
        }
    }
    catch {
        Write-Warning "The launcher could not confirm that its game server stopped. No unrelated process was targeted."
    }
    finally {
        $script:ownedServer = $null
    }
}

try {
    Set-Location -LiteralPath $projectRoot
    New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null

    if (-not (Test-Path -LiteralPath $healthContractPath -PathType Leaf)) {
        throw "The local launcher health contract is missing: $healthContractPath"
    }

    try {
        $expectedHealthContract = Get-Content -LiteralPath $healthContractPath -Raw |
            ConvertFrom-Json
    }
    catch {
        throw "The local launcher health contract is not valid JSON: $healthContractPath"
    }

    if (
        [string]::IsNullOrWhiteSpace([string]$expectedHealthContract.applicationId) -or
        $null -eq $expectedHealthContract.launcherProtocol
    ) {
        throw "The local launcher health contract is missing its application ID or protocol."
    }

    Write-Step "Checking whether this project's game server is already running..."
    $initialEndpointState = Get-PrototypeEndpointState

    if ($initialEndpointState -eq "Prototype") {
        Write-Host "The correct Gamify Surgery server is already available." -ForegroundColor Green
        Write-Host "This launcher did not start it, so this window will not stop it."
        if ($ExitAfterReady) {
            Write-Host "Launcher readiness check passed; the existing server remains running." -ForegroundColor Green
            exit 0
        }
        Open-PrototypeBrowser
        Write-Host ""
        Read-Host "Press Enter to close this launcher (the existing game server will stay running)"
        exit 0
    }

    if ($initialEndpointState -eq "Other") {
        throw ((
                "Another website or program is already using {0}. " +
                "Close that program, then double-click START_GAME.cmd again."
            ) -f $prototypeUrl)
    }

    if (
        $initialEndpointState -eq "Unavailable" -and
        (Test-PrototypePortInUse)
    ) {
        throw ((
                "Another website or program is already using {0}. " +
                "Close that program, then double-click START_GAME.cmd again."
            ) -f $prototypeUrl)
    }

    Write-Step "Checking Node.js and npm..."
    $nodeCommand = Get-Command "node.exe" -ErrorAction SilentlyContinue
    $npmCommand = Get-Command "npm.cmd" -ErrorAction SilentlyContinue

    if ($null -eq $nodeCommand -or $null -eq $npmCommand) {
        throw (
            "Node.js or npm is missing. Install the current Node.js LTS release, " +
            "then double-click START_GAME.cmd again."
        )
    }

    $nodeVersionText = (& $nodeCommand.Source --version).Trim().TrimStart([char]"v")
    try {
        $nodeVersion = [Version]$nodeVersionText
    }
    catch {
        throw ("The launcher could not understand the installed Node.js version: {0}" -f $nodeVersionText)
    }

    if ($nodeVersion -lt $minimumNodeVersion) {
        throw ((
                "Node.js {0} is installed, but this project needs {1} or newer. " +
                "Install the current Node.js LTS release and try again."
            ) -f $nodeVersion, $minimumNodeVersion)
    }

    $npmVersion = (& $npmCommand.Source --version).Trim()
    Write-Host ("Node.js {0} and npm {1} are ready." -f $nodeVersion, $npmVersion) -ForegroundColor Green

    Write-Step "Installing or refreshing the project's required files..."
    Write-Host "This is automatic. The first run may take a few minutes."
    Write-Host ("Installation details are saved in: {0}" -f $installLog)

    & $npmCommand.Source install --no-audit --no-fund 2>&1 |
        Tee-Object -FilePath $installLog
    $installExitCode = $LASTEXITCODE

    if ($installExitCode -ne 0) {
        Show-LogTail -Path $installLog
        throw ("npm install failed with exit code {0}." -f $installExitCode)
    }

    $viteEntry = Join-Path $projectRoot "node_modules\vite\bin\vite.js"
    if (-not (Test-Path -LiteralPath $viteEntry -PathType Leaf)) {
        throw "Vite was not installed where the launcher expected it. See the installation log above."
    }

    Write-Step "Starting the local game server..."
    $viteArguments = @(
        ('"{0}"' -f $viteEntry),
        "--host",
        "127.0.0.1",
        "--port",
        "4173",
        "--strictPort"
    )

    $ownedServer = Start-Process `
        -FilePath $nodeCommand.Source `
        -ArgumentList $viteArguments `
        -WorkingDirectory (Join-Path $projectRoot "apps\player") `
        -WindowStyle Hidden `
        -RedirectStandardOutput $serverOutputLog `
        -RedirectStandardError $serverErrorLog `
        -PassThru

    $serverStartedUtcTicks = $ownedServer.StartTime.ToUniversalTime().Ticks
    $watcherPowerShell = Join-Path $PSHOME "powershell.exe"
    $watcherArguments = @(
        "-NoLogo",
        "-NoProfile",
        "-WindowStyle",
        "Hidden",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        ('"{0}"' -f $watcherScript),
        "-ParentProcessId",
        $PID,
        "-ServerProcessId",
        $ownedServer.Id,
        "-ServerStartedUtcTicks",
        $serverStartedUtcTicks
    )

    Start-Process `
        -FilePath $watcherPowerShell `
        -ArgumentList $watcherArguments `
        -WindowStyle Hidden | Out-Null

    $deadline = [DateTime]::UtcNow.AddSeconds(60)
    $serverReady = $false
    do {
        Start-Sleep -Milliseconds 400
        $ownedServer.Refresh()
        if ($ownedServer.HasExited) {
            Show-LogTail -Path $serverErrorLog
            Show-LogTail -Path $serverOutputLog
            if (Test-PrototypePortInUse) {
                throw ((
                        "Another website or program began using {0} while the game was starting. " +
                        "Close that program, then double-click START_GAME.cmd again."
                    ) -f $prototypeUrl)
            }
            throw ("The local game server stopped unexpectedly with exit code {0}." -f $ownedServer.ExitCode)
        }

        $endpointState = Get-PrototypeEndpointState
        if ($endpointState -eq "Prototype") {
            $serverReady = $true
        }
        elseif ($endpointState -eq "Other") {
            throw ("Port 4173 responded, but it was not the Gamify Surgery prototype.")
        }
    } while (-not $serverReady -and [DateTime]::UtcNow -lt $deadline)

    if (-not $serverReady) {
        Show-LogTail -Path $serverErrorLog
        Show-LogTail -Path $serverOutputLog
        throw "The game server did not become ready within 60 seconds."
    }

    Write-Host "The game is ready." -ForegroundColor Green

    if ($ExitAfterReady) {
        Stop-OwnedPrototypeServer
        Write-Host "Launcher readiness check passed and the test server was stopped." -ForegroundColor Green
        exit 0
    }

    Open-PrototypeBrowser
    Write-Host ""
    Write-Host "Keep this launcher window open while you play."
    Write-Host "Use the Help button inside the game for beginner instructions."
    Write-Host "Closing the browser tab does not stop the local server."
    Write-Host ""
    Write-Host "Press ENTER here when you are finished. Only the server started by this launcher will stop." -ForegroundColor Yellow

    while ($true) {
        $ownedServer.Refresh()
        if ($ownedServer.HasExited) {
            Show-LogTail -Path $serverErrorLog
            throw ("The local game server stopped unexpectedly with exit code {0}." -f $ownedServer.ExitCode)
        }

        if ([Console]::KeyAvailable) {
            $pressedKey = [Console]::ReadKey($true)
            if ($pressedKey.Key -eq [ConsoleKey]::Enter) {
                break
            }
        }

        Start-Sleep -Milliseconds 250
    }

    Stop-OwnedPrototypeServer
    Write-Host ""
    Write-Host "The local game server is stopped. Your saved campaign remains in this browser." -ForegroundColor Green
    Start-Sleep -Seconds 1
    exit 0
}
catch {
    Write-Host ""
    Write-Host "The game could not be started." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host ("Troubleshooting logs, when available, are in: {0}" -f $logDirectory)
    Stop-OwnedPrototypeServer
    exit 1
}
finally {
    Stop-OwnedPrototypeServer
}
