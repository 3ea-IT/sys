// Service Worker for Secure Seat PWA
const CACHE_NAME = 'secure-seat-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/secure_seat_logo.png',
  '/offline.html'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => {
          console.log('Cache addAll error:', err);
        });
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  // Skip POST requests, API calls, and external resources
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other unsupported schemes
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache successful HTML, CSS, JS, and image requests
            if (event.request.destination === 'document' || 
                event.request.destination === 'style' || 
                event.request.destination === 'script' || 
                event.request.destination === 'image') {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache).catch(err => {
                    console.log('Cache put error:', err);
                  });
                });
            }

            return response;
          })
          .catch(() => {
            // Return offline page if available
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
