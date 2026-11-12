$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$assetDir = Join-Path (Get-Location) 'apps/player/public/clinical-exhibits'
$svgDir = Join-Path (Get-Location) 'tools/question-new-n2-round2/constructed-svg'
[System.IO.Directory]::CreateDirectory($assetDir) | Out-Null
[System.IO.Directory]::CreateDirectory($svgDir) | Out-Null
$script:svg = $null
$script:gfx = $null
function ColorOf([string]$hex) { return [System.Drawing.ColorTranslator]::FromHtml($hex) }
function Line([float]$x1,[float]$y1,[float]$x2,[float]$y2,[string]$color='#31475E',[float]$width=4) {
  $pen = [System.Drawing.Pen]::new((ColorOf $color),$width)
  $script:gfx.DrawLine($pen,$x1,$y1,$x2,$y2); $pen.Dispose()
  [void]$script:svg.AppendLine("<line x1='$x1' y1='$y1' x2='$x2' y2='$y2' stroke='$color' stroke-width='$width'/>")
}
function Box([float]$x,[float]$y,[float]$w,[float]$h,[string]$fill='#EAF2F8',[string]$stroke='#31475E') {
  $brush=[System.Drawing.SolidBrush]::new((ColorOf $fill));$pen=[System.Drawing.Pen]::new((ColorOf $stroke),3)
  $script:gfx.FillRectangle($brush,$x,$y,$w,$h);$script:gfx.DrawRectangle($pen,$x,$y,$w,$h);$brush.Dispose();$pen.Dispose()
  [void]$script:svg.AppendLine("<rect x='$x' y='$y' width='$w' height='$h' fill='$fill' stroke='$stroke' stroke-width='3'/>")
}
function Oval([float]$x,[float]$y,[float]$w,[float]$h,[string]$fill='#FFFFFF',[string]$stroke='#31475E') {
  $brush=[System.Drawing.SolidBrush]::new((ColorOf $fill));$pen=[System.Drawing.Pen]::new((ColorOf $stroke),3)
  $script:gfx.FillEllipse($brush,$x,$y,$w,$h);$script:gfx.DrawEllipse($pen,$x,$y,$w,$h);$brush.Dispose();$pen.Dispose()
  $cx=$x+$w/2;$cy=$y+$h/2;$rx=$w/2;$ry=$h/2
  [void]$script:svg.AppendLine("<ellipse cx='$cx' cy='$cy' rx='$rx' ry='$ry' fill='$fill' stroke='$stroke' stroke-width='3'/>")
}
function Label([string]$text,[float]$x,[float]$y,[float]$size=23,[string]$color='#18324B',[bool]$bold=$false) {
  $style=if($bold){[System.Drawing.FontStyle]::Bold}else{[System.Drawing.FontStyle]::Regular}
  $font=[System.Drawing.Font]::new('Arial',$size,$style,[System.Drawing.GraphicsUnit]::Pixel)
  $brush=[System.Drawing.SolidBrush]::new((ColorOf $color));$script:gfx.DrawString($text,$font,$brush,$x,$y)
  $font.Dispose();$brush.Dispose();$escaped=[System.Security.SecurityElement]::Escape($text)
  $baseline=$y+$size;$weight=if($bold){'bold'}else{'normal'}
  [void]$script:svg.AppendLine("<text x='$x' y='$baseline' font-family='Arial,sans-serif' font-size='$size' font-weight='$weight' fill='$color'>$escaped</text>")
}
function MarkX([float]$x,[float]$y) { Line ($x-11) ($y-11) ($x+11) ($y+11) '#B14C00' 6;Line ($x+11) ($y-11) ($x-11) ($y+11) '#B14C00' 6 }
function MakeDiagram([string]$slug,[scriptblock]$draw) {
  $bmp=[System.Drawing.Bitmap]::new(1200,720)
  $script:gfx=[System.Drawing.Graphics]::FromImage($bmp)
  $script:gfx.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $script:gfx.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $script:gfx.Clear([System.Drawing.Color]::White)
  $script:svg=[System.Text.StringBuilder]::new()
  [void]$script:svg.AppendLine("<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='720' viewBox='0 0 1200 720'><rect width='1200' height='720' fill='white'/>")
  & $draw
  Label 'Original constructed teaching schematic - not a patient image' 40 675 19 '#526575'
  [void]$script:svg.AppendLine('</svg>')
  $png=Join-Path $assetDir "question-new-n2-r2-$slug.png"
  $bmp.Save($png,[System.Drawing.Imaging.ImageFormat]::Png)
  [System.IO.File]::WriteAllText((Join-Path $svgDir "$slug.svg"),$script:svg.ToString())
  $script:gfx.Dispose();$bmp.Dispose()
  Write-Output $png
}
MakeDiagram 'ducts' {
  Label 'Two studies after cholecystectomy' 40 28 32 '#18324B' $true
  Box 35 105 550 500 '#F7FAFC';Box 615 105 550 500 '#F7FAFC'
  Label 'A. Endoscopic duct injection' 55 123 27 '#18324B' $true
  Label 'B. Noncontrast MR map' 635 123 27 '#18324B' $true
  Line 310 530 310 340 '#375D8C' 18
  Line 310 340 170 235 '#375D8C' 15;Line 310 340 420 235 '#375D8C' 15
  Line 170 235 120 185 '#375D8C' 11;Line 420 235 475 185 '#375D8C' 11
  Oval 230 525 160 47 '#E6E8ED';Label 'Duodenum' 247 532 23
  Label 'Injected contrast' 60 390 22 '#375D8C';Line 240 410 295 410 '#375D8C' 3
  Label 'No visible escape' 60 440 22
  Label 'from filled channels' 60 468 22
  Label 'S branch not represented' 60 575 22
  Line 860 530 860 340 '#667887' 15
  Line 860 340 745 235 '#667887' 12;Line 860 340 955 235 '#667887' 12
  Line 745 235 700 185 '#667887' 9
  Line 1060 205 1000 305 '#A06D37' 11
  Line 1000 305 990 365 '#A06D37' 9
  Label 'Segment S' 1005 155 23 '#7D4E20'
  Oval 930 375 150 100 '#F3DFC3' '#A06D37';Label 'Collection' 943 408 22 '#7D4E20'
  Line 1020 472 1115 535 '#A06D37' 8;Label 'Drain' 1080 545 22 '#7D4E20'
  Label 'Junction not resolved' 650 575 22
  Line 880 295 965 312 '#526575' 2
  Label '?' 895 253 32 '#526575' $true
  Label 'Shaded blue channels contain injected contrast; other anatomy is not filled by that study.' 40 625 22
}
MakeDiagram 'coverage' {
  Label 'Anterior-shin debridement and marked coverage designs' 40 28 30 '#18324B' $true
  Label 'Source artery outside injury zone' 350 105 24 '#A95353'
  Line 100 165 1100 165 '#A95353' 11
  Box 455 260 290 300 '#AB6660' '#6E4240'
  Box 480 285 240 250 '#E6DDC8' '#856F4A'
  Label 'Central cortex' 505 350 24 '#5F5037'
  Label 'Periosteum removed' 488 395 21 '#5F5037'
  Label 'No punctate bleeding' 488 433 21 '#5F5037'
  Label 'Bleeding muscle rim' 455 585 24 '#6E4240'
  Box 70 300 300 210 '#EDF3F8';Label 'Design 1' 160 465 28 '#18324B' $true
  Box 830 300 300 210 '#EDF3F8';Label 'Design 2' 920 465 28 '#18324B' $true
  Line 220 165 220 225 '#A95353' 9;Line 220 260 220 402 '#A95353' 9
  MarkX 220 242;Label 'Prior ligature' 55 210 21 '#9F570C'
  Line 980 165 980 402 '#A95353' 9
  Label 'Vessel' 1010 210 21 '#A95353';Label 'continuous' 1010 239 21 '#A95353'
  Line 370 420 448 420 '#526575' 3;Line 830 420 752 420 '#526575' 3
  Label 'Both designs reach the central defect; both have uninjured skin.' 150 625 24
}
MakeDiagram 'vessels' {
  Label 'Recipient-vessel continuity after earlier neck surgery' 40 28 31 '#18324B' $true
  Label 'Arterial inflow' 65 150 26 '#A95353' $true
  Line 90 240 550 240 '#A95353' 14;Line 620 240 1100 240 '#A95353' 14
  Line 120 218 155 240 '#A95353' 5;Line 120 262 155 240 '#A95353' 5
  MarkX 585 240;Label 'Prior ligature' 508 177 23 '#9F570C'
  Label 'A1' 335 287 28 '#18324B' $true;Label 'A2' 830 287 28 '#18324B' $true
  Label 'Vein' 65 360 26 '#375D8C' $true
  Line 90 440 550 440 '#375D8C' 14;Line 620 440 1100 440 '#375D8C' 14
  MarkX 585 440;Label 'Prior ligature' 508 475 23 '#9F570C'
  Line 1045 418 1080 440 '#375D8C' 5;Line 1045 462 1080 440 '#375D8C' 5
  Label 'V1' 335 487 28 '#18324B' $true;Label 'V2' 830 487 28 '#18324B' $true
  Label 'Venous return' 910 360 26 '#375D8C' $true
  Box 375 555 450 65 '#F3F0E8';Label 'Transferred flap artery and vein' 409 575 25
  Label 'All marked ends have suitable caliber and reach. No proposed connections are drawn.' 65 635 22
}
