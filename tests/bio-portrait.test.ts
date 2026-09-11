import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Owner requirement: the desktop Bio portrait must show substantially all of
// the original PH-09 composition (native 1440x2172, ~2:3). A short
// landscape-ish container with object-cover cropped it to roughly 63%.
// The fix keeps object-cover (never letterboxed contain) and gives the
// desktop container the source aspect ratio; the mobile crop is separate.

test('desktop bio portrait container matches the source aspect without letterboxing', () => {
  const source = readFileSync('src/components/About.tsx', 'utf8');
  assert.match(source, /ph09/);
  assert.match(source, /object-cover/);
  assert.match(source, /lg:aspect-\[2\/3\]/);
  assert.doesNotMatch(source, /object-contain/);
});
