/* WHITE WOLF SCHOLAR V65.11 — Intelligent Tutor Memory */
(function(global){'use strict';
  var VERSION='65.20';
  function fresh(){return {version:VERSION,updatedAt:null,turns:0,facts:[],concepts:{},errorPatterns:{},preferences:{support:null},recent:[]}}
  function ensure(state){if(!state.tutorMemory||typeof state.tutorMemory!=='object')state.tutorMemory=fresh();var m=state.tutorMemory;if(!Number.isFinite(Number(m.turns))||Number(m.turns)<0)m.turns=0;else m.turns=Math.floor(Number(m.turns));if(!Array.isArray(m.facts))m.facts=[];if(!m.concepts||typeof m.concepts!=='object')m.concepts={};if(!m.errorPatterns||typeof m.errorPatterns!=='object')m.errorPatterns={};if(!m.preferences||typeof m.preferences!=='object')m.preferences={support:null};if(!Array.isArray(m.recent))m.recent=[];return m}
  function key(x){return String(x||'').trim().toLowerCase().replace(/\s+/g,' ').slice(0,180)}
  function upsert(list,text,max){var k=key(text);if(!k)return;if(!list.some(function(x){return key(x.text)===k})){list.unshift({text:String(text).trim(),at:new Date().toISOString()});}return list.slice(0,max||20)}
  function update(state,ev){ev=ev||{};var m=ensure(state),topicId=ev.topicId||'__global__',title=ev.topicTitle||topicId,v=ev.verdict||'partial';m.turns++;m.updatedAt=new Date().toISOString();var c=m.concepts[topicId]||(m.concepts[topicId]={topicId:topicId,title:title,attempts:0,correct:0,partial:0,incorrect:0,missing:[],misconceptions:[],strengths:[],lastAt:null});c.title=title;c.attempts++;if(v==='correct')c.correct++;else if(v==='partial')c.partial++;else c.incorrect++;c.lastAt=m.updatedAt;
    (ev.missingConcepts||[]).slice(0,4).forEach(function(x){c.missing=upsert(c.missing.map(function(z){return {text:z}}),x,8).map(function(z){return z.text})});
    (ev.misconceptions||[]).slice(0,4).forEach(function(x){c.misconceptions=upsert(c.misconceptions.map(function(z){return {text:z}}),x,8).map(function(z){return z.text})});
    (ev.strengths||[]).slice(0,4).forEach(function(x){c.strengths=upsert(c.strengths.map(function(z){return {text:z}}),x,8).map(function(z){return z.text})});
    (ev.misconceptions||[]).slice(0,2).forEach(function(x){var kx=key(x);if(kx){var p=m.errorPatterns[kx]||(m.errorPatterns[kx]={pattern:String(x).trim(),count:0,lastAt:null,topics:{}});p.count++;p.lastAt=m.updatedAt;p.topics[topicId]=(p.topics[topicId]||0)+1}});
    if(ev.recommendedSupport)m.preferences.support=ev.recommendedSupport;
    m.recent.unshift({topicId:topicId,title:title,verdict:v,missing:(ev.missingConcepts||[]).slice(0,3),misconceptions:(ev.misconceptions||[]).slice(0,3),support:ev.recommendedSupport||null,at:m.updatedAt});m.recent=m.recent.slice(0,20);return m}
  function context(state,topicId){var m=ensure(state),c=m.concepts[topicId||'__global__']||null;var patterns=Object.keys(m.errorPatterns).map(function(k){return m.errorPatterns[k]}).sort(function(a,b){return b.count-a.count}).slice(0,6);return {turns:m.turns,preferences:m.preferences,topic:c?{title:c.title,attempts:c.attempts,correct:c.correct,partial:c.partial,incorrect:c.incorrect,missing:c.missing.slice(0,5),misconceptions:c.misconceptions.slice(0,5),strengths:c.strengths.slice(0,5)}:null,recurringErrors:patterns.map(function(x){return {pattern:x.pattern,count:x.count}}),recent:m.recent.slice(0,6)}}
  function reset(state){state.tutorMemory=fresh();return state.tutorMemory}
  global.WWTutorMemory={version:VERSION,ensure:ensure,update:update,context:context,reset:reset};
})(window);
