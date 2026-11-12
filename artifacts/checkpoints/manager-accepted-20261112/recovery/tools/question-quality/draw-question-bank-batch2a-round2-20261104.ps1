param([switch]$Check)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
# Original qualitative teaching schematics. No source figure, measured tracing,
# diagnostic cutoff, time scale or patient data is reproduced.
$questionBankAssetDirectory=Join-Path (Get-Location) 'apps/player/public/clinical-exhibits'
if (-not (Test-Path -LiteralPath $questionBankAssetDirectory)) {
  New-Item -ItemType Directory -Path $questionBankAssetDirectory | Out-Null
}
function New-Canvas {
  $script:bitmap=New-Object System.Drawing.Bitmap 1200,720
  $script:graphics=[System.Drawing.Graphics]::FromImage($script:bitmap)
  $script:graphics.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $script:graphics.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $script:graphics.Clear([System.Drawing.Color]::White)
  $script:font=New-Object System.Drawing.Font 'Segoe UI',17
  $script:small=New-Object System.Drawing.Font 'Segoe UI',13
  $script:bold=New-Object System.Drawing.Font 'Segoe UI',21,([System.Drawing.FontStyle]::Bold)
  $script:ink=[System.Drawing.Brushes]::MidnightBlue
  $script:tracePen=New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(30,76,132)),3
  $script:grayPen=New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(190,198,208)),1
  $script:dashPen=New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(120,130,145)),2
  $script:dashPen.DashStyle=[System.Drawing.Drawing2D.DashStyle]::Dash
}
function Label([string]$s,[float]$x,[float]$y,[string]$size='normal') {
  $f=$script:font
  if ($size -eq 'small') {$f=$script:small}
  if ($size -eq 'bold') {$f=$script:bold}
  $script:graphics.DrawString($s,$f,$script:ink,$x,$y)
}
function Line([float]$x1,[float]$y1,[float]$x2,[float]$y2,[bool]$dashed=$false) {
  $p=$script:grayPen
  if ($dashed) {$p=$script:dashPen}
  $script:graphics.DrawLine($p,$x1,$y1,$x2,$y2)
}
function Wave([float]$x0,[float]$x1,[float]$baseline,[float[]]$centres,[float]$height=50,[float]$width=20) {
  $points=New-Object 'System.Collections.Generic.List[System.Drawing.PointF]'
  for($x=$x0;$x -le $x1;$x+=2){
    $y=$baseline
    foreach($centre in $centres){$y-=$height*[Math]::Exp(-[Math]::Pow(($x-$centre)/$width,2))}
    $points.Add([System.Drawing.PointF]::new($x,$y))
  }
  $script:graphics.DrawLines($script:tracePen,$points.ToArray())
}
function Save-Canvas([string]$name) {
  $target=Join-Path $questionBankAssetDirectory $name
  $stream=New-Object System.IO.MemoryStream
  try {
    $script:bitmap.Save($stream,[System.Drawing.Imaging.ImageFormat]::Png)
    $bytes=$stream.ToArray()
    if($Check){
      if(-not(Test-Path -LiteralPath $target)){throw "Missing image $target"}
      if([Convert]::ToBase64String([System.IO.File]::ReadAllBytes($target)) -ne [Convert]::ToBase64String($bytes)){throw "Image differs: $target"}
    }else{[System.IO.File]::WriteAllBytes($target,$bytes)}
    Write-Output ($name+' '+$bytes.Length+' bytes')
  }finally{
    $stream.Dispose();$script:graphics.Dispose();$script:bitmap.Dispose()
    foreach($r in @($script:font,$script:small,$script:bold,$script:tracePen,$script:grayPen,$script:dashPen)){$r.Dispose()}
  }
}

New-Canvas
Label 'Constructed challenge recordings' 34 18 'bold'
Label 'A. Separated baseline swallow' 34 66
$base=@('Upper','Middle','Lower')
for($i=0;$i -lt 3;$i++){
  $y=135+44*$i;Label $base[$i] 34 ($y-15) 'small';Line 165 $y 1130 $y
  Wave 165 1130 $y @(430+100*$i) 30 27
}
Label 'B. Rapid-swallow repeats' 34 281
Label 'During sequence' 176 323 'small';Label 'After sequence' 407 323 'small'
foreach($y in @(413,533)){
  Line 165 $y 575 $y
  Line 405 ($y-42) 565 ($y-42) $true
  $points=@([System.Drawing.PointF]::new(165,$y-12),[System.Drawing.PointF]::new(205,$y-12),[System.Drawing.PointF]::new(225,$y),[System.Drawing.PointF]::new(365,$y),[System.Drawing.PointF]::new(385,$y-12))
  $script:graphics.DrawLines($script:tracePen,$points)
  Wave 385 575 ($y-12) @(472) 17 23
  foreach($x in @(230,280,330)){Line $x ($y-40) $x ($y+5) $true}
}
Label 'Repeat 1' 34 388 'small';Label 'Repeat 2' 34 508 'small'
Label 'Dashed: illustrative baseline height' 160 572 'small'
Label 'C. Rapid drinking' 662 281
Label 'Body' 662 371 'small';Label 'Junction' 662 468 'small'
Line 770 400 1128 400
Wave 770 1128 398 @() 0 20
$script:graphics.DrawLines($script:tracePen,@([System.Drawing.PointF]::new(770,458),[System.Drawing.PointF]::new(810,458),[System.Drawing.PointF]::new(830,501),[System.Drawing.PointF]::new(1065,501),[System.Drawing.PointF]::new(1090,458),[System.Drawing.PointF]::new(1128,458)))
Label 'Relaxation within laboratory range' 665 540 'small'
Label 'Discomfort during drinking' 665 574 'small'
Label 'Pressure increases upwards; time runs left to right.' 34 596 'small'
Label 'Software integral: recovery below baseline in both repeats.' 34 628 'small'
Label 'Qualitative traces; reserve is not measured from peak height in this drawing.' 34 657 'small'
Save-Canvas 'batch2a-r2-b04-pressure.png'
