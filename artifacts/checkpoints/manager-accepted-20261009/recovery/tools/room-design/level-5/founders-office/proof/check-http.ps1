# Read-only requests to the manager's existing isolated proof server.
$ErrorActionPreference = 'Stop'
$proofUrl = [Uri]'http://127.0.0.1:4191/tools/room-design/level-5/founders-office/proof/index.html'
$prepared = Get-Content -Encoding UTF8 -Raw (Join-Path $PSScriptRoot '../assets/processed/v2/metadata.json') | ConvertFrom-Json
$resources = @('index.html','lab.js','geometry.mjs','room-touchups.mjs','design-rooms.js','data.json','proof-manifest.json','asset-contract.json','extension.js')
$resources += @($prepared.assets.PSObject.Properties | ForEach-Object { $_.Value.file })
$resources += @('../../../../../apps/player/public/art/characters/gs026-stills-v1/founder.01/sit-south.png','../../../../../apps/player/public/art/characters/gs026-stills-v1/patient.adult.007/sit-north.png')
$receipts = @()
foreach ($relative in $resources) {
    $resourceUrl = [Uri]::new($proofUrl, $relative)
    $response = Invoke-WebRequest -Uri $resourceUrl.AbsoluteUri -UseBasicParsing
    if ($response.StatusCode -ne 200) { throw "HTTP status $($response.StatusCode): $resourceUrl" }
    $receipts += [PSCustomObject]@{ url=$resourceUrl.AbsoluteUri; status=[int]$response.StatusCode; bytes=$response.RawContentLength }
}
$report = [PSCustomObject]@{ status='PASS'; url=$proofUrl.AbsoluteUri; origin=$proofUrl.GetLeftPart([UriPartial]::Authority); resources=$receipts; method='PowerShell read-only HTTP checks; no browser run or server change' }
$reportPath = Join-Path $PSScriptRoot 'evidence/v2/http-validation-report.json'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($reportPath, (($report | ConvertTo-Json -Depth 5) + "`n"), $utf8NoBom)
Write-Output "HTTP VALIDATION PASS: $($receipts.Count) current proof resources return 200 at http://127.0.0.1:4191; existing server unchanged."
