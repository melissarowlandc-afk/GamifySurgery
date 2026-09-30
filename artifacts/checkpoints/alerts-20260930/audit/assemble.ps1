param(
  [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot "../../../.."))
)

$ErrorActionPreference = "Stop"
$archiveRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

$exactFiles = @(
  "packages/balance-config/src/prototype-alerts.ts",
  "packages/game-domain/src/alert-cadence.ts",
  "packages/game-domain/src/departure-risk-alerts.ts",
  "packages/game-domain/src/facility-alert-conditions.ts",
  "packages/game-domain/tests/advertising-insolvency.test.ts",
  "packages/game-domain/tests/alert-cadence.test.ts",
  "packages/game-domain/tests/alert-humor.test.ts",
  "packages/game-domain/tests/departure-risk-alerts.test.ts",
  "packages/game-domain/tests/facility-alert-conditions.test.ts",
  "packages/game-domain/tests/patient-alert-delay.test.ts",
  "apps/player/src/session/alertViewModels.ts",
  "apps/player/src/session/alertViewModels.test.ts",
  "apps/player/src/session/prototypeAlertContent.test.ts",
  "apps/player/src/ui/EventMessageBoard.tsx",
  "apps/player/src/ui/EventMessageBoard.test.tsx",
  "tests/e2e/alert-humor.spec.ts",
  "tests/e2e/event-message-board-lifecycle.spec.ts",
  "docs/execplans/alerts-usefulness-and-humor.md",
  "docs/features/alert-notification-flavor-system.md",
  "docs/project-management/task-briefs/ALERTS_AND_EVENTS_FOLLOWUP.md"
)

foreach ($relativePath in $exactFiles) {
  $source = Join-Path $RepositoryRoot $relativePath
  if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
    throw "Missing checkpoint source: $relativePath"
  }
  $destination = Join-Path $archiveRoot (Join-Path "files" $relativePath)
  $destinationDirectory = Split-Path -Parent $destination
  New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null
  Copy-Item -LiteralPath $source -Destination $destination -Force
}

function Get-FunctionBlock {
  param([string]$Path, [string]$FunctionName)
  $lines = Get-Content -LiteralPath $Path
  $start = -1
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match ("^(?:export\s+)?function\s+" + [regex]::Escape($FunctionName) + "\b")) { $start = $i; break }
  }
  if ($start -lt 0) { throw "Function not found: $FunctionName in $Path" }
  $depth = 0
  $opened = $false
  $result = [System.Collections.Generic.List[string]]::new()
  for ($i = $start; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    $result.Add($line)
    $opens = ([regex]::Matches($line, "\{")).Count
    $closes = ([regex]::Matches($line, "\}")).Count
    if ($opens -gt 0) { $opened = $true }
    $depth += $opens - $closes
    if ($opened -and $depth -eq 0) { break }
  }
  return $result
}

function Get-MatchContexts {
  param([string]$Path, [string]$Pattern, [int]$Before = 5, [int]$After = 8)
  $lines = Get-Content -LiteralPath $Path
  $ranges = [System.Collections.Generic.List[object]]::new()
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match $Pattern) {
      $ranges.Add(@([Math]::Max(0, $i - $Before), [Math]::Min($lines.Count - 1, $i + $After)))
    }
  }
  $output = [System.Collections.Generic.List[string]]::new()
  $lastEnd = -2
  foreach ($range in $ranges) {
    $start = [int]$range[0]
    $end = [int]$range[1]
    if ($start -le $lastEnd + 1) {
      for ($j = $lastEnd + 1; $j -le $end; $j++) { $output.Add($lines[$j]) }
    } else {
      if ($output.Count -gt 0) { $output.Add("// --- next exact context ---") }
      $output.Add("// Source lines $($start + 1)-$($end + 1)")
      for ($j = $start; $j -le $end; $j++) { $output.Add($lines[$j]) }
    }
    $lastEnd = [Math]::Max($lastEnd, $end)
  }
  return $output
}

