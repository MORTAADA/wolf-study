/* White Wolf Scholar — V65.20 Integration & Reliability Cache */
const CACHE_NAME = "white-wolf-scholar-v65.20";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=65.20",
  "./script.js?v=65.20",
  "./mountain-bg.jpg",
  "./logo.svg",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./modules/core-persistence.js?v=65.20",
  "./modules/state.js?v=65.20",
  "./modules/router.js?v=65.20",
  "./modules/icons.js?v=65.20",
  "./modules/event-bus.js?v=65.20",
  "./modules/renderer.js?v=65.20",
  "./modules/feature-controllers.js?v=65.20",
  "./modules/pdf-reader.js?v=65.20",
  "./modules/ocr-reader.js?v=65.20",
  "./modules/reader.js?v=65.20",
  "./modules/resource-adapter.js?v=65.20",
  "./modules/pwa.js?v=65.20",
  "./modules/backup.js?v=65.20",
  "./modules/global-search.js?v=65.20",
  "./modules/services.js?v=65.20",
  "./modules/dependency.js?v=65.20",
  "./modules/architecture.js?v=65.20",
  "./modules/chatbot-evaluator.js?v=65.20",
  "./modules/document-intelligence.js?v=65.20",
  "./modules/document-map.js?v=65.20",
  "./modules/section-tutor.js?v=65.20",
  "./modules/learning-loop.js?v=65.20",
  "./modules/chatbot-context.js?v=65.20",
  "./modules/chatbot-modes.js?v=65.20",
  "./modules/chatbot-actions.js?v=65.20",
  "./modules/ai-gateway.js?v=65.20",
  "./modules/chatbot-student-model.js?v=65.20",
  "./modules/chatbot-memory.js?v=65.20",
  "./modules/tutor-knowledge-graph.js?v=65.20",
  "./modules/prerequisite-intelligence.js?v=65.20",
  "./modules/adaptive-teaching.js?v=65.20",
  "./modules/tutor-orchestrator.js?v=65.20",
  "./modules/tutor-session.js?v=65.20",
  "./modules/problem-solving-tutor.js?v=65.20",
  "./modules/tutor-dashboard.js?v=65.20",
  "./modules/tutor-hardening.js?v=65.20",
  "./modules/chatbot.js?v=65.20",
  "./modules/mastery-engine.js?v=65.20",
  "./modules/adaptive-revision.js?v=65.20",
  "./modules/adaptive-quiz.js?v=65.20",
  "./modules/analytics-engine.js?v=65.20",
  "./modules/qa.js?v=65.20"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({type:"window", includeUncontrolled:true}))
    .then(clients => clients.forEach(client => client.postMessage({type:"WW_SW_READY", version:"65.20"}))));
});
function isAppAsset(url, req) {
  return req.method === "GET" && (url.pathname.endsWith("/index.html") || url.pathname.endsWith("/script.js") || url.pathname.endsWith("/style.css") || url.pathname.includes("/modules/") || url.pathname.endsWith("/manifest.webmanifest") || url.pathname.endsWith("/logo.svg") || url.pathname.includes("/icons/") || url.pathname.endsWith("/mountain-bg.jpg"));
}
self.addEventListener("fetch", event => {
  const req=event.request; if(req.method!=="GET") return; const url=new URL(req.url);
  if(req.mode==="navigate"){event.respondWith((async()=>{const cache=await caches.open(CACHE_NAME);const cached=await cache.match(req)||await cache.match("./index.html");const net=fetch(req,{cache:"no-store"}).then(r=>{if(r&&r.ok)cache.put("./index.html",r.clone()).catch(()=>{});return r}).catch(()=>null);if(cached){event.waitUntil(net.catch(()=>{}));return cached}return (await net)||Response.error()})());return;}
  if(isAppAsset(url,req)||url.pathname.endsWith("/sw.js")){event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const r=await fetch(req);if(r&&r.ok&&!url.pathname.endsWith("/sw.js"))caches.open(CACHE_NAME).then(c=>c.put(req,r.clone())).catch(()=>{});return r}catch(e){return Response.error()}})());return;}
  event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const r=await fetch(req);if(r&&r.ok)caches.open(CACHE_NAME).then(c=>c.put(req,r.clone())).catch(()=>{});return r}catch(e){return Response.error()}})());
});
