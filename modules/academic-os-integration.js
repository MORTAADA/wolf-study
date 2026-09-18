/* WHITE WOLF SCHOLAR V65.33 — Full Cross-Feature Wiring
 * Unified Academic OS bridge: legacy UI state <-> Academic repositories <-> Event Bus.
 * Planning remains the source of truth for planning; repositories become the shared
 * cross-feature contract layer without forcing a risky UI rewrite.
 */
(function(global){
  'use strict';
  var Bus=global.WWEventBus, R=global.WWAcademicRepositories, E=global.WWAcademicEntities;
  var wired=false, migrating=false;
  function state(){return global.__WW_STATE||global.state||null}
  function first(v){return Array.isArray(v)?v:Object.keys(v||{}).map(function(k){var x=v[k]; if(x&&typeof x==='object'&&!x.id)x.id=k; return x})}
  function sid(x){return x&&(x.subjectId||x.subject_id)||null}
  function tid(x){return x&&(x.topicId||x.topic_id)||null}
  function normalizeLegacy(kind,x){
    x=Object.assign({},x||{});
    if(kind==='topic'){x.name=x.name||x.title||'';x.subjectId=sid(x)}
    if(kind==='session'){x.subjectId=sid(x);x.topicId=tid(x);x.actualMinutes=Number(x.actualMinutes!=null?x.actualMinutes:(x.duration||0));x.plannedMinutes=Number(x.plannedMinutes||x.actualMinutes||0);x.startedAt=x.startedAt||x.started_at||null;x.endedAt=x.endedAt||x.ended_at||null}
    if(kind==='task'){x.title=x.title||x.text||'';x.completed=!!(x.completed||x.isDone)}
    if(kind==='resource'){x.title=x.title||x.name||'Resource';x.subjectId=sid(x);x.topicId=tid(x)}
    if(kind==='exam'){x.subjectId=sid(x);x.title=x.title||x.name||'Exam'}
    if(kind==='error'){x.subjectId=sid(x);x.topicId=tid(x);x.createdAt=x.createdAt||x.created_at||null}
    if(kind==='mastery'){x.subjectId=sid(x);x.topicId=tid(x);x.score=Number(x.score||0);x.level=Number(x.level!=null?x.level:(x.stage||0))}
    if(kind==='flashcard'){x.subjectId=sid(x);x.topicId=tid(x);x.front=x.front||x.question||'';x.back=x.back||x.answer||''}
    return E.normalize(kind,x)
  }
  async function merge(kind,items){
    var repo=R[kind]; if(!repo)return 0; var current=await repo.getAll(), ids={};current.forEach(function(x){ids[x.id]=1});var n=0;
    (items||[]).forEach(function(x){if(!x||!x.id||ids[x.id])return;try{repo.add(normalizeLegacy(kind,x));ids[x.id]=1;n++}catch(e){console.warn('WW Academic migration skipped',kind,e)}});return n;
  }
  async function migrateAll(){
    if(migrating)return; migrating=true;
    try{
      var s=state()||{};
      var maps={subjects:'subject',topics:'topic',sessions:'session',tasks:'task',resources:'resource',exams:'exam',errors:'error'};
      for(var k in maps) await merge(maps[k],first(s[k]));
      var m=[]; Object.keys(s.mastery||{}).forEach(function(k){var x=Object.assign({},s.mastery[k],{id:s.mastery[k].id||'mastery-'+k,topicId:k});m.push(x)}); await merge('mastery',m);
      var f=[]; Object.keys(s.flashcards||{}).forEach(function(lang){(s.flashcards[lang]||[]).forEach(function(x){f.push(Object.assign({},x,{id:x.id||('fc-'+lang+'-'+Math.random())}))})}); await merge('flashcard',f);
      if(s.customSchedule && typeof s.customSchedule==='object') await R.planning.upsert(E.normalize('planning',{id:'planning-week',date:null,items:Object.keys(s.customSchedule).map(function(day){return {day:day,text:s.customSchedule[day]||''}}),updatedAt:new Date().toISOString()}));
      return {ok:true,version:'65.31'};
    }finally{migrating=false}
  }
  async function persistEvent(type,p){
    p=p||{};
    try{
      if(type==='PLANNING_UPDATED'){
        await R.planning.upsert(E.normalize('planning',{id:'planning-week',items:Object.keys(p.schedule||{}).map(function(day){return {day:day,text:p.schedule[day]||''}}),updatedAt:p.updatedAt||new Date().toISOString()}));
      } else if(type==='SESSION_COMPLETED'){
        var x=Object.assign({},p,{id:p.sessionId,subjectId:sid(p),topicId:tid(p),startedAt:p.startedAt||null,endedAt:p.endedAt||null});
        await R.sessions.upsert(normalizeLegacy('session',x));
      } else if(type==='TASK_COMPLETED' || type==='TASK_CREATED'){
        var s=state()||{}, t=(s.tasks||[]).find(function(x){return x&&x.id===p.taskId});
        if(t) await R.tasks.upsert(normalizeLegacy('task',t));
        else if(p.taskId) await R.tasks.upsert(normalizeLegacy('task',Object.assign({},p,{id:p.taskId,title:p.title||'Task',completed:type==='TASK_COMPLETED'})));
      } else if(type==='RESOURCE_STUDIED'){
        var r=p.entity||p.resource||{}; if(!r.id)r.id=p.resourceId;
        if(r.id) await R.resources.upsert(normalizeLegacy('resource',Object.assign({},r,{id:r.id,subjectId:sid(p)||sid(r),topicId:tid(p)||tid(r),lastUsedAt:p.at||new Date().toISOString(),status:'studied'})));
      } else if(type==='EXAM_UPDATED'){
        var s2=state()||{}, ex=(s2.exams||[]).find(function(x){return x&&x.id===p.examId});
        if(ex) await R.exams.upsert(normalizeLegacy('exam',ex)); else if(p.examId) await R.exams.upsert(normalizeLegacy('exam',Object.assign({},p,{id:p.examId,title:p.title||'Exam'})));
      } else if(type==='ERROR_CREATED' || type==='ERROR_REVIEWED'){
        var s3=state()||{}, er=(s3.errors||[]).find(function(x){return x&&x.id===p.errorId});
        if(er) await R.errors.upsert(normalizeLegacy('error',er)); else if(p.errorId) await R.errors.upsert(normalizeLegacy('error',Object.assign({},p,{id:p.errorId})));
      } else if(type==='MASTERY_CHANGED'){
        var mx=Object.assign({},p,{id:p.id||('mastery-'+(p.topicId||'global')),subjectId:sid(p),topicId:tid(p),score:Number(p.score||p.mastery||0),level:Number(p.level||p.stage||0)});
        await R.mastery.upsert(normalizeLegacy('mastery',mx));
      } else if(type==='FLASHCARD_REVIEWED'){
        var fx=p.entity||p.flashcard||{}; if(fx.id||p.cardId) await R.flashcards.upsert(normalizeLegacy('flashcard',Object.assign({},fx,{id:fx.id||p.cardId,subjectId:sid(p)||sid(fx),topicId:tid(p)||tid(fx)})));
      }
    }catch(e){console.warn('WW Academic event persistence error',type,e)}
  }
  function wire(){
    if(wired||!Bus||!R)return; wired=true;
    ['PLANNING_UPDATED','SESSION_COMPLETED','TASK_CREATED','TASK_COMPLETED','RESOURCE_STUDIED','EXAM_UPDATED','ERROR_CREATED','ERROR_REVIEWED','MASTERY_CHANGED','FLASHCARD_REVIEWED'].forEach(function(type){Bus.on(type,function(p){persistEvent(type,p)})});
    global.addEventListener('ww:academic-os-ready',function(){migrateAll()});
  }
  global.WWAcademicOSIntegration={version:'65.31',wire:wire,migrateAll:migrateAll,persistEvent:persistEvent,health:function(){return{version:'65.31',wired:wired,repositories:!!R,eventBus:!!Bus,legacyState:!!state()}}};
  if(Bus)wire();
})(window);
