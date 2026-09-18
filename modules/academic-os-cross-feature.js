/* WHITE WOLF SCHOLAR V65.33 — Cross-feature orchestration
 * Bridges the unified Academic OS contracts with the existing feature engines.
 * Planning stays authoritative; this layer coordinates, records, and refreshes
 * derived intelligence without creating a second UI state.
 */
(function(global){
  'use strict';
  var Bus=global.WWEventBus, R=global.WWAcademicRepositories;
  var started=false, busy={};
  function st(){return global.__WW_STATE||global.state||{};}
  function emit(type,p){if(Bus&&Bus.emit)Bus.emit(type,Object.assign({source:'academic-os-cross-feature',at:Date.now()},p||{}));}
  function guard(key,fn){if(busy[key])return Promise.resolve(null);busy[key]=true;return Promise.resolve().then(fn).finally(function(){busy[key]=false;});}
  async function syncMastery(p){
    var id=p&&p.topicId; if(!id)return;
    return guard('mastery:'+id,async function(){
      var s=st();
      if(global.WWMastery&&typeof global.WWMastery.syncTopic==='function'){
        try{global.WWMastery.syncTopic(s,id);}catch(e){console.warn('Mastery sync skipped',e);}
      }
      emit('MASTERY_CONTEXT_REFRESHED',{topicId:id,subjectId:p.subjectId||null});
    });
  }
  async function refreshRevision(p){
    if(!p||!p.topicId)return;
    emit('REVISION_CONTEXT_CHANGED',{topicId:p.topicId,subjectId:p.subjectId||null,reason:p.reason||'academic-event'});
  }
  async function refreshAnalytics(p){
    emit('ANALYTICS_CONTEXT_CHANGED',{topicId:p&&p.topicId||null,subjectId:p&&p.subjectId||null,reason:p&&p.reason||'academic-event'});
  }
  async function refreshResources(p){
    emit('RESOURCE_INTELLIGENCE_CONTEXT_CHANGED',{topicId:p&&p.topicId||null,subjectId:p&&p.subjectId||null,reason:p&&p.reason||'academic-event'});
  }
  async function process(type,p){
    p=p||{};
    if(type==='SESSION_COMPLETED'){
      if(global.WWMastery&&typeof global.WWMastery.recordSession==='function'){
        try{global.WWMastery.recordSession(st(),p.topicId,p.actualMinutes||p.duration||0);}catch(e){console.warn('Session mastery bridge skipped',e);}
      }
      await syncMastery(p); await refreshAnalytics(Object.assign({},p,{reason:'session-completed'})); await refreshRevision(Object.assign({},p,{reason:'session-completed'}));
    } else if(type==='MASTERY_CHANGED'){
      await syncMastery(p); await refreshAnalytics(Object.assign({},p,{reason:'mastery-changed'})); await refreshRevision(Object.assign({},p,{reason:'mastery-changed'}));
    } else if(type==='FLASHCARD_REVIEWED'){
      if(global.WWMastery&&typeof global.WWMastery.recordReview==='function'){
        try{global.WWMastery.recordReview(st(),p.topicId,p.success!==false);}catch(e){console.warn('Review mastery bridge skipped',e);}
      }
      await syncMastery(p); await refreshAnalytics(Object.assign({},p,{reason:'flashcard-reviewed'})); await refreshRevision(Object.assign({},p,{reason:'flashcard-reviewed'}));
    } else if(type==='ERROR_CREATED'||type==='ERROR_REVIEWED'){
      if(global.WWMastery&&typeof global.WWMastery.recordError==='function'){
        try{global.WWMastery.recordError(st(),p.topicId,p.success===true);}catch(e){console.warn('Error mastery bridge skipped',e);}
      }
      await syncMastery(p); await refreshAnalytics(Object.assign({},p,{reason:type.toLowerCase()})); await refreshRevision(Object.assign({},p,{reason:type.toLowerCase()}));
    } else if(type==='RESOURCE_STUDIED'){
      await refreshResources(p); await refreshAnalytics(Object.assign({},p,{reason:'resource-studied'}));
    } else if(type==='TASK_COMPLETED'){
      await refreshAnalytics(Object.assign({},p,{reason:'task-completed'}));
    } else if(type==='PLANNING_UPDATED'){
      emit('DAILY_MISSION_CONTEXT_CHANGED',{reason:'planning-updated'});
      await refreshAnalytics({reason:'planning-updated'});
    } else if(type==='EXAM_UPDATED'){
      emit('EXAM_INTELLIGENCE_CONTEXT_CHANGED',{examId:p.examId||p.entityId||null,subjectId:p.subjectId||null});
      await refreshRevision(Object.assign({},p,{reason:'exam-updated'}));
    }
  }
  function start(){
    if(started||!Bus||!R)return false; started=true;
    ['SESSION_COMPLETED','MASTERY_CHANGED','FLASHCARD_REVIEWED','ERROR_CREATED','ERROR_REVIEWED','RESOURCE_STUDIED','TASK_COMPLETED','PLANNING_UPDATED','EXAM_UPDATED'].forEach(function(type){Bus.on(type,function(p){process(type,p);});});
    return true;
  }
  global.WWAcademicOSCrossFeature={version:'65.31',start:start,process:process,health:function(){return {version:'65.31',started:started,eventBus:!!Bus,repositories:!!R,engines:{mastery:!!global.WWMastery,analytics:!!global.WWAnalytics,revision:!!global.WWAdaptiveRevision,resources:!!global.WWResourceIntel}};}};
  start();
})(window);
