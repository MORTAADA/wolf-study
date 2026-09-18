/* White Wolf Scholar V79.1 — resilient PWA / offline-first service worker */
const CACHE_NAME = "white-wolf-scholar-v80.1.0";
const APP_SHELL = [
  './modules/academic-os-v4.js',
  './modules/academic-event-journal-v77.js',
  './modules/architecture-final-gate-v78.js',
  './modules/academic-projection-v68.js',
  './modules/release-hardening-v80.js',
  './modules/academic-os-v5.js',
  './modules/academic-write-bridge.js',
  './modules/academic-entities.js',
  './modules/academic-migrations.js',
  './modules/academic-repositories.js',
  './modules/academic-services.js',
  './modules/architecture-v3.js',
  './modules/architecture-hardening-v65.34.js',
  './modules/academic-os-bootstrap.js',
  './modules/academic-os-cutover.js',
  './modules/academic-runtime-v65.33.js',
  './modules/feature-migration-v65.31.js',
  './modules/legacy-api-retirement-v65.32.js',
  './modules/academic-os-integration.js',
  './modules/academic-os-cross-feature.js',
  "./",
  "./index.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./logo.svg",
  "./manifest.webmanifest",
  "./modules/adaptive-quiz.js",
  "./modules/adaptive-revision.js",
  "./modules/analytics-engine.js",
  "./modules/architecture.js",
  "./modules/backup.js",
  "./modules/core-persistence.js",
  "./modules/dependency.js",
  "./modules/document-intelligence.js",
  "./modules/document-map.js",
  "./modules/event-bus.js",
  "./modules/feature-controllers.js",
  "./modules/global-search.js",
  "./modules/icons.js",
  "./modules/mastery-engine.js",
  "./modules/ocr-reader.js",
  "./modules/pdf-reader.js",
  "./modules/pwa.js",
  "./modules/qa.js",
  "./modules/reader.js",
  "./modules/renderer.js",
  "./modules/resource-adapter.js",
  "./modules/resource-intelligence.js",
  "./modules/router.js",
  "./modules/services.js",
  "./modules/state.js",
  "./modules/study-performance-engine.js",
  "./modules/study-performance-ui.js",
  "./modules/ui-ux-refinement.js",
  "./mountain-bg.jpg",
  "./script.js",
  "./style.css"
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
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({type:"window", includeUncontrolled:true}))
      .then(clients => clients.forEach(client =>
        client.postMessage({type:"WW_SW_READY", version:"79.1"})
      ))
  );
});

function sameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const hit = await cache.match(request, {ignoreSearch:true});
  if (hit) return hit;
  try {
    const response = await fetch(request);
    if (response && response.ok && sameOrigin(request)) {
      cache.put(request, response.clone()).catch(()=>{});
    }
    return response;
  } catch (_) {
    return new Response("Offline", {status:503, headers:{"Content-Type":"text/plain; charset=utf-8"}});
  }
}

async function navigation(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match("./index.html", {ignoreSearch:true});
  try {
    const response = await fetch(request, {cache:"no-store"});
    if (response && response.ok) {
      cache.put("./index.html", response.clone()).catch(()=>{});
      return response;
    }
  } catch (_) {}
  return cached || new Response(
    "<!doctype html><meta charset='utf-8'><title>White Wolf — Offline</title><body style='font-family:system-ui;padding:24px;background:#0a0e14;color:#dce8f7'><h1>🐺 White Wolf Scholar</h1><p>Mode hors connexion. Recharge l’application quand le cache est disponible.</p></body>",
    {status:200, headers:{"Content-Type":"text/html; charset=utf-8"}}
  );
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (request.mode === "navigate") {
    event.respondWith(navigation(request));
    return;
  }
  if (sameOrigin(request)) {
    event.respondWith(cacheFirst(request));
  }
});
