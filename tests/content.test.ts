import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { mixes, featuredMix, additionalMixes } from '../src/data/mixes.ts';
import { STOPS, repeatBookings } from '../src/data/performances.ts';
import { bookingResources } from '../src/data/bookingResources.ts';
import en from '../src/i18n/en.ts';
import de from '../src/i18n/de.ts';
import fr from '../src/i18n/fr.ts';
import pt from '../src/i18n/pt.ts';
import es from '../src/i18n/es.ts';
test('four distinct mixes, one editorially featured set, real local previews',()=>{
  assert.deepEqual(mixes.map(m=>m.videoId),['ukQDVRV-4Rs','tJgmfQGqq-4','Edy-hiLpmz4','Wa7tW_tpVr8']);
  assert.equal(new Set(mixes.map(m=>m.videoId)).size,4);assert.equal(mixes.filter(m=>m.featured).length,1);
  assert.equal(featuredMix.videoId,'ukQDVRV-4Rs');assert.equal(additionalMixes.length,3);
  for(const mix of mixes)for(const file of [mix.thumbnail,mix.thumbnailSmall])assert.ok(existsSync(resolve('public',file.slice(1))));
});
test('all baseline locations and recorded repeat counts are preserved',()=>{
  assert.deepEqual(STOPS.map(stop=>[stop.city,stop.venues.length]),[['Hamburg',14],['Berlin',3]]);
  assert.deepEqual(STOPS.flatMap(s=>s.venues).map(v=>v.name),['ROOTS Club Hamburg','Halo','Uwe','Club 25','Golden Cut','YOTO','Edelfettwerk','Thomas Read','Berliner Bahnhof','Café Schöne Aussichten','45 Herz Gelände','Kairo Beach','Golden Pudel','Westfield Hamburg','BRICKS Berlin','Skate Yard','Corner TT - Blücherstraße']);
  assert.deepEqual(repeatBookings,[{name:'Golden Cut',count:3},{name:'Foot Locker',count:4}]);
});
test('booking resources include real PDFs without invented EPK files',()=>{
  assert.equal(bookingResources.some(r=>r.id==='epk'||r.id==='pressPhotos'),false);
  for(const item of bookingResources.filter(r=>r.href.endsWith('.pdf')))assert.ok(existsSync(resolve('public',decodeURIComponent(item.href.slice(1)))));
});
function keys(value:unknown,prefix=''):string[]{return Object.entries(value as Record<string,unknown>).flatMap(([key,v])=> typeof v==='string'?[prefix+key]:keys(v,prefix+key+'.'));}
test('five languages include the same new booking-critical keys',()=>{
  const relevant=(d:unknown)=>keys(d).filter(k=>/^(mixes|map|accessibility)\.|^hero\.availability|^about\.portrait/.test(k)).sort();
  for(const dict of [de,fr,pt,es])assert.deepEqual(relevant(dict),relevant(en));
  for(const dict of [en,de,fr,pt,es])assert.doesNotMatch(JSON.stringify(dict),/Played worldwide|Afro-House/i);
});
test('canonical, structured data and crawl files identify only the real site',()=>{
  const html=readFileSync('index.html','utf8');
  assert.match(html,/rel="canonical" href="https:\/\/www.prodbyarmah.com\/"/);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)![1])['@graph'];
  assert.deepEqual(graph.map((x:{'@type':string})=>x['@type']),['Person','WebSite']);
  assert.match(readFileSync('public/robots.txt','utf8'),/Disallow: \/api\//);
  assert.match(readFileSync('public/sitemap.xml','utf8'),/<loc>https:\/\/www.prodbyarmah.com\/<\/loc>/);
});

test('owner-confirmed periods and occurrences remain distinct from booking totals', () => {
  const venues = STOPS.flatMap(stop => stop.venues);
  const history = venues.flatMap(venue => venue.history ?? []);
  assert.equal(new Set(venues.map(venue => venue.name)).size, venues.length);
  assert.equal(new Set(history.map(record => record.id)).size, history.length);
  assert.equal(history.length, 23);
  assert.deepEqual(history.filter(record => record.date).map(record => record.date).sort(), ['2025-05-31', '2025-09-27', '2025-10-04', '2026-01-24', '2026-03-27', '2026-04-18', '2026-06-05', '2026-08-07']);
  const roots = venues.find(venue => venue.name === 'ROOTS Club Hamburg')!;
  assert.equal(roots.subtitle, 'formerly at Cave Club');
  assert.equal(roots.count, undefined);
  assert.equal(roots.history![0].startMonth, '2024-12');
  assert.equal(roots.history![0].endMonth, '2025-03');
  assert.equal(roots.history![0].date, undefined);
  assert.ok(history.every(record => record.ownerVerified && record.performanceRole === 'DJ'));
  assert.equal(history.filter(record => record.event === 'We Outside').length, 6);
  const zaya = history.filter(record => record.event === 'Zaya Dreams');
  assert.equal(zaya.length, 2);
  assert.ok(zaya.every(record => record.projectRole === 'CO_FOUNDER / OWN_EVENT' && record.relationshipType === 'OWN_EVENT'));
});

