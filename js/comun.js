/* ==========================================================================
   COMÚN — lo que comparten todas las páginas del sitio
   Sitio profesional · Mgtr. Jesús Álvarez Sáez

     1. Tema claro / oscuro.
     2. Menú compacto en móvil.
     3. El año del pie de página.

   Se carga antes que el guion propio de cada página.
   ========================================================================== */
;(function () {
  'use strict'

  /* ========================================================================
     1. Tema claro / oscuro
     ======================================================================== */
  var CLAVE_TEMA = 'tema'
  var raiz = document.documentElement

  var ICONO_SOL =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="4"/>' +
    '<path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4' +
    'M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/></svg>'

  var ICONO_LUNA =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z"/></svg>'

  function temaGuardado() {
    try {
      return localStorage.getItem(CLAVE_TEMA)
    } catch (e) {
      return null
    }
  }

  function pintarTema(tema) {
    var oscuro = tema === 'oscuro'
    raiz.dataset.tema = tema

    var iconos = [document.getElementById('icono-tema'), document.getElementById('icono-tema-movil')]
    iconos.forEach(function (n) {
      if (n) n.innerHTML = oscuro ? ICONO_LUNA : ICONO_SOL
    })

    var etiqueta = document.getElementById('etiqueta-tema')
    if (etiqueta) etiqueta.textContent = oscuro ? 'Oscuro' : 'Claro'

    var botones = [
      document.getElementById('interruptor-tema'),
      document.getElementById('interruptor-tema-movil'),
    ]
    botones.forEach(function (b) {
      if (!b) return
      b.setAttribute('aria-pressed', String(oscuro))
      b.title = oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    })
  }

  function alternarTema() {
    var siguiente = raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro'
    try {
      localStorage.setItem(CLAVE_TEMA, siguiente)
    } catch (e) {
      /* Modo privado o almacenamiento bloqueado: el tema vale solo esta sesión. */
    }
    pintarTema(siguiente)
  }

  pintarTema(raiz.dataset.tema || 'claro')
  ;['interruptor-tema', 'interruptor-tema-movil'].forEach(function (id) {
    var b = document.getElementById(id)
    if (b) b.addEventListener('click', alternarTema)
  })

  // Mientras el usuario no haya elegido, la página acompaña al sistema.
  if (!temaGuardado() && window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)')
    var alCambiar = function (e) {
      if (!temaGuardado()) pintarTema(e.matches ? 'oscuro' : 'claro')
    }
    if (mq.addEventListener) mq.addEventListener('change', alCambiar)
    else if (mq.addListener) mq.addListener(alCambiar)
  }

  /* ========================================================================
     2. Menú compacto en móvil
     ======================================================================== */
  var botonMenu = document.getElementById('boton-menu')
  var menuMovil = document.getElementById('menu-movil')

  if (botonMenu && menuMovil) {
    var cerrarMenu = function () {
      menuMovil.dataset.abierto = 'no'
      botonMenu.setAttribute('aria-expanded', 'false')
      botonMenu.setAttribute('aria-label', 'Abrir menú')
    }

    botonMenu.addEventListener('click', function () {
      var abierto = menuMovil.dataset.abierto === 'si'
      menuMovil.dataset.abierto = abierto ? 'no' : 'si'
      botonMenu.setAttribute('aria-expanded', String(!abierto))
      botonMenu.setAttribute('aria-label', abierto ? 'Abrir menú' : 'Cerrar menú')
    })

    // Al elegir una sección el menú se recoge solo.
    menuMovil.addEventListener('click', function (e) {
      if (e.target.closest('a')) cerrarMenu()
    })

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarMenu()
    })
  }

  /* ========================================================================
     3. El año del pie se actualiza solo
     ======================================================================== */
  var anio = document.getElementById('anio')
  if (anio) anio.textContent = String(new Date().getFullYear())
})()
