/* White Wolf Scholar — V63.6.4 Fast PWA Cache */
const CACHE_NAME = "white-wolf-scholar-v63.6.4-fast";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=63.6.4",
  "./script.js?v=63.6.4",
  "./mountain-bg.jpg",
  "./logo.svg",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./modules/core-persistence.js?v=63.6.4",
  "./modules/state.js?v=63.6.4",
  "./modules/router.js?v=63.6.4",
  "./modules/icons.js?v=63.6.4",
  "./modules/event-bus.js?v=63.6.4",
  "./modules/renderer.js?v=63.6.4",
  "./modules/feature-controllers.js?v=63.6.4",
  "./modules/reader.js?v=63.6.4",
  "./modules/resource-adapter.js?v=63.6.4",
  "./modules/pwa.js?v=63.6.4",
  "./modules/backup.js?v=63.6.4",
  "./modules/global-search.js?v=63.6.4",
  "./modules/services.js?v=63.6.4",
  "./modules/dependency.js?v=63.6.4",
  "./modules/architecture.js?v=63.6.4",
  "./modules/chatbot.js?v=63.6.4",
  "./modules/mastery-engine.js?v=63.6.4",
  "./modules/adaptive-revision.js?v=63.6.4",
  "./modules/adaptive-quiz.js?v=63.6.4",
  "./modules/analytics-engine.js?v=63.6.4",
  "./modules/qa.js?v=63.6.4"
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
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
      .then(() => self.clients.matchAll({type:"window", includeUncontrolled:true}))
      .then(clients => clients.forEach(client => client.postMessage({
        type:"WW_SW_READY", version:"63.6.4"
      })))
  );
});

function isAppAsset(url, req) {
  return req.method === "GET" && (
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/script.js") ||
    url.pathname.endsWith("/style.css") ||
    url.pathname.includes("/modules/") ||
    url.pathname.endsWith("/manifest.webmanifest") ||
    url.pathname.endsWith("/logo.svg") ||
    url.pathname.includes("/icons/") ||
    url.pathname.endsWith("/mountain-bg.jpg")
  );
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Navigation: instant cached launch when available, then refresh cache in background.
  // This avoids a second page load and prevents a slow network from blocking startup.
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req) || await cache.match("./index.html");
      const networkPromise = fetch(req, {cache:"no-store"}).then(response => {
        if (response && response.ok) cache.put("./index.html", response.clone()).catch(()=>{});
        return response;
      }).catch(() => null);
      if (cached) {
        event.waitUntil(networkPromise.catch(()=>{}));
        return cached;
      }
      const network = await networkPromise;
      return network || Response.error();
    })());
    return;
  }

  // Versioned app assets: cache first for immediate startup. The version query changes
  // whenever the app is released, so a new deployment naturally gets a new cache key.
  if (isAppAsset(url, req) || url.pathname.endsWith("/sw.js")) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const response = await fetch(req);
        if (response && response.ok && !url.pathname.endsWith("/sw.js")) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(()=>{});
        }
        return response;
      } catch (e) {
        return Response.error();
      }
    })());
    return;
  }

  // Other resources: cache first, then network and cache the successful response.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const response = await fetch(req);
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(()=>{});
      }
      return response;
    } catch (e) {
      return Response.error();
    }
  })());
});
