const CACHE_NAME = 'web-ide-cache-v1';

const CORE_ASSETS = [
    '../',
    '../index.html',
    '../style.css',
    '../script.js',
    './manifest.json',
    '../screenshots/codeeditor.png',
    '../screenshots/aiassistant.png',
    '../screenshots/livepreview.png',
    '../screenshots/publish.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .catch((error) => console.log('Cache addAll failed:', error))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only cache GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached response if found
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(event.request).then((networkResponse) => {
                    // Check if valid response
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // Clone the response and cache it dynamically
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return networkResponse;
                }).catch(() => {
                    // Provide offline fallback logic here if necessary
                });
            })
    );
});
