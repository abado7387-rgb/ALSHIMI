const CACHE_NAME = 'dailytasks-pro-cache-v1';

// Install event: triggered when the service worker is first installed.
self.addEventListener('install', event => {
  // Pre-cache the main app shell assets.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll([
          '/',
          '/index.html',
        ]);
      })
  );
  self.skipWaiting();
});

// Activate event: triggered when the service worker is activated.
self.addEventListener('activate', event => {
  // Clean up old caches.
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


// Fetch event: triggered for every network request made by the page.
self.addEventListener('fetch', event => {
  // Use a stale-while-revalidate strategy for most assets.
  // This serves from cache first for speed, then updates the cache in the background.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If we receive a valid response, we update the cache.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(err => {
          // Fetch failed, probably because of no network.
          // The cached response (if any) is already being returned.
          console.log('Fetch failed; returning cached response if available.', err);
        });

        // Return the cached response immediately if it exists, otherwise wait for the network.
        return response || fetchPromise;
      });
    })
  );
});
