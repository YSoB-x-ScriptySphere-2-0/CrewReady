// Service Worker Registration — BUILD_SEQUENCE.md D2a

/**
 * Registers the offline service worker in environments that support it.
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`.replace(/([^:]\/)\/+/g, '$1');
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        // Optional: listen for updates
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New content available; will update on next visit.');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.warn('[SW] Registration notice:', error);
      });
  });
}