test('KDK Berlin is one event-day with two stops, not two bookings', () => {
  const venues = STOPS.flatMap(stop => stop.venues);
  const history = venues.flatMap(venue => venue.history ?? []);
  const bricks = venues.find(venue => venue.name === 'BRICKS Berlin')!;
  const skate = venues.find(venue => venue.name === 'Skate Yard')!;
  const corner = venues.find(venue => venue.name === 'Corner TT - Blücherstraße')!;
  assert.deepEqual(bricks.events, ['KDK']);
  assert.deepEqual(skate.events, ['KDK']);
  assert.ok(!bricks.events!.includes('We Outside') && !skate.events!.includes('We Outside'));
  const kdkStops = history.filter(record => record.event === 'KDK');
  assert.equal(kdkStops.length, 2);
  assert.ok(kdkStops.every(record => record.eventDayId === 'kdk-berlin-day-2025'));
  assert.equal(new Set(kdkStops.map(record => record.id)).size, 2);
  const byId = Object.fromEntries(kdkStops.map(record => [record.id, record]));
  assert.equal(byId['kdk-berlin-day-skate-yard-daytime'].stopLabel, 'Daytime set');
  assert.equal(byId['kdk-berlin-day-bricks-evening'].stopLabel, 'Evening closing set');
  assert.ok(kdkStops.every(record => record.year === '2025' && record.weekday === 'Saturday' && record.date === undefined));
  const streetFest = corner.history!;
  assert.deepEqual(corner.events, ['KDK – On My Mind Street Fest']);
  assert.equal(streetFest.length, 1);
  assert.equal(streetFest[0].event, 'KDK – On My Mind Street Fest');
  assert.equal(streetFest[0].weekday, 'Saturday');
  assert.equal(streetFest[0].date, undefined);
  assert.ok(!streetFest[0].eventDayId || streetFest[0].eventDayId !== 'kdk-berlin-day-2025');
});

test('YOTO venue aggregates all performances while YOTO event filter stays brand-only', () => {
  const venues = STOPS.flatMap(stop => stop.venues);
  const yoto = venues.find(venue => venue.name === 'YOTO')!;
  assert.deepEqual(yoto.events, ['We Outside', 'YOTO', 'Enchanted', 'Queens & Clouds', 'PRAIZ / ARMAH / NORII', 'DARI HATI', "Monteezy's World"]);
  assert.equal(yoto.history!.length, 7);
  // Brand-only view: a single YOTO-branded occurrence, no venue-wide fan-out.
  assert.equal(yoto.history!.filter(record => record.event === 'YOTO').length, 1);
  // Venue aggregation: every physical performance at YOTO in one place.
  assert.deepEqual(yoto.history!.map(record => record.event).sort(), ['DARI HATI', 'Enchanted', "Monteezy's World", 'PRAIZ / ARMAH / NORII', 'Queens & Clouds', 'We Outside', 'YOTO'].sort());
  const monteezy = yoto.history!.find(record => record.event === "Monteezy's World")!;
  assert.equal(monteezy.date, undefined);
  assert.deepEqual(yoto.history!.filter(record => record.date).map(record => record.date).sort(), ['2025-05-31', '2025-09-27', '2025-10-04', '2026-04-18']);
});

test('repeat totals are preserved without inventing individual dates', () => {
  const venues = STOPS.flatMap(stop => stop.venues);
  const goldenCut = venues.find(venue => venue.name === 'Golden Cut')!;
  const westfield = venues.find(venue => venue.name === 'Westfield Hamburg')!;
  assert.equal(goldenCut.count, 3);
  assert.equal(westfield.count, 4);
  assert.ok(goldenCut.history!.every(record => record.date === undefined));
  assert.ok(westfield.history!.every(record => record.date === undefined));
});
