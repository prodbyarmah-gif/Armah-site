import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicDateLine, historyLabel, groupOverlappingPins, absorbPinsUnderBadges, resolveActiveVenue } from '../src/lib/mapUi.ts';

test('history labels deduplicate identical event/venue names generically', () => {
  assert.equal(historyLabel('Golden Cut', 'Golden Cut'), 'Golden Cut');
  assert.equal(historyLabel('  golden cut ', 'Golden Cut'), 'Golden Cut');
  assert.equal(historyLabel('Foot Locker', 'Westfield Hamburg'), 'Foot Locker · Westfield Hamburg');
  assert.equal(historyLabel('DARI HATI', 'YOTO'), 'DARI HATI · YOTO');
  assert.equal(historyLabel('KDK', 'BRICKS Berlin'), 'KDK · BRICKS Berlin');
  assert.equal(historyLabel('Zaya Dreams', 'HALO Upper Club'), 'Zaya Dreams · HALO Upper Club');
});

test('public date lines expose only visitor-safe precision, never internal markers', () => {
  assert.equal(publicDateLine({ date: '2026-08-07' }), '07.08.2026');
  assert.equal(publicDateLine({ startMonth: '2024-12', endMonth: '2025-03' }), 'Dec 2024 – Mar 2025');
  assert.equal(publicDateLine({ year: '2025', weekday: 'Saturday' }), '2025 · Saturday');
  assert.equal(publicDateLine({ weekday: 'Saturday' }), 'Saturday');
  assert.equal(publicDateLine({ year: '2025' }), '2025');
  assert.equal(publicDateLine({}), null);
  for (const line of [
    publicDateLine({ date: '2026-08-07' }),
    publicDateLine({ year: '2025', weekday: 'Saturday' }),
    publicDateLine({ weekday: 'Saturday' }),
  ]) {
    assert.doesNotMatch(line!, /unknown|unresolved|UNKNOWN|VERIFIED|NEEDS_/i);
  }
});

test('pin collision grouping clusters only near-overlapping pins', () => {
  const groups = groupOverlappingPins(
    [
      { key: 'A', x: 0, y: 0 },
      { key: 'B', x: 20, y: 0 },
      { key: 'C', x: 200, y: 200 },
    ],
    40,
  );
  assert.equal(groups.length, 2);
  assert.deepEqual(groups[0].map((p) => p.key), ['A', 'B']);
  assert.deepEqual(groups[1].map((p) => p.key), ['C']);
});

test('pin collision grouping chains transitively linked pins', () => {
  const groups = groupOverlappingPins(
    [
      { key: 'A', x: 0, y: 0 },
      { key: 'B', x: 30, y: 0 },
      { key: 'C', x: 60, y: 0 },
    ],
    40,
  );
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].map((p) => p.key), ['A', 'B', 'C']);
});

test('pin collision grouping keeps distant pins independent', () => {
  const groups = groupOverlappingPins(
    [
      { key: 'A', x: 0, y: 0 },
      { key: 'B', x: 100, y: 100 },
    ],
    40,
  );
  assert.equal(groups.length, 2);
});

test('lone pins under a badge join the cluster instead of hiding behind it', () => {
  const groups = absorbPinsUnderBadges(
    [
      [
        { key: 'A', x: 0, y: 0 },
        { key: 'B', x: 20, y: 0 },
      ],
      [{ key: 'C', x: 30, y: 0 }],
      [{ key: 'D', x: 500, y: 500 }],
    ],
    44,
  );
  assert.equal(groups.length, 2);
  assert.deepEqual(groups[0].map((p) => p.key).sort(), ['A', 'B', 'C']);
  assert.deepEqual(groups[1].map((p) => p.key), ['D']);
});

test('badge absorption never splits multi-member groups', () => {
  const groups = absorbPinsUnderBadges(
    [
      [
        { key: 'A', x: 0, y: 0 },
        { key: 'B', x: 20, y: 0 },
      ],
      [
        { key: 'C', x: 200, y: 0 },
        { key: 'D', x: 220, y: 0 },
      ],
    ],
    44,
  );
  assert.equal(groups.length, 2);
});

test('explicit tap selection survives hover changes unless filtered out', () => {
  assert.equal(resolveActiveVenue('YOTO', true, null), 'YOTO');
  assert.equal(resolveActiveVenue('YOTO', true, 'Edelfettwerk'), 'YOTO');
  assert.equal(resolveActiveVenue('YOTO', false, 'Edelfettwerk'), 'Edelfettwerk');
  assert.equal(resolveActiveVenue('YOTO', false, null), null);
  assert.equal(resolveActiveVenue(null, true, 'Edelfettwerk'), 'Edelfettwerk');
  assert.equal(resolveActiveVenue(null, false, null), null);
});
