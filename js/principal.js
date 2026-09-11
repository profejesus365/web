/* ==========================================================================
   PRINCIPAL — comportamiento propio de la página de inicio
   Sitio profesional · Mgtr. Jesús Álvarez Sáez

     1. Sección activa en la navegación.
     2. Carga de los enlaces de las seis secciones desde «enlaces.txt».

   El tema claro/oscuro, el menú móvil y el año del pie están en «comun.js»,
   que se carga antes que este archivo.
   ========================================================================== */
;(function () {
  'use strict'

  /* ========================================================================
     1. Sección activa en la navegación
     ======================================================================== */
  // En el mismo orden en que aparecen en la página.
  var secciones = ['inicio', 'secciones', 'servicios', 'perfil']
    .map(function (id) {
      return document.getElementById(id)
    })
    .filter(Boolean)

  if (secciones.length && 'IntersectionObserver' in window) {
    var marcar = function (id) {
      document.querySelectorAll('.nav__enlace').forEach(function (a) {
        var suyo = a.getAttribute('href') === '#' + id
        if (suyo) a.setAttribute('aria-current', 'page')
        else a.removeAttribute('aria-current')
      })
    }

    // El observador solo avisa de las secciones que CAMBIAN de estado, así que
    // se lleva aparte la cuenta de cuáles siguen a la vista. Sin este registro,
    // al asomar una sección se iluminaría esa aunque la anterior siga ocupando
    // la pantalla.
    var aLaVista = new Map()
    secciones.forEach(function (s) {
      aLaVista.set(s, false)
    })

    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          aLaVista.set(e.target, e.isIntersecting)
        })

        // Se ilumina la primera sección visible, que por orden del documento es
        // también la más cercana al inicio de la ventana.
        for (var i = 0; i < secciones.length; i++) {
          if (aLaVista.get(secciones[i])) {
            marcar(secciones[i].id)
            return
          }
        }
      },
      { rootMargin: '-70px 0px -55% 0px', threshold: 0 },
    )

    secciones.forEach(function (s) {
      observador.observe(s)
    })
  }

  /* ========================================================================
     2. Enlaces de las seis secciones

     El archivo «enlaces.txt», en la carpeta del sitio, es el que manda: allí
     se pega la dirección de cada sección sin tocar el código de la página.

     Los navegadores no permiten leer un .txt cuando la página se abre con
     doble clic (protocolo file://), así que «enlaces.js» guarda una copia de
     respaldo con los mismos valores. Al publicar el sitio en internet se lee
     directamente el .txt.
     ======================================================================== */
  var CLAVES = ['portal', 'proyectos', 'ejes', 'examenes', 'gamificaciones', 'recursos']

  function leerRespaldo() {
    var base = {}
    var origen = window.ENLACES || {}
    CLAVES.forEach(function (c) {
      base[c] = typeof origen[c] === 'string' ? origen[c].trim() : ''
    })
    return base
  }

  /**
   * Interpreta el contenido de enlaces.txt.
   * Formato: una línea por sección, «clave = dirección».
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

      // Se admiten comillas alrededor de la dirección, por si se copian de otro sitio.
      valor = valor.replace(/^["']|["']$/g, '').trim()

      if (CLAVES.indexOf(clave) !== -1) mapa[clave] = valor
    })
    return mapa
  }

  function esExterno(url) {
    return /^https?:\/\//i.test(url)
  }

  function aplicar(enlaces) {
    // --- Tarjetas de acceso ---
    document.querySelectorAll('.acceso[data-enlace]').forEach(function (tarjeta) {
      var url = enlaces[tarjeta.dataset.enlace] || ''
      var etiqueta = tarjeta.querySelector('[data-etiqueta]')

      if (!url) {
        tarjeta.dataset.estado = 'pendiente'
        tarjeta.removeAttribute('href')
        tarjeta.removeAttribute('target')
        tarjeta.removeAttribute('rel')
        if (etiqueta) {
          etiqueta.textContent = 'Próximamente'
          etiqueta.className = 'distintivo distintivo--neutro'
        }
        return
      }

      tarjeta.dataset.estado = 'activo'
      tarjeta.href = url
      if (esExterno(url)) {
        tarjeta.target = '_blank'
        tarjeta.rel = 'noopener noreferrer'
      } else {
        tarjeta.removeAttribute('target')
        tarjeta.removeAttribute('rel')
      }
      if (etiqueta) {
        etiqueta.textContent = 'Disponible'
        etiqueta.className = 'distintivo distintivo--marca'
      }
    })

    // --- Lista del pie de página ---
    document.querySelectorAll('[data-enlace-pie]').forEach(function (a) {
      var url = enlaces[a.dataset.enlacePie] || ''
      if (!url) return
      a.href = url
      if (esExterno(url)) {
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
      }
    })
  }

  var enlaces = leerRespaldo()
  aplicar(enlaces)

  // El .txt tiene la última palabra cuando el navegador puede leerlo.
  if (window.fetch && location.protocol !== 'file:') {
    fetch('./enlaces.txt', { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('enlaces.txt: ' + r.status)
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
        /* Sin .txt legible se mantienen los valores de enlaces.js. */
      })
  }
})()
