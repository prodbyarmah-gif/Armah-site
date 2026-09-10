// Pure presentation helpers for the Career Map (no data, no coordinates).
// Extracted so the rules can be unit-tested; Trusted.tsx renders from these.

export type PublicDateInput = {
  date?: string;
  startMonth?: string;
  endMonth?: string;
  year?: string;
  weekday?: string;
};

// Public-facing date line only. Internal precision markers (datePrecision,
// ownerVerified, evidence statuses) must NEVER be rendered — this function is
// the single mapping from stored precision to visitor-visible text. Returns
// null when no useful public date information exists; callers then omit the
// date line entirely (never an "unknown"/"unresolved" label).
export function publicDateLine(record: PublicDateInput): string | null {
  if (record.date) return record.date.split('-').reverse().join('.');
  const months = [record.startMonth, record.endMonth]
    .filter(Boolean)
    .map(
      (month) =>
        new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
          new Date(`${month}-01T00:00:00Z`),
        ),
    )
    .join(' – ');
  if (months) return months;
  if (record.year && record.weekday) return `${record.year} · ${record.weekday}`;
  if (record.weekday) return record.weekday;
  if (record.year) return record.year;
  return null;
}

const normalizeLabel = (value: string) => value.trim().toLowerCase();

// History-line label. When the event/brand name and the venue name are the
// same (e.g. Golden Cut at Golden Cut), render once instead of repeating
// "Golden Cut · Golden Cut". Generic rule — no per-venue hardcodes.
export function historyLabel(event: string, venueLabel: string): string {
  return normalizeLabel(event) === normalizeLabel(venueLabel) ? venueLabel.trim() : `${event} · ${venueLabel}`;
}

export type PinPoint = { key: string; x: number; y: number };

// Decides which venue (if any) an explicit tap/click selection ("pinned")
// should win over a transient hover preview. A pinned venue that conflicts
// with the active event filter is ignored so the filter always wins; hover
// otherwise backs it up. Pure rule, tested below.
export function resolveActiveVenue(
  pinnedVenue: string | null,
  pinnedMatchesFilter: boolean,
  hoveredVenue: string | null,
): string | null {
  if (pinnedVenue && pinnedMatchesFilter) return pinnedVenue;
  if (pinnedVenue && !pinnedMatchesFilter) return hoveredVenue;
  return hoveredVenue;
}
// Groups pins whose centers are closer than thresholdPx (union-find, so
// chains of near-overlapping pins end up in one chooser group). Positions are
// display pixels; coordinates themselves are never altered here — grouping is
// presentation-only. Returns groups in first-appearance order; singletons are
// returned as one-member groups so callers can render pins uniformly.
export function groupOverlappingPins(points: PinPoint[], thresholdPx: number): PinPoint[][] {
  const parent = points.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb);
  };
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) < thresholdPx) {
        union(i, j);
      }
    }
  }
  const groups = new Map<number, PinPoint[]>();
  points.forEach((point, i) => {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(point);
  });
  return [...groups.values()];
}

const centroid = (group: PinPoint[]) => ({
  x: group.reduce((sum, p) => sum + p.x, 0) / group.length,
  y: group.reduce((sum, p) => sum + p.y, 0) / group.length,
});

// Absorbs lone pins that sit underneath (or touching) a cluster badge into
// that cluster, so no tappable pin can hide behind a badge. Multi-member
// groups are never split or moved — singletons only ever join their nearest
// badge. Pure presentation logic; coordinates untouched.
export function absorbPinsUnderBadges(groups: PinPoint[][], badgeClearancePx: number): PinPoint[][] {
  const result = groups.map((g) => [...g]);
  for (let pass = 0; pass < 5; pass++) {
    let moved = false;
    for (const group of result) {
      if (group.length !== 1) continue;
      let best: PinPoint[] | null = null;
      let bestDist = Infinity;
      for (const other of result) {
        if (other === group || other.length < 2) continue;
        const c = centroid(other);
        const dist = Math.hypot(group[0].x - c.x, group[0].y - c.y);
        if (dist < badgeClearancePx && dist < bestDist) {
          best = other;
          bestDist = dist;
        }
      }
      if (best) {
        best.push(group[0]);
        group.length = 0;
        moved = true;
      }
    }
    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i].length === 0) result.splice(i, 1);
    }
    if (!moved) break;
  }
  return result;
}
