[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$Destination
)

$ErrorActionPreference = 'Stop'
$packageRoot = $PSScriptRoot
$baselineRoot = Join-Path $packageRoot 'a'
$manifestPath = Join-Path $packageRoot 'manifest.json'
$patchPath = Join-Path $packageRoot 'gs-016-baseline-to-accepted.patch'
$destinationPath = [System.IO.Path]::GetFullPath($Destination)

if (-not (Test-Path -LiteralPath $baselineRoot -PathType Container)) {
  throw "Baseline directory is missing: $baselineRoot"
}
if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
  throw "Manifest is missing: $manifestPath"
}
if (-not (Test-Path -LiteralPath $patchPath -PathType Leaf)) {
  throw "Patch is missing: $patchPath"
}

if (Test-Path -LiteralPath $destinationPath) {
  if (-not (Test-Path -LiteralPath $destinationPath -PathType Container)) {
    throw "Destination exists and is not a directory: $destinationPath"
  }
  $existing = Get-ChildItem -LiteralPath $destinationPath -Force | Select-Object -First 1
  if ($null -ne $existing) {
    throw "Refusing to restore into a non-empty destination: $destinationPath"
  }
} else {
  New-Item -ItemType Directory -Path $destinationPath | Out-Null
}

Get-ChildItem -LiteralPath $baselineRoot -Force | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $destinationPath -Recurse
}

$git = Get-Command git.exe -ErrorAction SilentlyContinue
if ($null -eq $git) {
  $git = Get-Command git -ErrorAction SilentlyContinue
}
if ($null -eq $git) {
  throw 'Git is required to apply the binary-capable reconstruction patch.'
}

Push-Location -LiteralPath $destinationPath
$previousCeilingDirectories = $env:GIT_CEILING_DIRECTORIES
try {
  # Prevent Git from discovering any repository above the empty target. Without
  # this ceiling, a target nested under a checkout could redirect application
  # to that checkout's root instead of the requested reconstruction directory.
  $env:GIT_CEILING_DIRECTORIES = Split-Path -Path $destinationPath -Parent
  & $git.Source -c core.autocrlf=false -c core.eol=lf apply --binary --check -p1 $patchPath
  if ($LASTEXITCODE -ne 0) {
    throw "Patch preflight failed with exit code $LASTEXITCODE"
  }
  & $git.Source -c core.autocrlf=false -c core.eol=lf apply --binary -p1 $patchPath
  if ($LASTEXITCODE -ne 0) {
    throw "Patch application failed with exit code $LASTEXITCODE"
  }
} finally {
  $env:GIT_CEILING_DIRECTORIES = $previousCeilingDirectories
  Pop-Location
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$mismatches = [System.Collections.Generic.List[string]]::new()
foreach ($entry in $manifest.entries) {
  $relativePath = $entry.path -replace '/', [System.IO.Path]::DirectorySeparatorChar
  $restoredPath = Join-Path $destinationPath $relativePath
  if (-not (Test-Path -LiteralPath $restoredPath -PathType Leaf)) {
    $mismatches.Add("missing: $($entry.path)")
    continue
  }
  $actualHash = (Get-FileHash -LiteralPath $restoredPath -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($actualHash -ne $entry.acceptedSha256) {
    $mismatches.Add("hash mismatch: $($entry.path) expected=$($entry.acceptedSha256) actual=$actualHash")
  }
}

if ($mismatches.Count -gt 0) {
  throw "Restore verification failed:`n$($mismatches -join "`n")"
}

Write-Output "Verified $($manifest.entryCount) scoped GS-016 evidence files in $destinationPath"
Write-Output 'This is a reconstruction of the accepted GS-016 scope, not a standalone runnable repository.'