function Get-BetweenMarkers {
  param([string]$Path, [string]$StartPattern, [string]$EndPattern)
  $lines = Get-Content -LiteralPath $Path
  $start = -1
  $end = -1
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($start -lt 0 -and $lines[$i] -match $StartPattern) { $start = $i; continue }
    if ($start -ge 0 -and $lines[$i] -match $EndPattern) { $end = $i - 1; break }
  }
  if ($start -lt 0 -or $end -lt $start) { throw "Markers not found in $Path" }
  return $lines[$start..$end]
}

$domainReducer = Join-Path $RepositoryRoot "packages/game-domain/src/reducer.ts"
$domainPersistence = Join-Path $RepositoryRoot "packages/game-domain/src/persistence.ts"
$domainTypes = Join-Path $RepositoryRoot "packages/game-domain/src/types.ts"
$domainIndex = Join-Path $RepositoryRoot "packages/game-domain/src/index.ts"
$playerSession = Join-Path $RepositoryRoot "apps/player/src/session/usePrototypeSession.ts"
$slicePath = Join-Path $archiveRoot "recovery/current-shared-code-slices.md"
$sliceLines = [System.Collections.Generic.List[string]]::new()
@(
  "# Exact current code slices for mixed shared files", "",
  "These verbatim slices preserve implementation that cannot be copied as whole files.",
  "Source-line comments are discovery aids; use named symbols/selectors as anchors.", ""
) | ForEach-Object { $sliceLines.Add($_) }
$fence = ([string][char]96) * 3

function Add-CodeSection {
  param([string]$Title, [string]$Language, [string[]]$Lines)
  $sliceLines.Add("## $Title"); $sliceLines.Add(""); $sliceLines.Add($fence + $Language)
  foreach ($line in $Lines) { $sliceLines.Add($line) }
  $sliceLines.Add($fence); $sliceLines.Add("")
}

Add-CodeSection "Domain exports" "ts" @(
  Get-Content -LiteralPath $domainIndex | Where-Object { $_ -match 'export \* from "\./(alert-cadence|departure-risk-alerts)"' }
)
Add-CodeSection "Domain type additions with insertion context" "ts" @(
  Get-MatchContexts $domainTypes 'departureRiskWarningAtTick|staff_departure_risk' 5 5
)
Add-CodeSection "Persistence: durable alert recovery" "ts" @(
  (Get-Content -LiteralPath $domainPersistence | Select-Object -First 12 | Where-Object { $_ -match 'departure-risk-alerts' })
  ""
  (Get-FunctionBlock $domainPersistence "normalizeAlertHumorState")
  ""
  (Get-MatchContexts $domainPersistence 'departureRiskWarningAtTick|alert\.patient\.departure-risk' 7 10)
)
Add-CodeSection "Reducer: departure-risk helpers" "ts" @(
  'import { operatingDayMinutes } from "./alert-cadence";'
  'import {'
  '  employeeDepartureRiskCadenceGroup,'
  '  employeeDepartureRiskWarningIsDue,'
  '  patientDepartureRiskIsActive,'
  '} from "./departure-risk-alerts";'
  ""
  (Get-FunctionBlock $domainReducer "maybeEmitPatientDepartureRiskWarning")
  ""
  (Get-FunctionBlock $domainReducer "maybeEmitEmployeeDepartureRiskWarnings")
)
Add-CodeSection "Reducer: encounter initialization and emission call sites" "ts" @(
  (Get-MatchContexts $domainReducer 'departureRiskWarningAtTick: null' 3 3)
  ""
  (Get-MatchContexts $domainReducer '^\s{4,}maybeEmit(?:PatientDepartureRiskWarning|EmployeeDepartureRiskWarnings)\(' 2 2)
)
Add-CodeSection "Reducer: complete ambient cadence owner" "ts" @(
  Get-FunctionBlock $domainReducer "maybeEmitAmbientMessage"
)
Add-CodeSection "Reducer: complete satisfaction-celebration owner" "ts" @(
  Get-FunctionBlock $domainReducer "settleEncounter"
)
Add-CodeSection "Player session: filtered system notices" "ts" @(
  (Get-Content -LiteralPath $playerSession | Select-Object -First 6)
  ""
  (Get-FunctionBlock $playerSession "shouldStoreSystemNotice")
  ""
  (Get-BetweenMarkers $playerSession '^  const \[systemNotices' '^  const \[questionReviewFlags')
  ""
  (Get-BetweenMarkers $playerSession '^  const publishSystemNotice' '^  const cancelScheduledAutosave')
  ""
  (Get-MatchContexts $playerSession 'systemNotices: systemNotices\.filter' 0 2)
)
$sliceLines | Set-Content -LiteralPath $slicePath -Encoding utf8

