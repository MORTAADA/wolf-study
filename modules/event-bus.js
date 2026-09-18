/* WHITE WOLF V65.26 — Event Bus Contract */
(function(){
  'use strict';
  var listeners=Object.create(null);
  function on(type,handler){
    if(typeof handler!=='function') return function(){};
    (listeners[type]||(listeners[type]=[])).push(handler);
    return function(){off(type,handler)};
  }
  function off(type,handler){
    var a=listeners[type]; if(!a)return;
    listeners[type]=a.filter(function(fn){return fn!==handler});
  }
  function emit(type,payload){
    var a=(listeners[type]||[]).slice();
    a.forEach(function(fn){try{fn(payload)}catch(e){console.warn('WWEventBus listener error',type,e)}});
  }
  window.WWEventBus={on:on,off:off,emit:emit,version:'65.26'};
})();
