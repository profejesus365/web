/* ==========================================================================
   CATÁLOGO DE RECURSOS EDUCATIVOS DIGITALES

   Este es el archivo que se edita para añadir, quitar o cambiar recursos.
   La página se arma sola a partir de esta lista: no hay que tocar el HTML.

   CÓMO AÑADIR UN RECURSO
   ----------------------
   Copia un bloque completo, pégalo debajo y cambia los datos. Respeta las
   comas y las comillas. Los campos son:

     cat ......... A qué categoría pertenece. Debe ser una de las cinco que
                   están definidas más abajo en CATEGORIAS:
                   'gamificacion', 'creacion', 'logica', 'practica', 'lectura'.
     nombre ...... Como aparece en la tarjeta.
     sigla ....... Una o dos letras para el recuadro de color. Conviene que no
                   se repita con otra del mismo listado.
     texto ....... La descripción breve, de una línea.
     url ......... La dirección del sitio, completa y con https://
     claves ...... Palabras extra por las que se podrá buscar el recurso,
                   además del nombre y la descripción. Es opcional.

   Para quitar un recurso, borra su bloque entero (desde la llave que abre
   hasta la coma que sigue a la llave que cierra).
   ========================================================================== */

/* --- Las cinco categorías, en el orden en que se muestran -----------------
   «nombre» encabeza cada grupo del catálogo; «corto» es el rótulo de la ficha
   de filtro, que debe caber en una sola palabra o poco más.
   ------------------------------------------------------------------------- */
window.CATEGORIAS = [
  { id: 'gamificacion', nombre: 'Evaluación y Gamificación', corto: 'Gamificación' },
  { id: 'creacion', nombre: 'Creación de Contenidos Interactivos', corto: 'Creación' },
  { id: 'logica', nombre: 'Lógica, Programación y Retos', corto: 'Programación' },
  { id: 'practica', nombre: 'Práctica Académica y Matemáticas', corto: 'Práctica' },
  { id: 'lectura', nombre: 'Lectura, Cultura y Apoyo Escolar', corto: 'Lectura' },
]

