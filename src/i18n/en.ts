// English

const en = {
  common: {
    language: "Language",
    loading: "Loading…",
    previewUnavailable: "Preview unavailable",
  },

  nav: {
    about: "BIO",
    live: "LIVE",
    shows: "SHOWS",
    beats: "BEAT",
    producer: "PRODUCER",
    booking: "BOOKING",
  },

  hero: {
    tagline: "Afro & Amapiano driven DJ — Hamburg based, expanding internationally.",
    cta: "BOOKING INQUIRY",
  },

  live: {
    tapHint: "Tap to switch videos",
    title: "LIVE MOMENTS",
    clipLabel: "Live Clip",
  },

  about: {
    eyebrow: "BIO",
    title: "ABOUT ARMAH",
    short:
      "Armah is a Hamburg-based DJ and producer with Ghanaian roots, known for blending Afrobeats, Amapiano, Afro-House, UK, Hip-Hop, RnB and Dancehall into high-energy sets built for real movement.",
    paragraph1:
      "Armah is a Hamburg-based DJ and producer with Ghanaian roots, connecting Afrobeats, Amapiano, Afro-House, UK, Hip-Hop, RnB and Dancehall into a sound shaped by rhythm, culture and club energy.",
    paragraph2:
      "His sets are energetic, rhythmic and crowd-focused. Instead of simply playing songs, Armah builds moments, reads the room and creates transitions that move people from listening into full participation.",
    paragraph3:
      "With experience across clubs, brand events and larger crowds, including Golden Cut, BRICKS Berlin, Edelfettwerk, YOTO Hamburg and Foot Locker events, his sound connects global rhythms with community and raw dancefloor energy.",
    paragraph4:
      "Alongside DJing, Armah produces his own music, works on creative projects and is co-founder of ZAYA Dreams, a Hamburg event concept focused on culture, sound and community.",
    facts: {
      base: "Hamburg-based",
      roots: "Ghanaian roots",
      sound: "Afrobeats · Amapiano · Hip-Hop · RnB · Dancehall",
      project: "Co-founder of ZAYA Dreams",
    },
  },

  shows: {
    title: "SELECTED SHOWS",
  },

  trusted: {
    title: "TRUSTED BY",
    prev: "Previous",
    next: "Next",
  },

  youtube: {
    title: "YouTube",
    iframeTitle: "ARMAH - YouTube",
    openOnYoutube: "Open on YouTube",
    watch: "Watch on YouTube",
  },

  producer: {
    title: "PRODUCER",
    currentCollabLabel: "Current collaboration",
    spotifyLabel: "Spotify",
    openSpotify: "Open on Spotify",
  },

  beatCatalog: {
    title: "BEAT CATALOG",
    subtitle: "Browse a few drafts & collaborations.",
    demoLabel: "Demo note",
    demoDisclaimer: "Note: All previews are demo sketches and not final fully produced beats.",
    previewSeekHint: "Preview (click waveform to seek)",
    licenseInquiry: "License inquiry",
    genres: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },
    idLabel: "ID",
    termsLine: "Non-exclusive / exclusive available",
    licensingLabel: "Licensing",
    licensingText: "Non-exclusive • Exclusive • Custom / Sync (ask)",
    previewPlay: "Play",
    previewPause: "Pause",
    with: "with",
    bpm: "BPM",
  },

  booking: {
    title: "BOOKING INQUIRY",
    subtitle: "For bookings, collaborations and appearances.",
    inquiryType: "Inquiry Type",
    djBooking: "DJ Booking",
    producerBeats: "Producer / Beats",

    // New structured keys
    typeDj: "DJ Booking",
    typeProducer: "Producer / Beats",
    sending: "Sending…",
    successTitle: "Message sent",
    successBody: "We will get back to you soon.",

    fields: {
      name: "Name",
      email: "Email",
      eventType: "Event Type",
      producerRequest: "Producer Request",
      location: "Location",
      beatSelect: "Select Beat",
      message: "Message",
    },
    placeholders: {
      name: "Your name",
      email: "your@email.com",
      selectType: "Select type",
      location: "City, Country",
      chooseBeat: "Choose a beat…",
      messageDj: "Tell us about your event…",
      messageProducer: "Tell us what you need (license, custom beat, collab, etc.)…",
    },
    djEventTypes: {
      club: "Club Show",
      festival: "Festival",
      private: "Private Event",
      corporate: "Corporate",
      other: "Other",
    },
    producerTypes: {
      beat_license: "Beat license",
      custom_beat: "Custom beat",
      production: "Production / Arrangement",
      mix_master: "Mixing / Mastering",
      collab: "Collab",
      other: "Other",
    },
    beatGroups: {
      afro: "Afro",
      drill: "Drill",
      trap: "Trap",
    },
    selectedBeat: {
      title: "Selected beat",
      id: "ID",
      bpm: "BPM",
      genre: "Genre",
    },
    errors: {
      selectBeat: "Please select a beat for Beat licensing inquiries.",
      missingFields: "Please fill in Name, Email, Event Type, Location, and Message.",
      generic: "Something went wrong.",
    },
    budget: {
      label: "Planned budget",
      unspecified: "Budget not specified",
      upTo150: "Up to €150",
      range150To250: "€150–250",
      range250To400: "€250–400",
      range400To600: "€400–600",
      range600To1000: "€600–1,000",
      over1000: "€1,000+",
    },

    name: "Name",
    email: "Email",
    location: "Location",
    message: "Message",

    eventType: "Event Type",
    producerRequest: "Producer Request",

    beatSelection: "Beat selection",
    selectBeat: "Choose a beat…",

    selectType: "Select type",
    yourName: "Your name",
    yourEmail: "your@email.com",
    cityCountry: "City, Country",
    tellUs: "Tell us about your event…",

    send: "SEND INQUIRY",

    technicalRider: "Technical Rider",
    hospitalityRider: "Hospitality Rider",
  },

  footer: {
    tagline: "Built in rhythm. Played worldwide.",
    navigation: "Navigation",
    connect: "Connect",
    rights: "All rights reserved.",
  },

  legal: {
    impressum: "Imprint",
    privacy: "Privacy",
  },

  // Backward-compat (older flat keys still referenced in some components)
  title_live_moments: "LIVE MOMENTS",
  title_selected_shows: "SELECTED SHOWS",
  title_producer: "PRODUCER",
  title_beat_catalog: "BEAT CATALOG",

  producer_browse_hint: "Browse a few drafts & collaborations.",
  producer_current_collab: "Current collaboration",
  producer_preview_seek_hint: "Preview (click waveform to seek)",

  common_loading: "Loading…",
  common_preview_unavailable: "Preview unavailable",

  booking_license_inquiry: "License inquiry",
  title_booking_inquiry: "BOOKING INQUIRY",
  booking_email_hint: "For bookings, collaborations and appearances.",
  booking_inquiry_type: "Inquiry Type",
  booking_type_dj: "DJ Booking",
  booking_type_producer: "Producer / Beats",
  booking_field_name: "Name",
  booking_field_email: "Email",
  booking_field_location: "Location",
  booking_field_message: "Message",
  booking_field_event_type: "Event Type",
  booking_field_producer_request: "Producer Request",
  booking_placeholder_name: "Your name",
  booking_placeholder_email: "your@email.com",
  booking_placeholder_location: "City, Country",
  booking_placeholder_select_type: "Select type",
  booking_button_send: "SEND INQUIRY",
  booking_beat_selection: "Beat selection",
  booking_beat_select_placeholder: "Choose a beat…",

  rider_technical: "Technical Rider",
  rider_hospitality: "Hospitality Rider",

  // Older booking/producers keys (camelCase/legacy)
  booking_title: "BOOKING INQUIRY",
  booking_subtitle: "For bookings, collaborations and appearances.",
  booking_inquiryType: "Inquiry Type",
  booking_dj: "DJ Booking",
  booking_producer: "Producer / Beats",
  booking_name: "Name",
  booking_email: "Email",
  booking_location: "Location",
  booking_message: "Message",
  booking_eventType: "Event Type",
  booking_selectType: "Select type",
  booking_producerRequest: "Producer Request",
  booking_beatSelection: "Beat selection",
  booking_beatSelectPlaceholder: "Select a beat",
  booking_send: "SEND INQUIRY",

  producer_title: "PRODUCER",
  producer_currentCollab: "Current collaboration",

  beats_title: "BEAT CATALOG",
  beats_subtitle: "Browse a few drafts & collaborations.",
  beats_licenseInquiry: "License inquiry",
  beats_previewUnavailable: "Preview unavailable",

  files_technicalRider: "Technical Rider",
  files_hospitalityRider: "Hospitality Rider",

  lang_label: "Language",
} as const;

export default en;
