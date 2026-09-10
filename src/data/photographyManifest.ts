/**
 * Canonical source-of-truth for approved ARMAH photography roles.
 *
 * This file intentionally does not choose website placements or alter any
 * production asset. A role is only final when the owner has approved it.
 */
export type PhotographyRole =
  | 'PH-01'
  | 'PH-02'
  | 'PH-03'
  | 'PH-04'
  | 'PH-05'
  | 'PH-06'
  | 'PH-07'
  | 'PH-08'
  | 'PH-09'
  | 'PH-10';

export type PhotographyCategory =
  | 'press'
  | 'club-editorial'
  | 'live'
  | 'editorial'
  | 'producer'
  | 'social-lifestyle';

export type ApprovalStatus =
  | 'owner-approved'
  | 'owner-review'
  | 'candidate-unresolved'
  | 'inherited-production';

export type SourceStatus = 'current' | 'recovered-from-git' | 'missing-owner-supplied';

type AssetUsage = 'main-website' | 'digital-epk' | 'pdf-epk' | 'press-download' | 'booking-promoter' | 'social-og' | 'live-video';

export interface PhotographyAsset {
  id: string;
  sourceFile: string;
  publicFile: string | null;
  sourceStatus: Exclude<SourceStatus, 'missing-owner-supplied'>;
  role: PhotographyRole | null;
  roleCandidate: readonly PhotographyRole[];
  category: PhotographyCategory;
  orientation: 'landscape' | 'portrait';
  dimensions: { width: number; height: number };
  format: 'JPEG';
  fileSizeBytes: number;
  sha256: string;
  priority: 'very-high' | 'high' | 'medium';
  approvalStatus: ApprovalStatus;
  alreadyUsedPublicly: boolean;
  usage: readonly AssetUsage[];
  doNotUseFor: readonly string[];
  alt: string;
  cropStrategy: string;
  notes: string;
}

export interface UnresolvedPhotographyRole {
  id: PhotographyRole;
  sourceStatus: Extract<SourceStatus, 'missing-owner-supplied'> | 'candidate-pool-only';
  category: PhotographyCategory;
  priority: 'very-high' | 'high' | 'medium';
  approvalStatus: 'owner-review' | 'candidate-unresolved';
  candidateAssetIds: readonly string[];
  requiredDescription: string;
  intendedUsage: readonly AssetUsage[];
  notes: string;
}

