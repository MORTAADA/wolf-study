/* WHITE WOLF SCHOLAR V65.34 — Architecture Hardening & Final Gate
 * Static/runtime architecture guardrails. Does not mutate academic data.
 */
(function(global){
  'use strict';
  var REQUIRED={
    core:['WWCorePersistence','WWState','WWRouter','WWRenderer','WWEventBus','WWDI'],
    domain:['WWAcademicEntities'],
    persistence:['WWAcademicRepositories'],
    services:['WWAcademicServices'],
    application:['WWApplication'],
    runtime:['WWAcademicRuntime']
  };
  var EVENTS=['PLANNING_UPDATED','SESSION_COMPLETED','ERROR_CREATED','ERROR_REVIEWED','FLASHCARD_REVIEWED','RESOURCE_STUDIED','TASK_COMPLETED','EXAM_UPDATED','MASTERY_CHANGED','QUIZ_COMPLETED'];
  var LEGACY=['WWDomain','WWRepositories','architecture-v2','architecture-integration'];
  function inspect(){
    var missing=[];
    Object.keys(REQUIRED).forEach(function(layer){REQUIRED[layer].forEach(function(name){if(!global[name])missing.push(name)})});
    var repo=global.WWAcademicRepositories||{};
    var repos=['subjects','topics','sessions','tasks','resources','exams','errors','flashcards','mastery','planning'];
    var missingRepos=repos.filter(function(k){return !repo[k]});
    var contracts=global.WWArchitectureV3&&global.WWArchitectureV3.eventContracts||[];
    var missingEvents=EVENTS.filter(function(e){return contracts.indexOf(e)<0});
    return {
      version:'65.34', healthy:missing.length===0&&missingRepos.length===0&&missingEvents.length===0,
      missingModules:missing, missingRepositories:missingRepos, missingEventContracts:missingEvents,
      legacyGlobalsPresent:LEGACY.filter(function(k){return !!global[k]}),
      layers:{core:true,domain:!!global.WWAcademicEntities,persistence:!!global.WWAcademicRepositories,events:!!global.WWEventBus,services:!!global.WWAcademicServices,features:!!global.WWApplication,ui:!!global.WWRenderer},
      repositories:repos,
      eventContracts:EVENTS
    };
  }
  function assert(){var r=inspect();global.__WW_ARCHITECTURE_HEALTH=r;if(!r.healthy)console.warn('WW Architecture Gate V65.34',r);return r;}
  global.WWArchitectureHardening={version:'65.34',inspect:inspect,assert:assert,required:REQUIRED,eventContracts:EVENTS};
  global.addEventListener('load',function(){setTimeout(assert,0)});
})(window);
