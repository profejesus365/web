# =============================================================================
#  actualizar-enlaces.ps1
#
#  Lee «enlaces.txt» y vuelve a escribir «enlaces.js» con los mismos valores.
#  Esa copia es la que usa la página cuando se abre con doble clic, porque los
#  navegadores no permiten leer archivos .txt con el protocolo file://.
#
#  No se ejecuta a mano: lo llama «actualizar-enlaces.bat».
# =============================================================================

$ErrorActionPreference = 'Stop'

$raiz = Split-Path -Parent $PSScriptRoot
$rutaTxt = Join-Path $raiz 'enlaces.txt'
$rutaJs = Join-Path $raiz 'enlaces.js'

if (-not (Test-Path -LiteralPath $rutaTxt)) {
    Write-Host ''
    Write-Host '  ERROR: no se encontro el archivo enlaces.txt' -ForegroundColor Red
    Write-Host "  Se esperaba aqui: $rutaTxt"
    Write-Host ''
    exit 1
}

# Las seis secciones de la pagina, en el orden en que aparecen.
$claves = @('portal', 'proyectos', 'ejes', 'examenes', 'gamificaciones', 'recursos')
$rotulos = @{
    portal         = 'Portal Estudiante'
    proyectos      = 'Mis proyectos'
    ejes           = 'Ejes tematicos'
    examenes       = 'Examenes'
    gamificaciones = 'Gamificacion'
    recursos       = 'Recursos Digitales'
}

$valores = @{}
foreach ($c in $claves) { $valores[$c] = '' }

# --- Lectura de enlaces.txt --------------------------------------------------
foreach ($linea in (Get-Content -LiteralPath $rutaTxt -Encoding UTF8)) {
    $l = $linea.Trim()
    if ($l -eq '' -or $l.StartsWith('#') -or $l.StartsWith('//')) { continue }

    $corte = $l.IndexOf('=')
    if ($corte -lt 1) { continue }

    $clave = $l.Substring(0, $corte).Trim().ToLower()
    $valor = $l.Substring($corte + 1).Trim().Trim('"', "'").Trim()

    if ($claves -contains $clave) { $valores[$clave] = $valor }
}

# --- Escritura de enlaces.js -------------------------------------------------
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('/* ==========================================================================')
[void]$sb.AppendLine('   COPIA DE RESPALDO DE «enlaces.txt»  —  archivo generado automaticamente')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('   NO EDITES ESTE ARCHIVO A MANO.')
[void]$sb.AppendLine('   Edita «enlaces.txt» y ejecuta «actualizar-enlaces.bat»: este archivo se')
[void]$sb.AppendLine('   vuelve a escribir solo con los valores que alli pongas.')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('   Existe porque los navegadores no dejan leer un .txt cuando la pagina se')
[void]$sb.AppendLine('   abre con doble clic (protocolo file://). Con esta copia, los enlaces')
[void]$sb.AppendLine('   funcionan igual sin necesidad de publicar el sitio.')
[void]$sb.AppendLine('   ========================================================================== */')
[void]$sb.AppendLine('window.ENLACES = {')

foreach ($c in $claves) {
    # Se escapan la barra invertida y la comilla simple para no romper el JavaScript.
    $v = $valores[$c].Replace('\', '\\').Replace("'", "\'")
    [void]$sb.AppendLine(("  {0}: '{1}'," -f $c, $v))
}

[void]$sb.AppendLine('}')

$sinBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($rutaJs, $sb.ToString(), $sinBom)

# --- Informe en pantalla -----------------------------------------------------
Write-Host ''
Write-Host '  Enlaces actualizados correctamente.' -ForegroundColor Green
Write-Host ''

foreach ($c in $claves) {
    $rotulo = $rotulos[$c].PadRight(20)
    if ($valores[$c] -eq '') {
        Write-Host "  $rotulo  ->  (vacio: se vera como Proximamente)" -ForegroundColor DarkGray
    }
    else {
        Write-Host "  $rotulo  ->  $($valores[$c])" -ForegroundColor Cyan
    }
}

Write-Host ''
Write-Host '  Ya puedes volver al navegador y recargar con Ctrl+F5.'
Write-Host ''
