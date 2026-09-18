/* WHITE WOLF SCHOLAR V68 — Academic OS Core v4
 * Application boundary: Commands + Queries + Domain events + diagnostics.
 * UI remains compatible with the existing state projection; academic persistence
 * stays in repositories and never in the UI state object.
 */
(function(global){
  'use strict';
  var R=global.WWAcademicRepositories, E=global.WWAcademicEntities, P=global.WWCorePersistence, B=global.WWEventBus;
  var queues=Object.create(null), diagnostics=[], MAX_DIAGNOSTICS=100;
  function now(){return new Date().toISOString()}
  function diag(code,error,meta){var d={id:'diag-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6),code:code,message:error&&error.message?error.message:String(error||''),at:now(),meta:meta||{}};diagnostics.push(d);if(diagnostics.length>MAX_DIAGNOSTICS)diagnostics.shift();try{console.warn('[WW V68]',code,d.message,meta||{})}catch(_){}return d}
  function serial(key,fn){var prev=queues[key]||Promise.resolve();var next=prev.then(fn,fn);queues[key]=next.catch(function(){});return next}
  function envelope(type,payload,source){return {eventId:'evt-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),type:type,version:1,occurredAt:now(),source:source||'application',payload:payload||{}}}
  function publish(type,payload,source){var ev=envelope(type,payload,source);if(B&&B.emit)B.emit(type,Object.assign({},payload||{},{eventId:ev.eventId,eventType:ev.type,eventVersion:ev.version,occurredAt:ev.occurredAt,source:ev.source}));return ev}
  function repo(kind){if(!R||!R[kind])throw new Error('Repository unavailable: '+kind);return R[kind]}
  function command(name,kind,eventType,mapper){return function(input){return serial(kind,async function(){try{var data=mapper?mapper(input||{}):input||{};var entityKinds={subjects:'subject',topics:'topic',sessions:'session',tasks:'task',resources:'resource',exams:'exam',errors:'error',flashcards:'flashcard',mastery:'mastery',planning:'planning'};var entity=E.normalize(entityKinds[kind]||kind,data);var saved=await repo(kind).upsert(entity);if(eventType)publish(eventType,{entityId:saved.id,entityType:saved.type,subjectId:saved.subjectId||null,topicId:saved.topicId||null,entity:saved},'command:'+name);return saved}catch(e){diag('COMMAND_FAILED',e,{command:name,kind:kind});throw e}})} }
  var commands={
    saveSubject:command('saveSubject','subjects'), saveTopic:command('saveTopic','topics'),
    saveSession:command('saveSession','sessions'), completeSession:command('completeSession','sessions','SESSION_COMPLETED'),
    saveTask:command('saveTask','tasks'), completeTask:command('completeTask','tasks','TASK_COMPLETED'),
    saveResource:command('saveResource','resources'), studyResource:command('studyResource','resources','RESOURCE_STUDIED'),
    saveExam:command('saveExam','exams','EXAM_UPDATED'), saveError:command('saveError','errors','ERROR_CREATED'),
    saveFlashcard:command('saveFlashcard','flashcards'), reviewFlashcard:command('reviewFlashcard','flashcards','FLASHCARD_REVIEWED'),
    saveMastery:command('saveMastery','mastery','MASTERY_CHANGED'),
    async savePlanning(x){return serial('planning',async function(){try{var e=E.normalize('planning',x||{}),s=await repo('planning').upsert(e);publish('PLANNING_UPDATED',{entityId:s.id,entityType:s.type,entity:s},'command:savePlanning');return s}catch(e){diag('COMMAND_FAILED',e,{command:'savePlanning'});throw e}})}
  };
  commands.atomic=async function(name,work){
    return serial('__academic_transaction__',async function(){
      try{
        if(typeof work!=='function')throw new Error('Transaction callback required');
        var snapshot=await global.WWAcademicRuntime.readAll();
        var result=await work(snapshot);
        if(result&&result.replace && R.batchReplace){await R.batchReplace(result.replace);}
        if(result&&result.events)result.events.forEach(function(ev){publish(ev.type,ev.payload||{},'transaction:'+name)});
        return result&&Object.prototype.hasOwnProperty.call(result,'value')?result.value:result;
      }catch(e){diag('TRANSACTION_FAILED',e,{name:name});throw e}
    });
  };
  function query(name,fn){return function(args){return Promise.resolve().then(function(){try{return fn(args||{})}catch(e){diag('QUERY_FAILED',e,{query:name});throw e}})}}
  var queries={
    all:query('all',async function(){return global.WWAcademicRuntime.readAll()}),
    subjects:query('subjects',function(){return repo('subjects').getAll()}), topics:query('topics',function(){return repo('topics').getAll()}),
    sessions:query('sessions',function(){return repo('sessions').getAll()}), tasks:query('tasks',function(){return repo('tasks').getAll()}),
    resources:query('resources',function(){return repo('resources').getAll()}), exams:query('exams',function(){return repo('exams').getAll()}),
    errors:query('errors',function(){return repo('errors').getAll()}), flashcards:query('flashcards',function(){return repo('flashcards').getAll()}),
    mastery:query('mastery',function(){return repo('mastery').getAll()}), planning:query('planning',function(){return repo('planning').getAll()}),
    byId:query('byId',function(a){return repo(a.kind).getById(a.id)})
  };
  async function persistProjection(state){if(!global.WWAcademicOSCutover)throw new Error('Academic OS cutover unavailable');return global.WWAcademicOSCutover.persist(state)}
  function health(){return {version:'68.0',healthy:!!(R&&E&&P&&B),repositories:R?Object.keys(R).filter(function(k){return k!=='version'}):[],diagnostics:diagnostics.length,queued:Object.keys(queues).length,singleSourceOfTruth:'academic-repositories'}}
  global.WWAcademicOSV4={version:'68.0',commands:commands,queries:queries,publish:publish,envelope:envelope,diagnostics:function(){return diagnostics.slice()},diagnose:diag,persistProjection:persistProjection,health:health};
})(window);
