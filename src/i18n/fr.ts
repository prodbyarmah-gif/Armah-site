// French translations
// String-only dictionary. Keep keys aligned with other locale files.

const fr = {
  // Language label
  langName: "Français",

  // Nested i18n (used by UI)
  nav: {
    live: "LIVE",
    shows: "SHOWS",
    producer: "PRODUCTEUR",
    booking: "BOOKING",
  },

  hero: {
    tagline: "DJ Afro & Amapiano — basé à Hambourg, en expansion à l’international.",
    cta: "DEMANDE DE BOOKING",
  },

  // Structured keys (preferred by components)
  common: {
    language: "Langue",
    loading: "Chargement…",
    previewUnavailable: "Aperçu indisponible",
  },

  live: {
    title: "MOMENTS LIVE",
    clipLabel: "Clip live",
  },

  shows: {
    title: "SHOWS SÉLECTIONNÉS",
  },


  trusted: {
    title: "ILS NOUS FONT CONFIANCE",
    prev: "Précédent",
    next: "Suivant",
  },

  youtube: {
    title: "YouTube",
    iframeTitle: "ARMAH - YouTube",
    openOnYoutube: "Ouvrir sur YouTube",
    watch: "Voir sur YouTube",
  },

  producer: {
    title: "PRODUCER",
    currentCollabLabel: "Collaboration actuelle",
    spotifyLabel: "Spotify",
  },

  beatCatalog: {
    title: "CATALOGUE DE BEATS",
    subtitle: "Quelques démos et collaborations.",
    previewSeekHint: "Aperçu (clique sur la forme d’onde pour avancer)",
    licenseInquiry: "Demande de licence",
    genres: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },
    idLabel: "ID",
    termsLine: "Non-exclusif / exclusif disponible",
    licensingLabel: "Licences",
    licensingText: "Non-exclusif • Exclusif • Custom / Sync (demander)",
    previewPlay: "Lecture",
    previewPause: "Pause",
    with: "avec",
    bpm: "BPM",
  },

  booking: {
    title: "DEMANDE DE BOOKING",
    subtitle: "Pour les bookings, collaborations et apparitions.",
    inquiryType: "Type de demande",
    typeDj: "DJ Booking",
    typeProducer: "Producteur / Beats",

    technicalRider: "Rider technique",
    hospitalityRider: "Rider hospitality",

    sending: "Envoi…",
    send: "ENVOYER",

    successTitle: "Message envoyé",
    successBody: "Nous te répondrons rapidement.",

    fields: {
      name: "Nom",
      email: "Email",
      eventType: "Type d’événement",
      producerRequest: "Demande producteur",
      location: "Lieu",
      beatSelect: "Sélectionner un beat",
      message: "Message",
    },

    placeholders: {
      name: "Ton nom",
      email: "ton@email.com",
      selectType: "Choisir un type",
      location: "Ville, Pays",
      chooseBeat: "Choisis un beat…",
      messageDj: "Parle-nous de ton événement…",
      messageProducer: "Dis-nous ce dont tu as besoin (licence, beat sur mesure, collab, etc.)…",
    },

    djEventTypes: {
      club: "Club Show",
      festival: "Festival",
      private: "Événement privé",
      corporate: "Corporate",
      other: "Autre",
    },

    producerTypes: {
      beat_license: "Licence de beat",
      custom_beat: "Beat sur mesure",
      production: "Production / Arrangement",
      mix_master: "Mixage / Master",
      collab: "Collab",
      other: "Autre",
    },

    beatGroups: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },

    selectedBeat: {
      title: "Beat sélectionné",
      id: "ID",
      bpm: "BPM",
      genre: "Genre",
    },

    errors: {
      selectBeat: "Merci de sélectionner un beat pour une demande de licence.",
      missingFields: "Merci de remplir Nom, Email, Type d’événement, Lieu et Message.",
      generic: "Une erreur s’est produite.",
    },
  },

  footer: {
    tagline: "Built in rhythm. Played worldwide.",
    navigation: "Navigation",
    connect: "Contact",
    rights: "Tous droits réservés.",
  },

  legal: {
    impressum: "Mentions légales",
    privacy: "Confidentialité",
  },

  // Sections / titles
  title_live_moments: "MOMENTS LIVE",
  title_selected_shows: "SHOWS SÉLECTIONNÉS",
  title_booking_inquiry: "DEMANDE DE BOOKING",
  title_producer: "PRODUCER",
  title_beat_catalog: "CATALOGUE DE BEATS",

  // Booking
  booking_email_hint: "Pour les bookings, collaborations et apparitions.",
  booking_inquiry_type: "Type de demande",
  booking_type_dj: "DJ Booking",
  booking_type_producer: "Producteur / Beats",

  booking_field_name: "Nom",
  booking_field_email: "Email",
  booking_field_location: "Lieu",
  booking_field_message: "Message",
  booking_field_event_type: "Type d’événement",
  booking_field_producer_request: "Demande producteur",
  booking_placeholder_name: "Ton nom",
  booking_placeholder_email: "ton@email.com",
  booking_placeholder_location: "Ville, Pays",
  booking_placeholder_select_type: "Choisir un type",
  booking_button_send: "ENVOYER",

  // Beat licensing / selection
  booking_beat_selection: "Sélection du beat",
  booking_beat_select_placeholder: "Choisis un beat…",
  booking_license_inquiry: "Demande de licence",

  // Producer / beats
  producer_current_collab: "Collaboration actuelle",
  producer_links_soundcloud: "SoundCloud",
  producer_links_beatstars: "BeatStars",
  producer_links_youtube: "YouTube",

  // Riders
  rider_technical: "Rider technique",
  rider_hospitality: "Rider hospitality",

  // Generic
  common_loading: "Chargement…",
  common_preview_unavailable: "Aperçu indisponible",
} as const;

export default fr;
