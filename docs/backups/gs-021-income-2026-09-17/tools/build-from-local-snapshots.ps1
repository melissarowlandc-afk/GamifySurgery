param(
  [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "../../..")).Path
)

$ErrorActionPreference = "Stop"
$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

function Copy-TreeFiles {
  param(
    [Parameter(Mandatory)] [string]$SourceRoot,
    [Parameter(Mandatory)] [string]$DestinationRoot,
    [string[]]$Extensions = @(".ts", ".tsx", ".css", ".md", ".json", ".txt", ".patch", ".tsv")
  )

  $resolvedSource = (Resolve-Path -LiteralPath $SourceRoot).Path
  Get-ChildItem -LiteralPath $resolvedSource -Recurse -File |
    Where-Object { $Extensions -contains $_.Extension } |
    ForEach-Object {
      $relative = $_.FullName.Substring($resolvedSource.Length + 1)
      $destination = Join-Path $DestinationRoot $relative
      New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
      Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
    }
}

function Copy-RepositoryFile {
  param(
    [Parameter(Mandatory)] [string]$RelativePath,
    [Parameter(Mandatory)] [string]$DestinationRoot
  )

  $source = Join-Path $RepositoryRoot $RelativePath
  if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
    throw "Required repository file is missing: $RelativePath"
  }
  $destination = Join-Path $DestinationRoot $RelativePath
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
  Copy-Item -LiteralPath $source -Destination $destination -Force
}

$payloadDirectories = @("accepted-after", "milestones", "prerequisites", "evidence", "provenance")
foreach ($directory in $payloadDirectories) {
  $path = Join-Path $packageRoot $directory
  if (Test-Path -LiteralPath $path) {
    Remove-Item -LiteralPath $path -Recurse -Force
  }
  New-Item -ItemType Directory -Path $path | Out-Null
}

$localDev = Join-Path $RepositoryRoot ".local-dev"
$prerequisiteLayers = @(
  @{ Name = "01-m1-reconstructed-before"; Source = "gs-021-m1-reconstructed-baseline" },
  @{ Name = "01-m1-sol-start"; Source = "gs-021-m1-sol-start" },
  @{ Name = "02-m2-before"; Source = "gs-021-m2-baseline" },
  @{ Name = "03-m3-before"; Source = "gs-021-m3-baseline" },
  @{ Name = "04-m4a-before"; Source = "gs-021-m4a-baseline" },
  @{ Name = "04-m4a-glp1-before"; Source = "gs-021-glp1-ui-baseline" },
  @{ Name = "04-m4a-popups-before"; Source = "gs-021-popups-baseline" },
  @{ Name = "04-m4a-tabs-before"; Source = "gs-021-m4a-tabs-baseline" },
  @{ Name = "04-m4a-level-two-e2e-before"; Source = "gs-021-ui-baseline" },
  @{ Name = "05-m4b-before"; Source = "gs-021-m4b-baseline" },
  @{ Name = "05-m4b-browser-before"; Source = "gs-021-m4b-browser-baseline" },
  @{ Name = "06-minor-procedure-tests-before"; Source = "gs-021-minor-procedure-tests-baseline" },
  @{ Name = "07-fixture-integration-before-terra-partial"; Source = "gs-021-fixture-integration-current" }
)
foreach ($layer in $prerequisiteLayers) {
  Copy-TreeFiles -SourceRoot (Join-Path $localDev $layer.Source) -DestinationRoot (Join-Path $packageRoot "prerequisites/$($layer.Name)")
}

Copy-TreeFiles -SourceRoot (Join-Path $localDev "gs-021-m1-review") -DestinationRoot (Join-Path $packageRoot "provenance/m1-reconstruction")
Copy-TreeFiles -SourceRoot (Join-Path $localDev "gs-021-m1-review-replay3") -DestinationRoot (Join-Path $packageRoot "provenance/m1-replay3") -Extensions @(".ts", ".tsx", ".css", ".md")

