/* WHITE WOLF V63.2 — Runtime QA / Health Monitor */
(function(global){
  'use strict';
  var started=Date.now(), errors=0;
  function init(){
    global.addEventListener('error',function(e){errors++;if(global.WWEventBus)WWEventBus.emit('qa:runtime-error',{message:e.message||'Runtime error'});});
    global.addEventListener('unhandledrejection',function(e){errors++;if(global.WWEventBus)WWEventBus.emit('qa:unhandled-rejection',{message:String(e.reason||'Promise rejection')});});
  }
  function snapshot(){return {version:'63.2',uptimeMs:Date.now()-started,runtimeErrors:errors,modules:{persistence:!!global.WWCorePersistence,state:!!global.WWState,router:!!global.WWRouter,renderer:!!global.WWRenderer,events:!!global.WWEventBus,controllers:!!global.WWFeatureControllers,di:!!global.WWDI,chatbot:!!global.WWChatbot}}}
  global.WWQA={init:init,snapshot:snapshot};
})(window);
