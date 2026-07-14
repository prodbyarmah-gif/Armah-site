// French translations
// String-only dictionary. Keep keys aligned with other locale files.

const fr = {
  // Language label
  langName: "Français",

  // Nested i18n (used by UI)
  nav: {
    about: "BIO",
    live: "LIVE",
    shows: "SHOWS",
    beats: "BEAT",
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
    tapHint: "Touchez pour changer de vidéo",
    title: "MOMENTS LIVE",
    clipLabel: "Clip live",
  },

  about: {
    eyebrow: "BIO",
    title: "À PROPOS D’ARMAH",
    short:
      "Armah est un DJ et producteur basé à Hambourg, aux racines ghanéennes, qui mêle Afrobeats, Amapiano, Afro-House, UK, Hip-Hop, RnB et Dancehall dans des sets énergiques.",
    paragraph1:
      "Armah est un DJ et producteur basé à Hambourg, aux racines ghanéennes, avec un son qui relie Afrobeats, Amapiano, Afro-House, UK, Hip-Hop, RnB et Dancehall.",
    paragraph2:
      "Son style est énergique, rythmique et pensé pour le public. Il construit des sets qui créent du mouvement, posent les transitions avec intention et lisent l’énergie de la salle.",
    paragraph3:
      "Avec des passages dans des clubs, événements de marque et devant de plus grandes foules, notamment Golden Cut, BRICKS Berlin, Edelfettwerk, YOTO Hamburg et Foot Locker, Armah apporte une vraie expérience de scène.",
    paragraph4:
      "En parallèle du DJing, Armah produit sa propre musique, développe des projets créatifs et est cofondateur de ZAYA Dreams, un concept événementiel hambourgeois centré sur la culture, le son et la communauté.",
    facts: {
      base: "Basé à Hambourg",
      roots: "Racines ghanéennes",
      sound: "Afrobeats · Amapiano · Hip-Hop · RnB · Dancehall",
      project: "Cofondateur de ZAYA Dreams",
    },
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
    openSpotify: "Ouvrir sur Spotify",
  },

  beatCatalog: {
    title: "CATALOGUE DE BEATS",
    subtitle: "Quelques démos et collaborations.",
    demoLabel: "Note démo",
    demoDisclaimer: "Note : tous les aperçus sont des maquettes démo, pas des beats finalisés.",
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
      eventDate: "Date de l’événement",
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
      budget: {
        label: "Budget prévu",
        unspecified: "Budget non précisé",
        upTo150: "Jusqu’à 150 €",
        range150To250: "150–250 €",
        range250To400: "250–400 €",
        range400To600: "400–600 €",
        range600To1000: "600–1 000 €",
        over1000: "1 000 €+",
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