foreach ($layer in @(
  @{ Name = "01-m1-after"; Source = "gs-021-m1-current" },
  @{ Name = "02-m2-after"; Source = "gs-021-m2-current" },
  @{ Name = "03-m3-after"; Source = "gs-021-m3-current" },
  @{ Name = "05-m4b-after"; Source = "gs-021-m4b-current" }
)) {
  Copy-TreeFiles -SourceRoot (Join-Path $localDev $layer.Source) -DestinationRoot (Join-Path $packageRoot "milestones/$($layer.Name)")
}

$acceptedAfter = Join-Path $packageRoot "accepted-after"
foreach ($snapshot in @("gs-021-m1-current", "gs-021-m2-current", "gs-021-m3-current")) {
  Copy-TreeFiles -SourceRoot (Join-Path $localDev $snapshot) -DestinationRoot $acceptedAfter -Extensions @(".ts", ".tsx", ".css", ".md")
}

$m4aManifest = Join-Path $localDev "gs-021-m4a-current/manifest.txt"
$m4aAfter = Join-Path $packageRoot "milestones/04-m4a-after"
foreach ($line in Get-Content -LiteralPath $m4aManifest) {
  if ([string]::IsNullOrWhiteSpace($line)) { continue }
  $parts = $line -split " "
  $relativePath = $parts[0]
  $expectedHash = $parts[1]
  $m4aCandidates = @(
    (Join-Path (Join-Path $localDev "gs-021-m4b-baseline") $relativePath),
    (Join-Path (Join-Path $localDev "gs-021-m4b-browser-baseline") $relativePath),
    (Join-Path (Join-Path $localDev "gs-021-m4a-baseline") $relativePath),
    (Join-Path (Join-Path $localDev "gs-021-m4a-tabs-baseline") $relativePath),
    (Join-Path (Join-Path $localDev "gs-021-m4b-finish-start") (Split-Path -Leaf $relativePath)),
    (Join-Path $RepositoryRoot $relativePath)
  )
  $m4aSource = $m4aCandidates | Where-Object {
    (Test-Path -LiteralPath $_ -PathType Leaf) -and
    ((Get-FileHash -LiteralPath $_ -Algorithm SHA256).Hash -eq $expectedHash)
  } | Select-Object -First 1
  if (-not (Test-Path -LiteralPath $m4aSource -PathType Leaf)) {
    throw "Required M4a source is missing: $relativePath"
  }
  $actualM4aHash = (Get-FileHash -LiteralPath $m4aSource -Algorithm SHA256).Hash
  if ($actualM4aHash -ne $expectedHash) {
    throw "M4a source hash mismatch for $relativePath. Expected $expectedHash, found $actualM4aHash"
  }
  $m4aDestination = Join-Path $m4aAfter $relativePath
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $m4aDestination) | Out-Null
  Copy-Item -LiteralPath $m4aSource -Destination $m4aDestination -Force
  Copy-RepositoryFile -RelativePath $relativePath -DestinationRoot $acceptedAfter
}

foreach ($relativePath in @(
  "apps/player/src/ui/EmergencyGlp1Panel.tsx",
  "apps/player/src/ui/EmergencyGlp1Panel.test.tsx",
  "tests/e2e/level-two.spec.ts",
  "tests/e2e/clinic-income-popups.spec.ts"
)) {
  Copy-RepositoryFile -RelativePath $relativePath -DestinationRoot $acceptedAfter
}

Copy-TreeFiles -SourceRoot (Join-Path $localDev "gs-021-m4b-current") -DestinationRoot $acceptedAfter -Extensions @(".ts", ".tsx", ".css", ".md")

foreach ($relativePath in @(
  "apps/player/src/session/breadButterPresentation.test.ts",
  "apps/player/src/session/earlyLevelsPresentation.test.ts",
  "packages/game-domain/tests/bread-butter-20260917-batch.test.ts",
  "packages/game-domain/tests/early-levels-20260913-batch.test.ts",
  "packages/game-domain/tests/patient-supply.test.ts",
  "packages/game-domain/tests/surgery-center-batch.test.ts",
  "packages/game-domain/tests/diagnostics/patient-supply.test.ts"
)) {
  Copy-RepositoryFile -RelativePath $relativePath -DestinationRoot $acceptedAfter
  Copy-RepositoryFile -RelativePath $relativePath -DestinationRoot (Join-Path $packageRoot "milestones/07-fixture-integration-after")
}

