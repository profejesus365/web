/* ==========================================================================
   RECURSOS — buscador, filtros por categoría y favoritos

   Las tarjetas se construyen UNA sola vez a partir de «recursos-datos.js».
   Después, filtrar solo consiste en mostrar u ocultar las que ya existen y en
   volver a pintar el resaltado del texto. Así el botón de favorito nunca se
   destruye y no se pierde el foco del teclado al pulsarlo.
   ========================================================================== */
;(function () {
  'use strict'

  var RECURSOS = window.RECURSOS || []
  var CATEGORIAS = window.CATEGORIAS || []
  var CLAVE_FAVORITOS = 'recursos-favoritos'

  var $catalogo = document.getElementById('catalogo')
  var $filtros = document.getElementById('filtros')
  var $contador = document.getElementById('contador')
  var $buscador = document.getElementById('buscador')
  var $limpiar = document.getElementById('limpiar-busqueda')
  var $atajo = document.getElementById('atajo-busqueda')
  var $vacio = document.getElementById('vacio')
  var $vacioTexto = document.getElementById('vacio-texto')
  var $vacioLimpiar = document.getElementById('vacio-limpiar')

  if (!$catalogo || !RECURSOS.length) return

  /* ========================================================================
     Estado
     ======================================================================== */
  var consulta = ''
  var categoria = 'todas'
  var soloFavoritos = false
  var favoritos = cargarFavoritos()

  /* ========================================================================
     Utilidades de texto

     Se comparan las cadenas sin tildes y en minúscula, de modo que «matematicas»
     encuentre «matemáticas». La normalización se hace carácter a carácter para
     que la cadena resultante mida exactamente lo mismo que la original: así los
     índices de una coincidencia sirven para recortar el texto sin desfase.
     ======================================================================== */
  function normalizar(texto) {
    var salida = ''
    for (var i = 0; i < texto.length; i++) {
      var c = texto[i]
      var n = c.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      salida += n.length === 1 ? n.toLowerCase() : c.toLowerCase()
    }
    return salida
  }

  /**
   * Devuelve el texto en nodos, con las coincidencias envueltas en <mark>.
   * Se construye con nodos y no con innerHTML para que ningún carácter del
   * catálogo pueda interpretarse como etiqueta.
   */
  function resaltar(texto, aguja) {
    var trozo = document.createDocumentFragment()
    if (!aguja) {
      trozo.appendChild(document.createTextNode(texto))
      return trozo
    }

    var heno = normalizar(texto)
    var desde = 0
    var pos = heno.indexOf(aguja)

    while (pos !== -1) {
      if (pos > desde) trozo.appendChild(document.createTextNode(texto.slice(desde, pos)))
      var marca = document.createElement('mark')
      marca.textContent = texto.slice(pos, pos + aguja.length)
      trozo.appendChild(marca)
      desde = pos + aguja.length
      pos = heno.indexOf(aguja, desde)
    }

    if (desde < texto.length) trozo.appendChild(document.createTextNode(texto.slice(desde)))
    return trozo
  }

  /* ========================================================================
     Favoritos
     ======================================================================== */
  function cargarFavoritos() {
    try {
      var crudo = localStorage.getItem(CLAVE_FAVORITOS)
      var lista = crudo ? JSON.parse(crudo) : []
      return new Set(Array.isArray(lista) ? lista : [])
    } catch (e) {
      return new Set()
    }
  }

  function guardarFavoritos() {
    try {
      localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify([...favoritos]))
    } catch (e) {
      /* Modo privado o almacenamiento lleno: los favoritos duran esta visita. */
    }
  }

  /* ========================================================================
     Construcción del catálogo
     ======================================================================== */
  var fichas = [] // { datos, el, $nombre, $texto, $favorito }
  var grupos = [] // { id, el, $cuenta, fichas }

  function construir() {
    CATEGORIAS.forEach(function (cat) {
      var deLaCategoria = RECURSOS.filter(function (r) {
        return r.cat === cat.id
      })
      if (!deLaCategoria.length) return

      var seccion = document.createElement('section')
      seccion.className = 'grupo'
      seccion.setAttribute('data-cat', cat.id)
      seccion.setAttribute('aria-labelledby', 't-' + cat.id)

      var cabeza = document.createElement('div')
      cabeza.className = 'grupo__cabeza'
      cabeza.innerHTML =
        '<span class="grupo__icono"><svg width="19" height="19" aria-hidden="true">' +
        '<use href="#ic-' +
        cat.id +
        '"></use></svg></span>' +
        '<h2 class="grupo__titulo" id="t-' +
        cat.id +
        '"></h2>' +
        '<span class="grupo__cuenta"></span>'
      cabeza.querySelector('.grupo__titulo').textContent = cat.nombre
      seccion.appendChild(cabeza)

      var rejilla = document.createElement('div')
      rejilla.className = 'rejilla rejilla--3'
      seccion.appendChild(rejilla)

      var delGrupo = []
      deLaCategoria.forEach(function (r) {
        var ficha = crearFicha(r, cat)
        rejilla.appendChild(ficha.el)
        fichas.push(ficha)
        delGrupo.push(ficha)
      })

      grupos.push({
        id: cat.id,
        el: seccion,
        $cuenta: cabeza.querySelector('.grupo__cuenta'),
        fichas: delGrupo,
      })
      $catalogo.appendChild(seccion)
    })
  }

  function crearFicha(r, cat) {
    var id = normalizar(r.nombre).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    var el = document.createElement('article')
    el.className = 'recurso'
    el.setAttribute('data-cat', r.cat)

    // --- Cabeza: sigla y estrella ---
    var cabeza = document.createElement('div')
    cabeza.className = 'recurso__cabeza'

    var sigla = document.createElement('span')
    sigla.className = 'recurso__sigla'
    sigla.setAttribute('aria-hidden', 'true')
    sigla.textContent = r.sigla || r.nombre.charAt(0)
    cabeza.appendChild(sigla)

    var favorito = document.createElement('button')
    favorito.type = 'button'
    favorito.className = 'recurso__favorito'
    favorito.innerHTML = '<svg width="18" height="18" aria-hidden="true"><use href="#ic-estrella"></use></svg>'
    favorito.addEventListener('click', function () {
      if (favoritos.has(id)) favoritos.delete(id)
      else favoritos.add(id)
      guardarFavoritos()
      pintarFavorito(favorito, id, r.nombre)
      aplicar()
    })
    cabeza.appendChild(favorito)
    el.appendChild(cabeza)

    // --- Nombre, con el enlace que cubre toda la tarjeta ---
    var titulo = document.createElement('h3')
    titulo.className = 'recurso__nombre'
    var enlace = document.createElement('a')
    enlace.href = r.url
    enlace.target = '_blank'
    enlace.rel = 'noopener noreferrer'
    enlace.textContent = r.nombre
    titulo.appendChild(enlace)
    el.appendChild(titulo)

    // --- Descripción ---
    var texto = document.createElement('p')
    texto.className = 'recurso__texto'
    texto.textContent = r.texto
    el.appendChild(texto)

    // --- Pie ---
    var pie = document.createElement('p')
    pie.className = 'recurso__pie'
    var etiqueta = document.createElement('span')
    etiqueta.className = 'recurso__categoria'
    etiqueta.textContent = cat.nombre
    var ir = document.createElement('span')
    ir.className = 'recurso__ir'
    ir.innerHTML =
      'Visitar sitio <svg width="12" height="12" aria-hidden="true"><use href="#ic-externo"></use></svg>'
    pie.appendChild(etiqueta)
    pie.appendChild(ir)
    el.appendChild(pie)

    pintarFavorito(favorito, id, r.nombre)

    return {
      datos: r,
      id: id,
      // Todo lo que se puede buscar, ya normalizado una sola vez.
      indice: normalizar([r.nombre, r.texto, cat.nombre, r.claves || ''].join(' ')),
      el: el,
      $nombre: enlace,
      $texto: texto,
      $favorito: favorito,
    }
  }

  function pintarFavorito(boton, id, nombre) {
    var activo = favoritos.has(id)
    boton.setAttribute('aria-pressed', String(activo))
    boton.setAttribute(
      'aria-label',
      (activo ? 'Quitar ' : 'Guardar ') + nombre + (activo ? ' de favoritos' : ' en favoritos'),
    )
    boton.title = activo ? 'Quitar de favoritos' : 'Guardar en favoritos'
  }

  /* ========================================================================
     Fichas de filtro
     ======================================================================== */
  var botonesCategoria = {}
  var $botonFavoritos = null

  function construirFiltros() {
    var todas = crearFicha_filtro('todas', 'Todas', null)
    $filtros.appendChild(todas)
    botonesCategoria.todas = todas

    CATEGORIAS.forEach(function (cat) {
      var b = crearFicha_filtro(cat.id, cat.corto || cat.nombre, cat.id)
      $filtros.appendChild(b)
      botonesCategoria[cat.id] = b
    })

    var sep = document.createElement('span')
    sep.className = 'ficha__separador'
    sep.setAttribute('aria-hidden', 'true')
    $filtros.appendChild(sep)

    $botonFavoritos = document.createElement('button')
    $botonFavoritos.type = 'button'
    $botonFavoritos.className = 'ficha ficha--favoritos'
    $botonFavoritos.setAttribute('aria-pressed', 'false')
    $botonFavoritos.innerHTML =
      '<svg width="14" height="14" aria-hidden="true"><use href="#ic-estrella"></use></svg>' +
      '<span>Favoritos</span><span class="ficha__cuenta"></span>'
    $botonFavoritos.addEventListener('click', function () {
      soloFavoritos = !soloFavoritos
      $botonFavoritos.setAttribute('aria-pressed', String(soloFavoritos))
      aplicar()
    })
    $filtros.appendChild($botonFavoritos)
  }

  function crearFicha_filtro(valor, rotulo, catId) {
    var b = document.createElement('button')
    b.type = 'button'
    b.className = 'ficha'
    if (catId) b.setAttribute('data-cat', catId)
    b.setAttribute('aria-pressed', String(valor === categoria))
    b.innerHTML = '<span></span><span class="ficha__cuenta"></span>'
    b.firstChild.textContent = rotulo
    b.addEventListener('click', function () {
      categoria = valor
      Object.keys(botonesCategoria).forEach(function (k) {
        botonesCategoria[k].setAttribute('aria-pressed', String(k === valor))
      })
      aplicar()
    })
    return b
  }

  /* ========================================================================
     Filtrado
     ======================================================================== */
  function aplicar() {
    var aguja = normalizar(consulta.trim())
    var visibles = 0
    var porCategoria = {}
    var favoritosQueCoinciden = 0

    fichas.forEach(function (f) {
      var coincideTexto = !aguja || f.indice.indexOf(aguja) !== -1
      var esFavorito = favoritos.has(f.id)

      // Las cuentas de las fichas de filtro se calculan sobre lo que queda tras
      // la búsqueda, para que digan cuántos resultados hay en cada categoría.
      if (coincideTexto) {
        if (esFavorito) favoritosQueCoinciden++
        if (!soloFavoritos || esFavorito) {
          porCategoria[f.datos.cat] = (porCategoria[f.datos.cat] || 0) + 1
        }
      }

      var visible =
        coincideTexto &&
        (categoria === 'todas' || f.datos.cat === categoria) &&
        (!soloFavoritos || esFavorito)

      f.el.hidden = !visible

      if (visible) {
        visibles++
        f.$nombre.replaceChildren(resaltar(f.datos.nombre, aguja))
        f.$texto.replaceChildren(resaltar(f.datos.texto, aguja))
      }
    })

    // --- Grupos: se oculta el que se quede sin tarjetas ---
    grupos.forEach(function (g) {
      var cuenta = g.fichas.filter(function (f) {
        return !f.el.hidden
      }).length
      g.el.hidden = cuenta === 0
      g.$cuenta.textContent = cuenta === 1 ? '1 recurso' : cuenta + ' recursos'
    })

    // --- Cuentas de las fichas de filtro ---
    var totalFiltrado = Object.keys(porCategoria).reduce(function (s, k) {
      return s + porCategoria[k]
    }, 0)
    botonesCategoria.todas.querySelector('.ficha__cuenta').textContent = String(totalFiltrado)
    CATEGORIAS.forEach(function (cat) {
      var b = botonesCategoria[cat.id]
      if (b) b.querySelector('.ficha__cuenta').textContent = String(porCategoria[cat.id] || 0)
    })
    $botonFavoritos.querySelector('.ficha__cuenta').textContent = String(favoritosQueCoinciden)

    // --- Contador y estado vacío ---
    pintarContador(visibles)
    $vacio.hidden = visibles > 0
    if (!visibles) $vacioTexto.textContent = mensajeVacio()

    $limpiar.hidden = consulta === ''
    if ($atajo) $atajo.hidden = consulta !== '' || document.activeElement === $buscador
  }

  function pintarContador(visibles) {
    var total = fichas.length
    var fuerte = document.createElement('strong')

    if (visibles === total) {
      fuerte.textContent = total + ' recursos'
      $contador.replaceChildren(fuerte, ' en ' + grupos.length + ' categorías.')
    } else {
      fuerte.textContent = visibles === 1 ? '1 recurso' : visibles + ' recursos'
      $contador.replaceChildren(fuerte, ' de ' + total + '.')
    }
  }

  function mensajeVacio() {
    if (soloFavoritos && !favoritos.size) {
      return 'Todavía no has guardado ningún favorito. Pulsa la estrella de una tarjeta para tenerla siempre a mano.'
    }
    if (consulta.trim()) {
      return 'Ningún recurso coincide con «' + consulta.trim() + '».'
    }
    return 'No hay recursos que coincidan con los filtros activos.'
  }

  /* ========================================================================
     Sucesos
     ======================================================================== */
  $buscador.addEventListener('input', function () {
    consulta = $buscador.value
    aplicar()
  })

  $buscador.addEventListener('focus', function () {
    if ($atajo) $atajo.hidden = true
  })

  $buscador.addEventListener('blur', function () {
    if ($atajo) $atajo.hidden = consulta !== ''
  })

  $buscador.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && consulta) {
      e.stopPropagation()
      limpiarBusqueda()
    }
  })

  function limpiarBusqueda() {
    consulta = ''
    $buscador.value = ''
    aplicar()
    $buscador.focus()
  }

  $limpiar.addEventListener('click', limpiarBusqueda)

  $vacioLimpiar.addEventListener('click', function () {
    consulta = ''
    $buscador.value = ''
    categoria = 'todas'
    soloFavoritos = false
    Object.keys(botonesCategoria).forEach(function (k) {
      botonesCategoria[k].setAttribute('aria-pressed', String(k === 'todas'))
    })
    $botonFavoritos.setAttribute('aria-pressed', 'false')
    aplicar()
    $buscador.focus()
  })

  // La barra «/» lleva el cursor al buscador, como en cualquier catálogo.
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
    var activo = document.activeElement
    var escribiendo =
      activo &&
      (activo.tagName === 'INPUT' || activo.tagName === 'TEXTAREA' || activo.isContentEditable)
    if (escribiendo) return
    e.preventDefault()
    $buscador.focus()
    $buscador.select()
  })

  /* ========================================================================
     Puesta en marcha
     ======================================================================== */
  construir()
  construirFiltros()
  aplicar()
})()
