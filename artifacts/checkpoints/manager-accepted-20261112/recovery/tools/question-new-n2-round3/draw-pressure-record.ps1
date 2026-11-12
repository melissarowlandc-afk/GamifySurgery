$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$bitmap = New-Object System.Drawing.Bitmap 1200,720
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::White)
$ink = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(34,47,61))
$blue = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(30,93,165)),5
$green = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(0,118,105)),5
$axis = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(74,85,99)),2
$grid = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(221,226,232)),1
$titleFont = New-Object System.Drawing.Font 'Arial',28
$labelFont = New-Object System.Drawing.Font 'Arial',20
$smallFont = New-Object System.Drawing.Font 'Arial',17
try {
 $graphics.DrawString('Hospital ventilation record',$titleFont,$ink,65,30)
 $graphics.DrawString('Constructed observations; not a monitor screenshot',$smallFont,$ink,65,83)
 $graphics.DrawString('Pressure (cm H2O)',$labelFont,$ink,65,135)
 foreach($tick in @(0,10,20,30,40,50)) {
  $plotY=570-$tick*7
  $graphics.DrawLine($grid,150,$plotY,1100,$plotY)
  $graphics.DrawString([string]$tick,$smallFont,$ink,103,($plotY-14))
 }
 $graphics.DrawLine($axis,150,220,150,570)
 $graphics.DrawLine($axis,150,570,1100,570)
 $plotX=@(250,620,990)
 $peak=@(34,42,32);$plateau=@(18,26,26)
 for($pointIndex=0;$pointIndex -lt 3;$pointIndex++) {
  if($pointIndex -gt 0) {
   $priorIndex=$pointIndex-1
   $graphics.DrawLine($blue,$plotX[$priorIndex],(570-$peak[$priorIndex]*7),$plotX[$pointIndex],(570-$peak[$pointIndex]*7))
   $graphics.DrawLine($green,$plotX[$priorIndex],(570-$plateau[$priorIndex]*7),$plotX[$pointIndex],(570-$plateau[$pointIndex]*7))
  }
  $graphics.DrawEllipse($blue,($plotX[$pointIndex]-7),(563-$peak[$pointIndex]*7),14,14)
  $graphics.DrawRectangle($green,($plotX[$pointIndex]-7),(563-$plateau[$pointIndex]*7),14,14)
  $graphics.DrawString([string]$peak[$pointIndex],$labelFont,$ink,($plotX[$pointIndex]-16),(530-$peak[$pointIndex]*7))
  $graphics.DrawString([string]$plateau[$pointIndex],$labelFont,$ink,($plotX[$pointIndex]-16),(581-$plateau[$pointIndex]*7))
 }
 $graphics.DrawString('Earlier',$labelFont,$ink,198,600)
 $graphics.DrawString('After pressure rise',$labelFont,$ink,510,600)
 $graphics.DrawString('After flow change',$labelFont,$ink,875,600)
 $graphics.DrawString('Flow 90 L/min',$smallFont,$ink,175,642)
 $graphics.DrawString('Flow 90 L/min',$smallFont,$ink,545,642)
 $graphics.DrawString('Flow 30 L/min',$smallFont,$ink,915,642)
 $graphics.DrawLine($blue,760,133,810,133)
 $graphics.DrawString('Peak',$smallFont,$ink,825,118)
 $graphics.DrawLine($green,950,133,1000,133)
 $graphics.DrawString('Plateau',$smallFont,$ink,1010,118)
 $bitmap.Save((Join-Path (Get-Location) 'apps/player/public/clinical-exhibits/question-new-n2-r3-pressure.png'),[System.Drawing.Imaging.ImageFormat]::Png)
} finally {
 foreach($drawingObject in @($titleFont,$labelFont,$smallFont,$ink,$blue,$green,$axis,$grid,$graphics,$bitmap)) {$drawingObject.Dispose()}
}