/* --- El catálogo ---------------------------------------------------------- */
window.RECURSOS = [
  /* ---------------------- Evaluación y Gamificación ---------------------- */
  {
    cat: 'gamificacion',
    nombre: 'Kahoot!',
    sigla: 'K',
    texto: 'Cuestionarios interactivos, encuestas y debates en tiempo real.',
    url: 'https://kahoot.com/',
    claves: 'concurso trivia preguntas competencia',
  },
  {
    cat: 'gamificacion',
    nombre: 'Quizizz',
    sigla: 'Qz',
    texto: 'Cuestionarios autoguiados y competencias a su propio ritmo.',
    url: 'https://quizizz.com/',
    claves: 'test evaluación ritmo propio tarea',
  },
  {
    cat: 'gamificacion',
    nombre: 'Gimkit',
    sigla: 'Gk',
    texto: 'Juego de preguntas estratégico con moneda virtual y mejoras.',
    url: 'https://www.gimkit.com/',
    claves: 'estrategia economía puntos',
  },
  {
    cat: 'gamificacion',
    nombre: 'Quizlet',
    sigla: 'Ql',
    texto: 'Estudio mediante tarjetas de memoria (flashcards) y vocabulario.',
    url: 'https://quizlet.com/',
    claves: 'flashcards memoria vocabulario repaso',
  },
  {
    cat: 'gamificacion',
    nombre: 'Mentimeter',
    sigla: 'Me',
    texto: 'Encuestas en vivo, nubes de palabras y preguntas abiertas.',
    url: 'https://mentimeter.com/',
    claves: 'encuesta participación nube de palabras',
  },
  {
    cat: 'gamificacion',
    nombre: 'Cerebriti',
    sigla: 'Ce',
    texto: 'Juegos interactivos creados por usuarios sobre cualquier materia escolar.',
    url: 'https://www.cerebriti.com/',
    claves: 'juegos materias español',
  },

  /* ------------------ Creación de Contenidos Interactivos ---------------- */
  {
    cat: 'creacion',
    nombre: 'Wordwall',
    sigla: 'W',
    texto: 'Actividades interactivas como sopas de letras, ruletas y más.',
    url: 'https://wordwall.net/',
    claves: 'sopa de letras ruleta plantillas juegos',
  },
  {
    cat: 'creacion',
    nombre: 'Edpuzzle',
    sigla: 'Ed',
    texto: 'Transforma videos en lecciones interactivas con preguntas.',
    url: 'https://edpuzzle.com/',
    claves: 'video youtube preguntas lección',
  },
  {
    cat: 'creacion',
    nombre: 'Educaplay',
    sigla: 'Ep',
    texto: 'Actividades multimedia como crucigramas y mapas interactivos.',
    url: 'https://www.educaplay.com/',
    claves: 'crucigrama mapa actividades español',
  },
  {
    cat: 'creacion',
    nombre: 'Genially',
    sigla: 'Ge',
    texto: 'Creación de presentaciones e infografías interactivas.',
    url: 'https://genially.com/',
    claves: 'presentación infografía escape room',
  },
  {
    cat: 'creacion',
    nombre: 'Canva Educación',
    sigla: 'Cv',
    texto: 'Diseño de materiales visuales y presentaciones para el aula.',
    url: 'https://www.canva.com/es_es/educacion/',
    claves: 'diseño plantillas carteles presentación',
  },

  /* -------------------- Lógica, Programación y Retos --------------------- */
  {
    cat: 'logica',
    nombre: 'Scratch',
    sigla: 'S',
    texto: 'Aprende a programar creando tus propios juegos, historias y animaciones.',
    url: 'https://scratch.mit.edu/',
    claves: 'programación bloques animación pensamiento computacional',
  },
  {
    cat: 'logica',
    nombre: 'Code.org',
    sigla: 'Co',
    texto: 'Lecciones guiadas de programación y pensamiento computacional jugando.',
    url: 'https://code.org/',
    claves: 'programación hora del código lecciones',
  },

  /* ------------------ Práctica Académica y Matemáticas ------------------- */
  {
    cat: 'practica',
    nombre: 'Mundo Primaria',
    sigla: 'Mu',
    texto: 'Juegos educativos gratuitos para niños clasificados por asignaturas.',
    url: 'https://www.mundoprimaria.com/',
    claves: 'primaria asignaturas fichas gratis español',
  },
  {
    cat: 'practica',
    nombre: 'Cristic',
    sigla: 'Cr',
    texto: 'Colección de juegos educativos organizados por curso y temática escolar.',
    url: 'https://www.cristic.com/',
    claves: 'juegos por curso primaria español',
  },
  {
    cat: 'practica',
    nombre: 'Vedoque',
    sigla: 'V',
    texto:
      'Actividades enfocadas en mejorar habilidades específicas como mecanografía y ortografía.',
    url: 'https://www.vedoque.com/',
    claves: 'mecanografía ortografía lectoescritura',
  },
  {
    cat: 'practica',
    nombre: 'Math Playground',
    sigla: 'Ma',
    texto: 'Juegos especializados en matemáticas, desde aritmética hasta geometría y lógica.',
    url: 'https://es.mathplayground.com/',
    claves: 'matemáticas aritmética geometría fracciones',
  },

  /* ----------------- Lectura, Cultura y Apoyo Escolar -------------------- */
  {
    cat: 'lectura',
    nombre: 'Maguaré',
    sigla: 'Mg',
    texto: 'Portal cultural con juegos y cuentos folclóricos colombianos.',
    url: 'https://maguare.gov.co/',
    claves: 'colombia folclor cuentos cultura mincultura',
  },
  {
    cat: 'lectura',
    nombre: 'Árbol ABC',
    sigla: 'Á',
    texto: 'Juegos educativos para preescolar y primaria en español e inglés.',
    url: 'https://arbolabc.com/',
    claves: 'preescolar inglés lectura primeros grados',
  },
  {
    cat: 'lectura',
    nombre: 'Educa en Vivo',
    sigla: 'EV',
    texto: 'Recursos y transmisiones educativas para apoyo escolar.',
    url: 'https://educaenvivo.com/',
    claves: 'transmisiones apoyo escolar clases',
  },
  {
    cat: 'lectura',
    nombre: 'Cápsulas Educativas',
    sigla: 'Cá',
    texto: 'Recursos digitales del Ministerio de Educación de Colombia.',
    url: 'https://colombiaaprende.edu.co/',
    claves: 'colombia aprende men oficial ministerio',
  },
  {
    cat: 'lectura',
    nombre: 'Read Along',
    sigla: 'RA',
    texto: 'Herramienta de Google con asistente virtual para practicar la lectura en voz alta.',
    url: 'https://readalong.google.com/',
    claves: 'lectura en voz alta fluidez google',
  },
  {
    cat: 'lectura',
    nombre: 'Bosque de Fantasías',
    sigla: 'BF',
    texto: 'Cuentos, fábulas y recursos gramaticales para trabajar la comprensión lectora.',
    url: 'https://bosquedefantasias.com/',
    claves: 'cuentos fábulas comprensión lectora gramática',
  },
]
