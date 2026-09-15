/* WHITE WOLF V58 — Renderer Contract */
(function(){
  'use strict';
  function mount(root,html){
    if(!root) return false;
    var started=performance&&performance.now?performance.now():Date.now();
    root.innerHTML=html;
    var ended=performance&&performance.now?performance.now():Date.now();
    return {ok:true,duration:Math.max(0,ended-started)};
  }
  function clear(root){if(root)root.innerHTML=''}
  window.WWRenderer={mount:mount,clear:clear,version:'62.0'};
})();
