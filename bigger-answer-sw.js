const CACHE_NAME = "bigger-answer-offline-v1";

const APP_URL = new URL(
  "./bigger-answer-slp-social-communication-game.html",
  self.location.href
).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.add(
        new Request(APP_URL, { cache: "reload" })
      );
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const app = new URL(APP_URL);

  if (
    event.request.method !== "GET" ||
    url.origin !== app.origin ||
    url.pathname !== app.pathname
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        const response = await fetch(event.request);

        if (response.ok) {
          await cache.put(APP_URL, response.clone());
          return response;
        }

        return (await cache.match(APP_URL)) || response;
      } catch {
        return (
          (await cache.match(APP_URL)) ||
          new Response(
            "Open this app online once before using it offline.",
            {
              status: 503,
              headers: { "Content-Type": "text/plain" }
            }
          )
        );
      }
    })()
  );
});
