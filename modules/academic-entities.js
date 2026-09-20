/* WHITE WOLF SCHOLAR V65.28 — Unified Academic Entity Model */
(function(global){
  'use strict';
  var VERSION='1.0.0';
  function makeId(type){return 'ww-'+type+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8)}
  var TYPES={subject:'subject',topic:'topic',session:'session',task:'task',resource:'resource',exam:'exam',error:'error',flashcard:'flashcard',planning:'planning',mastery:'mastery',concept:'concept',studyActivity:'studyActivity'};
  var defaults={
    subject:{id:null,type:TYPES.subject,name:'',code:'',credits:0,semester:null},
    topic:{id:null,type:TYPES.topic,subjectId:null,name:'',status:0,mastery:0},
    session:{id:null,type:TYPES.session,subjectId:null,topicId:null,activityType:'study',plannedMinutes:0,actualMinutes:0,startedAt:null,endedAt:null},
    task:{id:null,type:TYPES.task,subjectId:null,topicId:null,title:'',priority:'Moyenne',completed:false},
    resource:{id:null,type:TYPES.resource,subjectId:null,topicId:null,examId:null,title:'',resourceType:'document',status:'available',lastUsedAt:null},
    exam:{id:null,type:TYPES.exam,subjectId:null,title:'',date:null,topicIds:[],coverage:0},
    error:{id:null,type:TYPES.error,subjectId:null,topicId:null,questionId:null,createdAt:null,resolved:false},
    flashcard:{id:null,type:TYPES.flashcard,subjectId:null,topicId:null,front:'',back:'',dueAt:null},
    planning:{id:null,type:TYPES.planning,date:null,items:[],updatedAt:null},
    mastery:{id:null,type:TYPES.mastery,subjectId:null,topicId:null,level:0,score:0,updatedAt:null},
    concept:{id:null,type:TYPES.concept,subjectId:null,topicId:null,name:'',description:'',status:'active',mastery:0},
    studyActivity:{id:null,type:TYPES.studyActivity,subjectId:null,topicId:null,conceptId:null,activityType:'study',title:'',plannedMinutes:0,actualMinutes:0,status:'planned',startedAt:null,endedAt:null}
  };
  function normalize(type,input){
    var base=defaults[type]; if(!base) throw new Error('Unknown academic entity: '+type);
    var x=input||{}, out={}; Object.keys(base).forEach(function(k){out[k]=base[k]});
    Object.keys(x).forEach(function(k){out[k]=x[k]});
    if(type==='session' && (x.actualMinutes==null) && x.duration!=null) out.actualMinutes=Number(x.duration||0);
    if(type==='topic' && !out.name && x.title) out.name=x.title;
    if(type==='task' && !out.title && x.text) out.title=x.text;
    if(type==='task' && x.isDone!=null && x.completed==null) out.completed=!!x.isDone;
    if(type==='session' && out.startedAt==null && x.start) out.startedAt=x.start;
    if(type==='session' && out.endedAt==null && x.end) out.endedAt=x.end;
    if(type==='session' && out.actualMinutes==null && x.duration!=null) out.actualMinutes=Number(x.duration||0);
    if(out.subjectId==null && out.subject_id!=null) out.subjectId=out.subject_id;
    if(out.topicId==null && out.topic_id!=null) out.topicId=out.topic_id;
    if(out.examId==null && out.exam_id!=null) out.examId=out.exam_id;
    if(out.startedAt==null && out.started_at!=null) out.startedAt=out.started_at;
    if(out.endedAt==null && out.ended_at!=null) out.endedAt=out.ended_at;
    if(out.createdAt==null && out.created_at!=null) out.createdAt=out.created_at;
    if(out.lastUsedAt==null && out.last_accessed_at!=null) out.lastUsedAt=out.last_accessed_at;
    out.id=out.id||makeId(type); out.type=type;
    if(type==='topic'||type==='mastery') out.score=type==='mastery'?Number(out.score||0):undefined;
    if(type==='topic') out.mastery=Number(out.mastery||0);
    if(type==='session'||type==='studyActivity'){out.plannedMinutes=Number(out.plannedMinutes||0);out.actualMinutes=Number(out.actualMinutes||0)}
    if(type==='concept') out.mastery=Number(out.mastery||0);
    if(type==='studyActivity'){out.subjectId=out.subjectId||null;out.topicId=out.topicId||null;out.conceptId=out.conceptId||null;out.activityType=out.activityType||'study';}
    return out;
  }
  function validate(type,e){var errors=[],d=defaults[type];if(!d||!e||e.type!==type)errors.push('type');if(!e||!e.id)errors.push('id');if(type==='topic'&&!e.name)errors.push('name');if(type==='task'&&!e.title)errors.push('title');if(type==='resource'&&!e.title)errors.push('title');if(type==='session'&&!e.startedAt)errors.push('startedAt');return {ok:errors.length===0,errors:errors}}
  function clone(e){return JSON.parse(JSON.stringify(e))}
  global.WWAcademicEntities={version:VERSION,TYPES:TYPES,defaults:defaults,normalize:normalize,validate:validate,clone:clone,makeId:makeId};
})(window);
