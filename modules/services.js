/* WHITE WOLF SCHOLAR V60 — Service Layer
 * Stable application services. Features depend on contracts, not implementation details.
 */
(function(){
  'use strict';
  var P=window.WWCorePersistence;
  var Bus=window.WWEventBus;
  var State=window.WWState;
  var Router=window.WWRouter;
  var Renderer=window.WWRenderer;
  var Controllers=window.WWFeatureControllers;

  function persistence(){
    return {open:P.open,get:P.get,set:P.set,fileSet:P.fileSet,fileGet:P.fileGet,fileDelete:P.fileDelete,
      readFallback:P.readFallback,writeFallback:P.writeFallback,dbName:P.dbName,schemaVersion:P.schemaVersion};
  }
  function events(){return {on:Bus&&Bus.on?Bus.on.bind(Bus):function(){},off:Bus&&Bus.off?Bus.off.bind(Bus):function(){},emit:Bus&&Bus.emit?Bus.emit.bind(Bus):function(){}};}
  function state(seed){return State.create(seed);}
  function pomodoro(){return State.createPomodoro();}
  function router(appState,render){return Router.create(appState,render);}
  function renderer(){return {mount:Renderer.mount,clear:Renderer.clear};}
  function controllers(){return Controllers||{};}

  window.WWServices={
    persistence:persistence,
    events:events,
    state:state,
    pomodoro:pomodoro,
    router:router,
    renderer:renderer,
    controllers:controllers,
    version:'62.3'
  };
})();
