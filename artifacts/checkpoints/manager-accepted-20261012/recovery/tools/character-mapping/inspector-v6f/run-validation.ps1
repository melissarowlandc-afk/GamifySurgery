# Run each validator directly from the shell and preserve its actual output.
# Browser validation is a separate manager check; no install or game launch.
$inspectorRepo = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../../..')).Path
$inspectorLogDirectory = Join-Path $inspectorRepo 'artifacts/character-statics/inspector-v6f/validation'
[System.IO.Directory]::CreateDirectory($inspectorLogDirectory) | Out-Null
$inspectorEncoding = New-Object System.Text.UTF8Encoding($false)
$inspectorCommands = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'validation-commands.json') -Raw -Encoding UTF8 | ConvertFrom-Json
function Write-InspectorUtf8($path, $value) {
  [System.IO.File]::WriteAllText($path, ($value -replace "`r`n", "`n" -replace "`r", "`n"), $inspectorEncoding)
}
# Preserve previous logs before rerunning, including failed attempts.
$inspectorExistingLogs = @(Get-ChildItem -LiteralPath $inspectorLogDirectory -File | Where-Object { $_.Name -match '\.(stdout\.txt|stderr\.txt|exit\.txt|timing\.json)$|^worker-validation\.(json|txt)$' })
if ($inspectorExistingLogs.Count -gt 0) {
  $inspectorArchive = Join-Path $inspectorLogDirectory ('history/' + [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssfffZ'))
  [System.IO.Directory]::CreateDirectory($inspectorArchive) | Out-Null
  foreach ($inspectorOldLog in $inspectorExistingLogs) {
    Copy-Item -LiteralPath $inspectorOldLog.FullName -Destination (Join-Path $inspectorArchive $inspectorOldLog.Name)
  }
}
# Create every eventual log before the text-file audit counts the lane.
foreach ($inspectorCommand in $inspectorCommands) {
  foreach ($inspectorSuffix in @('.stdout.txt', '.stderr.txt', '.exit.txt', '.timing.json')) {
    Write-InspectorUtf8 (Join-Path $inspectorLogDirectory ($inspectorCommand.name + $inspectorSuffix)) ''
  }
}
foreach ($inspectorName in @('worker-validation.json', 'worker-validation.txt')) {
  Write-InspectorUtf8 (Join-Path $inspectorLogDirectory $inspectorName) ''
}
$inspectorResults = @()
Push-Location -LiteralPath $inspectorRepo
try {
  foreach ($inspectorCommand in $inspectorCommands) {
    $inspectorExecutable = $inspectorCommand.executable
    $inspectorArguments = [string[]]$inspectorCommand.args
    $inspectorStderrPath = Join-Path $inspectorLogDirectory ($inspectorCommand.name + '.stderr.txt')
    $inspectorStarted = [DateTime]::UtcNow
    $inspectorStdoutLines = @(& $inspectorExecutable @inspectorArguments 2> $inspectorStderrPath)
    $inspectorExitCode = $LASTEXITCODE
    $inspectorFinished = [DateTime]::UtcNow
    $inspectorStdout = ($inspectorStdoutLines | ForEach-Object { [string]$_ }) -join "`n"
    if ($inspectorStdout.Length -gt 0) { $inspectorStdout += "`n" }
    # Windows PowerShell formats native stderr as NativeCommandError records.
    # Preserve that output and normalize encoding/line endings without hiding it.
    $inspectorStderr = [System.IO.File]::ReadAllText($inspectorStderrPath)
    Write-InspectorUtf8 (Join-Path $inspectorLogDirectory ($inspectorCommand.name + '.stdout.txt')) $inspectorStdout
    Write-InspectorUtf8 $inspectorStderrPath $inspectorStderr
    Write-InspectorUtf8 (Join-Path $inspectorLogDirectory ($inspectorCommand.name + '.exit.txt')) ([string]$inspectorExitCode + "`n")
    $inspectorTiming = @{startedAt=$inspectorStarted.ToString('o');finishedAt=$inspectorFinished.ToString('o');durationMs=[Math]::Round(($inspectorFinished-$inspectorStarted).TotalMilliseconds)} | ConvertTo-Json -Compress
    Write-InspectorUtf8 (Join-Path $inspectorLogDirectory ($inspectorCommand.name + '.timing.json')) ($inspectorTiming + "`n")
    $inspectorResults += @{name=$inspectorCommand.name;exitCode=$inspectorExitCode;stdout=$inspectorStdout.Trim()}
  }
  & node 'tools/character-mapping/inspector-v6f/record-worker-validation.mjs'
  $inspectorReceiptExit = $LASTEXITCODE
  $inspectorResults | ConvertTo-Json -Compress
  exit $inspectorReceiptExit
} finally {
  Pop-Location
}
