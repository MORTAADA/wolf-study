/* WHITE WOLF SCHOLAR V65.9 — Tutor Session Manager */
(function(global){'use strict';
  var VERSION='65.20';
  function now(){return new Date().toISOString()}
  function ensure(state){
    if(!state.tutorSession||typeof state.tutorSession!=='object') state.tutorSession=null;
    if(!Array.isArray(state.tutorSessions)) state.tutorSessions=[];
    return state.tutorSession;
  }
  function archive(state,t){
    if(!t)return null;
    if(!Array.isArray(state.tutorSessions)) state.tutorSessions=[];
    var copy=JSON.parse(JSON.stringify(t));
    copy.durationMinutes=durationMinutes(copy);
    state.tutorSessions.unshift(copy);
    if(state.tutorSessions.length>50)state.tutorSessions=state.tutorSessions.slice(0,50);
    return copy;
  }
  function list(state,limit){
    ensure(state); return state.tutorSessions.slice(0,Math.max(1,Number(limit)||20));
  }
  function start(state,opts){
    opts=opts||{};
    var t=state.tutorSession={
      id:'tutor-'+Date.now().toString(36), topicId:opts.topicId||null, topicTitle:opts.topicTitle||'',
      goal:opts.goal||'Comprendre et maîtriser le concept', mode:opts.mode||'socratic',
      startedAt:now(), endedAt:null, phase:'diagnostic', attempts:0, correct:0, partial:0, incorrect:0,
      hints:0, actions:[], lastEvaluation:null, active:true
    };
    return t;
  }
  function record(state,ev){
    var t=ensure(state);if(!t||!t.active)return null;
    ev=ev||{};t.attempts++;
    var v=ev.verdict||'incorrect';if(v==='correct')t.correct++;else if(v==='partial')t.partial++;else t.incorrect++;
    if(ev.hintUsed)t.hints++;
    t.lastEvaluation=ev;
    if(ev.phase)t.phase=ev.phase;
    if(ev.action)t.actions.push({action:ev.action,reason:ev.reason||'',at:now()});
    if(t.actions.length>30)t.actions=t.actions.slice(-30);
    return t;
  }
  function setPhase(state,phase){var t=ensure(state);if(t&&t.active)t.phase=phase;return t}
  function learningProfile(state){
    var sessions=Array.isArray(state.tutorSessions)?state.tutorSessions:[], sm=state.studentModel||{};
    var topics=sm.topics||{}, out={sessions:sessions.length,minutes:0,attempts:0,correct:0,partial:0,incorrect:0,hints:0,accuracy:0,independence:Number((sm.global||{}).independence||0),strengths:[],needsWork:[],updatedAt:now()};
    sessions.forEach(function(x){out.minutes+=Number(x.durationMinutes||0);out.attempts+=Number(x.attempts||0);out.correct+=Number(x.correct||0);out.partial+=Number(x.partial||0);out.incorrect+=Number(x.incorrect||0);out.hints+=Number(x.hints||0)});
    out.accuracy=out.attempts?Math.round(out.correct/out.attempts*100):0;
    Object.keys(topics).forEach(function(id){var t=topics[id]||{}, title=t.title||t.topicTitle||id, att=Number(t.attempts||0), correct=Number(t.correct||0), acc=att?Math.round(correct/att*100):0;if(att>=2){if(acc>=80)out.strengths.push({topicId:id,title:title,accuracy:acc,attempts:att});else if(acc<60)out.needsWork.push({topicId:id,title:title,accuracy:acc,attempts:att})}});
    out.strengths.sort(function(a,b){return b.accuracy-a.accuracy}); out.needsWork.sort(function(a,b){return a.accuracy-b.accuracy}); out.strengths=out.strengths.slice(0,5);out.needsWork=out.needsWork.slice(0,5);return out;
  }
  function end(state,summary){
    var t=ensure(state);if(!t)return null;t.endedAt=now();t.active=false;t.phase='completed';t.summary=summary||{};archive(state,t);return t;
  }
  function durationMinutes(t){if(!t)return 0;var a=Date.parse(t.startedAt||'');var b=Date.parse(t.endedAt||'')||Date.now();return a&&b?Math.max(0,Math.round((b-a)/60000)):0}
  function summary(state){
    var t=ensure(state);if(!t)return null;
    return {id:t.id,topicId:t.topicId,topicTitle:t.topicTitle,goal:t.goal,mode:t.mode,phase:t.phase,active:!!t.active,attempts:t.attempts,correct:t.correct,partial:t.partial,incorrect:t.incorrect,hints:t.hints,durationMinutes:durationMinutes(t),startedAt:t.startedAt,endedAt:t.endedAt,actions:t.actions||[],lastEvaluation:t.lastEvaluation||null,summary:t.summary||null};
  }
  function finishSummary(state){
    var t=ensure(state);if(!t)return null;
    var pct=t.attempts?Math.round(t.correct/t.attempts*100):0;
    return {score:pct,attempts:t.attempts,correct:t.correct,partial:t.partial,incorrect:t.incorrect,hints:t.hints,durationMinutes:durationMinutes(t),topicTitle:t.topicTitle,nextAction:t.incorrect?'revision':t.partial?'consolidation':pct>=80?'challenge':'practice'};
  }
  global.WWTutorSession={version:VERSION,ensure:ensure,start:start,record:record,setPhase:setPhase,end:end,summary:summary,finishSummary:finishSummary,durationMinutes:durationMinutes,archive:archive,list:list,learningProfile:learningProfile};
})(window);
