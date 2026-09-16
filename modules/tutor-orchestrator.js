/* WHITE WOLF SCHOLAR V65.7 — Autonomous Tutor Orchestrator */
(function(global){'use strict';
  var VERSION='65.20';
  function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
  function decide(state,ev){
    ev=ev||{}; var b=state.chatbotTutorBrain||{}; if(ev.topicId)b.lastTopicId=ev.topicId; var topicId=ev.topicId||b.lastTopicId||null; var sm=global.WWStudentModel&&global.WWStudentModel.profile?global.WWStudentModel.profile(state,topicId):null;
    var t=sm&&sm.topic||{}, attempts=Number(t.attempts||0), indep=Number(t.independence||0), hints=Number(t.hints||0), v=ev.verdict||'incorrect';
    if(v==='correct' && indep>=.78 && hints===0) return {action:'challenge',reason:'Bonne réponse avec autonomie élevée',difficulty:'up'};
    if(v==='correct') return {action:'transfer',reason:'Réponse correcte : consolider puis transférer',difficulty:'same'};
    if(v==='partial') return {action:'scaffold',reason:'Réponse partielle : isoler le concept manquant',difficulty:'down'};
    if(ev.misconceptions&&ev.misconceptions.length) return {action:'repair',reason:'Une misconception a été détectée',difficulty:'down'};
    if(attempts<=1) return {action:'diagnose',reason:'Première tentative : établir le niveau réel',difficulty:'down'};
    return {action:'hint',reason:'Difficulté persistante : fournir un indice ciblé',difficulty:'down'};
  }
  function prompt(state,ev){
    var d=decide(state,ev), topicId=(state.chatbotTutorBrain||{}).lastTopicId||null;
    var base='Reste en mode socratique. Pose UNE seule question et attends la réponse. Ne donne pas la solution complète.';
    if(d.action==='challenge') return base+' Propose un problème de transfert légèrement plus difficile sur le même concept, avec une justification demandée. Topic: '+topicId+'.';
    if(d.action==='transfer') return base+' Pose une question de transfert sur le même concept, légèrement différente de la précédente. Topic: '+topicId+'.';
    if(d.action==='scaffold') return base+' Identifie implicitement le concept manquant et pose une question plus simple qui permette à l’étudiant de le reconstruire. Ne révèle pas directement le concept. Topic: '+topicId+'.';
    if(d.action==='repair') return base+' Repars de la misconception détectée. Donne un micro-indice, puis pose une question très ciblée pour faire corriger le raisonnement. Topic: '+topicId+'.';
    if(d.action==='diagnose') return base+' Pose une question diagnostique très courte sur le prérequis nécessaire. Topic: '+topicId+'.';
    return base+' Donne un indice minimal puis pose une question ciblée sur la prochaine étape. Topic: '+topicId+'.';
  }
  function next(state,ev){var d=decide(state,ev);var b=state.chatbotTutorBrain||{};b.orchestrator=b.orchestrator||{turns:0,lastAction:null,lastReason:null};b.orchestrator.turns++;b.orchestrator.lastAction=d.action;b.orchestrator.lastReason=d.reason;b.orchestrator.updatedAt=new Date().toISOString();state.chatbotTutorBrain=b;return {decision:d,prompt:prompt(state,ev)};}
  global.WWTutorOrchestrator={version:VERSION,decide:decide,next:next,prompt:prompt};
})(window);
