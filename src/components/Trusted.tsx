import { useEffect, useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '../i18n';
import { highlights, trustedEvents } from '../data/armah';
import { Reveal } from './Reveal';

const WORLD_GEO = '/assets/world-110m.json';
const GERMANY_GEO = '/assets/germany-states.geo.json';
const RED = '#FB3640';
const NATIONAL_CENTER: [number, number] = [10.45, 51.2];
const NATIONAL_ZOOM = 1;
const TOUR_REGION_CENTER: [number, number] = [-18, 24];
const TOUR_REGION_SCALE = 175;
const COUNTRY_TO_CITY_ZOOM = 7.4;
const TILE_SIZE = 256;

type TileView = {
  center: [number, number];
  zoom: number;
  width: number;
  height: number;
};

const CITY_TILE_VIEWS: Record<string, TileView> = {
  Hamburg: {
    center: [9.962, 53.563],
    zoom: 12,
    width: 640,
    height: 720,
  },
  Berlin: {
    center: [13.414, 52.507],
    zoom: 12,
    width: 640,
    height: 720,
  },
};

const cityTilePreloadCache = new Map<string, Promise<void>>();

// Look up the Instagram link for an event by name (single source of truth).
const URL_BY_NAME: Record<string, string> = Object.fromEntries(
  trustedEvents.map((e) => [e.name, e.url])
);

type Venue = {
  name: string; // the real location / club
  coords?: [number, number];
  address?: string;
  own?: boolean; // your own event happened here
  events?: string[]; // which event(s)/brand(s) ran here
  count?: number; // times played here
  approx?: boolean; // coordinates still approximate (need exact address)
};
type Stop = { city: string; coords: [number, number]; zoom: number; venues: Venue[] };

// 👉 Real locations per city. coords from OpenStreetMap; `approx:true` = still estimated.
const STOPS: Stop[] = [
  {
    city: 'Hamburg',
    coords: [9.962, 53.56],
    zoom: 48,
    venues: [
      { name: 'Halo', coords: [9.9580213, 53.5502314], own: true, events: ['Zaya Dreams'] },
      { name: 'Uwe', coords: [9.9704241, 53.5565464], own: true, events: ['Zaya Dreams'] },
      { name: 'Club 25', coords: [9.9660033, 53.550125], events: ['Amapiano Hamburg'] },
      { name: 'Golden Cut', coords: [10.0064963, 53.5550554], events: ['Golden Cut'], count: 3 },
      { name: 'YOTO', coords: [9.9610207, 53.5623242], events: ['We Outside', 'YOTO', 'Enchanted', 'Queens & Clouds'] },
      { name: 'Edelfettwerk', coords: [9.9056241, 53.5955002], events: ['We Outside'] },
      { name: 'Thomas Read', coords: [9.9566397, 53.5500714], events: ['We Outside'] },
      { name: 'Berliner Bahnhof', coords: [10.0063896, 53.5471794], events: ['We Outside'] },
      { name: 'Café Schöne Aussichten', coords: [9.9857544, 53.558469], events: ['We Outside'] },
      { name: '45 Herz Gelände', coords: [9.9710102, 53.5634063], events: ['We Outside'] },
      { name: 'Kairo Beach', coords: [9.938, 53.546], approx: true, events: ["L'Atelier Studios"] },
      { name: 'Golden Pudel', coords: [9.9577662, 53.5461935], events: ['Afro Slot'] },
      { name: 'Westfield Hamburg', coords: [9.9991553, 53.5397349], events: ['Foot Locker'], count: 4 },
    ],
  },
  {
    city: 'Berlin',
    coords: [13.414, 52.507],
    zoom: 42,
    venues: [
      { name: 'BRICKS Berlin', coords: [13.3883, 52.5122], events: ['We Outside'] },
      {
        name: 'Skate Yard',
        coords: [13.453496, 52.507928],
        address: 'Revaler Str. 99, 10245 Berlin',
        events: ['We Outside'],
      },
      {
        name: 'Corner TT - Blücherstraße',
        coords: [13.392376, 52.496517],
        address: 'Blücherstraße / Blücherplatz, 10961 Berlin',
        events: ['On My Mind'],
      },
    ],
  },
];

function venueCoord(stop: Stop, v: Venue, i: number): [number, number] {
  if (v.coords) return v.coords;
  const n = stop.venues.length;
  if (n === 1) return stop.coords;
  const angle = (i / n) * Math.PI * 2;
  const r = 0.05;
  return [stop.coords[0] + Math.cos(angle) * r, stop.coords[1] + Math.sin(angle) * r * 0.62];
}

function cityEvents(stop: Stop) {
  return Array.from(new Set(stop.venues.flatMap((venue) => venue.events ?? [])));
}

function venueMatchesEvent(venue: Venue, event: string | null) {
  return !event || Boolean(venue.events?.includes(event));
}

function eventVenues(stop: Stop, event: string) {
  return stop.venues.filter((venue) => venueMatchesEvent(venue, event));
}

function formatVenueLocation(venue: Venue) {
  return `${venue.name}${venue.count ? ` ×${venue.count}` : ''}${venue.address ? ` · ${venue.address}` : ''}${
    venue.approx ? ' · ungefähre Position' : ''
  }`;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function lngLatToWorld([lng, lat]: [number, number], zoom: number) {
  const worldSize = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((lat * Math.PI) / 180);

  return {
    x: ((lng + 180) / 360) * worldSize,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * worldSize,
  };
}

function getTileLayout(tileView: TileView) {
  const mapCenterWorld = lngLatToWorld(tileView.center, tileView.zoom);
  const mapTopLeft = {
    x: mapCenterWorld.x - tileView.width / 2,
    y: mapCenterWorld.y - tileView.height / 2,
  };

  const mapTileCount = 2 ** tileView.zoom;
  const mapTileStartX = Math.floor(mapTopLeft.x / TILE_SIZE) - 1;
  const mapTileEndX = Math.floor((mapTopLeft.x + tileView.width) / TILE_SIZE) + 1;
  const mapTileStartY = Math.floor(mapTopLeft.y / TILE_SIZE) - 1;
  const mapTileEndY = Math.floor((mapTopLeft.y + tileView.height) / TILE_SIZE) + 1;

  const tiles = Array.from(
    { length: mapTileEndX - mapTileStartX + 1 },
    (_, xIndex) => mapTileStartX + xIndex
  ).flatMap((rawX) =>
    Array.from({ length: mapTileEndY - mapTileStartY + 1 }, (_, yIndex) => {
      const y = mapTileStartY + yIndex;
      const x = ((rawX % mapTileCount) + mapTileCount) % mapTileCount;

      return {
        key: `${rawX}-${y}`,
        x,
        y,
        left: ((rawX * TILE_SIZE - mapTopLeft.x) / tileView.width) * 100,
        top: ((y * TILE_SIZE - mapTopLeft.y) / tileView.height) * 100,
        width: (TILE_SIZE / tileView.width) * 100,
        height: (TILE_SIZE / tileView.height) * 100,
      };
    })
  );

  return { tiles, mapTopLeft };
}

function getCityTileView(stop: Stop) {
  return (
    CITY_TILE_VIEWS[stop.city] ?? {
      center: stop.coords,
      zoom: 12,
      width: 640,
      height: 720,
    }
  );
}

function getTileUrl(zoom: number, x: number, y: number) {
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

function preloadImage(url: string) {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise<void>((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      if (typeof image.decode === 'function') {
        void image.decode().then(() => resolve()).catch(() => resolve());
        return;
      }

      resolve();
    };
    image.onerror = () => resolve();
    image.src = url;
  });
}

function preloadCityTiles(stop: Stop) {
  const cacheKey = stop.city;
  const cached = cityTilePreloadCache.get(cacheKey);
  if (cached) return cached;

  const tileView = getCityTileView(stop);
  const { tiles } = getTileLayout(tileView);
  const urls = Array.from(new Set(tiles.map((tile) => getTileUrl(tileView.zoom, tile.x, tile.y))));
  const promise = Promise.all(urls.map(preloadImage)).then(() => undefined);
  cityTilePreloadCache.set(cacheKey, promise);

  return promise;
}

function preloadMapJson(url: string) {
  if (typeof window === 'undefined') return;
  void fetch(url, { cache: 'force-cache' }).catch(() => undefined);
}

const markerOffsets: Record<string, { x: number; y: number }> = {
  Halo: { x: -20, y: -2 },
  'Club 25': { x: 18, y: 4 },
  'Thomas Read': { x: 6, y: 22 },
  'Golden Pudel': { x: -8, y: 18 },
  YOTO: { x: -14, y: -12 },
  '45 Herz Gelände': { x: 18, y: -12 },
  Uwe: { x: 16, y: -8 },
  'BRICKS Berlin': { x: -14, y: -8 },
  'Skate Yard': { x: 16, y: -10 },
  'Corner TT - Blücherstraße': { x: -16, y: 10 },
};

function getCityMarkerPosition(coords: [number, number], tileView: TileView, mapTopLeft: { x: number; y: number }) {
  const point = lngLatToWorld(coords, tileView.zoom);

  return {
    left: `${((point.x - mapTopLeft.x) / tileView.width) * 100}%`,
    top: `${((point.y - mapTopLeft.y) / tileView.height) * 100}%`,
  };
}

function WorldMap({ onOpenCountry, reduce }: { onOpenCountry: () => void; reduce: boolean | null }) {
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] shadow-[0_18px_80px_rgba(0,0,0,0.45)]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: TOUR_REGION_SCALE, center: TOUR_REGION_CENTER }}
        width={760}
        height={460}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={WORLD_GEO}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo) => {
              const isGermany = geo.properties?.name === 'Germany';

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={isGermany ? onOpenCountry : undefined}
                  onMouseEnter={isGermany ? () => setCountryPopoverOpen(true) : undefined}
                  onMouseLeave={isGermany ? () => setCountryPopoverOpen(false) : undefined}
                  onFocus={isGermany ? () => setCountryPopoverOpen(true) : undefined}
                  onBlur={isGermany ? () => setCountryPopoverOpen(false) : undefined}
                  fill={isGermany ? 'rgba(251,54,64,0.78)' : 'rgba(255,255,255,0.07)'}
                  stroke={isGermany ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.06)'}
                  strokeWidth={isGermany ? 0.9 : 0.35}
                  style={{
                    default: { outline: 'none', cursor: isGermany ? 'pointer' : 'default' },
                    hover: {
                      outline: 'none',
                      fill: isGermany ? RED : 'rgba(255,255,255,0.09)',
                      cursor: isGermany ? 'pointer' : 'default',
                    },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
        <Marker
          coordinates={NATIONAL_CENTER}
          onClick={onOpenCountry}
          onMouseEnter={() => setCountryPopoverOpen(true)}
          onMouseLeave={() => setCountryPopoverOpen(false)}
          onFocus={() => setCountryPopoverOpen(true)}
          onBlur={() => setCountryPopoverOpen(false)}
          style={{ default: { cursor: 'pointer' } }}
        >
          {!reduce && (
            <motion.circle
              r={8}
              fill={RED}
              animate={{ scale: [1, 3.5], opacity: [0.5, 0] }}
              transition={{ duration: 2.3, repeat: Infinity, ease: 'easeOut' }}
              style={{ transformOrigin: 'center' }}
            />
          )}
          <circle r={6} fill={RED} stroke="#ffffff" strokeWidth={1.4} />
        </Marker>
      </ComposableMap>
      <AnimatePresence>
        {countryPopoverOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-none absolute left-[60%] top-[35%] -translate-x-1/2 -translate-y-full rounded-2xl border border-white/15 bg-black/90 px-3 py-2 text-center shadow-[0_14px_35px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <p className="font-head text-base uppercase leading-none text-white">Deutschland</p>
            <p className="mt-1 text-[10px] font-medium leading-none text-armah-red">Hamburg · Berlin</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CityTileMap({
  stop,
  selectedEvent,
  hoveredEvent,
  hoveredVenue,
  onVenueHover,
}: {
  stop: Stop;
  selectedEvent: string | null;
  hoveredEvent: string | null;
  hoveredVenue: string | null;
  onVenueHover: (venue: string | null) => void;
}) {
  const tileView = getCityTileView(stop);
  const { tiles, mapTopLeft } = getTileLayout(tileView);
  const popupVenue = hoveredVenue ? stop.venues.find((venue) => venue.name === hoveredVenue) ?? null : null;
  const popupEvent = hoveredEvent ?? selectedEvent;
  const popupEvents = popupVenue
    ? selectedEvent && venueMatchesEvent(popupVenue, selectedEvent)
      ? [selectedEvent]
      : popupVenue.events ?? []
    : popupEvent
      ? [popupEvent]
      : [];
  const popupVenues = popupVenue ? [popupVenue] : popupEvent ? eventVenues(stop, popupEvent) : [];
  const popupTitle = popupEvents.join(' · ');
  const showPopupLocations =
    popupTitle.length > 0 && popupVenues.some((venue) => popupEvents.some((event) => venue.name.toLowerCase() !== event.toLowerCase()));

  return (
    <div
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#07100d] shadow-[0_18px_80px_rgba(0,0,0,0.45)]"
      style={{ aspectRatio: `${tileView.width} / ${tileView.height}` }}
    >
      <div className="absolute inset-0">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={getTileUrl(tileView.zoom, tile.x, tile.y)}
            alt=""
            aria-hidden="true"
            draggable={false}
            loading="eager"
            decoding="async"
            className="absolute max-w-none select-none"
            style={{
              left: `${tile.left}%`,
              top: `${tile.top}%`,
              width: `${tile.width}%`,
              height: `${tile.height}%`,
              filter: 'grayscale(1) invert(0.9) brightness(0.54) contrast(1.22)',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_44%,rgba(251,54,64,0.08),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.3))]" />

      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/65 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
        {stop.city} · OpenStreetMap
      </div>

      <AnimatePresence mode="wait">
        {popupTitle && (
          <motion.div
            key={`${popupTitle}-${popupVenues.map((venue) => venue.name).join('-')}`}
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-4 top-20 z-20 max-w-[290px] rounded-2xl border border-white/15 bg-black/80 px-4 py-3 text-left shadow-[0_16px_45px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-armah-red">Event</p>
            <p className="mt-1 text-sm font-semibold leading-5 text-white">{popupTitle}</p>
            {showPopupLocations && (
              <p className="mt-2 text-xs leading-5 text-white/45">
                {popupVenues.map(formatVenueLocation).join(' · ')}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {stop.venues.map((venue, index) => {
        const coords = venueCoord(stop, venue, index);
        const pos = getCityMarkerPosition(coords, tileView, mapTopLeft);
        const offset = markerOffsets[venue.name] ?? { x: 0, y: 0 };
        const matchesSelection = venueMatchesEvent(venue, selectedEvent);
        const matchesHoverEvent = Boolean(hoveredEvent && venueMatchesEvent(venue, hoveredEvent));
        const matchesHoverVenue = hoveredVenue === venue.name;
        const hasListHover = Boolean(hoveredEvent || hoveredVenue);
        const isSpotlit = matchesHoverEvent || matchesHoverVenue;
        const hasFocusedVenueLabel = Boolean(selectedEvent || hoveredEvent || hoveredVenue);
        const label = hasFocusedVenueLabel ? venue.name : venue.events?.join(' · ') ?? venue.name;

        return (
          <div
            key={venue.name}
            role="button"
            tabIndex={0}
            onMouseEnter={() => onVenueHover(venue.name)}
            onMouseLeave={() => onVenueHover(null)}
            onFocus={() => onVenueHover(venue.name)}
            onBlur={() => onVenueHover(null)}
            className={`absolute z-10 transition-all duration-200 ${
              isSpotlit
                ? 'opacity-100'
                : hasListHover
                  ? 'opacity-15'
                  : matchesSelection
                    ? 'opacity-55'
                    : 'opacity-10'
            }`}
            style={{
              ...pos,
              transform: `translate(calc(-50% + ${offset.x}px), calc(-100% + ${offset.y}px))`,
            }}
          >
            <div className="group relative flex flex-col items-center">
              <span
                className={`grid place-items-center rounded-full border text-[11px] font-semibold transition-all duration-200 ${
                  isSpotlit
                    ? 'h-10 w-10 border-white bg-armah-red text-white shadow-[0_0_28px_rgba(251,54,64,0.85)] ring-4 ring-armah-red/30'
                    : venue.own
                      ? 'h-8 w-8 border-white/75 bg-armah-red/80 text-white/80 ring-4 ring-armah-red/15'
                      : matchesSelection
                        ? 'h-8 w-8 border-white/70 bg-armah-red/75 text-white/80'
                        : 'h-8 w-8 border-white/30 bg-armah-red/45 text-white/55'
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`pointer-events-none mt-1 max-w-[170px] rounded-full border border-white/15 bg-black/80 px-2.5 py-1 text-center text-[10px] font-medium leading-tight text-white/90 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 ${
                  isSpotlit ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {venue.own && hasFocusedVenueLabel ? '★ ' : ''}
                {label}
                {hasFocusedVenueLabel && venue.count ? ` ×${venue.count}` : ''}
                {venue.approx ? ' · approx.' : ''}
              </span>
            </div>
          </div>
        );
      })}

      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-3 rounded bg-black/65 px-2 py-1 text-[10px] text-white/45 hover:text-white/80"
      >
        © OpenStreetMap
      </a>
    </div>
  );
}

export default function Trusted(): JSX.Element {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  // ----- Logo carousel -----
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  useEffect(() => {
    if (index < 0) setIndex(highlights.length - 1);
    if (index >= highlights.length) setIndex(0);
  }, [index]);
  const prev = () => setIndex((i) => (i - 1 + highlights.length) % highlights.length);
  const next = () => setIndex((i) => (i + 1) % highlights.length);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dx = touchStartX.current - touchEndX.current;
    if (dx > 40) next();
    else if (dx < -40) prev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // ----- Map journey -----
  const [mapLevel, setMapLevel] = useState<'world' | 'country' | 'city'>('world');
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [view, setView] = useState<{ center: [number, number]; zoom: number }>({
    center: NATIONAL_CENTER,
    zoom: NATIONAL_ZOOM,
  });
  const rafRef = useRef<number | null>(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const activeStop = STOPS.find((s) => s.city === activeCity) || null;
  const activeEvents = activeStop ? cityEvents(activeStop) : [];
  const showMobileMapDetails = mapLevel === 'country' || mapLevel === 'city';

  function animateTo(center: [number, number], zoom: number) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (reduce) { setView({ center, zoom }); return; }
    const from = viewRef.current;
    const start = performance.now();
    const dur = 750;
    const step = (now: number) => {
      const tt = Math.min((now - start) / dur, 1);
      const e = easeInOut(tt);
      const lon = from.center[0] + (center[0] - from.center[0]) * e;
      const lat = from.center[1] + (center[1] - from.center[1]) * e;
      const z = from.zoom * Math.pow(zoom / from.zoom, e);
      setView({ center: [lon, lat], zoom: z });
      if (tt < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    preloadMapJson(WORLD_GEO);
    preloadMapJson(GERMANY_GEO);
    STOPS.forEach((stop) => {
      void preloadCityTiles(stop);
    });
  }, []);

  useEffect(() => {
    if (mapLevel === 'world') {
      setMobilePanelOpen(false);
    }
  }, [mapLevel]);

  function openCountry() {
    setMobilePanelOpen(false);
    preloadMapJson(GERMANY_GEO);
    void Promise.all(STOPS.map(preloadCityTiles));
    setActiveCity(null);
    setSelectedEvent(null);
    setHoveredEvent(null);
    setHoveredVenue(null);
    animateTo(NATIONAL_CENTER, NATIONAL_ZOOM);
    setMapLevel('country');
  }
  function openCity(city: string) {
    const s = STOPS.find((x) => x.city === city);
    if (!s) return;
    setMobilePanelOpen(false);
    void preloadCityTiles(s);
    setActiveCity(city);
    setSelectedEvent(null);
    setHoveredEvent(null);
    setHoveredVenue(null);
    animateTo(s.coords, COUNTRY_TO_CITY_ZOOM);
    setMapLevel('city');
  }
  function resetToWorld() {
    setMobilePanelOpen(false);
    setMapLevel('world');
    setActiveCity(null);
    setSelectedEvent(null);
    setHoveredEvent(null);
    setHoveredVenue(null);
    animateTo(NATIONAL_CENTER, NATIONAL_ZOOM);
  }
  function resetToCountry() {
    setMobilePanelOpen(false);
    setMapLevel('country');
    setActiveCity(null);
    setSelectedEvent(null);
    setHoveredEvent(null);
    setHoveredVenue(null);
    animateTo(NATIONAL_CENTER, NATIONAL_ZOOM);
  }

  function chooseEvent(event: string | null, closeAfterSelect: boolean) {
    setSelectedEvent(event);
    setHoveredEvent(null);
    setHoveredVenue(null);
    if (closeAfterSelect) setMobilePanelOpen(false);
  }

  function renderMapDetailsPanel(mobile = false) {
    if (mapLevel === 'world') {
      return (
        <button
          type="button"
          onClick={openCountry}
          className={`group block w-full text-left cursor-pointer ${mobile ? '' : 'border-l border-armah-red/80 pl-5'}`}
        >
          <span className="text-white/35 text-[11px] uppercase tracking-[0.22em]">Tour-Region</span>
          <div className="mt-3">
            <h3 className="font-head text-2xl md:text-3xl text-white uppercase tracking-wide group-hover:text-armah-red transition-colors duration-200">
              Deutschland
            </h3>
            <span className="mt-2 inline-flex rounded-full border border-armah-red/35 bg-armah-red/10 px-3 py-1 text-xs font-medium text-armah-red">
              Hamburg · Berlin
            </span>
          </div>
          <span className="mt-4 inline-block text-white/40 text-xs group-hover:text-armah-red transition-colors">
            Deutschland öffnen →
          </span>
        </button>
      );
    }

    if (mapLevel === 'country' || !activeStop) {
      return (
        <div className={`space-y-4 ${mobile ? '' : 'border-l border-armah-red/80 pl-5'}`}>
          <span className="text-white/35 text-[11px] uppercase tracking-[0.22em]">Deutschland</span>
          {STOPS.map((stop) => (
            <button
              key={stop.city}
              type="button"
              onClick={() => openCity(stop.city)}
              className="group block w-full text-left cursor-pointer"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-head text-2xl text-white uppercase tracking-wide group-hover:text-armah-red transition-colors duration-200">
                  {stop.city}
                </h3>
                <span className="text-armah-red text-xs font-medium">
                  {cityEvents(stop).length} Events · {stop.venues.length} Locations
                </span>
              </div>
              <p className="mt-2 max-w-sm text-xs leading-5 text-white/42">
                {cityEvents(stop).join(' · ')}
              </p>
              <span className="mt-2 inline-block text-white/40 text-xs group-hover:text-armah-red transition-colors">
                Stadt-Historie öffnen →
              </span>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className={mobile ? '' : 'border-l-2 border-armah-red pl-5'}>
        <button
          type="button"
          onClick={resetToCountry}
          className="mb-4 inline-flex items-center gap-2 text-white/50 hover:text-armah-red text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Zurück zur Deutschlandkarte
        </button>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-head text-2xl md:text-3xl text-white uppercase tracking-wide">{activeStop.city}</h3>
          <span className="text-armah-red text-xs font-medium">
            {activeEvents.length} Events · {activeStop.venues.length} Locations
          </span>
        </div>
        <div className="mt-4">
          <span className="text-white/35 text-[11px] uppercase tracking-[0.22em]">Event wählen</span>
          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={() => chooseEvent(null, mobile)}
              className={`w-full rounded-2xl border px-3 py-2 text-left text-sm transition-colors ${
                selectedEvent === null
                  ? 'border-armah-red bg-armah-red/20 text-white'
                  : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-armah-red/50 hover:text-white'
              }`}
            >
              Alle Events
            </button>
            {activeEvents.map((event) => (
              <button
                key={event}
                type="button"
                onClick={() => chooseEvent(event, mobile)}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
                onFocus={() => setHoveredEvent(event)}
                onBlur={() => setHoveredEvent(null)}
                className={`w-full rounded-2xl border px-3 py-2 text-left text-sm font-medium transition-colors ${
                  selectedEvent === event
                    ? 'border-armah-red bg-armah-red/20 text-white'
                    : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-armah-red/50 hover:text-white'
                }`}
              >
                {event}
              </button>
            ))}
          </div>
          {selectedEvent && URL_BY_NAME[selectedEvent] && (
            <a
              href={URL_BY_NAME[selectedEvent]}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-white/40 transition-colors hover:text-armah-red"
            >
              Event auf Instagram öffnen →
            </a>
          )}
        </div>
      </div>
    );
  }

  const mobilePanelLabel =
    mapLevel === 'city' && activeStop
      ? `${activeStop.city} · Events wählen`
      : mapLevel === 'country'
        ? 'Deutschland · Städte wählen'
        : 'Tour-Region · Deutschland';
  const z = view.zoom;

  return (
    <section id="shows" className="relative w-full bg-black py-24 md:py-32">
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Title */}
        <Reveal className="text-center mb-4">
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            {t('trusted.title')}
          </h2>
          <div className="w-20 h-0.5 bg-armah-red mt-6 mx-auto" />
        </Reveal>
        <Reveal delay={0.05} className="text-center mb-12">
          <p className="text-white/50 text-sm md:text-base tracking-wide">
            Weltweit gesehen: bisher gebuchte DJ-Stopps in Deutschland
          </p>
        </Reveal>

        {/* Logo carousel */}
        <div className="max-w-4xl mx-auto mb-16 relative">
          <div
            className="w-full h-28 flex items-center justify-center overflow-hidden relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {highlights.map((h, i) => (
              <div
                key={h.name + i}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                  i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{ width: '220px', height: '80px' }}
              >
                <img src={h.logo} alt={h.name} className="h-full w-auto mx-auto object-contain" draggable={false} />
              </div>
            ))}
            <button
              aria-label={t('trusted.prev')}
              onClick={prev}
              className="absolute top-1/2 -translate-y-1/2 left-10 md:left-14 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full cursor-pointer text-white bg-black/40 hover:bg-black/60 focus:outline-none"
            >
              ‹
            </button>
            <button
              aria-label={t('trusted.next')}
              onClick={next}
              className="absolute top-1/2 -translate-y-1/2 right-10 md:right-14 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full cursor-pointer text-white bg-black/40 hover:bg-black/60 focus:outline-none"
            >
              ›
            </button>
          </div>
        </div>

        {/* Map + event list */}
        <div
          className={`grid grid-cols-1 items-center gap-8 lg:gap-10 mx-auto ${
            mapLevel === 'world'
              ? 'max-w-[1120px]'
              : 'max-w-[1500px] lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.72fr)]'
          }`}
        >
          {/* Map */}
          <Reveal className="w-full">
            <div className="grid">
              <AnimatePresence initial={false}>
              {mapLevel === 'world' ? (
                <motion.div
                  key="tour-region-map"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.14, filter: 'blur(8px)' }}
                  transition={{ duration: reduce ? 0 : 0.34, ease: 'easeOut' }}
                  className="col-start-1 row-start-1 w-full"
                  style={{ transformOrigin: '52% 42%' }}
                >
                  <div className="w-full">
                    <WorldMap onOpenCountry={openCountry} reduce={reduce} />
                  </div>
                </motion.div>
              ) : mapLevel === 'city' && activeStop ? (
                <motion.div
                  key={`city-map-${activeStop.city}`}
                  initial={{ opacity: 0, scale: 0.985, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: 'easeOut' }}
                  className="col-start-1 row-start-1 w-full"
                >
                  <div className="w-full">
                    <CityTileMap
                      stop={activeStop}
                      selectedEvent={selectedEvent}
                      hoveredEvent={hoveredEvent}
                      hoveredVenue={hoveredVenue}
                      onVenueHover={setHoveredVenue}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="country-map"
                  initial={{ opacity: 0, scale: 0.985, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.06, filter: 'blur(5px)' }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: 'easeOut' }}
                  className="col-start-1 row-start-1 w-full"
                >
                  <div className="relative w-full">
                  <button
                    onClick={resetToWorld}
                    className="absolute z-10 top-2 left-2 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-black/60 backdrop-blur-sm text-white/80 hover:text-white hover:border-armah-red/60 text-sm transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Welt
                  </button>
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{ center: NATIONAL_CENTER, scale: 3000 }}
                    width={600}
                    height={740}
                    style={{ width: '100%', height: 'auto' }}
                  >
                    <ZoomableGroup center={view.center} zoom={view.zoom} minZoom={1} maxZoom={80} filterZoomEvent={() => false}>
                      <Geographies geography={GERMANY_GEO}>
                        {({ geographies }: { geographies: any[] }) =>
                          geographies.map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="rgba(255,255,255,0.045)"
                              stroke="rgba(251,54,64,0.18)"
                              strokeWidth={0.6 / z}
                              style={{
                                default: { outline: 'none' },
                                hover: { outline: 'none', fill: 'rgba(255,255,255,0.07)' },
                                pressed: { outline: 'none' },
                              }}
                            />
                          ))
                        }
                      </Geographies>

                      {/* National → city pins */}
                      {STOPS.map((stop) => (
                        <Marker key={stop.city} coordinates={stop.coords} onClick={() => openCity(stop.city)} style={{ default: { cursor: 'pointer' } }}>
                          {!reduce && (
                            <motion.circle
                              r={6 / z}
                              fill={RED}
                              animate={{ scale: [1, 3], opacity: [0.5, 0] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                              style={{ transformOrigin: 'center' }}
                            />
                          )}
                          <circle r={5 / z} fill={RED} stroke="#ffffff" strokeWidth={1.2 / z} style={{ cursor: 'pointer' }} />
                          <text textAnchor="middle" y={-14 / z} style={{ fontFamily: 'Anton, sans-serif', fontSize: 18 / z, letterSpacing: 0.5, cursor: 'pointer' }} fill="#ffffff">
                            {stop.city}
                          </text>
                        </Marker>
                      ))}
                    </ZoomableGroup>
                  </ComposableMap>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-white/50">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-armah-red ring-2 ring-armah-red/40" />
                Eigene Veranstaltung
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-armah-red" />
                Gastauftritt
              </span>
            </div>
          </Reveal>

          {/* Desktop list / mobile popover trigger */}
          {showMobileMapDetails && (
            <div className="hidden w-full lg:block lg:max-w-[400px] lg:justify-self-end">
              {renderMapDetailsPanel(false)}
            </div>
          )}

          {showMobileMapDetails && (
            <div className="lg:hidden">
              <div
                className="relative z-30"
                onMouseEnter={() => setMobilePanelOpen(true)}
                onMouseLeave={() => setMobilePanelOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setMobilePanelOpen((open) => !open)}
                  onFocus={() => setMobilePanelOpen(true)}
                  className="flex w-full items-center justify-between rounded-full border border-armah-red/35 bg-black/75 px-4 py-3 text-left text-sm text-white/85 shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur transition-colors hover:border-armah-red/65"
                  aria-expanded={mobilePanelOpen}
                >
                  <span className="font-medium">{mobilePanelLabel}</span>
                  <span className="text-xs uppercase tracking-[0.16em] text-armah-red">
                    {mobilePanelOpen ? 'Schließen' : 'Details'}
                  </span>
                </button>

                <AnimatePresence>
                  {mobilePanelOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute bottom-full left-0 right-0 z-40 mb-3 max-h-[62vh] overflow-y-auto rounded-3xl border border-white/10 bg-black/95 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.7)] backdrop-blur-md"
                    >
                      {renderMapDetailsPanel(true)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {showMobileMapDetails && mobilePanelOpen && (
          <button
            type="button"
            aria-label="Popover schließen"
            className="fixed inset-0 z-20 bg-transparent lg:hidden"
            onClick={() => setMobilePanelOpen(false)}
            tabIndex={-1}
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}
