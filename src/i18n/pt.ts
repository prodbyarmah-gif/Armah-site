// Portuguese translations
// String-only dictionary. Keep keys aligned with other locale files.

const pt = {
  // Language label
  langName: "Português",
  nav: {
    live: "AO VIVO",
    shows: "SHOWS",
    producer: "PRODUTOR",
    booking: "BOOKING",
  },

  // Hero
  hero: {
    tagline: "DJ Afro & Amapiano — baseado em Hamburgo, a expandir internacionalmente.",
    cta: "PEDIDO DE BOOKING",
  },

  // Sections / titles
  title_live_moments: "MOMENTOS AO VIVO",
  title_booking_inquiry: "PEDIDO DE BOOKING",
  title_producer: "PRODUTOR",
  title_beat_catalog: "CATÁLOGO DE BEATS",
  title_selected_shows: "SHOWS SELECIONADOS",

  // New structured keys (preferred by components)
  live: {
    title: "MOMENTOS AO VIVO",
  },

  shows: {
    title: "SHOWS SELECIONADOS",
  },

  producer: {
    title: "PRODUTOR",
    currentCollab: "Colaboração atual",
    currentCollabLabel: "Colaboração atual",
    spotifyLabel: "Spotify",
    browseHint: "Explora alguns rascunhos e colaborações.",
    previewSeekHint: "Prévia (clique na forma de onda para avançar)",
    links: {
      soundcloud: "SoundCloud",
      beatstars: "BeatStars",
      youtube: "YouTube",
    },
  },

  beatCatalog: {
    title: "CATÁLOGO DE BEATS",
    subtitle: "Explora alguns rascunhos e colaborações.",
    previewSeekHint: "Prévia (clique na forma de onda para avançar)",
    licenseInquiry: "Pedido de licença",
    genres: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },
    idLabel: "ID",
    termsLine: "Não-exclusivo / exclusivo disponível",
    licensingLabel: "Licenças",
    licensingText: "Não-exclusivo • Exclusivo • Custom / Sync (perguntar)",
    previewPlay: "Play",
    previewPause: "Pause",
    with: "com",
    bpm: "BPM",
  },

  booking: {
    title: "PEDIDO DE BOOKING",
    subtitle: "Para bookings, colaborações e aparições.",
    technicalRider: "Rider técnico",
    hospitalityRider: "Rider de hospitality",
    send: "ENVIAR",
    sending: "A enviar…",
    successTitle: "Mensagem enviada",
    successBody: "Vamos responder em breve.",
    emailHint: "Para bookings, colaborações e aparições.",
    inquiryType: "Tipo de pedido",
    typeDj: "DJ Booking",
    typeProducer: "Produtor / Beats",
    fields: {
      name: "Nome",
      email: "Email",
      location: "Local",
      message: "Mensagem",
      eventType: "Tipo de evento",
      producerRequest: "Pedido de produtor",
      beatSelection: "Seleção de beat",
      beatSelect: "Selecionar beat",
    },
    placeholders: {
      name: "O teu nome",
      email: "teu@email.com",
      location: "Cidade, País",
      selectType: "Selecionar tipo",
      beatSelect: "Escolhe um beat…",
      chooseBeat: "Escolhe um beat…",
      messageDj: "Fala-nos do teu evento…",
      messageProducer: "Diz-nos o que precisas (licença, custom beat, collab, etc.)…",
    },
    buttons: {
      send: "ENVIAR",
      licenseInquiry: "Pedido de licença",
    },
    djEventTypes: {
      club: "Club Show",
      festival: "Festival",
      private: "Evento privado",
      corporate: "Corporate",
      other: "Outro",
    },
    producerTypes: {
      beat_license: "Licença de beat",
      custom_beat: "Custom beat",
      production: "Production / Arrangement",
      mix_master: "Mixing / Mastering",
      collab: "Collab",
      other: "Outro",
    },
    beatGroups: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },
    selectedBeat: {
      title: "Beat selecionado",
      id: "ID",
      bpm: "BPM",
      genre: "Género",
    },
    errors: {
      selectBeat: "Por favor seleciona um beat para pedidos de licença.",
      missingFields: "Por favor preenche Nome, Email, Tipo de evento, Local e Mensagem.",
      generic: "Algo correu mal.",
    },
  },


  trusted: {
    title: "CONFIADO POR",
    prev: "Anterior",
    next: "Seguinte",
  },

  youtube: {
    title: "YouTube",
    iframeTitle: "ARMAH - YouTube",
    openOnYoutube: "Abrir no YouTube",
    watch: "Ver no YouTube",
  },

  footer: {
    tagline: "Construído com ritmo. Tocando pelo mundo.",
    navigation: "Navegação",
    connect: "Contacto",
    rights: "Todos os direitos reservados.",
  },

  legal: {
    impressum: "Aviso legal",
    privacy: "Privacidade",
  },

  // Booking
  booking_email_hint: "Para bookings, colaborações e aparições.",
  booking_inquiry_type: "Tipo de pedido",
  booking_type_dj: "DJ Booking",
  booking_type_producer: "Produtor / Beats",

  booking_field_name: "Nome",
  booking_field_email: "Email",
  booking_field_location: "Local",
  booking_field_message: "Mensagem",
  booking_field_event_type: "Tipo de evento",
  booking_field_producer_request: "Pedido de produtor",
  booking_placeholder_name: "O teu nome",
  booking_placeholder_email: "teu@email.com",
  booking_placeholder_location: "Cidade, País",
  booking_placeholder_select_type: "Selecionar tipo",
  booking_button_send: "ENVIAR",

  // Beat licensing / selection
  booking_beat_selection: "Seleção de beat",
  booking_beat_select_placeholder: "Escolhe um beat…",
  booking_license_inquiry: "Pedido de licença",

  // Producer / beats
  producer_current_collab: "Colaboração atual",
  producer_links_soundcloud: "SoundCloud",
  producer_links_beatstars: "BeatStars",
  producer_links_youtube: "YouTube",
  producer_browse_hint: "Explora alguns rascunhos e colaborações.",
  producer_preview_seek_hint: "Prévia (clique na forma de onda para avançar)",

  // Riders
  rider_technical: "Rider técnico",
  rider_hospitality: "Rider de hospitality",

  // Generic
  common_loading: "A carregar…",
  common_preview_unavailable: "Prévia indisponível",
  common: {
    loading: "A carregar…",
    previewUnavailable: "Prévia indisponível",
  },
} as const;

export default pt;