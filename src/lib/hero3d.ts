export type Hero3dMode = 'interactive' | 'static';
export type HeroTheme = 'dark' | 'light';

type Hero3dPolicyInput = {
  reducedMotion: boolean;
  saveData: boolean;
  webglAvailable: boolean;
  width: number;
  dpr: number;
};

export function getHero3dPolicy(input: Hero3dPolicyInput): { mode: Hero3dMode; dpr: number; fps: 30; mobile: boolean } {
  const mobile = input.width < 768;
  const dpr = Math.min(Math.max(input.dpr, 1), mobile ? 1.25 : 1.5);
  return {
    mode: input.reducedMotion || input.saveData || !input.webglAvailable ? 'static' : 'interactive',
    dpr,
    fps: 30,
    mobile,
  };
}

export function getHero3dTheme(theme: HeroTheme): {
  clearColor: number;
  metalColor: number;
  rimColor: number;
  intensity: number;
  roughness: number;
  envMapIntensity: number;
  exposure: number;
} {
  return theme === 'light'
    ? { clearColor: 0x000000, metalColor: 0x2b3342, rimColor: 0x8f151d, intensity: 1.15, roughness: 0.09, envMapIntensity: 1.5, exposure: 1.15 }
    : { clearColor: 0x000000, metalColor: 0xffffff, rimColor: 0xa31621, intensity: 1, roughness: 0.045, envMapIntensity: 1.3, exposure: 1.0 };
}

export const HERO_SWING_AMPLITUDE = Math.PI / 4;
export const HERO_SWING_PERIOD_MS = 12_000;

// Verified rotation axis for the Hero swing (see HeroLogo3D usage).
// Measured GLB bounds: the sign face spans X (width) by Z (height) with the
// thin extrusion axis along Y toward the camera above. The camera looks down
// -Y, so world Z appears as the screen-vertical: it is the physical line the
// letter tops stand along. Rotating about world Z fixes every point's Z, so
// tops stay up while the face normal yaws LEFT <-> RIGHT. Rotating about the
// face normal (Y) would spin the face in-plane like a clock hand instead.
// Do not change this without re-verifying upright extremes in a real browser.
export const HERO_ROTATION_AXIS = 'z' as const;

// Owner-approved motion: a moderate LEFT <-> RIGHT rocking turn with 90°
// TOTAL travel (approximately -45° <-> +45°), then smoothly back — never a
// continuous 360° turn, never the backside, no propeller/clock-hand/roll.
// The face stays readable throughout while both sides show chrome shading
// and depth. Sinusoidal profile: peak velocity at center, zero velocity at
// the extremes so reversals ease instead of snapping. Absolute function of
// elapsed time (pauses cleanly with the render loop; no drift, no wrap).
export function heroSwingAngle(elapsedMs: number): number {
  return HERO_SWING_AMPLITUDE * Math.sin((elapsedMs * 2 * Math.PI) / HERO_SWING_PERIOD_MS);
}

// Waveform structure: 135 evenly spaced bars, 45 per Ghana section.
// RED = bars 0–44, YELLOW = 45–89, GREEN = 90–134.
export const WAVEFORM_BARS = 135;
export const BARS_PER_SECTION = 45;
export const WAVEFORM_SECTION_COLORS = [0xb01e32, 0xd9a62e, 0x1e7a46] as const;

export function waveformSection(normalizedX: number): 0 | 1 | 2 {
  const bar = Math.min(WAVEFORM_BARS - 1, Math.floor(normalizedX * WAVEFORM_BARS));
  return Math.min(2, Math.floor(bar / BARS_PER_SECTION)) as 0 | 1 | 2;
}
