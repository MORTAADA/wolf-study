/* WHITE WOLF SCHOLAR V60 — Dependency Container */
(function(){
  'use strict';
  function create(){
    // Prefer the optional service registry, but always fall back to the
    // canonical module contracts.  Older builds shipped without WWServices,
    // which silently forced the whole application into compatibility mode.
    var S=window.WWServices||{};
    var container={
      persistence:S.persistence?S.persistence():(window.WWCorePersistence||null),
      events:S.events?S.events():(window.WWEventBus||null),
      state:S.state||window.WWState||null,
      pomodoro:S.pomodoro||((window.WWState&&window.WWState.createPomodoro)?window.WWState.createPomodoro:null),
      router:S.router||window.WWRouter||null,
      renderer:S.renderer?S.renderer():(window.WWRenderer||null),
      controllers:S.controllers?S.controllers():(window.WWFeatureControllers||null)
    };
    container.ready=!!(container.persistence&&container.events&&container.state&&container.router&&container.renderer);
    container.version='93.11';
    return container;
  }
  window.WWDI={create:create,version:'65.26'};
})();