$cssBaseline = Join-Path $RepositoryRoot ".local-dev/alerts-enhancement-m5-baseline/apps/player/src/styles/global.css"
$cssCurrent = Join-Path $RepositoryRoot "apps/player/src/styles/global.css"
$cssTemporary = Join-Path $archiveRoot "audit/.global-css-alerts.tmp"
$cssPatchPath = Join-Path $archiveRoot "recovery/global-css-alerts.patch"
$cssText = [IO.File]::ReadAllText($cssCurrent)
$cssText = [regex]::Replace(
  $cssText,
  '(?m)^\.employee-discussion-(?:body|tab)[^\r\n]*(?:\r?\n|$)',
  ''
)
[IO.File]::WriteAllText($cssTemporary, $cssText, [Text.UTF8Encoding]::new($false))
$cssDiff = (& git -C $RepositoryRoot diff --no-index --unified=3 -- $cssBaseline $cssTemporary 2>&1) -join [Environment]::NewLine
if ($LASTEXITCODE -ne 1) { throw "Expected CSS diff exit code 1, got $LASTEXITCODE" }
$cssDiff = [regex]::Replace($cssDiff, '(?m)^diff --git .+$', 'diff --git a/apps/player/src/styles/global.css b/apps/player/src/styles/global.css')
$cssDiff = [regex]::Replace($cssDiff, '(?m)^--- .+$', '--- a/apps/player/src/styles/global.css')
$cssDiff = [regex]::Replace($cssDiff, '(?m)^\+\+\+ .+$', '+++ b/apps/player/src/styles/global.css')
$cssDiff | Set-Content -LiteralPath $cssPatchPath -Encoding utf8
Remove-Item -LiteralPath $cssTemporary -Force

$entries = Get-ChildItem -LiteralPath $archiveRoot -Recurse -File |
  Where-Object { $_.Name -ne "manifest.json" } |
  Sort-Object FullName |
  ForEach-Object {
    $archivePath = $_.FullName.Substring($archiveRoot.Path.Length + 1).Replace("\", "/")
    $originalPath = if ($archivePath.StartsWith("files/")) {
      $archivePath.Substring(6)
    } else {
      $null
    }
    [pscustomobject][ordered]@{
      archivePath = $archivePath
      originalPath = $originalPath
      category = if ($archivePath.StartsWith("files/")) { "exact-task-file" } elseif ($archivePath.StartsWith("recovery/")) { "recovery" } elseif ($archivePath.StartsWith("audit/")) { "audit" } else { "checkpoint-metadata" }
      bytes = $_.Length
      sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
    }
  }

$manifest = [ordered]@{
  schemaVersion = 1
  checkpoint = "alerts-20260930"
  sourceBranch = "beta"
  sourceHead = (git -C $RepositoryRoot rev-parse HEAD).Trim()
  generatedAt = "2026-09-30"
  recoveryOnly = $true
  payloadCount = @($entries).Count
  payloadBytes = (@($entries) | Measure-Object -Property bytes -Sum).Sum
  payloads = @($entries)
}
$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $archiveRoot "manifest.json") -Encoding utf8

