/* White Wolf Scholar — Core Persistence V56
 * Single persistence contract for IndexedDB + localStorage mirror.
 */
(function(){
  'use strict';
  var DB_NAME='WhiteWolfDB', STORE_NAME='data', FALLBACK_KEY='wwAppStateFallback', db=null, unavailable=false;
  function fallbackRead(){try{var raw=localStorage.getItem(FALLBACK_KEY);return raw?JSON.parse(raw):null}catch(e){return null}}
  function fallbackWrite(v){try{localStorage.setItem(FALLBACK_KEY,JSON.stringify(v));return true}catch(e){console.warn('WW Persistence fallback write failed',e);return false}}
  function open(){
    return new Promise(function(resolve,reject){
      if(!window.indexedDB){unavailable=true;reject(new Error('IndexedDB indisponible'));return;}
      // Fail fast on blocked/slow IndexedDB so the app can use its localStorage fallback.
      var settled=false, timer=setTimeout(function(){if(settled)return;settled=true;unavailable=true;reject(new Error('IndexedDB timeout'))},1800), req;
      try{req=indexedDB.open(DB_NAME,2)}catch(e){clearTimeout(timer);unavailable=true;reject(e);return}
      req.onupgradeneeded=function(ev){var d=ev.target.result;if(!d.objectStoreNames.contains(STORE_NAME))d.createObjectStore(STORE_NAME,{keyPath:'key'});if(!d.objectStoreNames.contains('resourceFiles'))d.createObjectStore('resourceFiles',{keyPath:'key'})};
      req.onblocked=function(){console.warn('White Wolf: IndexedDB bloquée.')};
      req.onsuccess=function(ev){if(settled){try{ev.target.result.close()}catch(e){}return}settled=true;clearTimeout(timer);db=ev.target.result;unavailable=false;db.onversionchange=function(){try{db.close()}catch(e){}};resolve(db)};
      req.onerror=function(ev){if(settled)return;settled=true;clearTimeout(timer);unavailable=true;reject(ev.target.error||new Error('IndexedDB error'))};
    });
  }
  function get(key){
    if(unavailable||!db)return Promise.resolve(key==='appState'?fallbackRead():null);
    return new Promise(function(resolve,reject){var done=false;function fail(err){if(done)return;if(key==='appState'){var f=fallbackRead();if(f!==null){done=true;resolve(f);return}}done=true;reject(err||new Error('IndexedDB read error'))}try{var tx=db.transaction(STORE_NAME,'readonly'),r=tx.objectStore(STORE_NAME).get(key);r.onsuccess=function(){if(done)return;done=true;resolve(r.result?r.result.value:null)};r.onerror=function(){fail(r.error)};tx.onerror=function(){fail(tx.error)};tx.onabort=function(){fail(tx.error)}}catch(e){fail(e)}});
  }
  function set(key,value){
    if(unavailable||!db){if(key==='appState')fallbackWrite(value);return Promise.resolve()}
    return new Promise(function(resolve,reject){var done=false;function fail(err){if(done)return;if(key==='appState'&&fallbackWrite(value)){done=true;resolve();return}done=true;reject(err||new Error('IndexedDB write error'))}try{var tx=db.transaction(STORE_NAME,'readwrite'),r=tx.objectStore(STORE_NAME).put({key:key,value:value});r.onsuccess=function(){if(done)return;done=true;if(key==='appState')fallbackWrite(value);resolve()};r.onerror=function(){fail(r.error)};tx.onerror=function(){fail(tx.error)};tx.onabort=function(){fail(tx.error)}}catch(e){fail(e)}});
  }
  function batchSet(entries){
    entries=Array.isArray(entries)?entries:[];
    if(!entries.length)return Promise.resolve();
    if(unavailable||!db){
      entries.forEach(function(e){if(e&&e.key==='appState')fallbackWrite(e.value)});
      return Promise.resolve();
    }
    return new Promise(function(resolve,reject){
      try{
        var tx=db.transaction(STORE_NAME,'readwrite'),store=tx.objectStore(STORE_NAME);
        entries.forEach(function(e){if(e&&e.key)store.put({key:e.key,value:e.value})});
        tx.oncomplete=function(){entries.forEach(function(e){if(e&&e.key==='appState')fallbackWrite(e.value)});resolve()};
        tx.onerror=function(){reject(tx.error||new Error('IndexedDB batch write error'))};
        tx.onabort=function(){reject(tx.error||new Error('IndexedDB batch transaction aborted'))};
      }catch(e){reject(e)}
    });
  }
  function fileSet(key,value){if(unavailable||!db)return Promise.reject(new Error('Stockage de fichiers indisponible'));return new Promise(function(resolve,reject){try{var tx=db.transaction('resourceFiles','readwrite'),r=tx.objectStore('resourceFiles').put({key:key,value:value});r.onsuccess=function(){resolve()};r.onerror=function(){reject(r.error)}}catch(e){reject(e)}})}
  function fileGet(key){if(unavailable||!db)return Promise.reject(new Error('Stockage de fichiers indisponible'));return new Promise(function(resolve,reject){try{var tx=db.transaction('resourceFiles','readonly'),r=tx.objectStore('resourceFiles').get(key);r.onsuccess=function(){resolve(r.result?r.result.value:null)};r.onerror=function(){reject(r.error)}}catch(e){reject(e)}})}
  function fileDelete(key){if(unavailable||!db)return Promise.resolve();return new Promise(function(resolve,reject){try{var tx=db.transaction('resourceFiles','readwrite'),r=tx.objectStore('resourceFiles').delete(key);r.onsuccess=function(){resolve()};r.onerror=function(){reject(r.error)}}catch(e){reject(e)}})}
  window.WWCorePersistence={open:open,get:get,set:set,batchSet:batchSet,fileSet:fileSet,fileGet:fileGet,fileDelete:fileDelete,readFallback:fallbackRead,writeFallback:fallbackWrite,dbName:DB_NAME,schemaVersion:2,get unavailable(){return unavailable}};
})();
