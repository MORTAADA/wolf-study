/* WHITE WOLF SCHOLAR V65.33 — Legacy State Cutover & Single Source of Truth
 * Academic entities are persisted through the unified Academic OS repositories.
 * The legacy `state` object remains only as a runtime/UI projection for compatibility.
 */
(function(global){
  'use strict';
  var R=global.WWAcademicRepositories, E=global.WWAcademicEntities, P=global.WWCorePersistence;
  var KEY='wws.academic-os.cutover.v1', running=false;
  function arr(v){return Array.isArray(v)?v:Object.keys(v||{}).reduce(function(a,k){var x=v[k];if(x&&typeof x==='object'&&!x.id)x.id=k;if(x)a.push(x);return a},[])}
  function obj(v){var o={};(v||[]).forEach(function(x){if(x&&x.id)o[x.id]=x});return o}
  function flatResources(v){var a=[];if(Array.isArray(v))return v;Object.keys(v||{}).forEach(function(s){Object.keys(v[s]||{}).forEach(function(f){(v[s][f]||[]).forEach(function(x){a.push(Object.assign({},x,{subjectId:x.subjectId||s}))})});});return a}
  function flatFlashcards(v){var a=[];Object.keys(v||{}).forEach(function(lang){(v[lang]||[]).forEach(function(x){if(x)a.push(Object.assign({},x,{id:x.id||('fc-'+lang+'-'+Math.random().toString(36).slice(2))}))})});return a}
  async function replaceAll(state){
    var maps={};
    maps.subjects=arr(state.subjects).map(function(x){return E.normalize('subject',x)});
    maps.topics=arr(state.topics).map(function(x){return E.normalize('topic',x)});
    maps.sessions=arr(state.sessions).map(function(x){return E.normalize('session',x)});
    maps.tasks=arr(state.tasks).map(function(x){return E.normalize('task',x)});
    maps.exams=arr(state.exams).map(function(x){return E.normalize('exam',x)});
    maps.errors=arr(state.errors).map(function(x){return E.normalize('error',x)});
    maps.resources=flatResources(state.resources).map(function(x){return E.normalize('resource',x)});
    var mastery=[];Object.keys(state.mastery||{}).forEach(function(k){var v=state.mastery[k]||{};mastery.push(E.normalize('mastery',Object.assign({},v,{id:v.id||'mastery-'+k,topicId:v.topicId||k})))});maps.mastery=mastery;
    maps.flashcards=flatFlashcards(state.flashcards).map(function(x){return E.normalize('flashcard',x)});
    maps.planning=[E.normalize('planning',{id:'planning-week',items:Object.keys(state.customSchedule||{}).map(function(day){return {day:day,text:state.customSchedule[day]||''}}),updatedAt:new Date().toISOString()})];
    if(R.batchReplace)await R.batchReplace(maps);
    else for(var k in maps)if(R[k])await R[k].replace(maps[k]);
  }
  async function hydrate(state){
    var academic=await Promise.all([R.subjects.getAll(),R.topics.getAll(),R.sessions.getAll(),R.tasks.getAll(),R.resources.getAll(),R.exams.getAll(),R.errors.getAll(),R.mastery.getAll(),R.flashcards.getAll(),R.planning.getAll()]);
    if(academic[0].length)state.subjects=academic[0];
    if(academic[1].length)state.topics=academic[1];
    if(academic[2].length)state.sessions=academic[2];
    if(academic[3].length)state.tasks=academic[3];
    if(academic[4].length){var grouped={};academic[4].forEach(function(x){var s=x.subjectId||'global',f=x.folder||'documents';(grouped[s]||(grouped[s]={}));(grouped[s][f]||(grouped[s][f]=[])).push(x)});state.resources=grouped;}
    if(academic[5].length)state.exams=academic[5];
    if(academic[6].length)state.errors=academic[6];
    if(academic[7].length){state.mastery={};academic[7].forEach(function(x){if(x.topicId)state.mastery[x.topicId]=x;});}
    if(academic[8].length){state.flashcards={};academic[8].forEach(function(x){var lang=x.langId||'en';(state.flashcards[lang]||(state.flashcards[lang]=[])).push(x)});}
    if(academic[9].length&&academic[9][0].items){state.customSchedule={};academic[9][0].items.forEach(function(x){if(x&&x.day)state.customSchedule[x.day]=x.text||''});}
    return state;
  }
  async function boot(state){
    if(running||!R)return {ok:false,reason:'unavailable'};running=true;
    try{
      var marker=await P.get(KEY);
      if(!marker){await replaceAll(state);await P.set(KEY,{version:3,cutoverAt:new Date().toISOString()});}
      if(global.WWAcademicRuntime&&global.WWAcademicRuntime.hydrateProjection) await global.WWAcademicRuntime.hydrateProjection(state);
      else await hydrate(state);
      global.__WW_ACADEMIC_OS_PRIMARY=true;
      return {ok:true,primary:true,version:'65.33'};
    }finally{running=false;}
  }
  async function persist(state){if(!R)return false;await replaceAll(state);global.__WW_ACADEMIC_OS_PRIMARY=true;return true;}
  global.WWAcademicOSCutover={version:'65.33',boot:boot,hydrate:hydrate,persist:persist,health:function(){return{version:'65.33',primary:!!global.__WW_ACADEMIC_OS_PRIMARY,repositories:!!R,persistence:!!P}}};
})(window);
