/* WHITE WOLF SCHOLAR V65.34 — Academic OS Architecture Contract */
(function(global){
  'use strict';
  var required=['WWCorePersistence','WWState','WWRouter','WWRenderer','WWEventBus','WWServices','WWDI','WWAcademicEntities','WWAcademicRepositories','WWAcademicServices','WWApplication','WWAcademicRuntime'];
  var events=['PLANNING_UPDATED','SESSION_COMPLETED','ERROR_CREATED','ERROR_REVIEWED','FLASHCARD_REVIEWED','RESOURCE_STUDIED','TASK_COMPLETED','EXAM_UPDATED','MASTERY_CHANGED','QUIZ_COMPLETED'];
  function inspect(){
    var missing=required.filter(function(x){return !global[x]});
    var R=global.WWAcademicRepositories;
    return {version:'65.34',healthy:missing.length===0,missingModules:missing,layers:{core:!!global.WWCorePersistence,domain:!!global.WWAcademicEntities,persistence:!!R,events:!!global.WWEventBus,services:!!global.WWAcademicServices,features:!!global.WWApplication,ui:!!global.WWRenderer},eventContracts:events,repositoryCount:R?['subjects','topics','sessions','tasks','resources','exams','errors','flashcards','mastery','planning'].filter(function(k){return !!R[k]}).length:0};
  }
  global.WWArchitectureV3={version:'65.34',inspect:inspect,assert:function(){var r=inspect();if(!r.healthy)console.warn('WW Architecture Gate:',r.missingModules);return r},eventContracts:events};
})(window);
