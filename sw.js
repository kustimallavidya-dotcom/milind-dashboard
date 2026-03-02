const CACHE_NAME = 'milindcorp-cache-v3';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './icon.svg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // Force new Service Worker to take over immediately
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        clients.claim().then(() => {
            // Clear old caches
            return caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            });
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        // Network first, fallback to cache for fast updates
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
