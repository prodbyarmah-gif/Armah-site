// Spanish

const es = {
  common: {
    language: "Idioma",
    loading: "Cargando…",
    previewUnavailable: "Vista previa no disponible",
  },

  nav: {
    about: "BIO",
    live: "EN VIVO",
    shows: "SHOWS",
    beats: "BEAT",
    producer: "PRODUCTOR",
    booking: "BOOKING",
  },

  hero: {
    tagline: "DJ Afro & Amapiano — desde Hamburgo, creciendo internacionalmente.",
    cta: "SOLICITUD DE BOOKING",
  },

  live: {
    title: "MOMENTOS EN VIVO",
    clipLabel: "Clip en vivo",
  },

  about: {
    eyebrow: "BIO",
    title: "SOBRE ARMAH",
    short:
      "Armah es un DJ y productor de Hamburgo con raíces ghanesas, mezclando Afrobeats, Amapiano, Afro-House, UK, Hip-Hop, RnB y Dancehall en sets energéticos.",
    paragraph1:
      "Armah es DJ y productor de Hamburgo con raíces ghanesas y un sonido que conecta Afrobeats, Amapiano, Afro-House, UK, Hip-Hop, RnB y Dancehall.",
    paragraph2:
      "Su estilo es energético, rítmico y enfocado en la crowd. En lugar de solo poner canciones, construye sets que generan movimiento, cuidan las transiciones y leen la energía del lugar.",
    paragraph3:
      "Con experiencia en clubes, eventos de marca y públicos más grandes, incluyendo Golden Cut, BRICKS Berlin, Edelfettwerk, YOTO Hamburg y eventos de Foot Locker, Armah trae un sonido global con energía real de club.",
    paragraph4:
      "Además de DJ, Armah produce su propia música, trabaja en proyectos creativos y es cofundador de ZAYA Dreams, un concepto de eventos de Hamburgo enfocado en cultura, sonido y comunidad.",
    facts: {
      base: "Basado en Hamburgo",
      roots: "Raíces ghanesas",
      sound: "Afrobeats · Amapiano · Hip-Hop · RnB · Dancehall",
      project: "Cofundador de ZAYA Dreams",
    },
  },

  shows: {
    title: "SHOWS SELECCIONADOS",
  },


  trusted: {
    title: "CON LA CONFIANZA DE",
    prev: "Anterior",
    next: "Siguiente",
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
      missingFields: "Por favor completa Nombre, Email, Tipo de evento, Ubicación y Mensaje.",
      generic: "Algo salió mal.",
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
    tagline: "Built in rhythm. Played worldwide.",
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
} as const;

export default es;
