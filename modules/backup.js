/* =========================================================
   WHITE WOLF V45 — BACKUP / RESTORE
   Exports localStorage + Smart Review + selected IndexedDB
   metadata. Phone file bytes and file handles are deliberately
   excluded: the original resources remain in phone storage.
   ========================================================= */
(function(){
"use strict";
var B={modal:null,status:null,input:null};

function setStatus(msg,ok){
  if(B.status){B.status.textContent=msg||"";B.status.style.color=ok?"#6ae8a5":"";}
}
function openBackup(){
  if(!B.modal)return;
  B.modal.classList.add("is-open");B.modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  setStatus("");
}
function closeBackup(){
  if(!B.modal)return;
  B.modal.classList.remove("is-open");B.modal.setAttribute("aria-hidden","true");document.body.style.overflow="";
}
function collectLocalStorage(){
  var data={};
  for(var i=0;i<localStorage.length;i++){
    var k=localStorage.key(i),v=localStorage.getItem(k);
    try{data[k]=JSON.parse(v)}catch(e){data[k]=v}
  }
  return data;
}
function collectResourceMetadata(){
  return new Promise(function(resolve){
    var req=indexedDB.open((window.WWPersistence&&window.WWPersistence.dbName)||"WhiteWolfDB",2);
    req.onerror=function(){resolve([])};
    req.onsuccess=function(){
      var db=req.result;
      if(!db.objectStoreNames.contains("resourceFiles")){resolve([]);return}
      try{
        var tx=db.transaction("resourceFiles","readonly"),store=tx.objectStore("resourceFiles"),items=[];
        var cur=store.openCursor();
        cur.onerror=function(){resolve(items)};
        cur.onsuccess=function(e){
          var c=e.target.result;
          if(!c){resolve(items);return}
          var v=c.value||{};
          // Never serialize FileSystemFileHandle or Blob/file bytes.
          var safe={};
          Object.keys(v).forEach(function(k){
            if(/handle|blob|filedata|filebytes|file$/i.test(k))return;
            var x=v[k];
            if(["string","number","boolean"].includes(typeof x)||x===null) safe[k]=x;
          });
          items.push(safe);c.continue();
        };
      }catch(e){resolve([])}
    };
  });
}
function downloadJSON(obj,name){
  var blob=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"});
  var url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url)},1000);
}
async function exportBackup(){
  try{
    setStatus("Preparing backup…");
    if(window.WWPersistence&&window.WWPersistence.save) await window.WWPersistence.save();
    var metadata=[];
    try{metadata=await collectResourceMetadata()}catch(e){metadata=[]}
    var payload={
      format:"white-wolf-scholar-backup",
      version:61.5,
      schemaVersion:2,
      exportedAt:new Date().toISOString(),
      note:"Personal data backup. Local phone resource files and FileSystemFileHandles are intentionally excluded.",
      localStorage:collectLocalStorage(),
      resourceMetadata:metadata
    };
    var stamp=new Date().toISOString().replace(/[:.]/g,"-").slice(0,19);
    downloadJSON(payload,"white-wolf-backup-"+stamp+".json");
    setStatus("Backup exported successfully.",true);
  }catch(e){setStatus("Backup failed.")}
}
function restoreLocalStorage(data){
  if(!data||typeof data!=="object")return 0;
  var count=0;
  Object.keys(data).forEach(function(k){
    try{
      var v=data[k];
      localStorage.setItem(k,typeof v==="string"?v:JSON.stringify(v));count++;
    }catch(e){}
  });
  return count;
}
function validateBackup(x){
  if(!x||x.format!=="white-wolf-scholar-backup"||!x.localStorage||typeof x.localStorage!=="object")return false;
  if(x.version!==undefined && (typeof x.version!=="number" || x.version<45 || x.version>61.5))return false;
  if(x.schemaVersion!==undefined && (x.schemaVersion!==1 && x.schemaVersion!==2))return false;
  return true;
}
function restoreBackup(file){
  var reader=new FileReader();
  reader.onload=function(){
    try{
      var data=JSON.parse(reader.result);
      if(!validateBackup(data)){setStatus("Invalid White Wolf backup file.");return}
      var n=restoreLocalStorage(data.localStorage);
      setStatus("Restored "+n+" data entries. Reloading…",true);
      setTimeout(function(){location.reload()},700);
    }catch(e){setStatus("Could not read this backup.")}
  };
  reader.onerror=function(){setStatus("Could not read this backup.")}
  reader.readAsText(file);
}
function init(){
  B.modal=document.getElementById("ww-backup-modal");
  B.status=document.getElementById("ww-backup-status");
  B.input=document.getElementById("ww-backup-file");
  if(!B.modal)return;
  document.getElementById("ww-backup-close").onclick=closeBackup;
  B.modal.querySelectorAll("[data-backup-close]").forEach(function(x){x.onclick=closeBackup});
  document.getElementById("ww-backup-export").onclick=exportBackup;
  document.getElementById("ww-backup-import").onclick=function(){B.input.click()};
  B.input.onchange=function(){if(B.input.files&&B.input.files[0])restoreBackup(B.input.files[0]);B.input.value=""};
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&B.modal.classList.contains("is-open"))closeBackup()});
  window.WWBackup={open:openBackup,close:closeBackup,export:exportBackup};
  // Accept future/settings buttons without depending on one exact DOM structure.
  document.addEventListener("click",function(e){
    var el=e.target.closest&&e.target.closest("[data-backup],.backup-btn,.open-backup");
    if(el){e.preventDefault();openBackup();}
  });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
