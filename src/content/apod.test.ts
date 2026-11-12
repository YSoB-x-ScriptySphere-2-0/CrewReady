import { describe, expect, it } from 'vitest';
import { SAVED_APOD, usableApod } from './apod';

const real = { date: '2024-01-01', title: 'A Galaxy', url: 'https://apod.nasa.gov/apod/image/2401/galaxy.jpg', media_type: 'image' };

describe('usableApod', () => {
  it('accepts a real saved picture', () => {
    expect(usableApod(real)).toBe(true);
  });
  it('rejects nothing at all', () => {
    expect(usableApod(null)).toBe(false);
    expect(usableApod(undefined)).toBe(false);
  });
  it('rejects videos and other media', () => {
    expect(usableApod({ ...real, media_type: 'video' })).toBe(false);
    expect(usableApod({ ...real, media_type: undefined })).toBe(false);
  });
  it('rejects an entry with no url', () => {
    expect(usableApod({ ...real, url: undefined })).toBe(false);
    expect(usableApod({ ...real, url: '' })).toBe(false);
  });
  it('rejects the placeholder the API sends today', () => {
    expect(usableApod({ ...real, title: 'NASA Science' })).toBe(false);
    expect(usableApod({ ...real, url: 'https://science.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo@2x.png' })).toBe(false);
    expect(usableApod({ ...real, title: 'NASA Science', url: 'https://science.nasa.gov/x/NASA-LOGO@2x.png' })).toBe(false);
  });
  it('has no usable saved picture yet, so Success shows none', () => {
    expect(usableApod(SAVED_APOD)).toBe(false);
  });
});
