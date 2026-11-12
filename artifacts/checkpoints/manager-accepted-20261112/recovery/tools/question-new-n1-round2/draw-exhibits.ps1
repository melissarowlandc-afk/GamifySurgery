$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$assetDir = Join-Path (Get-Location) 'apps/player/public/clinical-exhibits'
$svgDir = Join-Path (Get-Location) 'tools/question-new-n1-round2/constructed-svg'
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
  $png=Join-Path $assetDir "question-new-n1-r2-$slug.png"
  $bmp.Save($png,[System.Drawing.Imaging.ImageFormat]::Png)
  [System.IO.File]::WriteAllText((Join-Path $svgDir "$slug.svg"),$script:svg.ToString())
  $script:gfx.Dispose();$bmp.Dispose()
  Write-Output $png
}
MakeDiagram 'groin' {
  Label 'Right groin - posterior orientation' 40 35 32 '#18324B' $true
  Label 'Medial' 110 125 24;Label 'Lateral' 990 125 24
  Line 250 550 1000 295 '#667F55' 10
  Label 'Inguinal ligament' 875 465 24 '#4D643C'
  Line 875 465 745 390 '#667F55' 2
  Line 805 415 805 620 '#377CAD' 12
  Line 840 415 840 620 '#A95353' 12
  Label 'Femoral vessels' 870 580 23
  Line 820 610 865 600 '#31475E' 2
  Line 805 415 650 170 '#A95353' 9
  Label 'Inferior epigastric vessels' 385 115 25
  Line 670 155 680 220 '#31475E' 2
  Oval 835 255 70 50 '#FFFFFF' '#31475E'
  Label 'Deep ring' 930 240 24
  Line 903 275 925 265 '#31475E' 2
  Line 850 288 425 505 '#CFAB69' 14
  Label 'Cord course' 330 560 23
  Line 455 550 515 465 '#31475E' 2
  MarkX 485 325
  Label 'X' 500 290 28 '#B14C00' $true
  Label 'Observed protrusion' 125 240 23
  Line 365 265 465 312 '#31475E' 2
  Label 'Pubic end' 125 600 23
  Label 'Iliac end' 1000 315 23
}
MakeDiagram 'meckel' {
  Label 'Operative small-bowel wall map' 40 35 32 '#18324B' $true
  Box 110 350 980 170 '#EEF5FA'
  Box 470 190 170 160 '#EEF5FA'
  Oval 470 130 170 125 '#EEF5FA'
  Box 473 230 164 125 '#EEF5FA' '#EEF5FA'
  Line 470 200 470 350 '#31475E' 3;Line 640 200 640 350 '#31475E' 3
  Line 430 350 680 350 '#C77A2A' 13
  Line 430 520 680 520 '#C77A2A' 13
  Line 470 282 470 350 '#C77A2A' 13;Line 640 282 640 350 '#C77A2A' 13
  Label 'Proximal ileum' 100 555 23;Label 'Distal ileum' 925 555 23
  Label 'Antimesenteric border' 100 285 23
  Line 320 318 330 345 '#31475E' 2
  Label 'Mesenteric border' 690 575 23
  Line 720 570 670 527 '#31475E' 2
  Label 'Diverticulum' 710 165 23
  Line 700 195 647 205 '#31475E' 2
  Label 'Orange: pale/disrupted wall recorded by surgeon' 105 615 23 '#9F570C'
  Label 'No proposed resection line is shown' 105 90 22 '#526575'
}
MakeDiagram 'thorax' {
  Label 'Thoracic localization - posterior orientation' 40 35 32 '#18324B' $true
  Label 'Patient left' 180 105 24;Label 'Patient right' 900 105 24
  Box 550 135 55 470 '#EEE6D9'
  Label 'Neck esophagus' 310 145 23
  Line 510 170 548 170 '#31475E' 2
  Box 845 165 45 240 '#E6EEF5'
  Label 'Superior vena cava' 900 170 22
  Line 890 200 915 200 '#31475E' 2
  Line 745 550 745 300 '#5B7FA0' 10
  Line 745 300 780 255 '#5B7FA0' 10
  Line 780 255 840 250 '#5B7FA0' 10
  Line 840 250 865 280 '#5B7FA0' 10
  Label 'Azygos arch' 920 295 23
  Line 910 320 812 265 '#31475E' 2
  MarkX 576 320;MarkX 795 254
  Label 'Contrast exits here' 245 260 23 '#9F570C'
  Line 450 295 560 317 '#B14C00' 2
  Label 'Venous wall injury' 865 380 23 '#9F570C'
  Line 875 370 808 270 '#B14C00' 2
  Line 570 332 490 390 '#258C92' 5
  Line 490 390 420 470 '#258C92' 5
  Line 420 470 370 535 '#258C92' 5
  Oval 280 515 175 75 '#DDF3F1' '#258C92'
  Label 'Dependent contrast pool' 65 470 22 '#256E73'
  Line 280 495 330 520 '#258C92' 2
  Label 'Diaphragmatic hiatus' 650 630 23
  Line 600 605 640 620 '#31475E' 2
  Line 180 620 550 620 '#667F55' 3;Line 605 620 1040 620 '#667F55' 3
}
