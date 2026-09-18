/* WHITE WOLF SCHOLAR V77 — Immutable Academic Event Journal + Outbox
 * Journal = historical fact. Outbox = pending delivery. Repositories = current state.
 * Local-first, append-only, deterministic replay, duplicate-safe by eventId.
 */
(function(global){
  'use strict';
  var P=global.WWCorePersistence, B=global.WWEventBus;
  var JOURNAL_KEY='wws.academic.eventJournal.v1', OUTBOX_KEY='wws.academic.eventOutbox.v1';
  var queue=Promise.resolve(), memory=null, outboxMemory=null, initialized=false;
  var DOMAIN_TYPES={PLANNING_UPDATED:1,SESSION_COMPLETED:1,ERROR_CREATED:1,FLASHCARD_REVIEWED:1,RESOURCE_STUDIED:1,TASK_COMPLETED:1,EXAM_UPDATED:1,MASTERY_CHANGED:1,ACADEMIC_CONTEXT_CHANGED:1};
  function clone(x){return x==null?x:JSON.parse(JSON.stringify(x))}
  function serial(fn){var p=queue.then(fn,fn);queue=p.catch(function(){});return p}
  function id(){return 'evt-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)}
  function read(key){return P.get(key).then(function(v){return Array.isArray(v)?v:[]})}
  async function init(){if(initialized)return;memory=await read(JOURNAL_KEY);outboxMemory=await read(OUTBOX_KEY);initialized=true}
  async function ensure(){if(!initialized)await init()}
  async function append(event,meta){return serial(async function(){await ensure();var e=clone(event)||{};var eventId=e.eventId||id();if(memory.some(function(x){return x.eventId===eventId}))return memory.find(function(x){return x.eventId===eventId});var seq=memory.length?memory[memory.length-1].sequence+1:1;var record={eventId:eventId,sequence:seq,occurredAt:e.occurredAt||new Date().toISOString(),type:e.type||e.eventType||'UNKNOWN',version:Number(e.version||e.eventVersion||1),source:e.source||'event-bus',aggregateId:e.aggregateId||((e.payload||{}).entityId)||null,aggregateType:e.aggregateType||((e.payload||{}).entityType)||null,payload:clone(e.payload||e.data||{}),meta:clone(meta||{})};memory.push(record);await P.set(JOURNAL_KEY,memory);return clone(record)})}
  async function enqueue(record){return serial(async function(){await ensure();if(outboxMemory.some(function(x){return x.eventId===record.eventId}))return;outboxMemory.push({eventId:record.eventId,sequence:record.sequence,enqueuedAt:new Date().toISOString(),status:'pending',attempts:0,lastError:null});await P.set(OUTBOX_KEY,outboxMemory)})}
  function onEvent(payload){var p=payload||{};var type=p.eventType||p.type;if(!DOMAIN_TYPES[type])return;var event={eventId:p.eventId,type:type,version:p.eventVersion||1,occurredAt:p.occurredAt,source:p.source,payload:p};append(event).then(enqueue).catch(function(e){try{console.warn('[WW V77] journal append failed',e)}catch(_){} });}
  async function list(){await ensure();return clone(memory)}
  async function pending(){await ensure();return clone(outboxMemory.filter(function(x){return x.status==='pending'}))}
  async function acknowledge(eventId){return serial(async function(){await ensure();var x=outboxMemory.find(function(a){return a.eventId===eventId});if(!x)return false;x.status='sent';x.sentAt=new Date().toISOString();await P.set(OUTBOX_KEY,outboxMemory);return true})}
  async function fail(eventId,error){return serial(async function(){await ensure();var x=outboxMemory.find(function(a){return a.eventId===eventId});if(!x)return false;x.attempts++;x.lastError=String(error&&error.message||error||'unknown');await P.set(OUTBOX_KEY,outboxMemory);return true})}
  async function replay(handler,opts){await ensure();if(typeof handler!=='function')throw new Error('Replay handler required');var from=Number(opts&&opts.fromSequence||1),to=Number(opts&&opts.toSequence||Infinity),events=memory.filter(function(e){return e.sequence>=from&&e.sequence<=to});for(var i=0;i<events.length;i++)await handler(clone(events[i]));return events.length}
  async function stats(){await ensure();return {version:'77.0',journalCount:memory.length,outboxPending:outboxMemory.filter(function(x){return x.status==='pending'}).length,outboxTotal:outboxMemory.length,lastSequence:memory.length?memory[memory.length-1].sequence:0}}
  function resetForTests(){memory=[];outboxMemory=[];initialized=true}
  if(B&&B.on)Object.keys(DOMAIN_TYPES).forEach(function(type){B.on(type,onEvent)});
  global.WWAcademicEventJournal={version:'77.0',init:init,append:append,list:list,pending:pending,acknowledge:acknowledge,fail:fail,replay:replay,stats:stats,resetForTests:resetForTests,keys:{journal:JOURNAL_KEY,outbox:OUTBOX_KEY}};
})(window);
