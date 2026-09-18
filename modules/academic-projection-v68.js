/* WHITE WOLF SCHOLAR V68 — Projection Reconciliation Layer
 * The legacy `state` object is a UI projection only. Academic persistence is
 * synchronized through repository deltas; appState no longer stores academic entities.
 */
(function(global){
  'use strict';
  var R=global.WWAcademicRepositories, E=global.WWAcademicEntities;
  var TYPES={subjects:'subject',topics:'topic',sessions:'session',tasks:'task',resources:'resource',exams:'exam',errors:'error',flashcards:'flashcard',mastery:'mastery',planning:'planning'};
  var baseline=null, syncing=false, lastResult=null;
  function arr(v){return Array.isArray(v)?v:[]}
  function flatResources(v){var a=[]; if(Array.isArray(v)) return v; Object.keys(v||{}).forEach(function(s){Object.keys(v[s]||{}).forEach(function(f){arr(v[s][f]).forEach(function(x){a.push(Object.assign({},x,{subjectId:x.subjectId||x.subject_id||s,folder:x.folder||f}))})})}); return a}
  function flatFlashcards(v){var a=[];Object.keys(v||{}).forEach(function(lang){arr(v[lang]).forEach(function(x){a.push(Object.assign({},x,{langId:x.langId||x.lang_id||lang}))})});return a}
  function masteryArray(v){var a=[];Object.keys(v||{}).forEach(function(k){var x=v[k];if(x&&typeof x==='object')a.push(Object.assign({},x,{id:x.id||'mastery-'+k,topicId:x.topicId||x.topic_id||k}))});return a}
  function planningArray(v){return [E.normalize('planning',{id:'planning-week',items:Object.keys(v||{}).map(function(day){return {day:day,text:v[day]||''}}),updatedAt:new Date().toISOString()})]}
  function projection(state){return {subjects:arr(state.subjects),topics:arr(state.topics),sessions:arr(state.sessions),tasks:arr(state.tasks),resources:flatResources(state.resources),exams:arr(state.exams),errors:arr(state.errors),flashcards:flatFlashcards(state.flashcards),mastery:masteryArray(state.mastery),planning:planningArray(state.customSchedule)}}
  function index(items){var m=Object.create(null);arr(items).forEach(function(x){if(x&&x.id)m[x.id]=x});return m}
  function equal(a,b){return JSON.stringify(a)===JSON.stringify(b)}
  async function reconcile(state){
    if(!R||!E)throw new Error('Academic projection dependencies unavailable');
    if(syncing)return {ok:false,reason:'sync-in-progress'}; syncing=true;
    try{
      var next=projection(state), before=baseline||await global.WWAcademicRuntime.readAll(), changed={}, added=0, updated=0, removed=0;
      for(var kind in TYPES){
        var type=TYPES[kind], ni=index(next[kind]), oi=index(before[kind]);
        var upserts=[];
        Object.keys(ni).forEach(function(id){var n=E.normalize(type,ni[id]),o=oi[id];if(!o||!equal(n,E.normalize(type,o)))upserts.push(n)});
        var deletes=Object.keys(oi).filter(function(id){return !ni[id]});
        if(upserts.length||deletes.length)changed[kind]={upserts:upserts,deletes:deletes};
      }
      for(var k in changed){var c=changed[k];for(var i=0;i<c.upserts.length;i++){await R[k].upsert(c.upserts[i]); if(before[k]&&index(before[k])[c.upserts[i].id])updated++;else added++;}for(var j=0;j<c.deletes.length;j++){if(R[k].removeById)await R[k].removeById(c.deletes[j]);removed++;}}
      baseline=await global.WWAcademicRuntime.readAll(); lastResult={ok:true,added:added,updated:updated,removed:removed,at:new Date().toISOString()};
      if(global.WWEventBus)global.WWEventBus.emit('academic:projection:reconciled',lastResult);
      return lastResult;
    }finally{syncing=false;}
  }
  async function capture(){baseline=await global.WWAcademicRuntime.readAll();return baseline}
  async function status(){return {version:'68.0',baseline:!!baseline,syncing:syncing,last:lastResult}}
  global.WWAcademicProjectionV68={version:'68.0',reconcile:reconcile,capture:capture,status:status,projection:projection};
})(window);
