param([switch]$Check)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
# Original scientific schematic from project-authored qualitative observations.
# No source figure, measured patient tracing or clinical numeric cutoff is copied.
$assetPath=Join-Path (Get-Location) 'apps/player/public/clinical-exhibits/batch2a-r3-b04-pressure.png'
$bitmap=New-Object System.Drawing.Bitmap 760,1220
$graphics=[System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.Color]::White)
$font=New-Object System.Drawing.Font 'Segoe UI',21
$small=New-Object System.Drawing.Font 'Segoe UI',17
$bold=New-Object System.Drawing.Font 'Segoe UI',24,([System.Drawing.FontStyle]::Bold)
$ink=[System.Drawing.Brushes]::MidnightBlue
$trace=New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(28,77,136)),3
$axis=New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(180,190,205)),1
$marker=New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(100,110,125)),2
$marker.DashStyle=[System.Drawing.Drawing2D.DashStyle]::Dash
$barBrush=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(73,118,171))
$bandBrush=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(231,237,244))
function Text([string]$s,[float]$x,[float]$y,[string]$size='normal'){
 $chosen=$font;if($size -eq 'small'){$chosen=$small};if($size -eq 'bold'){$chosen=$bold}
 $graphics.DrawString($s,$chosen,$ink,$x,$y)
}
function Baseline([float]$y){$graphics.DrawLine($axis,170,$y,714,$y)}
function Peak([float]$y,[float]$centre,[float]$height,[float]$width){
 $points=New-Object 'System.Collections.Generic.List[System.Drawing.PointF]'
 for($x=170;$x -le 714;$x+=2){$z=$y-$height*[Math]::Exp(-[Math]::Pow(($x-$centre)/$width,2));$points.Add([System.Drawing.PointF]::new($x,$z))}
 $graphics.DrawLines($trace,$points.ToArray())
}
try{
 Text 'Constructed pressure study' 24 16 'bold'
 Text 'A. Ordinary water swallow' 24 78
 $channels=@('Upper','Middle','Lower')
 for($i=0;$i -lt 3;$i++){$y=163+58*$i;Text $channels[$i] 24 ($y-17) 'small';Baseline $y;Peak $y (330+86*$i) 32 29}
 Text 'B. Clustered water swallows' 24 325
 Text 'Water events' 191 365 'small';Text 'Following response' 454 365 'small'
 foreach($pair in @(@(450,'Repeat 1'),@(545,'Repeat 2'))){
  $y=[float]$pair[0];Text ([string]$pair[1]) 24 ($y-17) 'small';Baseline $y
  foreach($x in @(224,267,310,353)){$graphics.DrawLine($marker,$x,$y-42,$x,$y+9)}
  Peak $y 543 52 12
 }
 Text 'C. DCI: software integration' 24 611
 foreach($row in @(@('Baseline',687,340),@('Repeat 1',751,235),@('Repeat 2',815,210))){
  $y=[float]$row[1];Text ([string]$row[0]) 24 ($y-17) 'small'
  $graphics.DrawLine($axis,190,$y+16,703,$y+16)
  $graphics.FillRectangle($barBrush,190,$y-9,[float]$row[2],25)
 }
 Text 'Common integration scale' 190 856 'small'
 Text 'D. Liquid-load recording' 24 922
 Text 'Body' 24 991 'small';Baseline 1011
 $graphics.DrawLine($trace,170,1011,714,1011)
 Text 'Junction' 24 1090 'small'
 $graphics.FillRectangle($bandBrush,170,1089,544,43)
 $graphics.DrawLine($trace,170,1110,714,1110)
 Text 'Laboratory reference band' 322 1147 'small'
 $stream=New-Object System.IO.MemoryStream
 try{
  $bitmap.Save($stream,[System.Drawing.Imaging.ImageFormat]::Png);$bytes=$stream.ToArray()
  if($Check){if(-not(Test-Path -LiteralPath $assetPath)){throw 'Missing round-three image'};if([Convert]::ToBase64String([System.IO.File]::ReadAllBytes($assetPath)) -ne [Convert]::ToBase64String($bytes)){throw 'Round-three image differs'}}
  else{[System.IO.File]::WriteAllBytes($assetPath,$bytes)}
  Write-Output ('batch2a-r3-b04-pressure.png '+$bytes.Length+' bytes, 760x1220')
 }finally{$stream.Dispose()}
}finally{
 foreach($resource in @($graphics,$bitmap,$font,$small,$bold,$trace,$axis,$marker,$barBrush,$bandBrush)){$resource.Dispose()}
}
