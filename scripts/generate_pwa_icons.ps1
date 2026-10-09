Add-Type -AssemblyName System.Drawing

function New-Gr3tfulIcon {
  param(
    [int]$Size,
    [string]$OutputPath,
    [switch]$Maskable
  )

  $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#FFF8F0'))

  $marginRatio = if ($Maskable) { 0.19 } else { 0.12 }
  $margin = [int]($Size * $marginRatio)
  $diameter = $Size - (2 * $margin)
  $terracotta = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#C4622D'))
  $cream = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#FFF8F0'))
  $graphics.FillEllipse($terracotta, $margin, $margin, $diameter, $diameter)

  $center = $Size / 2
  $outer = $Size * 0.25
  $inner = $Size * 0.075
  $points = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new($center, $center - $outer),
    [System.Drawing.PointF]::new($center + $inner, $center - $inner),
    [System.Drawing.PointF]::new($center + $outer, $center),
    [System.Drawing.PointF]::new($center + $inner, $center + $inner),
    [System.Drawing.PointF]::new($center, $center + $outer),
    [System.Drawing.PointF]::new($center - $inner, $center + $inner),
    [System.Drawing.PointF]::new($center - $outer, $center),
    [System.Drawing.PointF]::new($center - $inner, $center - $inner)
  )
  $graphics.FillPolygon($cream, $points)

  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $cream.Dispose()
  $terracotta.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$publicPath = Join-Path $PSScriptRoot '..\public'
New-Gr3tfulIcon -Size 192 -OutputPath (Join-Path $publicPath 'pwa-192.png')
New-Gr3tfulIcon -Size 512 -OutputPath (Join-Path $publicPath 'pwa-512.png')
New-Gr3tfulIcon -Size 512 -OutputPath (Join-Path $publicPath 'pwa-maskable-512.png') -Maskable
New-Gr3tfulIcon -Size 180 -OutputPath (Join-Path $publicPath 'apple-touch-icon.png')
