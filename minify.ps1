$css = Get-Content src/styles/style.css -Raw
$css = $css -replace '/\*[\s\S]*?\*/', ''
$css = $css -replace '\s+', ' '
$css = $css -replace '\s*([{}:;,])\s*', '$1'
$css = $css -replace ';}', '}'
$css = $css.Trim()
Set-Content src/styles/style.min.css -Value $css
Write-Host ("OK style.min.css (" + $css.Length + " bytes)")

$files = @(
  @{s='src/js/supabase.js'; d='src/js/supabase.min.js'},
  @{s='src/js/cart.js'; d='src/js/cart.min.js'},
  @{s='src/js/main.js'; d='src/js/main.min.js'},
  @{s='src/js/app.js'; d='src/js/app.min.js'}
)

foreach ($f in $files) {
  $js = Get-Content $f.s -Raw
  $js = $js -replace '//.*', ''
  $js = $js -replace '/\*[\s\S]*?\*/', ''
  $js = $js -replace '\s+', ' '
  $js = $js -replace '\s*([{}();,:<>=+\-*/!])\s*', '$1'
  $js = $js.Trim()
  Set-Content $f.d -Value $js
  Write-Host ("OK " + $f.d + " (" + $js.Length + " bytes)")
}

Write-Host "Minificacion completa."
