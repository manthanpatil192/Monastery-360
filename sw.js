// =============================================
// SW.JS — Service Worker for PWA Offline Caching
// =============================================

const CACHE_NAME = 'monastery360-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './tour.html',
  './monasteries.html',
  './archive.html',
  './calendar.html',
  './map.html',
  './guide.html',
  './css/global.css',
  './css/components.css',
  './css/animations.css',
  './js/main.js',
  './js/tour.js',
  './js/archive.js',
  './js/calendar.js',
  './js/map.js',
  './js/guide.js',
  './js/chatbot.js',
  './js/i18n.js',
  './manifest.json',
  './assets/images/hero.png',
  './assets/images/rumtek.png',
  './assets/images/pemayangtse.png',
  './assets/images/tashiding.png',
  './assets/images/enchey.png',
  './assets/images/interior.png',
  './assets/images/pano_rumtek_courtyard.png',
  './assets/images/pano_shrine_interior.png',
  './assets/images/pano_pemayangtse.png',
  './assets/images/pano_tashiding.png',
  './assets/images/pano_enchey.png',
  './assets/images/pano_ralang.png',
  './assets/images/pano_samdruptse.png',
  './assets/images/pano_himalayas.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching Monastery 360 offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignore external cross-origin API calls (like Groq) from cache
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    }).catch(() => {
      // Fallback to offline index page
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