const assets = [
  {
    id: 'PH-02',
    sourceFile: 'assets/source/official/PH-02-hero-club-editorial.jpg',
    publicFile: 'public/assets/hero-bg.jpg',
    sourceStatus: 'current',
    role: 'PH-02',
    roleCandidate: [],
    category: 'club-editorial',
    orientation: 'landscape',
    dimensions: { width: 1280, height: 720 },
    format: 'JPEG',
    fileSizeBytes: 221556,
    sha256: 'fd62e69fc3bf088cd455021cfec3482758828af7b99589f6436d9c3fe73fe01c',
    priority: 'very-high',
    approvalStatus: 'owner-approved',
    alreadyUsedPublicly: true,
    usage: ['main-website', 'digital-epk', 'pdf-epk', 'social-og'],
    doNotUseFor: ['press-primary', 'press-download'],
    alt: 'ARMAH DJing in a dark red-lit club.',
    cropStrategy: 'Preserve the subject on the left and the right-side negative space; do not tightly crop the DJ equipment.',
    notes: 'Confirmed owner role. The production original remains intact at public/assets/hero-bg.jpg; responsive derivatives are separate files.',
  },
  {
    id: 'PH-03',
    sourceFile: 'assets/source/official/PH-03-press-secondary-sunglasses.jpg',
    publicFile: null,
    sourceStatus: 'recovered-from-git',
    role: 'PH-03',
    roleCandidate: [],
    category: 'press',
    orientation: 'portrait',
    dimensions: { width: 1200, height: 1600 },
    format: 'JPEG',
    fileSizeBytes: 613009,
    sha256: '103fdb2e5e1738af572b1dd4f7e8ae8f19149c62921bcfc76f79f0a06515dca1',
    priority: 'high',
    approvalStatus: 'owner-approved',
    alreadyUsedPublicly: false,
    usage: ['digital-epk', 'pdf-epk', 'press-download', 'booking-promoter'],
    doNotUseFor: ['main-website hero'],
    alt: 'ARMAH in a white outfit and mirror sunglasses outdoors.',
    cropStrategy: 'Preserve the face, sunglasses, and white outfit; allow only conventional portrait crops.',
    notes: 'Recovered byte-for-byte from the last valid Git version before commit 060789c removed public/assets/bio-small-sunglasses.jpg. It is deliberately not restored to public or component usage.',
  },
  {
    id: 'legacy-bio-main',
    sourceFile: 'public/assets/bio-main.jpg',
    publicFile: 'public/assets/bio-main.jpg',
    sourceStatus: 'current',
    role: null,
    roleCandidate: [],
    category: 'editorial',
    orientation: 'portrait',
    dimensions: { width: 2000, height: 1500 },
    format: 'JPEG',
    fileSizeBytes: 785273,
    sha256: '2965a061f72dbf37342a852ae81ae725b78bc824ea94ff714bcae121f72f3f27',
    priority: 'medium',
    approvalStatus: 'inherited-production',
    alreadyUsedPublicly: true,
    usage: ['main-website'],
    doNotUseFor: ['PH-01 press primary unless separately approved', 'press-download'],
    alt: 'ARMAH at night on a waterfront bridge.',
    cropStrategy: 'Respect EXIF orientation and retain the portrait framing; do not treat it as a replacement for PH-01.',
    notes: 'Legacy production About image. Stored with RightTop EXIF orientation; visual display is portrait despite stored 2000×1500 pixels.',
  },
  ...(['01', '02', '03', '04'] as const).map((number) => {
    const details = {
      '01': { size: 97383, sha256: '79a056fc17f9fc2ff7cade81a3b0e94f2342c41db0c8a15f07b8437c65700e06' },
      '02': { size: 352285, sha256: 'f4d33dc6ce99655d14ca23a58f777f1529cbe8b942db0b1c6d9233731a58f96f' },
      '03': { size: 312438, sha256: 'e6bdb930060ee193bd1d17041bc2dcdc00781aab106471b44534a56e680a8808' },
      '04': { size: 143637, sha256: '67cf3557b3c356b8c0f04c666cfe6aa7c57e7d7b6432525a742771e5f7d7e661' },
    }[number];
    return {
      id: `live-candidate-${number}`,
      sourceFile: `public/assets/live${number}.jpg`,
      publicFile: `public/assets/live${number}.jpg`,
      sourceStatus: 'current' as const,
      role: null,
      roleCandidate: ['PH-04', 'PH-05'] as const,
      category: 'live' as const,
      orientation: 'portrait' as const,
      dimensions: { width: 1080, height: 1920 },
      format: 'JPEG' as const,
      fileSizeBytes: details.size,
      sha256: details.sha256,
      priority: 'high' as const,
      approvalStatus: 'candidate-unresolved' as const,
      alreadyUsedPublicly: true,
      usage: ['main-website', 'live-video'] as const,
      doNotUseFor: ['PH-04 or PH-05 final assignment without owner confirmation'] as const,
      alt: `ARMAH Live clip ${number} poster.`,
      cropStrategy: 'Use the existing vertical poster framing; do not create a press crop from this video poster without approval.',
      notes: 'Candidate pool only. The owner has not assigned this underlying file to PH-04 or PH-05.',
    };
  }),
] as const satisfies readonly PhotographyAsset[];

