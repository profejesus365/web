/* ==========================================================================
   ACADEMIA CODE — carga de los enlaces de sus dos botones

   «enlaces-academia.txt», en la carpeta principal del sitio, es el que manda:
   allí se pega la dirección de «Entrar desde la escuela» y «Entrar desde la
   web» sin tocar el código de la página.

   Los navegadores no permiten leer un .txt cuando la página se abre con
   doble clic (protocolo file://), así que «enlaces-academia.js» guarda una
   copia de respaldo con los mismos valores. Al publicar el sitio en internet
   se lee directamente el .txt.
   ========================================================================== */
;(function () {
  'use strict'

  var CLAVES = ['escuela', 'web']

  function leerRespaldo() {
    var base = {}
    var origen = window.ENLACES_ACADEMIA || {}
    CLAVES.forEach(function (c) {
      base[c] = typeof origen[c] === 'string' ? origen[c].trim() : ''
    })
    return base
  }

  /**
   * Interpreta el contenido de enlaces-academia.txt.
   * Formato: una línea por botón, «clave = dirección».
   * Se ignoran las líneas vacías y las que empiezan por # o //.
   */
  function interpretarTexto(texto) {
    var mapa = {}
    texto.split(/\r?\n/).forEach(function (linea) {
      var limpia = linea.trim()
      if (!limpia || limpia.charAt(0) === '#' || limpia.slice(0, 2) === '//') return

      var corte = limpia.indexOf('=')
      if (corte < 1) return

      var clave = limpia.slice(0, corte).trim().toLowerCase()
      var valor = limpia.slice(corte + 1).trim()

      valor = valor.replace(/^["']|["']$/g, '').trim()

      if (CLAVES.indexOf(clave) !== -1) mapa[clave] = valor
    })
    return mapa
  }

  function esExterno(url) {
    return /^https?:\/\//i.test(url)
  }

  function aplicar(enlaces) {
    document.querySelectorAll('[data-enlace-academia]').forEach(function (boton) {
      var url = enlaces[boton.dataset.enlaceAcademia] || ''
      var envoltura = boton.closest('.entrada')
      var etiqueta = envoltura ? envoltura.querySelector('[data-etiqueta]') : null

      if (!url) {
        if (envoltura) envoltura.dataset.estado = 'pendiente'
        boton.removeAttribute('href')
        boton.removeAttribute('target')
        boton.removeAttribute('rel')
        boton.setAttribute('aria-disabled', 'true')
        if (etiqueta) {
          etiqueta.textContent = 'Próximamente'
          etiqueta.className = 'entrada__ayuda distintivo distintivo--neutro'
        }
        return
      }

      if (envoltura) envoltura.dataset.estado = 'activo'
      boton.href = url
      boton.removeAttribute('aria-disabled')
      if (esExterno(url)) {
        boton.target = '_blank'
        boton.rel = 'noopener noreferrer'
      } else {
        boton.removeAttribute('target')
        boton.removeAttribute('rel')
      }
      if (etiqueta) {
        etiqueta.textContent = 'Disponible'
        etiqueta.className = 'entrada__ayuda distintivo distintivo--marca'
      }
    })
  }

  var enlaces = leerRespaldo()
  aplicar(enlaces)

  // El .txt tiene la última palabra cuando el navegador puede leerlo.
  if (window.fetch && location.protocol !== 'file:') {
    fetch('../enlaces-academia.txt', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('enlaces-academia.txt: ' + r.status)
        return r.text()
      })
      .then(function (texto) {
        var delTexto = interpretarTexto(texto)
        CLAVES.forEach(function (c) {
          if (typeof delTexto[c] === 'string') enlaces[c] = delTexto[c]
        })
        aplicar(enlaces)
      })
      .catch(function () {
        /* Sin .txt legible se mantienen los valores de enlaces-academia.js. */
      })
  }
})()
