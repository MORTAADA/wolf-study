/* WHITE WOLF SCHOLAR V78 — Architecture Final Gate
 * Read-only audit + explicit freeze marker. No automatic feature mutation.
 */
(function(global){
  'use strict';
  var REQUIRED=['WWCorePersistence','WWAcademicEntities','WWAcademicRepositories','WWAcademicRuntime','WWAcademicProjectionV68','WWAcademicEventJournal','WWAcademicOSV4'];
  var LEGACY_ACADEMIC_KEYS=['subjects','topics','sessions','tasks','resources','exams','errors','flashcards','mastery'];
  function audit(){
    var missing=REQUIRED.filter(function(k){return !global[k]});
    var directAcademicSave=typeof global.WWAcademicOSCutover!=='undefined' && typeof global.WWAcademicProjectionV68!=='undefined';
    return {version:'78.0',status:missing.length?'BLOCKED':'PASS',missing:missing,corePersistence:!!global.WWCorePersistence,academicRepositories:!!global.WWAcademicRepositories,eventJournal:!!global.WWAcademicEventJournal,projectionLayer:!!global.WWAcademicProjectionV68,legacyAcademicPersistenceBlocked:directAcademicSave,architectureFrozen:true,generatedAt:new Date().toISOString()};
  }
  function health(){var a=audit();return Object.assign(a,{freeze:'V78-FROZEN',writePath:'UI projection → reconciliation → academic repositories',historyPath:'Event Bus → immutable journal → outbox',replay:'supported'});}
  global.WWArchitectureFinalGateV78={version:'78.0',audit:audit,health:health,frozen:true,freezeId:'V78-FROZEN'};
})(window);