foreach ($relativePath in @(
  "docs/execplans/clinic-income-service-catalog.md",
  "docs/execplans/clinic-income-service-visitors.md",
  "docs/handoffs/GS-021_CLINIC_INCOME.md"
)) {
  Copy-RepositoryFile -RelativePath $relativePath -DestinationRoot $acceptedAfter
}

$screenshots = @(
  "artifacts/screenshots/gs-021-manual-founder-popup.png",
  "artifacts/screenshots/gs-021-automation-np-popup.png",
  "artifacts/screenshots/gs-021-m4a-management-services-income.png",
  "artifacts/screenshots/gs-021-m4a-service-visitor.png",
  "artifacts/screenshots/gs-021-m4b-management-retail-receipt.png",
  "artifacts/screenshots/gs-021-m4b-management-retail.png",
  "artifacts/screenshots/gs-021-m4b-retail-popup.png"
)
foreach ($relativePath in $screenshots) {
  Copy-RepositoryFile -RelativePath $relativePath -DestinationRoot (Join-Path $packageRoot "evidence")
}

Copy-Item -LiteralPath $m4aManifest -Destination (Join-Path $packageRoot "provenance/m4a-accepted-manifest.txt")
Copy-Item -LiteralPath (Join-Path $localDev "gs-021-m3-current/hashes.json") -Destination (Join-Path $packageRoot "provenance/m3-accepted-hashes.json")
Copy-Item -LiteralPath (Join-Path $localDev "gs-021-m4b-current/hashes.json") -Destination (Join-Path $packageRoot "provenance/m4b-accepted-hashes.json")
Copy-Item -LiteralPath (Join-Path $localDev "gs-021-m3-current/staff-addendum.patch") -Destination (Join-Path $packageRoot "provenance/m3-staff-addendum.patch")

$acceptedFiles = Get-ChildItem -LiteralPath $acceptedAfter -Recurse -File
$liveComparison = foreach ($file in $acceptedFiles) {
  $relative = $file.FullName.Substring($acceptedAfter.Length + 1).Replace("\", "/")
  $livePath = Join-Path $RepositoryRoot $relative
  $acceptedHash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
  $liveHash = if (Test-Path -LiteralPath $livePath -PathType Leaf) {
    (Get-FileHash -LiteralPath $livePath -Algorithm SHA256).Hash.ToLowerInvariant()
  } else {
    $null
  }
  [ordered]@{
    path = $relative
    acceptedSha256 = $acceptedHash
    liveSha256 = $liveHash
    liveMatchesAccepted = ($acceptedHash -eq $liveHash)
  }
}
$liveComparison | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $packageRoot "provenance/live-comparison.json") -Encoding utf8

$manifestInputs = Get-ChildItem -LiteralPath $packageRoot -Recurse -File |
  Where-Object { $_.Name -ne "manifest.json" } |
  Sort-Object FullName
$manifestFiles = foreach ($file in $manifestInputs) {
  [ordered]@{
    path = $file.FullName.Substring($packageRoot.Length + 1).Replace("\", "/")
    bytes = $file.Length
    sha256 = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
  }
}
$manifest = [ordered]@{
  schemaVersion = 1
  task = "GS-021"
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  sourceRepositoryHead = (& "C:\Program Files\Git\cmd\git.exe" -C $RepositoryRoot rev-parse HEAD).Trim()
  acceptedAfterFileCount = $acceptedFiles.Count
  screenshotCount = $screenshots.Count
  packageFiles = $manifestFiles
}
$manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $packageRoot "manifest.json") -Encoding utf8

Write-Host "Built GS-021 package at $packageRoot"
Write-Host "Accepted after files: $($acceptedFiles.Count)"
Write-Host "Synthetic screenshots: $($screenshots.Count)"
