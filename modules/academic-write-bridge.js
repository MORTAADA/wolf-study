/* V67 Academic Write Bridge — compatibility adapter for legacy UI handlers. */
(function(global){
  'use strict';
  var V=global.WWAcademicOSV5;
  function syncState(kind, item, eventType){
    if(!V||!item)return Promise.resolve(item);
    return V.commit(kind,item,eventType).catch(function(e){
      if(global.WWAcademicOSV4&&global.WWAcademicOSV4.diagnose)global.WWAcademicOSV4.diagnose('BRIDGE_WRITE_FAILED',e,{kind:kind,id:item.id});
      throw e;
    });
  }
  global.WWAcademicWriteBridge={version:'68.0',commit:syncState,
    error:function(x){return syncState('errors',x,'ERROR_CREATED')},
    session:function(x){return syncState('sessions',x,'SESSION_COMPLETED')},
    resource:function(x){return syncState('resources',x,'RESOURCE_STUDIED')},
    task:function(x){return syncState('tasks',x,'TASK_COMPLETED')},
    flashcard:function(x){return syncState('flashcards',x,'FLASHCARD_REVIEWED')},
    mastery:function(x){return syncState('mastery',x,'MASTERY_CHANGED')}
  };
})(window);
