/* WHITE WOLF SCHOLAR V65.33 — Academic Runtime Projection
 * Academic repositories are the persistence source of truth. The legacy `state`
 * object is retained only as a volatile UI projection. It is never authoritative
 * for academic persistence.
 */
(function(global){
  'use strict';
  var R=global.WWAcademicRepositories, E=global.WWAcademicEntities;
  var ready=false, lastHydrateAt=0;
  function arr(v){return Array.isArray(v)?v:[]}
  function groupResources(items){
    var grouped={};
    arr(items).forEach(function(x){var sid=x.subjectId||x.subject_id||'global', folder=x.folder||'documents';(grouped[sid]||(grouped[sid]={}));(grouped[sid][folder]||(grouped[sid][folder]=[])).push(x)});
    return grouped;
  }
  function groupFlashcards(items){
    var grouped={};
    arr(items).forEach(function(x){var lang=x.langId||x.lang_id||'en';(grouped[lang]||(grouped[lang]=[])).push(x)});
    return grouped;
  }
  function mapMastery(items){
    var m={}; arr(items).forEach(function(x){if(x.topicId)m[x.topicId]=x}); return m;
  }
  async function readAll(){
    if(!R) throw new Error('Academic repositories unavailable');
    var a=await Promise.all([R.subjects.getAll(),R.topics.getAll(),R.sessions.getAll(),R.tasks.getAll(),R.resources.getAll(),R.exams.getAll(),R.errors.getAll(),R.mastery.getAll(),R.flashcards.getAll(),R.planning.getAll()]);
    return {subjects:a[0],topics:a[1],sessions:a[2],tasks:a[3],resources:a[4],exams:a[5],errors:a[6],mastery:a[7],flashcards:a[8],planning:a[9]};
  }
  async function hydrateProjection(state){
    if(!state||!R)return false;
    var a=await readAll();
    state.subjects=a.subjects;
    state.topics=a.topics;
    state.sessions=a.sessions;
    state.tasks=a.tasks;
    state.resources=groupResources(a.resources);
    state.exams=a.exams;
    state.errors=a.errors;
    state.mastery=mapMastery(a.mastery);
    state.flashcards=groupFlashcards(a.flashcards);
    if(a.planning.length && a.planning[0].items){
      state.customSchedule={}; a.planning[0].items.forEach(function(x){if(x&&x.day)state.customSchedule[x.day]=x.text||''});
    }
    ready=true; lastHydrateAt=Date.now();
    return true;
  }
  function academicSnapshotKeys(){return ['subjects','topics','sessions','tasks','resources','exams','errors','mastery','flashcards','customSchedule'];}
  async function assertConsistency(state){
    if(!ready) return {ok:false,reason:'projection-not-hydrated'};
    var a=await readAll();
    return {ok:true,subjects:a.subjects.length,topics:a.topics.length,sessions:a.sessions.length,tasks:a.tasks.length,resources:a.resources.length,exams:a.exams.length,errors:a.errors.length,mastery:a.mastery.length,flashcards:a.flashcards.length,planning:a.planning.length,lastHydrateAt:lastHydrateAt};
  }
  global.WWAcademicRuntime={version:'65.33',readAll:readAll,hydrateProjection:hydrateProjection,assertConsistency:assertConsistency,academicSnapshotKeys:academicSnapshotKeys,isReady:function(){return ready}};
})(window);
