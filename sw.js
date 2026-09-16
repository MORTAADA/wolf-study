const CACHE_NAME = "white-wolf-scholar-v63.5-stable";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=63.5",
  "./script.js?v=63.5",
  "./mountain-bg.jpg",
  "./logo.svg",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./modules/core-persistence.js?v=63.5",
  "./modules/state.js?v=63.5",
  "./modules/router.js?v=63.5",
  "./modules/icons.js?v=63.5",
  "./modules/event-bus.js?v=63.5",
  "./modules/renderer.js?v=63.5",
  "./modules/feature-controllers.js?v=63.5",
  "./modules/reader.js?v=63.5",
  "./modules/resource-adapter.js?v=63.5",
  "./modules/pwa.js?v=63.5",
  "./modules/backup.js?v=63.5",
  "./modules/global-search.js?v=63.5",
  "./modules/services.js?v=63.5",
  "./modules/dependency.js?v=63.5",
  "./modules/architecture.js?v=63.5",
  "./modules/chatbot.js?v=63.5",
  "./modules/adaptive-quiz.js?v=63.5",
  "./modules/qa.js?v=63.5"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
      .then(() => self.clients.matchAll({type:"window", includeUncontrolled:true}))
      .then(clients => clients.forEach(client => client.postMessage({type:"WW_V62_6_STABLE_READY"})))
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Always prefer the network for app code and the document. This prevents
  // an older mobile PWA/service-worker cache from booting stale JavaScript.
  const url = new URL(req.url);
  const isAppCode = req.mode === "navigate" ||
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/script.js") ||
    url.pathname.endsWith("/style.css") ||
    url.pathname.endsWith("/sw.js") ||
    url.pathname.endsWith("/manifest.webmanifest") ||
    url.pathname.includes("/modules/");

  if (isAppCode) {
    event.respondWith(
      fetch(req, { cache: "no-store" }).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
        return response;
      }).catch(() => caches.match(req).then(cached => cached || (req.mode === "navigate" ? caches.match("./index.html") : Response.error())))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
        return response;
      }).catch(() => {
        if (req.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      });
    })
  );
});
