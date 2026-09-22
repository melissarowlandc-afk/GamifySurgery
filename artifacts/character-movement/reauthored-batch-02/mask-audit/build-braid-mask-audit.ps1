Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')
$sourcePath = Join-Path $root 'Photos for Codex 2\Patients or Staff or Other Characters\exec-16c48adf-2478-4b2a-b0e3-9ce1f2bfc2cb.png'
$outPath = Join-Path $PSScriptRoot 'gray-braid-south-mask-audit.png'
$source = [System.Drawing.Image]::FromFile($sourcePath)
$scale = 3; $crop = [System.Drawing.Rectangle]::new(50, 20, 240, 310)
$panelWidth = 240 * $scale; $panelHeight = 310 * $scale; $top = 62
$canvas = [System.Drawing.Bitmap]::new($panelWidth * 3, $panelHeight + $top)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.Clear([System.Drawing.Color]::FromArgb(23,25,29))
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
$font = [System.Drawing.Font]::new('Arial', 20, [System.Drawing.FontStyle]::Bold)
$small = [System.Drawing.Font]::new('Consolas', 16)
$white = [System.Drawing.Brushes]::White
function New-Path([int[][]]$Points, [int]$OffsetX = 0) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $items = foreach ($point in $Points) { [System.Drawing.Point]::new($OffsetX + $point[0] * $scale, $point[1] * $scale + $top) }
  $path.AddPolygon([System.Drawing.Point[]]$items)
  return $path
}
function Draw-Crop([int]$Index) {
  $destination = [System.Drawing.Rectangle]::new($Index * $panelWidth, $top, $panelWidth, $panelHeight)
  $graphics.DrawImage($source, $destination, $crop.X, $crop.Y, $crop.Width, $crop.Height, [System.Drawing.GraphicsUnit]::Pixel)
}
$head = [int[][]]@((62,38),(143,38),(147,112),(139,123),(128,130),(82,130),(64,122))
$braid = [int[][]]@((122,106),(137,111),(137,122),(142,128),(137,136),(144,143),(137,151),(140,157),(132,159),(129,151),(133,143),(126,136),(131,128),(123,120))
Draw-Crop 0; $graphics.DrawString('approved source · South crop', $font, $white, 14, 15)
Draw-Crop 1; $graphics.DrawString('measured head + braid outline', $font, $white, $panelWidth + 14, 15)
$graphics.DrawString('braid tip y≈157', $small, $white, $panelWidth + 16, 42)
$headPath = New-Path $head $panelWidth; $braidPath = New-Path $braid $panelWidth
$graphics.DrawPath([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(61,255,119), 6), $headPath)
$graphics.DrawPath([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255,204,51), 6), $braidPath)
$graphics.DrawString('isolated source pixels · no coat', $font, $white, $panelWidth * 2 + 14, 15)
$isolatedHeadPath = New-Path $head ($panelWidth * 2); $isolatedBraidPath = New-Path $braid ($panelWidth * 2)
$state = $graphics.Save()
$graphics.SetClip($isolatedHeadPath, [System.Drawing.Drawing2D.CombineMode]::Replace)
$graphics.SetClip($isolatedBraidPath, [System.Drawing.Drawing2D.CombineMode]::Union)
$destination = [System.Drawing.Rectangle]::new($panelWidth * 2, $top, $panelWidth, $panelHeight)
$graphics.DrawImage($source, $destination, $crop.X, $crop.Y, $crop.Width, $crop.Height, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.Restore($state)
$canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$headPath.Dispose(); $braidPath.Dispose(); $isolatedHeadPath.Dispose(); $isolatedBraidPath.Dispose(); $font.Dispose(); $small.Dispose(); $graphics.Dispose(); $canvas.Dispose(); $source.Dispose()
Write-Output $outPath
