const CACHE_NAME = "white-wolf-scholar-v61.6-qa";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=61.6",
  "./script.js?v=61.6",
  "./mountain-bg.jpg",
  "./logo.svg",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./modules/core-persistence.js?v=61.6",
  "./modules/state.js?v=61.6",
  "./modules/router.js?v=61.6",
  "./modules/icons.js?v=61.6",
  "./modules/event-bus.js?v=61.6",
  "./modules/renderer.js?v=61.6",
  "./modules/feature-controllers.js?v=61.6",
  "./modules/reader.js?v=61.6",
  "./modules/resource-adapter.js?v=61.6",
  "./modules/pwa.js?v=61.6",
  "./modules/backup.js?v=61.6",
  "./modules/global-search.js?v=61.6",
  "./modules/services.js?v=61.6",
  "./modules/dependency.js?v=61.6",
  "./modules/architecture.js?v=61.6",
  "./modules/chatbot.js?v=61.6",
  "./modules/qa.js?v=61.6"
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
      .then(clients => clients.forEach(client => client.postMessage({type:"WW_V61_4_QA_READY"})))
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
