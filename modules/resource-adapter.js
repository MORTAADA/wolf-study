/* V43 resource reader hook: intercept clicks on resource cards/buttons that
   carry a persistent resource id/handle. */
(function(){
  function findResourceHandle(el){
    var id = el && (el.dataset ? (el.dataset.resourceId || el.dataset.id) : null);
    if(!id) return null;
    try{
      if(typeof window.getResourceFileHandle==="function") return window.getResourceFileHandle(id);
    }catch(e){}
    return null;
  }

  document.addEventListener("click", function(e){
    var el=e.target.closest ? e.target.closest("[data-resource-open],[data-open-resource]") : null;
    if(!el) return;
    var id=el.dataset.resourceOpen || el.dataset.openResource || el.dataset.resourceId;
    if(!id) return;
    if(typeof window.wwGetStoredResourceHandle==="function"){
      e.preventDefault(); e.stopPropagation();
      window.wwGetStoredResourceHandle(id).then(function(result){
        if(result && result.handle) window.wwOpenStoredResource(result.handle,result.name);
      });
    }
  }, true);
})();

(function(){
  window.wwGetStoredResourceHandle=async function(id){
    try{
      var dbName=null;
      // Detect likely existing DB from IndexedDB databases where supported.
      if(indexedDB.databases){
        var dbs=await indexedDB.databases();
        var match=dbs.find(function(x){return x.name && /white|wolf|scholar/i.test(x.name);});
        if(match) dbName=match.name;
      }
      // Fall back to the most common V42 naming convention if detection is unavailable.
      if(!dbName) dbName=(window.WWPersistence&&window.WWPersistence.dbName)||"WhiteWolfDB";

      return await new Promise(function(resolve,reject){
        var req=indexedDB.open(dbName);
        req.onerror=function(){reject(req.error||new Error("IndexedDB unavailable"));};
        req.onsuccess=function(){
          var db=req.result;
          if(!db.objectStoreNames.contains("resourceFiles")){
            db.close(); reject(new Error("resourceFiles store not found")); return;
          }
          var tx=db.transaction("resourceFiles","readonly");
          var store=tx.objectStore("resourceFiles");
          var keyCandidates=[id,Number(id)];
          var i=0;
          function next(){
            if(i>=keyCandidates.length){db.close();resolve(null);return;}
            var r=store.get(keyCandidates[i++]);
            r.onerror=next;
            r.onsuccess=function(){
              if(r.result){
                var v=r.result;
                var handle=v.handle || v.fileHandle || v.file || v.value || null;
                var name=v.name || v.fileName || "Resource";
                if(handle && typeof handle.getFile==="function"){
                  db.close(); resolve({handle:handle,name:name}); return;
                }
              }
              next();
            };
          }
          next();
        };
      });
    }catch(e){
      console.warn("V43 resource adapter:",e);
      return null;
    }
  };
})();
