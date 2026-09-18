/* WHITE WOLF SCHOLAR V79 — Production hardening & diagnostics
 * Non-invasive: observes runtime health, exposes diagnostics, adds safe keyboard UX.
 */
(function(global){
  'use strict';
  var VERSION='79.1';
  var required=['WWCorePersistence','WWAcademicRepositories','WWAcademicProjectionV68','WWAcademicEventJournal','WWArchitectureFinalGateV78'];
  var bootAt=Date.now(), errors=[];
  function record(kind,value){errors.push({kind:String(kind),message:String(value||''),at:new Date().toISOString()});if(errors.length>20)errors.shift()}
  function health(){
    var missing=required.filter(function(k){return !global[k]});
    return {
      version:VERSION, status:missing.length?'DEGRADED':'PASS', missing:missing,
      persistence:!!global.WWCorePersistence && !global.WWCorePersistence.unavailable,
      indexedDB:!!global.indexedDB,
      serviceWorker:'serviceWorker' in navigator,
      online:navigator.onLine,
      uptimeMs:Date.now()-bootAt,
      runtimeErrors:errors.slice(),
      frozen:!!(global.WWArchitectureFinalGateV78&&global.WWArchitectureFinalGateV78.frozen)
    };
  }
  async function fullHealth(){
    var h=health();
    if(global.WWAcademicEventJournal&&global.WWAcademicEventJournal.stats){try{h.events=await global.WWAcademicEventJournal.stats()}catch(e){h.eventsError=String(e)}}
    if(navigator.storage&&navigator.storage.estimate){try{var q=await navigator.storage.estimate();h.storage={usage:q.usage||0,quota:q.quota||0,percent:q.quota?Math.round((q.usage||0)/q.quota*100):0}}catch(e){}}
    return h;
  }
  function installShortcuts(){
    document.addEventListener('keydown',function(e){
      if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;
      var tag=(e.target&&e.target.tagName||'').toLowerCase();
      if(tag==='input'||tag==='textarea'||tag==='select'||(e.target&&e.target.isContentEditable))return;
      if(e.key==='/'&&global.WWGlobalSearch&&typeof global.WWGlobalSearch.open==='function'){e.preventDefault();global.WWGlobalSearch.open();}
    });
  }
  global.addEventListener('error',function(e){if(e&&e.error)record('error',e.error.message||e.message)},true);
  global.addEventListener('unhandledrejection',function(e){record('rejection',e&&e.reason&&e.reason.message||e&&e.reason||'unknown')});
  global.WWReleaseV79={version:VERSION,health:health,fullHealth:fullHealth,errors:errors,readyAt:bootAt};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installShortcuts);else installShortcuts();
})(window);
