export type ProducerRelease = {
  id: string;
  title: string;
  artists: string;
  platformUrl: string;
  artwork: string;
  /** Official Spotify oEmbed thumbnail URL used to create the local derivative. */
  artworkSource: string;
  /** Owner/session context: ARMAH's public portfolio contribution. */
  portfolioRoles: readonly string[];
  /** Exact platform role labels. These are evidence, not a claim about beat authorship. */
  spotifyRoleLabels: readonly string[];
};

/**
 * Evidence layers are deliberately separate. `spotifyRoleLabels` preserves the
 * platform's language; `portfolioRoles` describes ARMAH's owner-confirmed
 * contribution and must never be used to infer another person's authorship.
 */
export const producerReleases: readonly ProducerRelease[] = [
  {
    id: 'german-borga',
    title: 'German Borga',
    artists: 'Stephen Jounior',
    platformUrl: 'https://open.spotify.com/intl-de/track/1h3huetUjM2E6ccNs84rF3?si=1c4df676167f4aca',
    artwork: '/assets/media/releases/german-borga-600.webp',
    artworkSource: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02957a55b4082f37ee57fae9e1',
    portfolioRoles: ['Composer', 'Producer', 'Mixing', 'Mastering', 'Bass Guitar', 'Background Vocals'],
    spotifyRoleLabels: ['Composer', 'Studio Producer', 'Mixing Engineer', 'Mastering Engineer', 'Bass Guitar', 'Background Vocals'],
  },
  {
    id: 'bundesliga',
    title: 'Bundesliga',
    artists: 'Stephen Jounior & NK3',
    platformUrl: 'https://open.spotify.com/intl-de/track/3Mf5jsUc30w9PAfrM5LWvK?si=c5b2f6818b364c7d',
    artwork: '/assets/media/releases/bundesliga-600.webp',
    artworkSource: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02a88b9f2f95976a8784f158c6',
    portfolioRoles: ['Composer', 'Producer'],
    spotifyRoleLabels: ['Composer', 'Producer'],
  },
  {
    id: 'comeback-season',
    title: 'Comeback Season',
    artists: 'Stephen Jounior',
    platformUrl: 'https://open.spotify.com/intl-de/track/4OHgaDZPsAemSCikAgFKqr?si=ed4505e96e144fae',
    artwork: '/assets/media/releases/comeback-season-600.webp',
    artworkSource: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d742ce81907f8bf03e6a6952',
    portfolioRoles: ['Composer', 'Producer', 'Bass Guitar'],
    spotifyRoleLabels: ['Composer', 'Producer', 'Bass Guitar'],
  },
  {
    id: 'break-from-germany',
    title: 'Break From Germany',
    artists: 'Stephen Jounior & Yima Malik',
    platformUrl: 'https://open.spotify.com/intl-de/track/38ZFS6DGwTP6BL0mEVUEdI?si=88feede361974aee',
    artwork: '/assets/media/releases/break-from-germany-600.webp',
    artworkSource: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02a634f1f519ea4d7dc5c0ce34',
    portfolioRoles: ['Composer', 'Producer', 'Background Vocals'],
    spotifyRoleLabels: ['Composer', 'Producer', 'Background Vocals'],
  },
  {
    id: 'berlin-wall',
    title: 'Berlin Wall',
    artists: 'Stephen Jounior, YXNGBOIQ & Yima Malik',
    platformUrl: 'https://open.spotify.com/intl-de/track/4SrqKPTiHd2BQXntPMiz5a',
    artwork: '/assets/media/releases/berlin-wall-600.webp',
    artworkSource: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e023363aa2c3d897972bf37ec17',
    portfolioRoles: ['Composer', 'Producer'],
    spotifyRoleLabels: ['Composer', 'Producer'],
  },
] as const;
