import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isSceneVisuallySafe, markSceneReady, shouldResumePlayback } from '../src/lib/heroVideo.ts';

test('a scene becomes ready once and stays ready', () => {
  const empty: Record<string, boolean> = {};
  const ready = markSceneReady(empty, 'kwamzy');
  assert.deepEqual(ready, { kwamzy: true });
  // Idempotent: no new object, no other scenes touched.
  assert.equal(markSceneReady(ready, 'kwamzy'), ready);
  assert.deepEqual(markSceneReady(ready, 'dali'), { kwamzy: true, dali: true });
});

test('a video surface is visible only when active AND individually ready', () => {
  const ready = { kwamzy: true, dali: false };
  // Active but not ready: poster covers, never a black surface.
  assert.equal(isSceneVisuallySafe('dali', 'dali', ready), false);
  // Ready but not active: stays hidden (outgoing holds its frame instead).
  assert.equal(isSceneVisuallySafe('dali', 'kwamzy', ready), false);
  assert.equal(isSceneVisuallySafe('kwamzy', 'kwamzy', ready), true);
  // Slow 3D or slow second scene must not un-ready a healthy video.
  assert.equal(isSceneVisuallySafe('kwamzy', 'kwamzy', { kwamzy: true }), true);
});

test('playback resumes only for a stalled, resumable scene', () => {
  // Paused with data available: nudge exactly once per media event.
  assert.equal(shouldResumePlayback({ paused: true, ended: false, readyState: 4 }), true);
  // Already playing, ended, or without data: never touch.
  assert.equal(shouldResumePlayback({ paused: false, ended: false, readyState: 4 }), false);
  assert.equal(shouldResumePlayback({ paused: true, ended: true, readyState: 4 }), false);
  assert.equal(shouldResumePlayback({ paused: true, ended: false, readyState: 0 }), false);
  assert.equal(shouldResumePlayback({ paused: true, ended: false, readyState: 1 }), false);
});
