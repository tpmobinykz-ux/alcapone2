/* ===============================
   Zodiac Mafia – Service Worker
   =============================== */

const CACHE_NAME = "zodiac-mafia-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./game.js",
  "./logic.js",
  "./ui.js",
  "./manifest.json"
];

/* نصب */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

/* فعال‌سازی */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/* دریافت درخواست‌ها */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