const unresolvedRoles = [
  {
    id: 'PH-01', sourceStatus: 'missing-owner-supplied', category: 'press', priority: 'very-high', approvalStatus: 'owner-review', candidateAssetIds: [],
    requiredDescription: 'Outdoor frontal portrait: white/light outfit, black sunglasses, city/green background; a strong press-primary candidate.',
    intendedUsage: ['digital-epk', 'pdf-epk', 'press-download', 'booking-promoter'],
    notes: 'Owner-supplied file is not present in this repository or the supplied attachment. Do not substitute legacy-bio-main.',
  },
  {
    id: 'PH-04', sourceStatus: 'candidate-pool-only', category: 'live', priority: 'high', approvalStatus: 'candidate-unresolved', candidateAssetIds: ['live-candidate-01', 'live-candidate-02', 'live-candidate-03', 'live-candidate-04'],
    requiredDescription: 'Strong DJ/performance evidence.', intendedUsage: ['main-website', 'digital-epk', 'pdf-epk', 'booking-promoter'],
    notes: 'Existing live01–live04 files are candidates only; no owner mapping is encoded.',
  },
  {
    id: 'PH-05', sourceStatus: 'candidate-pool-only', category: 'live', priority: 'medium', approvalStatus: 'candidate-unresolved', candidateAssetIds: ['live-candidate-01', 'live-candidate-02', 'live-candidate-03', 'live-candidate-04'],
    requiredDescription: 'Secondary live / BTS performance-atmosphere image.', intendedUsage: ['digital-epk', 'pdf-epk'],
    notes: 'Must resolve to a different underlying file from PH-04 unless the owner explicitly permits a temporary duplicate.',
  },
  {
    id: 'PH-06', sourceStatus: 'missing-owner-supplied', category: 'producer', priority: 'high', approvalStatus: 'owner-review', candidateAssetIds: [],
    requiredDescription: 'ARMAH working on a MacBook/DAW from above/behind, white shirt, with the computer clearly visible.', intendedUsage: ['main-website', 'digital-epk', 'pdf-epk'],
    notes: 'Owner-described new photography is not present in this repository or supplied attachment.',
  },
  {
    id: 'PH-07', sourceStatus: 'missing-owner-supplied', category: 'producer', priority: 'medium', approvalStatus: 'owner-review', candidateAssetIds: [],
    requiredDescription: 'Alternate over-shoulder/back production image: white shirt and MacBook/DAW visible.', intendedUsage: ['digital-epk', 'pdf-epk'],
    notes: 'Owner-described new photography is not present in this repository or supplied attachment.',
  },
  {
    id: 'PH-08', sourceStatus: 'missing-owner-supplied', category: 'editorial', priority: 'medium', approvalStatus: 'owner-review', candidateAssetIds: [],
    requiredDescription: 'Warm natural-daylight profile/back-profile near a window.', intendedUsage: ['main-website', 'digital-epk', 'pdf-epk'],
    notes: 'Owner-described new photography is not present in this repository or supplied attachment.',
  },
  {
    id: 'PH-09', sourceStatus: 'missing-owner-supplied', category: 'editorial', priority: 'high', approvalStatus: 'owner-review', candidateAssetIds: [],
    requiredDescription: 'White-shirt portrait near a window with strong sunlight and shadow pattern; face clearly visible.', intendedUsage: ['digital-epk', 'pdf-epk'],
    notes: 'Owner-described new photography is not present in this repository or supplied attachment.',
  },
  {
    id: 'PH-10', sourceStatus: 'missing-owner-supplied', category: 'social-lifestyle', priority: 'medium', approvalStatus: 'owner-review', candidateAssetIds: [],
    requiredDescription: 'Casual mirror/elevator, off-stage, travel, or lifestyle image.', intendedUsage: ['main-website'],
    notes: 'Owner-described new photography is not present in this repository or supplied attachment.',
  },
] as const satisfies readonly UnresolvedPhotographyRole[];

export const photographyManifest = {
  version: 1,
  assets,
  unresolvedRoles,
  exactDuplicateSha256Groups: [
    {
      sha256: 'fd62e69fc3bf088cd455021cfec3482758828af7b99589f6436d9c3fe73fe01c',
      files: [
        'assets/source/official/PH-02-hero-club-editorial.jpg',
        'public/assets/hero-bg.jpg',
      ],
      disposition: 'Intentional preservation copy: canonical official source and unchanged production source.',
    },
  ] as const,
  sourceQualityConcerns: [
    'PH-02 has a repository source JPEG at 1280×720; no higher-resolution camera master is present.',
    'PH-03 is recovered at 1200×1600; no higher-resolution source is present.',
    'live01–live04 are vertical video posters, not identified high-resolution press masters.',
    'The owner-described PH-01 and PH-06–PH-10 files are absent from the repository and attachment.',
  ],
} as const;
