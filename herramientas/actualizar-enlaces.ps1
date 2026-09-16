# =============================================================================
#  actualizar-enlaces.ps1
#
#  Lee «enlaces.txt» y «enlaces-academia.txt» y vuelve a escribir «enlaces.js»
#  y «enlaces-academia.js» con los mismos valores. Esas copias son las que usa
#  la página cuando se abre con doble clic, porque los navegadores no permiten
#  leer archivos .txt con el protocolo file://.
#
#  No se ejecuta a mano: lo llama «actualizar-enlaces.bat».
# =============================================================================

$ErrorActionPreference = 'Stop'

$raiz = Split-Path -Parent $PSScriptRoot
$sinBom = New-Object System.Text.UTF8Encoding($false)

function Actualizar-Enlaces {
    param(
        [string]$NombreTxt,
        [string]$NombreJs,
        [string]$NombreVariable,
        [string[]]$Claves,
        [hashtable]$Rotulos
    )

    $rutaTxt = Join-Path $raiz $NombreTxt
    $rutaJs = Join-Path $raiz $NombreJs

    if (-not (Test-Path -LiteralPath $rutaTxt)) {
        Write-Host ''
        Write-Host "  ERROR: no se encontro el archivo $NombreTxt" -ForegroundColor Red
        Write-Host "  Se esperaba aqui: $rutaTxt"
        Write-Host ''
        exit 1
    }

    $valores = @{}
    foreach ($c in $Claves) { $valores[$c] = '' }

    # --- Lectura del .txt -----------------------------------------------------
    foreach ($linea in (Get-Content -LiteralPath $rutaTxt -Encoding UTF8)) {
        $l = $linea.Trim()
        if ($l -eq '' -or $l.StartsWith('#') -or $l.StartsWith('//')) { continue }

        $corte = $l.IndexOf('=')
        if ($corte -lt 1) { continue }

        $clave = $l.Substring(0, $corte).Trim().ToLower()
        $valor = $l.Substring($corte + 1).Trim().Trim('"', "'").Trim()

        if ($Claves -contains $clave) { $valores[$clave] = $valor }
    }

    # --- Escritura del .js -----------------------------------------------------
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine('/* ==========================================================================')
    [void]$sb.AppendLine("   COPIA DE RESPALDO DE «$NombreTxt»  —  archivo generado automaticamente")
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('   NO EDITES ESTE ARCHIVO A MANO.')
    [void]$sb.AppendLine("   Edita «$NombreTxt» y ejecuta «actualizar-enlaces.bat»: este archivo se")
    [void]$sb.AppendLine('   vuelve a escribir solo con los valores que alli pongas.')
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('   Existe porque los navegadores no dejan leer un .txt cuando la pagina se')
    [void]$sb.AppendLine('   abre con doble clic (protocolo file://). Con esta copia, los enlaces')
    [void]$sb.AppendLine('   funcionan igual sin necesidad de publicar el sitio.')
    [void]$sb.AppendLine('   ========================================================================== */')
    [void]$sb.AppendLine("window.$NombreVariable = {")

    foreach ($c in $Claves) {
        # Se escapan la barra invertida y la comilla simple para no romper el JavaScript.
        $v = $valores[$c].Replace('\', '\\').Replace("'", "\'")
        [void]$sb.AppendLine(("  {0}: '{1}'," -f $c, $v))
    }

    [void]$sb.AppendLine('}')

    [System.IO.File]::WriteAllText($rutaJs, $sb.ToString(), $sinBom)

    foreach ($c in $Claves) {
        $rotulo = $Rotulos[$c].PadRight(20)
        if ($valores[$c] -eq '') {
            Write-Host "  $rotulo  ->  (vacio: se vera como Proximamente)" -ForegroundColor DarkGray
        }
        else {
            Write-Host "  $rotulo  ->  $($valores[$c])" -ForegroundColor Cyan
        }
    }
}

Write-Host ''
Write-Host '  Leyendo enlaces.txt...'
Write-Host ''

# Las seis secciones de la pagina de inicio, en el orden en que aparecen.
Actualizar-Enlaces `
    -NombreTxt 'enlaces.txt' `
    -NombreJs 'enlaces.js' `
    -NombreVariable 'ENLACES' `
    -Claves @('portal', 'proyectos', 'ejes', 'examenes', 'gamificaciones', 'recursos') `
    -Rotulos @{
        portal         = 'Academia CODE'
        proyectos      = 'Mis proyectos'
        ejes           = 'Ejes tematicos'
        examenes       = 'Examenes'
        gamificaciones = 'Gamificacion'
        recursos       = 'Recursos Digitales'
    }

Write-Host ''
Write-Host '  Leyendo enlaces-academia.txt...'
Write-Host ''

# Los dos botones de la pagina «Academia CODE».
Actualizar-Enlaces `
    -NombreTxt 'enlaces-academia.txt' `
    -NombreJs 'enlaces-academia.js' `
    -NombreVariable 'ENLACES_ACADEMIA' `
    -Claves @('escuela', 'web') `
    -Rotulos @{
        escuela = 'Entrar desde la escuela'
        web     = 'Entrar desde la web'
    }

# --- Informe en pantalla -----------------------------------------------------
Write-Host ''
Write-Host '  Enlaces actualizados correctamente.' -ForegroundColor Green
Write-Host ''
Write-Host '  Ya puedes volver al navegador y recargar con Ctrl+F5.'
Write-Host ''
