$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$n1r3SvgDir = Join-Path (Get-Location) 'tools/question-new-n1-round3/constructed-svg'
$n1r3AssetDir = Join-Path (Get-Location) 'apps/player/public/clinical-exhibits'
[System.IO.Directory]::CreateDirectory($n1r3SvgDir) | Out-Null
$n1r3Bitmap = [System.Drawing.Bitmap]::new(1200,720)
$script:n1r3Graphics = [System.Drawing.Graphics]::FromImage($n1r3Bitmap)
$script:n1r3Graphics.Clear([System.Drawing.Color]::White)
$script:n1r3Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$script:n1r3Graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$script:n1r3Svg = [System.Text.StringBuilder]::new()
[void]$script:n1r3Svg.AppendLine('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">')
function N1r3Text([string]$value,[float]$x,[float]$y,[float]$size=25,[bool]$bold=$false) {
  $style=if($bold){[System.Drawing.FontStyle]::Bold}else{[System.Drawing.FontStyle]::Regular}
  $font=[System.Drawing.Font]::new('Arial',$size,$style,[System.Drawing.GraphicsUnit]::Pixel)
  $brush=[System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#17334B'))
  $script:n1r3Graphics.DrawString($value,$font,$brush,$x,$y)
  $weight=if($bold){'bold'}else{'normal'};$escaped=[System.Security.SecurityElement]::Escape($value)
  [void]$script:n1r3Svg.AppendLine("<text x='$x' y='$($y+$size)' font-size='$size' font-family='Arial' font-weight='$weight' fill='#17334B'>$escaped</text>")
  $font.Dispose();$brush.Dispose()
}
function N1r3Line([float]$x1,[float]$y1,[float]$x2,[float]$y2,[string]$color='#2C6A82',[float]$width=4) {
  $pen=[System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($color),$width)
  $script:n1r3Graphics.DrawLine($pen,$x1,$y1,$x2,$y2);$pen.Dispose()
  [void]$script:n1r3Svg.AppendLine("<line x1='$x1' y1='$y1' x2='$x2' y2='$y2' stroke='$color' stroke-width='$width'/>")
}
N1r3Text 'Common-femoral venous flow during respiration' 45 25 32 $true
N1r3Text 'Original constructed traces; no clinical velocity or time scale' 45 77 23
N1r3Text 'Left leg' 45 158 28 $true
N1r3Text 'Right leg' 45 341 28 $true
foreach($baseY in @(250,435)) {
  N1r3Line 230 $baseY 1135 $baseY '#B9CCD8' 2
  N1r3Line 230 ($baseY-90) 230 $baseY '#B9CCD8' 2
}
$oldX=230.0;$oldLeftY=194.0;$oldRightY=383.0
for($i=1;$i -le 200;$i++) {
  $x=230.0+4.5*$i
  $leftY=194.0+2.8*[Math]::Sin($i*[Math]::PI/25.0)
  $rightY=383.0-34.0*[Math]::Sin($i*[Math]::PI/25.0)
  N1r3Line $oldX $oldLeftY $x $leftY '#216B86' 4
  N1r3Line $oldX $oldRightY $x $rightY '#216B86' 4
  $oldX=$x;$oldLeftY=$leftY;$oldRightY=$rightY
}
N1r3Text 'Recorded compression:' 45 505 26 $true
N1r3Text 'Left common femoral, femoral and popliteal veins compress fully.' 45 550 25
N1r3Text 'Earlier baseline: skin thickening and heaviness, without new thigh pain.' 45 607 23
N1r3Text 'Fictional teaching record - not a patient Doppler acquisition' 45 670 21
[void]$script:n1r3Svg.AppendLine('</svg>')
[System.IO.File]::WriteAllText((Join-Path $n1r3SvgDir 'venous-flow.svg'),$script:n1r3Svg.ToString(),[System.Text.UTF8Encoding]::new($false))
$n1r3Bitmap.Save((Join-Path $n1r3AssetDir 'question-new-n1-r3-venous-flow.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$script:n1r3Graphics.Dispose();$n1r3Bitmap.Dispose()
