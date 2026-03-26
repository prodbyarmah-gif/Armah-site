const de = {
  common: {
    language: "Sprache",
    loading: "Lädt…",
    previewUnavailable: "Preview nicht verfügbar",
  },

  nav: {
    live: "LIVE",
    shows: "SHOWS",
    producer: "PRODUCER",
    booking: "BOOKING",
  },

  hero: {
    tagline: "Afro- & Amapiano-DJ — aus Hamburg, international unterwegs.",
    cta: "BOOKING ANFRAGE",
  },

  live: {
    title: "LIVE MOMENTS",
    clipLabel: "Live Clip",
  },

  shows: {
    title: "AUSGEWÄHLTE SHOWS",
  },

  trusted: {
    title: "VERTRAUT VON",
    prev: "Zurück",
    next: "Weiter",
  },

  youtube: {
    title: "YouTube",
    iframeTitle: "ARMAH - YouTube",
    openOnYoutube: "Auf YouTube öffnen",
    watch: "Auf YouTube ansehen",
  },

  producer: {
    title: "PRODUCER",
    currentCollabLabel: "Aktuelle Kollaboration",
    spotifyLabel: "Spotify",
  },

  beatCatalog: {
    title: "BEAT-KATALOG",
    subtitle: "Ein paar Drafts & Kollaborationen.",
    previewSeekHint: "Preview (Waveform klicken zum Springen)",
    licenseInquiry: "Lizenz anfragen",
    genres: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },
    idLabel: "ID",
    termsLine: "Non-exclusive / exclusive verfügbar",
    licensingLabel: "Lizenzierung",
    licensingText: "Non-exclusive • Exclusive • Custom / Sync (anfragen)",
    previewPlay: "Abspielen",
    previewPause: "Pause",
    with: "mit",
    bpm: "BPM",
  },

  booking: {
    title: "BOOKING ANFRAGE",
    subtitle: "Für Bookings, Kollaborationen und Auftritte.",
    inquiryType: "Anfrage-Typ",
    djBooking: "DJ Booking",
    producerBeats: "Producer / Beats",

    typeDj: "DJ Booking",
    typeProducer: "Producer / Beats",
    sending: "Senden…",
    successTitle: "Gesendet",
    successBody: "Wir melden uns zeitnah bei dir.",

    name: "Name",
    email: "E-Mail",
    location: "Ort",
    message: "Nachricht",

    fields: {
      name: "Name",
      email: "E-Mail",
      eventType: "Event-Typ",
      producerRequest: "Producer Anfrage",
      location: "Ort",
      beatSelect: "Beat auswählen",
      message: "Nachricht",
    },

    placeholders: {
      name: "Dein Name",
      email: "dein@email.de",
      selectType: "Typ wählen",
      location: "Stadt, Land",
      chooseBeat: "Beat auswählen…",
      messageDj: "Erzähl uns kurz vom Event…",
      messageProducer: "Sag uns, was du brauchst (License, Custom Beat, Collab, etc.)…",
    },

    djEventTypes: {
      club: "Club Show",
      festival: "Festival",
      private: "Private Event",
      corporate: "Corporate",
      other: "Sonstiges",
    },
    producerTypes: {
      beat_license: "Beat-Lizenz",
      custom_beat: "Custom Beat",
      production: "Produktion / Arrangement",
      mix_master: "Mixing / Mastering",
      collab: "Collab",
      other: "Sonstiges",
    },

    beatSelection: "Beat-Auswahl",
    selectBeat: "Beat auswählen…",

    beatGroups: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },

    selectedBeat: {
      title: "Ausgewählter Beat",
      id: "ID",
      bpm: "BPM",
      genre: "Genre",
    },

    errors: {
      selectBeat: "Bitte wähle einen Beat für Beat-Licensing aus.",
      missingFields: "Bitte fülle Name, E-Mail, Event-Typ, Ort und Nachricht aus.",
      generic: "Etwas ist schiefgelaufen.",
    },

    selectType: "Typ wählen",
    yourName: "Dein Name",
    yourEmail: "dein@email.de",
    cityCountry: "Stadt, Land",
    tellUs: "Erzähl uns kurz vom Event…",

    send: "ANFRAGE SENDEN",

    technicalRider: "Technischer Rider",
hospitalityRider: "Hospitality (Rider)",
  },

  footer: {
    tagline: "Built in rhythm. Played worldwide.",
    navigation: "Navigation",
    connect: "Connect",
    rights: "Alle Rechte vorbehalten.",
  },

  legal: {
    impressum: "Impressum",
    privacy: "Datenschutz",
  },

  // Backward-compat
  title_live_moments: "LIVE MOMENTS",
  title_selected_shows: "AUSGEWÄHLTE SHOWS",
  title_producer: "PRODUCER",
  title_beat_catalog: "BEAT CATALOG",
  producer_browse_hint: "Ein paar Drafts & Kollaborationen.",
  producer_current_collab: "Aktuelle Kollaboration",
  producer_preview_seek_hint: "Preview (Waveform klicken zum Springen)",
  booking_license_inquiry: "Lizenz anfragen",
  common_loading: "Lädt…",
  common_preview_unavailable: "Preview nicht verfügbar",
} as const;

export default de;
