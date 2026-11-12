param([switch]$Check)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
# Original technical schematic: no source illustration or patient image.
$assetPath=Join-Path (Get-Location) 'apps/player/public/clinical-exhibits/batch2b-r2-b24-breast-map.png'
$bitmap=[Drawing.Bitmap]::new(820,1080)
$g=[Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint=[Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([Drawing.Color]::White)
$font=[Drawing.Font]::new('Segoe UI',21)
$small=[Drawing.Font]::new('Segoe UI',17)
$bold=[Drawing.Font]::new('Segoe UI',24,[Drawing.FontStyle]::Bold)
$ink=[Drawing.Brushes]::MidnightBlue
$pen=[Drawing.Pen]::new([Drawing.Color]::MidnightBlue,3)
$faint=[Drawing.Pen]::new([Drawing.Color]::SlateGray,2)
$shade=[Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(229,235,241))
function Txt([string]$s,[float]$x,[float]$y,[string]$size='normal'){
 $f=$font;if($size -eq 'small'){$f=$small};if($size -eq 'bold'){$f=$bold}
 $g.DrawString($s,$f,$ink,$x,$y)
}
try{
 Txt 'One-quadrant localization map' 26 18 'bold'
 Txt 'Constructed schematic; not to scale' 26 67 'small'
 Txt 'Medial' 26 132 'small';Txt 'Lateral' 678 132 'small'
 $points=@(@('M',155),@('E',345),@('C',535),@('P',725))
 $g.DrawLine($faint,110,211,765,211)
 foreach($point in $points){
  $x=[float]$point[1];$g.DrawLine($pen,$x,195,$x,227)
  Txt ([string]$point[0]) ($x-15) 157 'bold'
 }
 Txt 'MRI enhancement' 26 283
 $g.FillRectangle($shade,155,335,190,40)
 $g.DrawRectangle($pen,155,335,190,40)
 Txt 'Mammographic calcification field' 26 423
 for($x=155;$x -le 535;$x+=19){$g.DrawEllipse($pen,$x-3,477,6,6)}
 $g.DrawLine($faint,155,508,535,508)
 foreach($point in $points){$x=[float]$point[1];Txt ([string]$point[0]) ($x-11) 529 'small'}
 Txt 'Landmark record' 26 611 'bold'
 Txt 'M   Original biopsy marker' 38 674
 Txt 'E    Current enhancement edge' 38 729
 Txt 'C    Sampled calcification edge' 38 784
 Txt 'P    Old outer palpable outline' 38 839
 Txt 'One mapped quadrant' 26 939 'small'
 Txt 'Histology from C is in the current update.' 26 982 'small'
 $stream=[IO.MemoryStream]::new()
 try{
  $bitmap.Save($stream,[Drawing.Imaging.ImageFormat]::Png);$bytes=$stream.ToArray()
  if($Check){if(-not(Test-Path -LiteralPath $assetPath)){throw 'Missing B24 map'};if([Convert]::ToBase64String([IO.File]::ReadAllBytes($assetPath)) -ne [Convert]::ToBase64String($bytes)){throw 'B24 map differs'}}
  else{[IO.File]::WriteAllBytes($assetPath,$bytes)}
  Write-Output ('batch2b-r2-b24-breast-map.png '+$bytes.Length+' bytes, 820x1080')
 }finally{$stream.Dispose()}
}finally{foreach($r in @($g,$bitmap,$font,$small,$bold,$pen,$faint,$shade)){$r.Dispose()}}
