/* =========================================================
   WHITE WOLF V43 — INTERNAL FILE READER
   Persistent files remain in phone storage. The app stores
   only FileSystemFileHandle references in IndexedDB.
   ========================================================= */
(function(){
  "use strict";

  var R = {root:null,content:null,title:null,type:null,status:null,external:null,currentUrl:null,currentFile:null};

  function initReader(){
    R.root=document.getElementById("ww-file-reader");
    R.content=document.getElementById("ww-reader-content");
    R.title=document.getElementById("ww-reader-title");
    R.type=document.getElementById("ww-reader-type");
    R.status=document.getElementById("ww-reader-status");
    R.external=document.getElementById("ww-reader-external");
    if(!R.root) return;

    var close=document.getElementById("ww-reader-close");
    if(close) close.addEventListener("click", closeReader);
    R.root.querySelectorAll("[data-reader-close]").forEach(function(el){
      el.addEventListener("click", closeReader);
    });
    if(R.external) R.external.addEventListener("click", function(){
      if(R.currentUrl) window.open(R.currentUrl,"_blank","noopener,noreferrer");
    });
    document.addEventListener("keydown", function(e){
      if(e.key==="Escape" && R.root.classList.contains("is-open")) closeReader();
    });
  }

  function revoke(){
    if(R.currentUrl){
      try{URL.revokeObjectURL(R.currentUrl);}catch(e){}
      R.currentUrl=null;
    }
  }

  function closeReader(){
    revoke();
    R.currentFile=null;
    if(R.content) R.content.innerHTML="";
    if(R.root){
      R.root.classList.remove("is-open");
      R.root.setAttribute("aria-hidden","true");
    }
    document.body.classList.remove("ww-reader-lock");
  }

  function openShell(file){
    if(!R.root) initReader();
    revoke();
    R.currentFile=file;
    R.title.textContent=file.name||"Resource";
    R.type.textContent=(file.type||"FILE").toUpperCase();
    R.status.textContent=(file.type||"File")+" • "+formatSize(file.size);
    R.root.classList.add("is-open");
    R.root.setAttribute("aria-hidden","false");
    document.body.classList.add("ww-reader-lock");
    R.content.innerHTML="";
    R.currentUrl=URL.createObjectURL(file);
  }

  function formatSize(n){
    if(!Number.isFinite(n)) return "";
    if(n<1024) return n+" B";
    if(n<1048576) return (n/1024).toFixed(1)+" KB";
    if(n<1073741824) return (n/1048576).toFixed(1)+" MB";
    return (n/1073741824).toFixed(1)+" GB";
  }

  function renderFile(file){
    openShell(file);
    var type=file.type||"";
    var name=(file.name||"").toLowerCase();
    var ext=name.includes(".")?name.split(".").pop():"";

    if(type==="application/pdf" || ext==="pdf"){
      var frame=document.createElement("iframe");
      frame.src=R.currentUrl;
      frame.title=file.name;
      R.content.appendChild(frame);
      return;
    }

    if(type.startsWith("image/") || ["png","jpg","jpeg","gif","webp","svg","bmp"].includes(ext)){
      var img=document.createElement("img");
      img.src=R.currentUrl; img.alt=file.name;
      R.content.appendChild(img);
      return;
    }

    if(type.startsWith("video/") || ["mp4","webm","ogg","mov"].includes(ext)){
      var video=document.createElement("video");
      video.className="ww-reader-video";
      video.controls=true; video.playsInline=true; video.src=R.currentUrl;
      R.content.appendChild(video);
      return;
    }

    if(type.startsWith("audio/") || ["mp3","wav","m4a","aac","ogg","flac"].includes(ext)){
      var audio=document.createElement("audio");
      audio.className="ww-reader-audio";
      audio.controls=true; audio.src=R.currentUrl;
      R.content.appendChild(audio);
      return;
    }

    if(type.startsWith("text/") || ["txt","csv","md","json","xml","js","css","html"].includes(ext)){
      file.text().then(function(text){
        if(!R.root.classList.contains("is-open")) return;
        var pre=document.createElement("pre");
        pre.className="ww-reader-text";
        pre.textContent=text;
        R.content.innerHTML="";
        R.content.appendChild(pre);
      }).catch(showUnsupported);
      return;
    }

    showUnsupported();
  }

  function showUnsupported(){
    R.content.innerHTML='<div class="ww-reader-empty"><strong>This file type cannot be rendered directly.</strong><span>You can still use the ↗ button to open it with a compatible application.</span></div>';
  }

  // Public function: open a resource whose FileSystemFileHandle was stored.
  window.wwOpenStoredResource=async function(handle, name){
    try{
      if(!handle || typeof handle.getFile!=="function"){
        throw new Error("No persistent file handle available.");
      }

      // Use the existing permission when available. Ask only if permission
      // is missing/expired; normal opens do not show a picker.
      if(typeof handle.queryPermission==="function"){
        var p=await handle.queryPermission({mode:"read"});
        if(p!=="granted" && typeof handle.requestPermission==="function"){
          p=await handle.requestPermission({mode:"read"});
        }
        if(p!=="granted") throw new Error("File permission is not granted.");
      }

      var file=await handle.getFile();
      renderFile(file);
      return true;
    }catch(err){
      console.warn("White Wolf reader:",err);
      if(R.root){
        if(!R.root.classList.contains("is-open")) openShell(new File([""],name||"Resource",{type:"application/octet-stream"}));
        R.content.innerHTML='<div class="ww-reader-empty"><strong>تعذر الوصول إلى الملف.</strong><span>قد يكون الملف نُقل أو حُذف، أو أن إذن الوصول انتهى. يمكنك إعادة ربط الملف من Resources مرة واحدة.</span></div>';
        R.status.textContent="Access unavailable";
      }
      return false;
    }
  };

  // Public helper for direct File objects, useful for the fallback picker.
  window.wwOpenFileInReader=function(file){
    if(file) renderFile(file);
  };

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initReader);
  }else{
    initReader();
  }
})();
