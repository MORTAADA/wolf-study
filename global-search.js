/* =========================================================
   WHITE WOLF V47 — DASHBOARD EXAM TRACKING + GLOBAL SEARCH + RESOURCE LIBRARY
   Non-invasive index over current app state, local resources and
   resource metadata. No external dependencies.
   ========================================================= */
(function(){
  "use strict";
  var KEY="wwResourceLibraryMeta";
  var app=window.WWV46App||{};
  var state=app.state||{};
  var navigate=app.navigate||function(){};
  var langCurrentLevel=app.langCurrentLevel||function(){return "B2"};
  var overlay=null,input=null,results=null,summary=null,filter="all",query="";
  var META={};
  try{META=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){META={}}

  function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function saveMeta(){try{localStorage.setItem(KEY,JSON.stringify(META))}catch(e){}}
  function markRecent(id){if(!id)return;META[id]=META[id]||{};META[id].lastOpened=new Date().toISOString();saveMeta()}
  function isFav(id){return !!(META[id]&&META[id].favorite)}
  function toggleFav(id){META[id]=META[id]||{};META[id].favorite=!META[id].favorite;saveMeta();renderResults()}

  function add(arr,type,title,sub,action,score,extra){
    if(!title)return;arr.push(Object.assign({type:type,title:String(title),sub:String(sub||""),action:action||null,score:score||0},extra||{}));
  }
  function walk(obj,arr,path,seen,depth){
    if(depth>5||obj==null)return;
    var t=typeof obj;
    if(t!=="object")return;
    if(seen.indexOf(obj)!==-1)return;seen.push(obj);
    if(Array.isArray(obj)){
      obj.slice(0,500).forEach(function(v,i){walk(v,arr,path+" / "+i,seen,depth+1)});return;
    }
    var keys=Object.keys(obj);
    keys.slice(0,300).forEach(function(k){
      var v=obj[k], low=k.toLowerCase();
      if(v==null)return;
      if(typeof v==="string" && v.length>1 && v.length<220 && /^(name|title|subject|description|question|front|prompt|term|label|text|topic|goal)$/i.test(k)){
        var kind=/question|front|prompt|term/.test(low)?"flashcard":/topic/.test(low)?"topic":"data";
        add(arr,kind,v,path.replace(/^\s*\/\s*/,""),null,0,{key:k});
      }
      if(typeof v==="object")walk(v,arr,path+" / "+k,seen,depth+1);
    });
  }
  function buildIndex(){
    var arr=[], seen=[];
    try{(state.subjects||[]).forEach(function(s){add(arr,"subject",s.name,"Master / Matières",function(){navigate("subject",{subjectId:s.id})},0,{id:s.id})})}catch(e){}
    try{(state.topics||[]).forEach(function(t){add(arr,"topic",t.title||t.name,"Topic / Master",function(){navigate("topic",{topicId:t.id})},0,{id:t.id})})}catch(e){}
    try{Object.keys(state.languages||{}).forEach(function(k){var l=state.languages[k];if(l&&l.name)add(arr,"language",l.name,"Growth / Langues",function(){state.langId=l.id;state.levelKey=langCurrentLevel(l.id);navigate("language")},0,{id:l.id})})}catch(e){}
    try{(state.tasks||[]).forEach(function(t){add(arr,"task",t.text||t.title,"Planning",null,0,{id:t.id})})}catch(e){}
    try{(state.exams||[]).forEach(function(x){add(arr,"exam",x.title,"Planning / Examens",null,0,{id:x.id})})}catch(e){}
    try{(state.errors||[]).forEach(function(x){add(arr,"error",x.description,"Error Lab / Révision",null,0,{id:x.id})})}catch(e){}
    try{(state.flashcards||{}).forEach?null:Object.keys(state.flashcards||{}).forEach(function(lang){(state.flashcards[lang]||[]).forEach(function(c){add(arr,"flashcard",c.question,"Flashcards",null,0,{id:c.id})})})}catch(e){}
    try{walk({programming:state.programming,settings:state.settings,onboardingData:state.onboardingData},arr,"App",seen,0)}catch(e){}
    (window.WWResourceAPI?window.WWResourceAPI.getAllResources():[]).forEach(function(r){
      var rid="res:"+r.subjectId+":"+r.id;
      add(arr,"resource",r.title,(r.subjectName||"Matière")+" / "+r.folder,function(){openResource(r)},0,{id:rid,resource:r})
    });
    return arr;
  }
  function typeLabel(t){return {subject:"MATIÈRE",topic:"TOPIC",language:"LANGUE",task:"TÂCHE",exam:"EXAMEN",error:"ERREUR",flashcard:"FLASHCARD",resource:"RESSOURCE",data:"DONNÉE"}[t]||"RÉSULTAT"}
  function icon(t){return {subject:"📚",topic:"🎯",language:"🌍",task:"✓",exam:"📝",error:"⚠️",flashcard:"🧠",resource:"📎",data:"◆"}[t]||"◆"}
  function scoreItem(x,q){
    var t=(x.title+" "+x.sub).toLowerCase(), n=q.toLowerCase(); if(!n)return 0;
    if(t===n)return 100;if(x.title.toLowerCase()===n)return 95;if(x.title.toLowerCase().indexOf(n)===0)return 85;
    var words=n.split(/\s+/).filter(Boolean), hits=words.filter(function(w){return t.indexOf(w)!==-1}).length;
    return hits?(50+Math.round(hits/words.length*30)):0;
  }
  function search(q){
    var idx=buildIndex();
    if(!q.trim())return idx.filter(function(x){return x.type==="resource"&&META[x.id]&&META[x.id].lastOpened}).sort(function(a,b){return new Date(META[b.id].lastOpened)-new Date(META[a.id].lastOpened)}).slice(0,8);
    return idx.map(function(x){x._score=scoreItem(x,q);return x}).filter(function(x){return x._score>0&&(filter==="all"||x.type===filter)}).sort(function(a,b){return b._score-a._score}).slice(0,30);
  }
  function openResource(r){
    var rid="res:"+r.subjectId+":"+r.id;markRecent(rid);
    if(r.fileKey){if(window.WWResourceAPI)window.WWResourceAPI.openResourceInApp(r.subjectId,r.id);return}
    if(r.url){window.open(r.url,"_blank","noopener");return}
  }
  function libraryResources(){
    var all=window.WWResourceAPI?window.WWResourceAPI.getAllResources():[];
    return all.map(function(r){r._rid="res:"+r.subjectId+":"+r.id;return r});
  }
  function renderLibrary(){
    var all=libraryResources();
    var fav=all.filter(function(r){return isFav(r._rid)});
    var recent=all.filter(function(r){return META[r._rid]&&META[r._rid].lastOpened}).sort(function(a,b){return new Date(META[b._rid].lastOpened)-new Date(META[a._rid].lastOpened)}).slice(0,8);
    var total=all.length, studied=all.filter(function(r){return r.studied}).length;
    var rows=all.slice().sort(function(a,b){return (isFav(b._rid)-isFav(a._rid))||(new Date((META[b._rid]||{}).lastOpened||0)-new Date((META[a._rid]||{}).lastOpened||0))}).slice(0,60);
    return '<div class="ww-library-wrap">'+
      '<div class="ww-library-head"><div><span class="ww-v46-kicker">WHITE WOLF / RESOURCE LIBRARY</span><h2>Resource Library</h2><p>'+total+' ressources · '+studied+' étudiées · '+fav.length+' favorites</p></div><button class="ww-lib-search" data-global-search>⌕ Rechercher partout</button></div>'+
      '<div class="ww-library-stats"><div><b>'+total+'</b><span>Total</span></div><div><b>'+fav.length+'</b><span>Favorites</span></div><div><b>'+recent.length+'</b><span>Recent</span></div><div><b>'+studied+'</b><span>Studied</span></div></div>'+
      (recent.length?'<section class="ww-lib-section"><h3>↻ Recently opened</h3><div class="ww-lib-grid">'+recent.map(resourceCard).join('')+'</div></section>':'')+
      (fav.length?'<section class="ww-lib-section"><h3>★ Favorites</h3><div class="ww-lib-grid">'+fav.slice(0,12).map(resourceCard).join('')+'</div></section>':'')+
      '<section class="ww-lib-section"><h3>▦ All resources</h3><div class="ww-lib-grid">'+rows.map(resourceCard).join('')+'</div></section>'+'</div>';
  }
  function resourceCard(r){
    return '<article class="ww-lib-card"><button class="ww-lib-star '+(isFav(r._rid)?"active":"")+'" data-lib-fav="'+esc(r._rid)+'" title="Favorite">★</button><div class="ww-lib-icon">'+(window.WWResourceAPI?window.WWResourceAPI.getResourceIcon(r.type):"🔗")+'</div><div class="ww-lib-card-body"><strong>'+esc(r.title)+'</strong><span>'+esc(r.subjectName)+' · '+esc(r.folder)+'</span><small>'+(window.WWResourceAPI?window.WWResourceAPI.getResourceTypeLabel(r.type):r.type)+(r.studied?' · ✓ Studied':'')+(META[r._rid]&&META[r._rid].lastOpened?' · Recently opened':'')+'</small></div><button class="ww-lib-open" data-lib-open="'+esc(r.subjectId+'|'+r.id)+'">Open</button></article>';
  }
  function ensureOverlay(){
    if(overlay)return;
    overlay=document.createElement("div");overlay.className="ww-global-search";overlay.id="ww-global-search";overlay.innerHTML='<div class="ww-gs-backdrop" data-gs-close></div><section class="ww-gs-panel" role="dialog" aria-modal="true" aria-label="Global Search"><header class="ww-gs-header"><div class="ww-gs-brand"><span class="ww-v46-kicker">WHITE WOLF / GLOBAL INDEX</span><strong>Search everything</strong></div><button class="ww-gs-close" data-gs-close>×</button></header><div class="ww-gs-input-wrap"><span>⌕</span><input id="ww-gs-input" autocomplete="off" placeholder="Matières, topics, flashcards, ressources, tâches…"><kbd>ESC</kbd></div><div class="ww-gs-filters"><button data-gs-filter="all" class="active">All</button><button data-gs-filter="resource">Resources</button><button data-gs-filter="subject">Subjects</button><button data-gs-filter="topic">Topics</button><button data-gs-filter="flashcard">Flashcards</button><button data-gs-filter="task">Tasks</button></div><div id="ww-gs-summary" class="ww-gs-summary"></div><div id="ww-gs-results" class="ww-gs-results"></div></section>';
    document.body.appendChild(overlay);input=overlay.querySelector("#ww-gs-input");results=overlay.querySelector("#ww-gs-results");summary=overlay.querySelector("#ww-gs-summary");
    input.addEventListener("input",function(){query=this.value;renderResults()});
    overlay.querySelectorAll("[data-gs-filter]").forEach(function(b){b.onclick=function(){filter=this.dataset.gsFilter;overlay.querySelectorAll("[data-gs-filter]").forEach(function(x){x.classList.toggle("active",x===b)});renderResults()}});
    overlay.addEventListener("click",function(e){
      var close=e.target.closest&&e.target.closest("[data-gs-close]");if(close){closeSearch();return}
      var r=e.target.closest&&e.target.closest("[data-gs-open]");if(r){var idx=Number(r.dataset.gsOpen),list=search(query);if(list[idx]){var x=list[idx];if(x.type==="resource")openResource(x.resource);else if(x.action)x.action();closeSearch()}}
      var lf=e.target.closest&&e.target.closest("[data-gs-fav]");if(lf){e.stopPropagation();toggleFav(lf.dataset.gsFav)}
    });
  }
  function renderResults(){
    if(!results)return;
    var list=search(query);
    summary.textContent=query.trim()?(list.length+" résultat"+(list.length===1?"":"s")):"Dernières ressources ouvertes";
    if(!list.length){results.innerHTML='<div class="ww-gs-empty"><span>⌕</span><strong>Aucun résultat</strong><small>Essaie un nom de matière, un topic, une ressource ou une tâche.</small></div>';return}
    results.innerHTML=list.map(function(x,i){var fav=x.type==="resource"?isFav(x.id):false;return '<button class="ww-gs-result" data-gs-open="'+i+'"><span class="ww-gs-icon">'+icon(x.type)+'</span><span class="ww-gs-copy"><strong>'+esc(x.title)+'</strong><small>'+esc(x.sub)+'</small></span><span class="ww-gs-type">'+typeLabel(x.type)+'</span>'+(x.type==="resource"?'<span class="ww-gs-fav '+(fav?'active':'')+'" data-gs-fav="'+esc(x.id)+'">★</span>':'')+'<span class="ww-gs-arrow">›</span></button>'}).join('');
  }
  function openSearch(){ensureOverlay();overlay.classList.add("is-open");document.body.classList.add("ww-search-lock");setTimeout(function(){input.focus();input.select()},30);renderResults()}
  function closeSearch(){if(!overlay)return;overlay.classList.remove("is-open");document.body.classList.remove("ww-search-lock")}
  function attach(){
    document.addEventListener("click",function(e){
      var b=e.target.closest&&e.target.closest("[data-global-search],.global-search-btn,.open-global-search");if(b){e.preventDefault();openSearch();return}
      var lf=e.target.closest&&e.target.closest("[data-lib-fav]");if(lf){e.stopPropagation();toggleFav(lf.dataset.libFav);return}
      var lo=e.target.closest&&e.target.closest("[data-lib-open]");if(lo){e.stopPropagation();var p=lo.dataset.libOpen.split("|");var r=(window.WWResourceAPI&&window.WWResourceAPI.getAllResources?window.WWResourceAPI.getAllResources():[]).find(function(x){return x.subjectId===p[0]&&x.id===p[1]});if(r)openResource(r);return}
      var ro=e.target.closest&&e.target.closest("[data-open-resource]");if(ro){var pp=ro.dataset.openResource.split("|");markRecent("res:"+pp[0]+":"+pp[1]);}
    },true);
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&overlay&&overlay.classList.contains("is-open"))closeSearch();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}});
  }
  window.WWGlobalSearch={open:openSearch,close:closeSearch,search:function(q){query=q||"";openSearch()}};
  // The existing Resources renderer calls this hook, preserving its original UI.
  window.WWV46LibraryHTML=renderLibrary;
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attach);else attach();
})();
