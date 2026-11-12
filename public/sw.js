// CrewReady Offline Service Worker — BUILD_SEQUENCE.md D2a
// Caches application shell, public/data snapshots, art, and assets for 100% offline play.

const CACHE_NAME = 'crewready-v1';

const PRECACHE_URLS = [
  './',
  'index.html',
  'manifest.json',
  'icon.svg',
  // Public data snapshots (NASA and NOAA archives)
  'data/donki.json',
  'data/noaa_kp.json',
  'data/neows.json',
  'data/epic.json',
  'data/apod.json',
  'data/insight.json',
  'data/osdr.json',
  'data/images.json',
  // Key crew art and welcome backgrounds
  'art/welcome-1.webp',
  'art/welcome-2.webp',
  'art/orbit-stand.webp',
  'art/orbit-wave.webp',
  'art/orbit-cheer.webp',
  'art/orbit-think.webp',
  'art/orbit-thumbs.webp',
  'art/nova-stand.webp',
  'art/nova-wave.webp',
  'art/nova-cheer.webp',
  'art/nova-think.webp',
  'art/twinkle-happy.webp',
  'art/twinkle-neutral.webp',
  'art/twinkle-question.webp',
  'art/twinkle-worried.webp',
  'art/twinkle-stars.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[SW] Precache notice:', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET and chrome-extension/other schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation requests (HTML document): Network first, fall back to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match('./') || await caches.match('index.html');
          return fallback || new Response('Offline', { status: 503, statusText: 'Offline' });
        })
    );
    return;
  }

  // 2. Data snapshots (/data/*.json): Stale-while-revalidate / Cache first
  if (url.pathname.includes('/data/') && url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => null);

        // If in cache, return immediately; otherwise wait for network
        return cached || fetchPromise.then((res) => res || new Response('{"error":"offline"}', { status: 503 }));
      })
    );
    return;
  }

  // 3. Static assets, fonts, art, scripts, styles: Cache first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          // Only cache same-origin or static asset hosts
          const isSameOrigin = url.origin === self.location.origin;
          const isStaticAsset =
            url.pathname.match(/\.(js|css|webp|png|jpg|jpeg|svg|woff2|woff|mp3|ogg|glb)$/i);

          if (isSameOrigin || isStaticAsset) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // If offline and request is an image, can return cached icon
          if (request.destination === 'image') {
            return caches.match('icon.svg');
          }
          return new Response('Network error', { status: 408 });
        });
    })
  );
});
