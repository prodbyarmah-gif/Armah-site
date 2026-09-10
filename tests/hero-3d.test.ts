import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BARS_PER_SECTION, HERO_REVOLUTION_MS, HERO_ROTATION_AXIS, WAVEFORM_BARS, WAVEFORM_SECTION_COLORS, advanceHeroRotation, getHero3dPolicy, getHero3dTheme, waveformSection } from '../src/lib/hero3d.ts';

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

test('rotation is one continuous 20-second revolution with monotonic modulo progression', () => {
  assert.equal(HERO_REVOLUTION_MS, 20_000);
  // Locked axis: world Z is the line parallel to the sign's up (GLB face
  // spans X by Z, thin axis Y). Rotating about the face normal (Y) spins the
  // face in-plane like a clock hand instead of turning front to back.
  assert.equal(HERO_ROTATION_AXIS, 'z');
  assert.equal(advanceHeroRotation(0, 0), 0);
  assert.ok(Math.abs(advanceHeroRotation(0, 5000) - Math.PI / 2) < 1e-9);
  assert.ok(Math.abs(advanceHeroRotation(0, 10000) - Math.PI) < 1e-9);
  assert.ok(Math.abs(advanceHeroRotation(0, 20000)) < 1e-9);
  assert.ok(Math.abs(advanceHeroRotation(Math.PI, 10000)) < 1e-9);
  let angle = 0;
  let previous = -1;
  for (let step = 0; step < 40; step += 1) {
    angle = advanceHeroRotation(angle, 500);
    assert.ok(angle >= 0 && angle < 2 * Math.PI);
    if (previous >= 0 && angle < previous) {
      // The only permitted decrease is the 2π wrap point.
      assert.ok(previous > Math.PI);
    }
    previous = angle;
  }
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
