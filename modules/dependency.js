/* WHITE WOLF SCHOLAR V60 — Dependency Container */
(function(){
  'use strict';
  function create(){
    var S=window.WWServices||{};
    var container={
      persistence:S.persistence?S.persistence():null,
      events:S.events?S.events():null,
      state:S.state,
      pomodoro:S.pomodoro,
      router:S.router,
      renderer:S.renderer?S.renderer():null,
      controllers:S.controllers?S.controllers():{}
    };
    container.ready=!!(container.persistence&&container.events&&container.state&&container.router&&container.renderer);
    container.version='61.5';
    return container;
  }
  window.WWDI={create:create,version:'61.5'};
})();
