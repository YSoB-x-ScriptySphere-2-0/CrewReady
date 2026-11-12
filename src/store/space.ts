// The real NASA data the game shows and sizes its storms from (BUILD_SEQUENCE.md D2b).
// Loaded once when the app opens (src/services/nasa.ts: 3-second timeout, cache, ARCHIVE fallback), so by the
// time a player presses PLAY the storm size X is known. Until it loads, X is the middle value, 20 (a game estimate).
import { create } from 'zustand';
import { stormSize, strongerStorm } from '../engine/storm';
import {
  fetchCuratedImages,
  fetchMarsWeather,
  getApod,
  getEarthToday,
  getKpToday,
  getNearEarthAsteroids,
  getSpaceWeather,
  type Apod,
  type EpicImage,
  type MarsSol,
  type NasaImageItem,
  type NeoWsSummary,
  type Result,
  type StormEvent,
} from '../services/nasa';

interface SpaceStore {
  weather: Result<StormEvent> | null;
  kp: Result<number> | null;
  earth: Result<EpicImage> | null;
  apod: Result<Apod> | null;
  neows: Result<NeoWsSummary> | null;
  mars: Result<MarsSol[]> | null;
  images: Result<NasaImageItem[]> | null;
  load: () => Promise<void>;
}

let started: Promise<void> | null = null;

export const useSpace = create<SpaceStore>((set) => ({
  weather: null,
  kp: null,
  earth: null,
  apod: null,
  neows: null,
  mars: null,
  images: null,
  // One call per dataset, each saved as soon as it arrives. A failure leaves that card on its loading or sample state.
  load: () => {
    started ??= Promise.all([
      getSpaceWeather().then((weather) => set({ weather })),
      getKpToday().then((kp) => set({ kp })),
      getEarthToday().then((earth) => set({ earth })),
      getApod().then((apod) => set({ apod })),
      getNearEarthAsteroids().then((neows) => set({ neows })),
      fetchMarsWeather().then((mars) => set({ mars })),
      fetchCuratedImages().then((images) => set({ images })),
    ]).then(
      () => undefined,
      () => undefined,
    );
    return started;
  },
}));

/** The May 2024 storm (docs/06 §4, confirmed in DONKI): an SEP event on 9 May and Kp 9 on 10–11 May. */
export const ARCHIVE_X = stormSize({ hasSep: true, kpIndex: 9 });

/** Storm size X for a loaded space-weather event (docs/06 §3). Not loaded yet: 20. */
export const stormXFrom = (weather: Result<StormEvent> | null): number =>
  weather ? stormSize({ hasSep: weather.data.hasSep, kpIndex: weather.data.kpIndex, cmeSpeed: weather.data.cmeSpeed }) : 20;

/** X for a mission that starts now. */
export const currentStormX = () => stormXFrom(useSpace.getState().weather);

/** Level 6 always uses the stronger of live and archive (docs/06 §3). */
export const level6Storm = (x: number) => strongerStorm(x, ARCHIVE_X);

/** "10 May 2024": one date style for every card. Takes a full ISO time or a plain date. */
export function fmtDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
