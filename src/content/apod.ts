// NASA's picture of the day (APOD) for the Success screen (A9).
// The APOD API now sends a placeholder for every date: the title "NASA Science" and a NASA logo image.
// The logo is banned on screen, so a saved entry is shown only when `usableApod` says it is a real picture.
// B1 adds the snapshot script that saves real entries; B4 wires live data. Until then there is none.

export interface ApodEntry {
  date?: string;
  title?: string;
  url?: string;
  hdurl?: string;
  media_type?: string;
  copyright?: string;
  explanation?: string;
}

/** True only for a real picture: an image, with a url, that is not the placeholder or the NASA logo. */
export function usableApod(entry: ApodEntry | null | undefined): entry is ApodEntry & { url: string } {
  if (!entry) return false;
  if (entry.media_type !== 'image') return false;
  if (typeof entry.url !== 'string' || entry.url.trim() === '') return false;
  if ((entry.title ?? '').trim() === 'NASA Science') return false;
  if (entry.url.toLowerCase().includes('nasa-logo')) return false;
  return true;
}

/**
 * The saved APOD entry to show. None yet: the API only returns the placeholder, and no real
 * entry is saved in the repo. B1 (snapshot) saves one; B4 (live data) replaces this.
 */
export const SAVED_APOD: ApodEntry | null = null;
