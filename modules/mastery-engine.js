/* WHITE WOLF V87 — Mastery & Evidence Engine */
(function(global){
  'use strict';
  var STAGES=['Pas commencé','Compréhension','Application','Exercices','Autonomie'];
  function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
  function num(v){var n=Number(v);return Number.isFinite(n)?n:0}
  function ensure(state,topicId){
    if(!state.mastery)state.mastery={};
    if(!state.mastery[topicId]){
      var p=(state.progress&&state.progress[topicId])||{};
      var level=clamp(num(p.level),0,4);
      state.mastery[topicId]={stage:level,score:num(p.score)||level*25,understanding:level*25,recall:level*25,application:level*25,sessions:0,studyMinutes:0,errorCount:0,errorSuccess:0,reviewCount:0,quizAttempts:0,quizCorrect:0,lastEvidence:null,lastStudied:p.last_studied||null,lastReviewedAt:null,updatedAt:null};
    }
    return state.mastery[topicId];
  }
  function syncTopic(state,id){var m=ensure(state,id),p=(state.progress&&state.progress[id])||{};m.stage=clamp(num(m.stage!==undefined?m.stage:p.level),0,4);if(!m.score)m.score=clamp(num(p.score)||m.stage*25,0,100);m.lastStudied=m.lastStudied||p.last_studied||null;m.updatedAt=new Date().toISOString();return m}
  function syncState(state){if(!state.mastery)state.mastery={};(state.topics||[]).forEach(function(t){syncTopic(state,t.id)});return state.mastery}
  function evidence(state,id){
    var m=ensure(state,id),sessions=(state.sessions||[]).filter(function(s){return s.topic_id===id||s.topicId===id}),topic=(state.topics||[]).find(function(t){return t.id===id}),errors=(state.errors||[]).filter(function(e){return e.topic_id===id||(topic&&e.subject_id===topic.subject_id&&!e.topic_id)});
    var minutes=sessions.reduce(function(a,s){return a+num(s.duration||s.actualMinutes)},0),unresolved=errors.filter(function(e){return e.status!=='mastered'}).length,success=errors.filter(function(e){return e.status==='mastered'}).length;
    var quizAttempts=num(m.quizAttempts),quizCorrect=num(m.quizCorrect),quizRate=quizAttempts?quizCorrect/quizAttempts*100:0;
    return {stage:clamp(num(m.stage),0,4),score:clamp(num(m.score),0,100),understanding:clamp(num(m.understanding),0,100),recall:clamp(num(m.recall),0,100),application:clamp(num(m.application),0,100),sessions:sessions.length,studyMinutes:Math.max(num(m.studyMinutes),minutes),errorCount:unresolved,errorSuccess:success,reviewCount:num(m.reviewCount),quizAttempts:quizAttempts,quizCorrect:quizCorrect,quizRate:Math.round(quizRate),lastStudied:m.lastStudied||null,lastReviewedAt:m.lastReviewedAt||null};
  }
  function recencyDays(v){if(!v)return 999;var d=new Date(v);if(isNaN(d.getTime()))return 999;return Math.max(0,Math.floor((Date.now()-d.getTime())/86400000))}
  function compute(state,id){var e=evidence(state,id),base=e.stage*25;var evidenceBoost=Math.min(8,e.sessions*2)+Math.min(8,e.studyMinutes/30)+Math.min(7,e.reviewCount);var quiz=(e.quizAttempts?e.quizRate*.10:0);var balanced=(e.understanding+e.recall+e.application)/3;var penalty=Math.min(18,e.errorCount*3);var stale=e.lastStudied?Math.min(8,recencyDays(e.lastStudied)*.7):0;return Math.round(clamp(Math.max(base,balanced)+evidenceBoost+quiz-penalty-stale,0,100))}
  function score(state,id){var m=ensure(state,id);m.score=compute(state,id);return Math.round(m.score)}
  function recommendedStage(state,id){var e=evidence(state,id),s=e.stage;var sc=score(state,id);if(s<4&&sc>=78&&e.errorCount<=1&&e.quizRate>=70)return s+1;if(s>0&&(e.errorCount>=3||e.quizRate<45))return s-1;return s}
  function label(stage){return STAGES[clamp(num(stage),0,4)]}
  function updateDimensions(state,id,patch){var m=ensure(state,id);Object.keys(patch||{}).forEach(function(k){m[k]=clamp(num(patch[k]),0,100)});m.score=compute(state,id);m.updatedAt=new Date().toISOString();return m}
  function recordSession(state,id,duration){if(!id)return;var m=ensure(state,id),d=num(duration);m.sessions++;m.studyMinutes+=d;m.lastStudied=new Date().toISOString();m.lastEvidence='session';m.updatedAt=new Date().toISOString();score(state,id)}
  function recordError(state,id,success){if(!id)return;var m=ensure(state,id);if(success)m.errorSuccess++;else m.errorCount++;m.lastEvidence='error';m.updatedAt=new Date().toISOString();score(state,id)}
  function recordReview(state,id,success){if(!id)return;var m=ensure(state,id);m.reviewCount++;m.lastReviewedAt=new Date().toISOString();if(success)m.errorSuccess++;else m.errorCount++;m.lastEvidence='review';m.updatedAt=new Date().toISOString();score(state,id)}
  function recordQuiz(state,id,correct){if(!id)return;var m=ensure(state,id);m.quizAttempts++;if(correct)m.quizCorrect++;m.lastEvidence='quiz';m.updatedAt=new Date().toISOString();score(state,id)}
  function needsReview(state,id){var e=evidence(state,id),sc=score(state,id),days=recencyDays(e.lastReviewedAt||e.lastStudied);return {needed:!!(e.errorCount>0||sc<65||days>=7||e.quizRate<55&&e.quizAttempts>=2),score:clamp((100-sc)+Math.min(25,e.errorCount*7)+Math.min(20,days>=999?20:days*2),0,100),daysSinceEvidence:days,mastery:sc}}
  global.WWMastery={version:'87.0',stages:STAGES,ensure:ensure,syncTopic:syncTopic,syncState:syncState,evidence:evidence,score:score,compute:compute,recommendedStage:recommendedStage,label:label,updateDimensions:updateDimensions,recordSession:recordSession,recordError:recordError,recordReview:recordReview,recordQuiz:recordQuiz,needsReview:needsReview};
})(window);
