/* WHITE WOLF SCHOLAR V65.19 — Tutor Dashboard & Explainability */
(function(global){'use strict';
  var VERSION='65.20';
  function activeTopics(state){
    return (state.topics||[]).filter(function(t){return typeof global.wwTopicActive==='function'?global.wwTopicActive(t):true;});
  }
  function profile(state){return global.WWTutorSession&&global.WWTutorSession.learningProfile?global.WWTutorSession.learningProfile(state):{accuracy:0,independence:0,attempts:0,strengths:[],needsWork:[]};}
  function diagnosis(state,topicId){return global.WWDependencyDiagnosis&&global.WWDependencyDiagnosis.diagnose?global.WWDependencyDiagnosis.diagnose(state,topicId):null;}
  function strategy(state){return state.chatbotTutorBrain&&state.chatbotTutorBrain.lastTeachingStrategy||state.chatbotTutorBrain&&state.chatbotTutorBrain.orchestrator&&state.chatbotTutorBrain.orchestrator.lastAction||'Diagnose';}
  function build(state){
    var p=profile(state), topics=activeTopics(state), mastery=topics.map(function(t){var m=global.WWMastery&&global.WWMastery.evidence?global.WWMastery.evidence(state,t.id):null;var score=global.WWMastery&&global.WWMastery.score?global.WWMastery.score(state,t.id):0;return {id:t.id,title:t.title||t.name||t.id,score:Math.round(score),mastery:m||{}}}).sort(function(a,b){return a.score-b.score;});
    var memory=state.tutorMemory||{},recent=Array.isArray(memory.recent)?memory.recent.slice(0,6):[], errors=Object.keys(memory.errorPatterns||{}).map(function(k){return {key:k,count:Number(memory.errorPatterns[k]&&memory.errorPatterns[k].count||memory.errorPatterns[k]||0)}}).sort(function(a,b){return b.count-a.count}).slice(0,5);
    return {version:VERSION,profile:p,activeTopics:topics.length,weakTopics:mastery.slice(0,5),strategy:strategy(state),recent:recent,recurringErrors:errors,activeSession:!!(state.tutorSession&&state.tutorSession.active),lastDiagnosis:state.chatbotTutorBrain&&state.chatbotTutorBrain.lastDiagnosis||null};
  }
  function explain(state){var x=build(state);return {strategy:x.strategy,why:x.lastDiagnosis&&x.lastDiagnosis.reason||'Le Tutor utilise les performances récentes, la maîtrise, les erreurs, l’autonomie et les prérequis dans le périmètre actif.',scope:x.activeTopics,weakTopics:x.weakTopics.map(function(t){return t.title}),next:'Vérifier le concept le plus faible avant d’augmenter la difficulté.'};}
  global.WWTutorDashboard={VERSION:VERSION,build:build,explain:explain,diagnosis:diagnosis};
})(window);

// V65.19 hardening is exposed through WWTutorHardening.
