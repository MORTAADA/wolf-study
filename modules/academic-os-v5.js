/* WHITE WOLF SCHOLAR V67 — Academic OS Application Boundary
 * The UI may keep a volatile projection for rendering, but academic writes go
 * through Commands. Repository persistence is the source of truth.
 */
(function(global){
  'use strict';
  var core=global.WWAcademicOSV4, R=global.WWAcademicRepositories, E=global.WWAcademicEntities;
  var VERSION='68.0';
  function ensure(){if(!core||!R||!E)throw new Error('Academic OS V5 core unavailable')}
  function commit(kind,data,eventType){ensure(); var c=core.commands; var map={subjects:'saveSubject',topics:'saveTopic',sessions:'saveSession',tasks:'saveTask',resources:'saveResource',exams:'saveExam',errors:'saveError',flashcards:'saveFlashcard',mastery:'saveMastery',planning:'savePlanning'}; var fn=c[map[kind]]; if(!fn)throw new Error('No command for '+kind); if(eventType==='SESSION_COMPLETED')fn= c.completeSession; if(eventType==='TASK_COMPLETED')fn=c.completeTask; if(eventType==='RESOURCE_STUDIED')fn=c.studyResource; if(eventType==='FLASHCARD_REVIEWED')fn=c.reviewFlashcard; return fn(data)}
  async function hydrate(){if(global.WWAcademicRuntime&&global.WWAcademicRuntime.hydrateProjection){var s=global.state; if(s)return global.WWAcademicRuntime.hydrateProjection(s)} return false}
  function health(){return {version:VERSION,sourceOfTruth:'repositories',commandBoundary:!!(core&&core.commands),queryBoundary:!!(core&&core.queries),runtimeProjection:!!global.WWAcademicRuntime}}
  global.WWAcademicOSV5={version:VERSION,commit:commit,hydrate:hydrate,health:health};
})(window);
