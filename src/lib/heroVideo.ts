// Independent video-readiness contract for the Hero.
//
// Video and WebGL initialize and reveal independently: a slow GLB must not
// freeze a healthy video, and a slow video must never expose unfinished
// WebGL. A video surface is visually safe only after the browser fires
// `canplay`/`playing` for it; until then the approved poster beneath covers
// the surface, so the user never sees black, empty, or collapsed video.

// A scene is ready once the browser can actually render it.
export function markSceneReady(prev: Readonly<Record<string, boolean>>, id: string): Record<string, boolean> {
  if (prev[id]) return prev as Record<string, boolean>;
  return { ...prev, [id]: true };
}

// A video element may only be visible when it is BOTH the active scene AND
// individually ready. The outgoing scene holds its last frame until the
// switch, so crossfades never cut to an unready (black) surface.
export function isSceneVisuallySafe(activeId: string, id: string, ready: Readonly<Record<string, boolean>>): boolean {
  return activeId === id && ready[id] === true;
}

// Event-driven playback resume: if the active scene stalled (e.g. mobile
// autoplay deferred across a reload), nudge it exactly when the browser
// signals it can play — never a retry loop, never a timer.
export function shouldResumePlayback(video: {
  paused: boolean;
  ended: boolean;
  readyState: number;
  HAVE_CURRENT_DATA?: number;
}): boolean {
  const threshold = video.HAVE_CURRENT_DATA ?? 2;
  return video.paused && !video.ended && video.readyState >= threshold;
}
