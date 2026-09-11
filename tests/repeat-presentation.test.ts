import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Owner requirement: all four repeat-booking relationships must be directly
// visible on mobile with no horizontal swipe discovery. The repeat strip is
// therefore a 2×2 grid on narrow viewports (4 columns on desktop), driven
// by the Career Map source of truth — presentation only, data untouched.

test('repeat bookings render 2x2 on mobile and 4 columns on desktop, without swipe UX', () => {
  const source = readFileSync('src/components/Trusted.tsx', 'utf8');
  const repeatBlock = source.slice(source.indexOf('repeat-editorial'));
  assert.match(repeatBlock, /grid-cols-2/);
  assert.match(repeatBlock, /lg:grid-cols-4/);
  assert.doesNotMatch(repeatBlock, /overflow-x-auto/);
  assert.doesNotMatch(repeatBlock, /snap-x/);
  assert.doesNotMatch(repeatBlock, /snap-mandatory/);
  assert.doesNotMatch(repeatBlock, /repeat-fade/);
  // Counts still derive from the Career Map history — no second dataset.
  assert.match(repeatBlock, /homepageRelationships\.map/);
});

test('no orphaned carousel styling remains for the repeat strip', () => {
  const css = readFileSync('src/styles/globals.css', 'utf8');
  assert.doesNotMatch(css, /repeat-fade/);
});
