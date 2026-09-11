// Shared contract for Beat Catalog preview audio elements.
//
// wavesurfer.js `load()` resolves its ready chain only after the media
// element fires `loadedmetadata`. WebKit/Safari (strict preload handling)
// NEVER fires `loadedmetadata` with preload='none' — not even for blob:
// URLs — so `load()` hangs silently until the UI watchdog reports the
// preview as unavailable (verified against production audio in WebKit:
// 'none' timed out, 'metadata' resolved with the 60s duration, while
// fetch/CORS/decodeAudioData were all healthy).
//
// 'metadata' is therefore the minimum correct value. Combined with the
// click-to-activate player, no audio bytes are fetched before the user
// presses Play — the lazy-loading intent is fully preserved.
export const PREVIEW_AUDIO_PRELOAD = 'metadata' as const;

export function createPreviewAudioElement(): HTMLAudioElement {
  const audio = document.createElement('audio');
  audio.preload = PREVIEW_AUDIO_PRELOAD;
  audio.crossOrigin = 'anonymous';
  // Never show native audio UI (the white control bar)
  audio.controls = false;
  audio.style.display = 'none';
  return audio;
}
