/* WHITE WOLF V64.2 — Chatbot Context Engine */
(function(global){'use strict';
 function arr(v){return Array.isArray(v)?v:[]}
 function active(state,t){if(!t)return false;if(global.wwTopicActive)return !!global.wwTopicActive(t);var sc=state.studyScope||{};if(Object.prototype.hasOwnProperty.call(sc.topics||{},t.id))return sc.topics[t.id]===true;return (sc.subjects||{})[t.subject_id]===true}
 function mastery(state,id){return global.WWMastery&&global.WWMastery.score?Number(global.WWMastery.score(state,id)||0):Number(((state.progress||{})[id]||{}).score||0)}
 function evidence(state,id){return global.WWMastery&&global.WWMastery.evidence?global.WWMastery.evidence(state,id):{sessions:0,studyMinutes:0,errorCount:0,errorSuccess:0,reviewCount:0}}
 function build(state){
   var topics=arr(state.topics).filter(function(t){return active(state,t)});
   var ids={};topics.forEach(function(t){ids[t.id]=true});
   var errors=arr(state.errors).filter(function(e){if(e.status==='mastered')return false;if(e.topic_id)return !!ids[e.topic_id];return !!e.subject_id&&topics.some(function(t){return t.subject_id===e.subject_id})});
   var sessions=arr(state.sessions), minutes=sessions.reduce(function(a,s){return a+Number(s.duration||0)},0);
   var rows=topics.map(function(t){var ev=evidence(state,t.id);return {topic:t,score:mastery(state,t.id),evidence:ev}});
   rows.sort(function(a,b){return a.score-b.score||b.evidence.errorCount-a.evidence.errorCount});
   return {topics:topics,rows:rows,weak:rows.slice(0,5),errors:errors,sessions:sessions,totalMinutes:minutes,activeCount:topics.length,subjects:arr(state.subjects).filter(function(s){return topics.some(function(t){return t.subject_id===s.id})})};
 }
 global.WWChatContext={version:'64.2',build:build,active:active};
})(window);
