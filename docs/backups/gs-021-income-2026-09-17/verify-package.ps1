param(
  [string]$ReconstructTo
)

$ErrorActionPreference = "Stop"
$packageRoot = $PSScriptRoot
$manifestPath = Join-Path $packageRoot "manifest.json"
if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
  throw "manifest.json is missing"
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$failures = @()
foreach ($entry in $manifest.packageFiles) {
  $path = Join-Path $packageRoot $entry.path
  if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
    $failures += "missing: $($entry.path)"
    continue
  }
  $item = Get-Item -LiteralPath $path
  if ($item.Length -ne $entry.bytes) {
    $failures += "size mismatch: $($entry.path)"
  }
  $hash = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($hash -ne $entry.sha256) {
    $failures += "hash mismatch: $($entry.path)"
  }
}
if ($failures.Count -gt 0) {
  $failures | ForEach-Object { Write-Error $_ }
  throw "GS-021 package verification failed with $($failures.Count) issue(s)."
}

$acceptedRoot = Join-Path $packageRoot "accepted-after"
$acceptedFiles = Get-ChildItem -LiteralPath $acceptedRoot -Recurse -File
if ($acceptedFiles.Count -ne $manifest.acceptedAfterFileCount) {
  throw "Accepted-after count mismatch: expected $($manifest.acceptedAfterFileCount), found $($acceptedFiles.Count)"
}

if ($ReconstructTo) {
  $destination = [System.IO.Path]::GetFullPath($ReconstructTo)
  if (Test-Path -LiteralPath $destination) {
    if ((Get-ChildItem -LiteralPath $destination -Force | Measure-Object).Count -ne 0) {
      throw "Reconstruction destination must be empty: $destination"
    }
  } else {
    New-Item -ItemType Directory -Path $destination | Out-Null
  }
  foreach ($file in $acceptedFiles) {
    $relative = $file.FullName.Substring($acceptedRoot.Length + 1)
    $target = Join-Path $destination $relative
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
    Copy-Item -LiteralPath $file.FullName -Destination $target
    $sourceHash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
    $targetHash = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
    if ($sourceHash -ne $targetHash) {
      throw "Reconstruction hash mismatch: $relative"
    }
  }
  Write-Host "Reconstructed and verified $($acceptedFiles.Count) accepted source files at $destination"
}

Write-Host "Verified $($manifest.packageFiles.Count) package payload files and $($acceptedFiles.Count) accepted source files."
