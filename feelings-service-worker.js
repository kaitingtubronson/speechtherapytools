const CACHE_NAME = "feelings-board-v2";

const FILES_TO_CACHE = [
  const FILES_TO_CACHE = [
  "feelings.html",
  "feelings-manifest.json",
  "feelings-service-worker.js"
];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
