[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$workbenchUrl = "http://127.0.0.1:4174"
$healthUrl = "$workbenchUrl/api/health"
$minimumNodeVersion = [Version]"22.12.0"
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDirectory
. (Join-Path $scriptDirectory "Repair-LauncherEnvironment.ps1")
Repair-LauncherProcessEnvironment
$logDirectory = Join-Path $projectRoot ".local-dev\logs"
$installLog = Join-Path $logDirectory "npm-install.log"
$serverOutputLog = Join-Path $logDirectory "clinical-workbench-output.log"
$serverErrorLog = Join-Path $logDirectory "clinical-workbench-error.log"
$watcherScript = Join-Path $scriptDirectory "Watch-PrototypeServer.ps1"
$ownedServer = $null

function Write-Step {
    param([Parameter(Mandatory = $true)][string]$Message)

    Write-Host ""
    Write-Host ("[Clinical Context Workbench] {0}" -f $Message) -ForegroundColor Cyan
}

function Get-WorkbenchEndpointState {
    try {
        $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 2
        if (
            $response.StatusCode -eq 200 -and
            $response.Content.Contains('"persistence":"local-only"')
        ) {
            return "Workbench"
        }
        return "Other"
    }
    catch {
        return "Unavailable"
    }
}

function Show-LogTail {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (Test-Path -LiteralPath $Path) {
        Write-Host ""
        Write-Host ("Last lines from {0}:" -f $Path) -ForegroundColor Yellow
        Get-Content -LiteralPath $Path -Tail 30
    }
}

function Stop-OwnedWorkbench {
    if ($null -eq $script:ownedServer) {
        return
    }
    try {
        $script:ownedServer.Refresh()
        if (-not $script:ownedServer.HasExited) {
            Write-Step "Stopping the local Workbench..."
            $taskKill = Join-Path $env:SystemRoot "System32\taskkill.exe"
            & $taskKill /PID $script:ownedServer.Id /T /F 2>&1 | Out-Null
        }
    }
    catch {
        Write-Warning "Could not confirm that the Workbench process stopped. No unrelated process was targeted."
    }
    finally {
        $script:ownedServer = $null
    }
}

try {
    Set-Location -LiteralPath $projectRoot
    New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null

    Write-Step "Checking whether the Workbench is already running..."
    $initialState = Get-WorkbenchEndpointState
    if ($initialState -eq "Workbench") {
        Write-Host "The correct local Workbench is already available." -ForegroundColor Green
        Start-Process -FilePath $workbenchUrl
        Read-Host "Press Enter to close this launcher (the existing Workbench remains running)"
        exit 0
    }
    if ($initialState -eq "Other") {
        throw "Another program is using port 4174. Close it, then run this launcher again."
    }

    Write-Step "Checking Node.js and npm..."
    $nodeCommand = Get-Command "node.exe" -ErrorAction SilentlyContinue
    $npmCommand = Get-Command "npm.cmd" -ErrorAction SilentlyContinue
    if ($null -eq $nodeCommand -or $null -eq $npmCommand) {
        throw "Node.js or npm is missing. Install the current Node.js LTS release, then try again."
    }
    $nodeVersionText = (& $nodeCommand.Source --version).Trim().TrimStart([char]"v")
    $nodeVersion = [Version]$nodeVersionText
    if ($nodeVersion -lt $minimumNodeVersion) {
        throw ("Node.js {0} is installed, but {1} or newer is required." -f $nodeVersion, $minimumNodeVersion)
    }

    Write-Step "Installing or refreshing the required local files..."
    & $npmCommand.Source install --no-audit --no-fund 2>&1 |
        Tee-Object -FilePath $installLog
    if ($LASTEXITCODE -ne 0) {
        Show-LogTail -Path $installLog
        throw ("npm install failed with exit code {0}." -f $LASTEXITCODE)
    }

    Write-Step "Starting the loopback-only Workbench..."
    $arguments = @(
        "run",
        "dev",
        "--workspace",
        "@gamify-surgery/clinical-context-workbench"
    )
    $ownedServer = Start-Process `
        -FilePath $npmCommand.Source `
        -ArgumentList $arguments `
        -WorkingDirectory $projectRoot `
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
    do {
        Start-Sleep -Milliseconds 400
        $ownedServer.Refresh()
        if ($ownedServer.HasExited) {
            Show-LogTail -Path $serverErrorLog
            Show-LogTail -Path $serverOutputLog
            throw ("The Workbench stopped unexpectedly with exit code {0}." -f $ownedServer.ExitCode)
        }
        $endpointState = Get-WorkbenchEndpointState
        if ($endpointState -eq "Other") {
            throw "Port 4174 responded, but it was not this Workbench."
        }
    } while ($endpointState -ne "Workbench" -and [DateTime]::UtcNow -lt $deadline)

    if ($endpointState -ne "Workbench") {
        Show-LogTail -Path $serverErrorLog
        throw "The Workbench did not become ready within 60 seconds."
    }

    Write-Host "The Workbench is ready." -ForegroundColor Green
    Start-Process -FilePath $workbenchUrl
    Write-Host ""
    Write-Host "Private workspace data remains on this computer in ignored folders."
    Write-Host "Live literature scouting stays disabled until CLINICAL_SCOUT_CONTACT_EMAIL is configured in .env.local."
    Write-Host ""
    Read-Host "Press Enter when finished; only the Workbench started by this launcher will stop"
    Stop-OwnedWorkbench
    exit 0
}
catch {
    Write-Host ""
    Write-Host "The Clinical Context Workbench could not be started." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ("Troubleshooting logs are in: {0}" -f $logDirectory)
    Stop-OwnedWorkbench
    exit 1
}
finally {
    Stop-OwnedWorkbench
}
