// src/data/beats.ts
// Pure data module (NO React / NO JSX). Safe to import from Producer.tsx and Booking.tsx.

export type BeatMood = 'Afro' | 'Drill' | 'Trap';

export type Beat = {
  id: string;
  title: string;
  bpm: number;
  mood: BeatMood;
  tags?: string[];
  credits?: string[];
  /** Public URL served from /public */
  previewUrl?: string;
};

// Keep stable ordering (UI can reuse this)
export const GENRE_ORDER: BeatMood[] = ['Afro', 'Drill', 'Trap'];

// IMPORTANT:
// Preview MP3 files must exist here:
// public/assets/beat-previews/mp3/
// And are served at:
// /assets/beat-previews/mp3/<filename>.mp3

export const beats: Beat[] = [
  // AFRO
  {
    id: 'B001',
    title: '23',
    bpm: 89,
    mood: 'Afro',
    tags: ['Afrobeats'],
    credits: ['@Armah'],
    previewUrl: '/assets/beat-previews/mp3/23 - 89BPM @Armah.mp3',
  },
  {
    id: 'B003',
    title: 'Forever',
    bpm: 105,
    mood: 'Afro',
    tags: ['Dancehall', 'Afrobeats'],
    credits: ['@Armah'],
    previewUrl: '/assets/beat-previews/mp3/Forever - 105BPM @Armah.mp3',
  },
  {
    id: 'B004',
    title: 'Kokonsa',
    bpm: 100,
    mood: 'Afro',
    tags: ['Afrobeats'],
    credits: ['@Armah'],
    previewUrl: '/assets/beat-previews/mp3/Kokonsa - 100BPM @Armah.mp3',
  },
  {
    id: 'B007',
    title: 'Waiting Game',
    bpm: 104,
    mood: 'Afro',
    tags: ['Afrobeat', 'Afro Swing'],
    credits: ['@Armah'],
    previewUrl: '/assets/beat-previews/mp3/Waiting Game - 104 BPM @Armah.mp3',
  },
  {
    id: 'B008',
    title: 'Walking in Tokyo',
    bpm: 113,
    mood: 'Afro',
    tags: ['Afro Jazz'],
    credits: ['@Armah'],
    previewUrl: '/assets/beat-previews/mp3/Walking in Tokyo - 113BPM @Armah.mp3',
  },
  {
    id: 'B009',
    title: 'Wstrn',
    bpm: 118,
    mood: 'Afro',
    tags: ['Afrofusion'],
    credits: ['@Armah'],
    previewUrl: '/assets/beat-previews/mp3/Wstrn - 118BPM @Armah.mp3',
  },

  // DRILL
  {
    id: 'B002',
    title: 'Curious',
    bpm: 150,
    mood: 'Drill',
    tags: ['Sexy Drill'],
    credits: ['@Armah'],
    previewUrl: '/assets/beat-previews/mp3/Curious - 150BPM @Armah.mp3',
  },
  {
    id: 'B005',
    title: 'Siren',
    bpm: 140,
    mood: 'Drill',
    tags: ['UK Drill (Soft)'],
    credits: ['@Armah'],
    previewUrl: '/assets/beat-previews/mp3/Siren - 140BPM @Armah.mp3',
  },

  // TRAP
  {
    id: 'B006',
    title: 'Timba',
    bpm: 114,
    mood: 'Trap',
    tags: ['Trap'],
    credits: ['@Armah'],
    previewUrl: '/assets/beat-previews/mp3/Timba - 114BPM @Armah.mp3',
  },
];

// Convenience default export
export default beats;