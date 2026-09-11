import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BARS_PER_SECTION, HERO_ROTATION_AXIS, HERO_SWING_AMPLITUDE, HERO_SWING_PERIOD_MS, WAVEFORM_BARS, WAVEFORM_SECTION_COLORS, heroSwingAngle, getHero3dPolicy, getHero3dTheme, waveformSection } from '../src/lib/hero3d.ts';

test('static identity is selected for reduced motion, save-data, or unavailable WebGL', () => {
  assert.equal(getHero3dPolicy({ reducedMotion: true, saveData: false, webglAvailable: true, width: 1440, dpr: 2 }).mode, 'static');
  assert.equal(getHero3dPolicy({ reducedMotion: false, saveData: true, webglAvailable: true, width: 1440, dpr: 2 }).mode, 'static');
  assert.equal(getHero3dPolicy({ reducedMotion: false, saveData: false, webglAvailable: false, width: 1440, dpr: 2 }).mode, 'static');
});

test('interactive rendering is bounded to the approved device pixel ratios and 30 fps', () => {
  const mobile = getHero3dPolicy({ reducedMotion: false, saveData: false, webglAvailable: true, width: 375, dpr: 3 });
  const desktop = getHero3dPolicy({ reducedMotion: false, saveData: false, webglAvailable: true, width: 1440, dpr: 3 });
  assert.deepEqual(mobile, { mode: 'interactive', dpr: 1.25, fps: 30, mobile: true });
  assert.deepEqual(desktop, { mode: 'interactive', dpr: 1.5, fps: 30, mobile: false });
});

test('theme parameters keep the same metallic model readable in dark and light themes', () => {
  assert.deepEqual(getHero3dTheme('dark'), { clearColor: 0x000000, metalColor: 0xffffff, rimColor: 0xa31621, intensity: 1, roughness: 0.045, envMapIntensity: 1.3, exposure: 1.0 });
  assert.deepEqual(getHero3dTheme('light'), { clearColor: 0x000000, metalColor: 0x2b3342, rimColor: 0x8f151d, intensity: 1.15, roughness: 0.09, envMapIntensity: 1.5, exposure: 1.15 });
});

test('motion is a bounded moderate rocking turn, never a continuous 360-degree turn', () => {
  // Total travel between extremes is 90 degrees (approximately -45 to +45):
  // readable throughout, with chrome shading visible on both sides.
  assert.equal(HERO_SWING_AMPLITUDE, Math.PI / 4);
  // Locked axis: world Z is the physical line the letter tops stand along
  // (GLB face spans X by Z, thin axis Y toward the camera above), so yawing
  // about Z keeps the wordmark upright. Rotating about the face normal (Y)
  // would spin the face in-plane like a clock hand instead.
  assert.equal(HERO_ROTATION_AXIS, 'z');
  // Sinusoidal profile: center at t=0, +45 at quarter period, center at
  // half, -45 at three quarters, back to center after one full period.
  assert.equal(heroSwingAngle(0), 0);
  assert.ok(Math.abs(heroSwingAngle(HERO_SWING_PERIOD_MS / 4) - Math.PI / 4) < 1e-9);
  assert.ok(Math.abs(heroSwingAngle(HERO_SWING_PERIOD_MS / 2)) < 1e-9);
  assert.ok(Math.abs(heroSwingAngle((3 * HERO_SWING_PERIOD_MS) / 4) + Math.PI / 4) < 1e-9);
  assert.ok(Math.abs(heroSwingAngle(HERO_SWING_PERIOD_MS)) < 1e-9);
  // Bounded everywhere: no sample may approach the profile/backside.
  for (let t = 0; t <= HERO_SWING_PERIOD_MS; t += 137) {
    assert.ok(Math.abs(heroSwingAngle(t)) <= Math.PI / 4 + 1e-9);
  }
  // Ease at the extremes: velocity vanishes at quarter and three-quarter
  // period (smooth reversal, no snap) and peaks at center (weighted feel).
  const velocity = (t: number) => (heroSwingAngle(t + 1) - heroSwingAngle(t - 1)) / 2;
  assert.ok(Math.abs(velocity(HERO_SWING_PERIOD_MS / 4)) < 1e-6);
  assert.ok(Math.abs(velocity((3 * HERO_SWING_PERIOD_MS) / 4)) < 1e-6);
  assert.ok(Math.abs(velocity(0)) > Math.abs(velocity(HERO_SWING_PERIOD_MS / 8)));
});

test('waveform keeps the locked 45/45/45 Ghana structure with bar-exact boundaries', () => {
  assert.equal(WAVEFORM_BARS, 135);
  assert.equal(BARS_PER_SECTION, 45);
  assert.deepEqual([...WAVEFORM_SECTION_COLORS], [0xb01e32, 0xd9a62e, 0x1e7a46]);
  assert.equal(waveformSection(0), 0);
  assert.equal(waveformSection(44 / 135), 0);
  assert.equal(waveformSection(45 / 135), 1);
  assert.equal(waveformSection(89 / 135), 1);
  assert.equal(waveformSection(90 / 135), 2);
  assert.equal(waveformSection(134 / 135), 2);
  assert.equal(waveformSection(1), 2);
});
