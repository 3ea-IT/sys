// Service Worker for Secure Seat PWA
//
// Bumping CACHE_NAME retires every older cache on activate. v2 was
// cache-first for *every* same-origin document and script, which froze
// authenticated pages and kept serving build assets that no longer exist
// after a deploy, so anything cached by it has to go.
const CACHE_NAME = 'secure-seat-v3';

// The app is not always mounted at the domain root (XAMPP serves it from
// /sys/public), so everything is resolved against the registration scope
// rather than hardcoded absolute paths.
const SCOPE = new URL(self.registration.scope);
const OFFLINE_URL = new URL('offline.html', SCOPE).href;

const urlsToCache = [
  SCOPE.href,
  OFFLINE_URL,
  new URL('assets/secure_seat_logo.png', SCOPE).href,
];

// Paths that must never be served from the cache: they are per-user,
// session-dependent, or carry Inertia props that go stale immediately.
const NEVER_CACHE = ['admin', 'vendor', 'api', 'login', 'logout', 'register', 'payment'];

// Path relative to the registration scope, so the checks below work the
// same whether the app is at / or at /sys/public/.
const scopedPath = (url) => {
  const path = new URL(url).pathname;
  return path.startsWith(SCOPE.pathname) ? path.slice(SCOPE.pathname.length) : path.replace(/^\//, '');
};

const isPrivate = (request) => {
  // Inertia sends its JSON page payloads with this header. They are never
  // cacheable, and matching one against a cached HTML document (same URL)
  // hands Inertia a document where it expects JSON.
  if (request.headers.get('X-Inertia')) {
    return true;
  }
  const path = scopedPath(request.url);
  return NEVER_CACHE.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
};

// Build output is content-hashed, so a hit is always the right file and a
// miss always means a genuinely new asset.
const isBuildAsset = (request) => scopedPath(request.url).startsWith('build/');

const isStaticAsset = (request) =>
  ['style', 'script', 'image', 'font'].includes(request.destination);

// Install event
self.addEventListener('install', event => {
  // Take over straight away instead of waiting for every open tab to
  // close, so a browser holding a poisoned v2 cache recovers on reload.
  self.skipWaiting();

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
  const request = event.request;

  // Skip POST requests, API calls, and external resources
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other unsupported schemes
  if (request.url.startsWith('chrome-extension://') ||
      request.url.startsWith('moz-extension://')) {
    return;
  }

  // Skip cross-origin requests entirely (e.g. a Vite dev server running
  // on a different port, or third-party APIs). Intercepting these caused
  // net::ERR_FAILED loops when the dev server wasn't reachable.
  if (new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // Authenticated pages and Inertia payloads always go to the network.
  if (isPrivate(request)) {
    return;
  }

  // Full page loads are network-first: a cached document pins the exact
  // asset hashes it was built against, so serving a stale one after a
  // rebuild loads JavaScript that is no longer on disk.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, copy).catch(err => console.log('Cache put error:', err));
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(cached => cached || caches.match(OFFLINE_URL))
            .then(cached => cached || Response.error());
        })
    );
    return;
  }

  // Hashed build output is immutable, so cache-first is safe here.
  if (isBuildAsset(request)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) {
          return cached;
        }
        return fetch(request)
          .then(response => {
            if (response && response.status === 200 && response.type === 'basic') {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, copy).catch(err => console.log('Cache put error:', err));
              });
            }
            return response;
          })
          .catch(() => Response.error());
      })
    );
    return;
  }

  // Everything else static (unhashed images, fonts, plain CSS) is served
  // from cache for speed but refreshed in the background, so it can never
  // get stuck on an old copy the way v2 did.
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request)
          .then(response => {
            if (response && response.status === 200 && response.type === 'basic') {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, copy).catch(err => console.log('Cache put error:', err));
              });
            }
            return response;
          })
          .catch(() => cached || Response.error());

        return cached || network;
      })
    );
  }
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
    }).then(() => self.clients.claim())
  );
});
