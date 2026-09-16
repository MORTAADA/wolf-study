/* WHITE WOLF V57 — Router Contract */
(function(){
  'use strict';
  function createRouter(state, render){
    return function navigate(route, params){
      state.route=route;
      if(params){
        if(params.subjectId)state.subjectId=params.subjectId;
        if(params.topicId)state.topicId=params.topicId;
        if(params.langId)state.langId=params.langId;
        if(params.levelKey)state.levelKey=params.levelKey;
        if(params.lessonNum)state.lessonNum=params.lessonNum;
        if(params.fcLang)state.fcLang=params.fcLang;
      }
      state.isEditingPlanning=false;
      state.isSettingsOpen=false;
      // Close transient overlays/modals when navigation is requested from inside them.
      // This prevents modal content from remaining on top of the destination route.
      state.modal=null;
      if(window.WWEventBus)window.WWEventBus.emit('route:change',{route:route,params:params||null});
      return render();
    };
  }
  window.WWRouter={create:createRouter,version:'63.0'};
})();
