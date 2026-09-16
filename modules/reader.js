/* =========================================================
   WHITE WOLF V43 — INTERNAL FILE READER
   Persistent files remain in phone storage. The app stores
   only FileSystemFileHandle references in IndexedDB.
   ========================================================= */
(function(){
  "use strict";

  var R = {root:null,content:null,title:null,type:null,status:null,external:null,currentUrl:null,currentFile:null,meta:null};

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

  function openShell(file,meta){
    if(!R.root) initReader();
    revoke();
    R.currentFile=file; R.meta=meta||null;
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

  function ingestDocument(result){
    if(!R.meta || !result || !result.text || !global.WWDocumentIntel) return;
    try{
      global.WWDocumentIntel.ingest(R.meta,result.text);
      if(global.state){
        global.state.chatbotPdfContext={name:R.meta.name||R.currentFile.name||'Document',text:result.text,extractedAt:new Date().toISOString(),method:result.method||'local',resourceId:R.meta.resourceId||null,topicId:R.meta.topicId||null};
        if(global.saveState)global.saveState();
      }
    }catch(e){console.warn('Document intelligence ingest:',e)}
  }
  function addTutorButton(container){
    if(!R.meta || !R.meta.resourceId || !container) return;
    var b=document.createElement('button'); b.type='button'; b.className='ww-reader-pdf-action'; b.textContent='🐺 Tutoriser ce document';
    b.addEventListener('click',function(){
      if(global.WWChatbot && global.WWChatbot.openDocument) global.WWChatbot.openDocument(R.meta.resourceId);
      else { var fab=document.getElementById('chatbot-fab'); if(fab)fab.click(); }
    });
    container.appendChild(b);
  }

  function renderFile(file,meta){
    openShell(file,meta);
    var type=file.type||"";
    var name=(file.name||"").toLowerCase();
    var ext=name.includes(".")?name.split(".").pop():"";

    if(type==="application/pdf" || ext==="pdf"){
      var tools=document.createElement("div");
      tools.className="ww-pdf-tools";
      var extractBtn=document.createElement("button");
      extractBtn.type="button"; extractBtn.className="ww-reader-pdf-action"; extractBtn.textContent="🧠 Extraire le texte";
      var info=document.createElement("span"); info.className="ww-pdf-tool-info"; info.textContent="Analyse locale — aucune donnée envoyée";
      tools.appendChild(extractBtn); tools.appendChild(info);
      var frame=document.createElement("iframe");
      frame.className="ww-reader-pdf";
      frame.src=R.currentUrl;
      frame.title=file.name||"PDF";
      frame.setAttribute("loading","eager");
      frame.setAttribute("allow","fullscreen");
      frame.addEventListener("error",function(){showUnsupported();});
      R.content.appendChild(tools); R.content.appendChild(frame);
      var ocrBtn=document.createElement("button");
      ocrBtn.type="button"; ocrBtn.className="ww-reader-pdf-action"; ocrBtn.textContent="🔎 OCR du PDF scanné";
      tools.appendChild(ocrBtn);
      ocrBtn.addEventListener("click",async function(){
        if(!window.WWOCR){info.textContent="Module OCR indisponible";return;}
        ocrBtn.disabled=true; ocrBtn.textContent="⏳ OCR…";
        try{
          var result=await window.WWOCR.run(file,function(m){if(m&&m.status==='page')info.textContent="OCR page "+m.current+"/"+m.total;});
          ingestDocument(result); var pre=document.createElement("pre"); pre.className="ww-reader-text ww-pdf-extracted"; pre.textContent=result.text||"Aucun texte reconnu.";
          var copy=document.createElement("button"); copy.type="button"; copy.className="ww-reader-pdf-action"; copy.textContent="📋 Copier le texte";
          copy.addEventListener("click",async function(){try{await navigator.clipboard.writeText(result.text||"");copy.textContent="✓ Copié"}catch(e){copy.textContent="Copie non disponible"}});
          var wrap=document.createElement("div");wrap.className="ww-pdf-extract-wrap";wrap.appendChild(copy);wrap.appendChild(pre);addTutorButton(wrap);R.content.innerHTML="";R.content.appendChild(wrap);
          R.status.textContent="OCR local • "+(result.pages||0)+" page(s) • "+(result.text?result.text.length:0)+" caractères";
          if(window.state){window.state.chatbotPdfContext={name:file.name||"PDF",text:result.text||"",extractedAt:new Date().toISOString(),method:result.method};if(window.saveState)window.saveState();}
        }catch(err){info.textContent=err&&err.message?err.message:"OCR impossible";}finally{ocrBtn.disabled=false;ocrBtn.textContent="🔎 Réessayer OCR"}
      });
      extractBtn.addEventListener("click",async function(){
        if(!window.WWPDFReader){info.textContent="Extracteur indisponible";return;}
        extractBtn.disabled=true; extractBtn.textContent="⏳ Extraction…";
        try{
          var result=await window.WWPDFReader.extract(file);
          ingestDocument(result); var pre=document.createElement("pre"); pre.className="ww-reader-text ww-pdf-extracted"; pre.textContent=result.text||"Aucun texte exploitable trouvé. Ce PDF peut être scanné/image ou utiliser un encodage non pris en charge.";
          var copy=document.createElement("button"); copy.type="button"; copy.className="ww-reader-pdf-action"; copy.textContent="📋 Copier le texte";
          copy.addEventListener("click",async function(){try{await navigator.clipboard.writeText(result.text||"");copy.textContent="✓ Copié"}catch(e){copy.textContent="Copie non disponible"}});
          var wrap=document.createElement("div");wrap.className="ww-pdf-extract-wrap";wrap.appendChild(copy);wrap.appendChild(pre);addTutorButton(wrap);R.content.innerHTML="";R.content.appendChild(wrap);
          R.status.textContent="Texte extrait localement • "+(result.text?result.text.length:0)+" caractères";
          if(window.state){window.state.chatbotPdfContext={name:file.name||"PDF",text:result.text||"",extractedAt:result.extractedAt};if(window.saveState)window.saveState();}
        }catch(err){info.textContent=err&&err.message?err.message:"Extraction impossible";extractBtn.disabled=false;extractBtn.textContent="🧠 Réessayer"}
      });
      return;
    }

    if(type.startsWith("image/") || ["png","jpg","jpeg","gif","webp","svg","bmp"].includes(ext)){
      var imgTools=document.createElement("div");imgTools.className="ww-pdf-tools";
      var imgOcr=document.createElement("button");imgOcr.type="button";imgOcr.className="ww-reader-pdf-action";imgOcr.textContent="🔎 Extraire le texte (OCR)";
      var imgInfo=document.createElement("span");imgInfo.className="ww-pdf-tool-info";imgInfo.textContent="OCR optionnel — traitement local après chargement du moteur";imgTools.appendChild(imgOcr);imgTools.appendChild(imgInfo);R.content.appendChild(imgTools);
      var img=document.createElement("img");img.src=R.currentUrl;img.alt=file.name;R.content.appendChild(img);
      imgOcr.addEventListener("click",async function(){imgOcr.disabled=true;imgOcr.textContent="⏳ OCR…";try{var rr=await window.WWOCR.run(file,function(m){if(m&&m.progress)imgInfo.textContent=Math.round(m.progress*100)+" %"});ingestDocument(rr); var pre=document.createElement("pre");pre.className="ww-reader-text ww-pdf-extracted";pre.textContent=rr.text||"Aucun texte reconnu.";R.content.appendChild(pre);if(window.state){window.state.chatbotPdfContext={name:file.name||"Image",text:rr.text||"",extractedAt:new Date().toISOString(),method:rr.method};if(window.saveState)window.saveState();}imgInfo.textContent="OCR terminé"}catch(e){imgInfo.textContent=e&&e.message?e.message:"OCR impossible"}finally{imgOcr.disabled=false;imgOcr.textContent="🔎 Réessayer OCR"}});
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
  window.wwOpenFileInReader=function(file,title,meta){
    if(file) renderFile(file,meta||{name:title||file.name||"Document"});
  };

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",initReader);
  }else{
    initReader();
  }
})();
