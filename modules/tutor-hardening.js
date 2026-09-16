/* White Wolf Scholar — V65.19 Final Tutor Hardening */
(function(global){
  'use strict';
  var VERSION='65.20';
  function finite(n,f){n=Number(n);return Number.isFinite(n)?n:(f||0)}
  function safeString(v,max){return String(v==null?'':v).slice(0,max||1000)}
  function sanitizeMemory(state){
    var m=state.tutorMemory=state.tutorMemory||{};
    m.facts=Array.isArray(m.facts)?m.facts.slice(0,30):[];
    m.recent=Array.isArray(m.recent)?m.recent.slice(-20):[];
    m.concepts=m.concepts&&typeof m.concepts==='object'?m.concepts:{};
    m.errorPatterns=m.errorPatterns&&typeof m.errorPatterns==='object'?m.errorPatterns:{};
    return m;
  }
  function validate(state){
    var issues=[];
    if(!state||typeof state!=='object') return ['state_missing'];
    ['subjects','topics','sessions','errors'].forEach(function(k){if(!Array.isArray(state[k]))issues.push(k+'_not_array')});
    if(state.studyScope&&typeof state.studyScope!=='object')issues.push('studyScope_invalid');
    if(state.mastery&&typeof state.mastery!=='object')issues.push('mastery_invalid');
    if(state.tutorSession&&typeof state.tutorSession!=='object')issues.push('tutorSession_invalid');
    sanitizeMemory(state);
    return issues;
  }
  function scopeTopic(state,id){
    var t=(state.topics||[]).find(function(x){return x.id===id});
    if(!t)return false;
    var sc=state.studyScope||{subjects:{},topics:{}};
    if(sc.topics&&Object.prototype.hasOwnProperty.call(sc.topics,id))return !!sc.topics[id];
    if(sc.subjects&&Object.prototype.hasOwnProperty.call(sc.subjects,t.subject_id))return !!sc.subjects[t.subject_id];
    return false;
  }
  function compactContext(state){
    var brain=state.chatbotTutorBrain||{}, active=(state.topics||[]).filter(function(t){return scopeTopic(state,t.id)});
    return {version:VERSION,mode:safeString(brain.mode,40),activeTopics:active.slice(0,12).map(function(t){return {id:t.id,title:safeString(t.title,120)}}),issues:validate(state)};
  }
  global.WWTutorHardening={version:VERSION,validate:validate,sanitizeMemory:sanitizeMemory,compactContext:compactContext,finite:finite,safeString:safeString};
})(window);
