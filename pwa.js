/* WHITE WOLF V45 — OFFLINE/PWA */
(function(){
  if(!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("./sw.js").catch(function(){});
  });
})();
