// Spanish

const es = {
  common: {
    language: "Idioma",
    loading: "Cargando…",
    previewUnavailable: "Vista previa no disponible",
  
    retry: "Intentar de nuevo",
  },

  nav: {
    about: "BIO",
    live: "EN VIVO",
    shows: "SHOWS",
    beats: "BEAT",
    producer: "PRODUCTOR",
    booking: "BOOKING",
  
    mixes: "MIXES",
  },

  hero: {
    tagline: "DJ y productor de Afrobeats & Amapiano.",
    cta: "SOLICITUD DE BOOKING",
  
    availability: "Desde Hamburgo. Bookings en Alemania, Europa y eventos internacionales seleccionados.",
  },

  live: {
    tapHint: "Toca para cambiar de vídeo",
    title: "MOMENTOS EN VIVO",
    clipLabel: "Clip en vivo",
  
    play: "Reproducir vídeo en directo",
  },

  about: {
    eyebrow: "BIO",
    title: "SOBRE ARMAH",
    short:
      "ARMAH es DJ y productor afincado en Hamburgo, con raíces ghanesas. Los Afrobeats y el Amapiano definen su sonido, junto al Dancehall y una selección de influencias de club británicas y globales.",
    paragraph1:
      "ARMAH es DJ y productor afincado en Hamburgo, con raíces ghanesas. Los Afrobeats y el Amapiano definen su sonido, junto al Dancehall y una selección de influencias de club británicas y globales.",
    paragraph2:
      "Su estilo es energético, rítmico y enfocado en la crowd. En lugar de solo poner canciones, construye sets que generan movimiento, cuidan las transiciones y leen la energía del lugar.",
    paragraph3:
      "Con experiencia en clubes, eventos de marca y públicos más grandes, incluyendo Golden Cut, BRICKS Berlin, Edelfettwerk, YOTO Hamburg y eventos de Foot Locker, Armah trae un sonido global con energía real de club.",
    paragraph4:
      "Además de DJ, Armah produce su propia música, trabaja en proyectos creativos y es cofundador de ZAYA Dreams, un concepto de eventos de Hamburgo enfocado en cultura, sonido y comunidad.",
    facts: {
      base: "Basado en Hamburgo",
      roots: "Raíces ghanesas",
      sound: "Afrobeats · Amapiano · Dancehall",
      project: "Cofundador de ZAYA Dreams",
    },
  
    portraitAlt: "ARMAH junto al agua por la noche",
    portraitCaption: "Sonido de Hamburgo. Raíces ghanesas.",
  },

  shows: {
    title: "SHOWS SELECCIONADOS",
  },


  trusted: {
    title: "CON LA CONFIANZA DE",
    prev: "Anterior",
    next: "Siguiente",
  
    subtitle: "Bookings seleccionados en Hamburgo y Berlín",
    repeat: "Invitado de nuevo",
    venueRelationship: "Relación con la sala",
    brandRelationship: "Relación con la marca",
  },

  youtube: {
    title: "YouTube",
    iframeTitle: "ARMAH - YouTube",
    openOnYoutube: "Abrir en YouTube",
    watch: "Ver en YouTube",
  },

  producer: {
    title: "PRODUCTOR",
    currentCollabLabel: "Colaboración actual",
    spotifyLabel: "Spotify",
    openSpotify: "Abrir en Spotify",
    releases: "Lanzamientos seleccionados",
    verifiedCredit: "Crédito de ARMAH verificado",
    creditPending: "Crédito de producción de ARMAH pendiente de confirmación",
    portfolioCredit: "Crédito de portfolio de ARMAH",
    platformRoleLabels: "Roles indicados por Spotify",
    listen: "Escuchar",
  },

  beatCatalog: {
    title: "CATÁLOGO DE BEATS",
    subtitle: "Algunas demos y colaboraciones.",
    demoLabel: "Nota demo",
    demoDisclaimer: "Nota: todas las vistas previas son demos, no beats finales terminados.",
    previewSeekHint: "Vista previa (haz clic en la onda para avanzar)",
    licenseInquiry: "Consulta de licencia",
    genres: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },
    idLabel: "ID",
    termsLine: "No exclusivo / exclusivo disponible",
    licensingLabel: "Licencias",
    licensingText: "No exclusivo • Exclusivo • Custom / Sync (pregunta)",
    previewPlay: "Reproducir",
    previewPause: "Pausar",
    with: "con",
    bpm: "BPM",
  },

  booking: {
    title: "SOLICITUD DE BOOKING",
    subtitle: "Para bookings, colaboraciones y apariciones.",
    inquiryType: "Tipo de consulta",
    djBooking: "DJ Booking",
    producerBeats: "Productor / Beats",

    // New structured keys added for Booking.tsx/Producer.tsx
    typeDj: "DJ Booking",
    typeProducer: "Productor / Beats",
    sending: "Enviando…",
    successTitle: "Mensaje enviado",
    successBody: "Te responderemos pronto.",

    fields: {
      name: "Nombre",
      email: "Email",
      eventType: "Tipo de evento",
      producerRequest: "Solicitud de productor",
      location: "Ubicación",
      eventDate: "Fecha del evento",
      beatSelect: "Seleccionar beat",
      message: "Mensaje",
    },

    placeholders: {
      name: "Tu nombre",
      email: "tu@email.com",
      selectType: "Seleccionar tipo",
      location: "Ciudad, País",
      chooseBeat: "Elige un beat…",
      messageDj: "Cuéntanos del evento…",
      messageProducer: "Dinos lo que necesitas (licencia, beat a medida, collab, etc.)…",
    },

    djEventTypes: {
      club: "Club show",
      festival: "Festival",
      private: "Evento privado",
      corporate: "Corporativo",
      other: "Otro",
    },

    producerTypes: {
      beat_license: "Licencia de beat",
      custom_beat: "Beat a medida",
      production: "Producción / Arreglo",
      mix_master: "Mezcla / Master",
      collab: "Collab",
      other: "Otro",
    },

    beatGroups: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },

    selectedBeat: {
      title: "Beat seleccionado",
      id: "ID",
      bpm: "BPM",
      genre: "Género",
    },

    errors: {
      selectBeat: "Por favor selecciona un beat para solicitudes de licencia.",
      missingFields: "Completa todos los campos obligatorios, incluida la fecha para bookings de DJ.",
      generic: "No se pudo confirmar tu solicitud. Tus datos siguen en el formulario. Inténtalo de nuevo o contacta con booking@prodbyarmah.com.",
    },
      budget: {
        label: "Presupuesto previsto",
        unspecified: "Presupuesto no especificado",
        upTo150: "Hasta 150 €",
        range150To250: "150–250 €",
        range250To400: "250–400 €",
        range400To600: "400–600 €",
        range600To1000: "600–1.000 €",
        over1000: "1.000 €+",
      },

    name: "Nombre",
    email: "Email",
    location: "Ubicación",
    message: "Mensaje",

    eventType: "Tipo de evento",
    producerRequest: "Solicitud de productor",

    beatSelection: "Selección de beat",
    selectBeat: "Elige un beat…",

    selectType: "Seleccionar tipo",
    yourName: "Tu nombre",
    yourEmail: "tu@email.com",
    cityCountry: "Ciudad, País",
    tellUs: "Cuéntanos del evento…",

    send: "ENVIAR",

    technicalRider: "Rider técnico",
    hospitalityRider: "Rider hospitality",
  },

  footer: {
    tagline: "Afrobeats. Amapiano. Raíces en Hamburgo.",
    navigation: "Navegación",
    connect: "Connect",
    rights: "Todos los derechos reservados.",
  },

  legal: {
    impressum: "Aviso legal",
    privacy: "Privacidad",
  },

  // Backward-compat (older flat keys still referenced in some components)
  langName: "Español",


  hero_tagline: "DJ Afro & Amapiano — desde Hamburgo, creciendo internacionalmente.",
  hero_cta_booking: "SOLICITUD DE BOOKING",

  title_live_moments: "MOMENTOS EN VIVO",
  title_selected_shows: "SHOWS SELECCIONADOS",
  title_booking_inquiry: "SOLICITUD DE BOOKING",
  title_producer: "PRODUCTOR",
  title_beat_catalog: "CATÁLOGO DE BEATS",

  booking_email_hint: "Para bookings, colaboraciones y apariciones.",
  booking_inquiry_type: "Tipo de consulta",
  booking_type_dj: "DJ Booking",
  booking_type_producer: "Productor / Beats",

  booking_field_name: "Nombre",
  booking_field_email: "Email",
  booking_field_location: "Ubicación",
  booking_field_message: "Mensaje",
  booking_field_event_type: "Tipo de evento",
  booking_field_producer_request: "Solicitud de productor",

  booking_placeholder_name: "Tu nombre",
  booking_placeholder_email: "tu@email.com",
  booking_placeholder_location: "Ciudad, País",
  booking_placeholder_select_type: "Seleccionar tipo",

  booking_button_send: "ENVIAR",

  booking_beat_selection: "Selección de beat",
  booking_beat_select_placeholder: "Elige un beat…",
  booking_license_inquiry: "Consulta de licencia",

  producer_current_collab: "Colaboración actual",
  producer_browse_hint: "Algunas demos y colaboraciones.",
  producer_preview_seek_hint: "Vista previa (haz clic en la onda para avanzar)",

  rider_technical: "Rider técnico",
  rider_hospitality: "Rider hospitality",

  common_loading: "Cargando…",
  common_preview_unavailable: "Vista previa no disponible",

  mixes: {
    "featured": "Live set destacado",
    "more": "Más mixes",
    "play": "Reproducir mix",
    "watch": "Ver en YouTube",
    "booking": "Invita a ARMAH a tu evento",
    "connection": "La reproducción establece una conexión con YouTube."
  },
  map: {
    "country": "Alemania",
    "history": "Historial de bookings",
    "openCountry": "Ver Alemania",
    "openCity": "Explorar esta ciudad",
    "back": "Volver a Alemania",
    "chooseEvent": "Elegir evento",
    "allEvents": "Todos los eventos",
    "instagram": "Ver en Instagram",
    "chooseCity": "Elegir ciudad",
    "world": "Mundo",
    "own": "Evento propio",
    "guest": "Artista invitado",
    "close": "Cerrar",
    "details": "Detalles",
    "approximate": "Posición aproximada",
    "events": "Eventos",
    "venues": "Lugares",
    "clusterHint": "lugares cercanos — actívalos para elegir",
    "chooseVenue": "Elegir lugar"
  },
  accessibility: {
    "navigation": "Navegación principal",
    "home": "Inicio",
    "openMenu": "Abrir menú",
    "closeMenu": "Cerrar menú",
    "skip": "Ir al contenido",
    "resources": "Prensa & booking"
  },
} as const;

export default es;
