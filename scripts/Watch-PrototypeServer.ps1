[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [int]$ParentProcessId,

    [Parameter(Mandatory = $true)]
    [int]$ServerProcessId,

    [Parameter(Mandatory = $true)]
    [long]$ServerStartedUtcTicks
)

$ErrorActionPreference = "SilentlyContinue"

# This hidden watchdog prevents an orphaned Vite process if the visible launcher
# console is closed instead of being stopped with Enter.
Wait-Process -Id $ParentProcessId -ErrorAction SilentlyContinue

$serverProcess = Get-Process -Id $ServerProcessId -ErrorAction SilentlyContinue
if ($null -eq $serverProcess) {
    exit 0
}

$actualStartedUtcTicks = $serverProcess.StartTime.ToUniversalTime().Ticks
if ($actualStartedUtcTicks -ne $ServerStartedUtcTicks) {
    # The original PID has already exited and Windows reused its number.
    exit 0
}

$taskKill = Join-Path $env:SystemRoot "System32\taskkill.exe"
& $taskKill /PID $ServerProcessId /T /F 2>&1 | Out-Null
