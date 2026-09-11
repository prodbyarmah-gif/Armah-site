import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PREVIEW_AUDIO_PRELOAD, createPreviewAudioElement } from '../src/lib/previewAudio.ts';

// Regression coverage for the production incident where Beat Catalog
// previews reported "Preview nicht verfügbar" in Safari/WebKit: the preview
// audio element had preload='none', under which WebKit never fires
// `loadedmetadata`, stalling wavesurfer's load() until the UI watchdog
// gave up. 'metadata' is the minimum that keeps the ready chain working.

test('preview audio contract requires metadata preloading for loadedmetadata', () => {
  assert.equal(PREVIEW_AUDIO_PRELOAD, 'metadata');
});

test('preview audio element keeps the CORS-safe, UI-hidden configuration', () => {
  const calls: Record<string, unknown> = {};
  const fakeElement = { style: {} as Record<string, string> };
  (globalThis as Record<string, unknown>).document = {
    createElement: (tag: string) => {
      calls.tag = tag;
      return fakeElement;
    },
  };
  try {
    const el = createPreviewAudioElement() as unknown as Record<string, unknown>;
    assert.equal(calls.tag, 'audio');
    assert.equal(el.preload, 'metadata');
    assert.equal(el.crossOrigin, 'anonymous');
    assert.equal(el.controls, false);
    assert.equal((el.style as Record<string, string>).display, 'none');
  } finally {
    delete (globalThis as Record<string, unknown>).document;
  }
});

test('the Beat Catalog player builds its audio element through the contract', () => {
  const source = readFileSync('src/components/Producer.tsx', 'utf8');
  assert.match(source, /createPreviewAudioElement\(\)/);
  assert.doesNotMatch(source, /preload\s*=\s*['"]none['"]/);
});
