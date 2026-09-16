/* WHITE WOLF V63.0 — Mastery Engine */
(function(){
  'use strict';
  var STAGES=['Pas commencé','Compréhension','Application','Exercices','Autonomie'];
  function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
  function ensure(state,topicId){
    if(!state.mastery)state.mastery={};
    if(!state.mastery[topicId]){
      var p=(state.progress&&state.progress[topicId])||{};
      var level=clamp(Number(p.level)||0,0,4);
      state.mastery[topicId]={stage:level,sessions:0,studyMinutes:0,errorCount:0,errorSuccess:0,reviewCount:0,lastEvidence:null,updatedAt:null};
    }
    return state.mastery[topicId];
  }
  function syncTopic(state,topicId){
    var m=ensure(state,topicId),p=(state.progress&&state.progress[topicId])||{level:0};
    m.stage=clamp(Number(p.level)||0,0,4);
    m.updatedAt=new Date().toISOString();
    return m;
  }
  function syncState(state){
    if(!state.mastery)state.mastery={};
    (state.topics||[]).forEach(function(t){var m=ensure(state,t.id);if(state.progress&&state.progress[t.id]&&m.stage===undefined)syncTopic(state,t.id);if(m.sessions==null)m.sessions=0;if(m.studyMinutes==null)m.studyMinutes=0;if(m.errorCount==null)m.errorCount=0;if(m.errorSuccess==null)m.errorSuccess=0;if(m.reviewCount==null)m.reviewCount=0});
    return state.mastery;
  }
  function evidence(state,topicId){
    var m=ensure(state,topicId), sessions=(state.sessions||[]).filter(function(s){return s.topic_id===topicId}),
        errors=(state.errors||[]).filter(function(e){return e.topic_id===topicId||e.subject_id===((state.topics||[]).find(function(t){return t.id===topicId})||{}).subject_id}),
        errorSuccess=errors.filter(function(e){return e.status==='mastered'}).length,
        minutes=sessions.reduce(function(a,s){return a+(Number(s.duration)||0)},0);
    return {stage:m.stage,sessions:sessions.length,studyMinutes:minutes,errorCount:errors.length,errorSuccess:errorSuccess,reviewCount:m.reviewCount||0};
  }
  function score(state,topicId){
    var e=evidence(state,topicId),base=e.stage*25;
    var evidenceBoost=Math.min(10,e.sessions*2)+Math.min(8,e.studyMinutes/30)+Math.min(7,e.reviewCount)+Math.min(5,e.errorSuccess*2);
    var penalty=Math.min(10,Math.max(0,e.errorCount-e.errorSuccess)*2);
    return Math.round(clamp(base+evidenceBoost-penalty,0,100));
  }
  function recommendedStage(state,topicId){
    var e=evidence(state,topicId),s=e.stage;
    if(s<4 && e.sessions>=3 && e.errorCount===0)return s+1;
    if(s>0 && e.errorCount>=3 && e.errorSuccess===0)return s-1;
    return s;
  }
  function label(stage){return STAGES[clamp(Number(stage)||0,0,4)]}
  function recordSession(state,topicId,duration){if(!topicId)return;var m=ensure(state,topicId);m.sessions=(m.sessions||0)+1;m.studyMinutes=(m.studyMinutes||0)+(Number(duration)||0);m.lastEvidence='session';m.updatedAt=new Date().toISOString()}
  function recordError(state,topicId){if(!topicId)return;var m=ensure(state,topicId);m.errorCount=(m.errorCount||0)+1;m.lastEvidence='error';m.updatedAt=new Date().toISOString()}
  function recordReview(state,topicId,success){if(!topicId)return;var m=ensure(state,topicId);m.reviewCount=(m.reviewCount||0)+1;if(success)m.errorSuccess=(m.errorSuccess||0)+1;m.lastEvidence='review';m.updatedAt=new Date().toISOString()}
  window.WWMastery={version:'63.0',stages:STAGES,ensure:ensure,syncTopic:syncTopic,syncState:syncState,evidence:evidence,score:score,recommendedStage:recommendedStage,label:label,recordSession:recordSession,recordError:recordError,recordReview:recordReview};
})();
