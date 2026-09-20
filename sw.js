/* White Wolf Scholar V92.6 — resilient PWA / offline-first service worker */
const CACHE_NAME = "white-wolf-scholar-v92.6.0";
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './manifest.webmanifest',
  './logo.webp',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './mountain-bg.jpg',
  './modules/core-persistence.js',
  './modules/state.js',
  './modules/time-engine.js',
  './modules/router.js',
  './modules/icons.js',
  './modules/event-bus.js',
  './modules/renderer.js',
  './modules/feature-controllers.js',
  './modules/task-engine.js',
  './modules/pdf-reader.js',
  './modules/ocr-reader.js',
  './modules/reader.js',
  './modules/global-search.js',
  './modules/dependency.js',
  './modules/document-intelligence.js',
  './modules/document-map.js',
  './modules/resource-intelligence.js',
  './modules/mastery-engine.js',
  './modules/adaptive-revision.js',
  './modules/adaptive-quiz.js',
  './modules/analytics-engine.js',
  './modules/qa.js',
  './modules/academic-entities.js',
  './modules/academic-graph.js',
  './modules/academic-migrations.js',
  './modules/academic-repositories.js',
  './modules/academic-services.js',
  './modules/academic-os-bootstrap.js',
  './modules/academic-os-integration.js',
  './modules/academic-os-cutover.js',
  './modules/academic-runtime-v65.33.js',
  './modules/academic-os-v4.js',
  './modules/academic-os-v5.js',
  './modules/academic-write-bridge.js',
  './modules/academic-projection-v68.js',
  './modules/academic-event-journal-v77.js',
  './script.js',
  './modules/ui-ux-refinement.js',
  './modules/adaptive-scheduler.js',
  './modules/white-wolf-intelligence.js',
  './modules/adaptive-daily-os.js',
  './modules/planning-intelligence.js',
  './modules/notification-engine.js',
  './modules/pwa-enhanced.js',
  './modules/academic-os-cross-feature.js',
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
        client.postMessage({type:"WW_SW_READY", version:"92.6.0"})
      ))
  );
});


self.addEventListener('message', event => {
  const d=event.data||{};
  if(d.type==='WW_SHOW_NOTIFICATION'){
    event.waitUntil(self.registration.showNotification(d.title||'White Wolf Scholar',{
      body:d.body||'', icon:'./icons/icon-192.png', badge:'./icons/icon-192.png',
      tag:'ww-'+((d.data&&d.data.tag)||'general'), data:d.data||{}
    }));
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async()=>{
    const list=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const target=new URL('./index.html',self.location.origin).href;
    for(const client of list){
      if('focus' in client){await client.focus(); if(client.postMessage) client.postMessage({type:'WW_NOTIFICATION_CLICK',data:event.notification.data||{}}); return;}
    }
    if(self.clients.openWindow) return self.clients.openWindow(target);
  })());
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
