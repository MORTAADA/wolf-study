/* WHITE WOLF SCHOLAR V65.19 — Adaptive Teaching Strategy */
(function(global){'use strict';
 var VERSION='65.20';
 function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
 function strategy(state,topicId,ev){
  ev=ev||{}; var sm=global.WWStudentModel&&global.WWStudentModel.profile?global.WWStudentModel.profile(state,topicId):null;
  var tp=sm&&sm.topic||{}, mastery=0, indep=Number((tp&&tp.independence)||0), attempts=Number((tp&&tp.attempts)||0), hints=Number((tp&&tp.hints)||0);
  if(global.WWMastery&&global.WWMastery.score&&topicId) mastery=Number(global.WWMastery.score(state,topicId))||0; else mastery=Number((tp&&tp.mastery)||0);
  var missing=(ev.missingConcepts||[]).slice(0,4), mis=(ev.misconceptions||[]).slice(0,3), verdict=ev.verdict||'';
  var action='guided',label='Guided Practice',reason='';
  if(mis.length){action='repair';label='Concept Repair';reason='Une misconception a été détectée : corriger le raisonnement avant d’augmenter la difficulté.';}
  else if(verdict==='incorrect' || mastery<40){action='scaffold';label='Scaffold';reason='Maîtrise faible ou réponse incorrecte : réduire la charge cognitive et reconstruire le concept étape par étape.';}
  else if(verdict==='partial' || missing.length || mastery<70){action='guided';label='Guided Practice';reason='Compréhension partielle : travailler le concept manquant avec une question intermédiaire et un indice ciblé.';}
  else if(mastery>=80 && indep>=.78 && hints===0){action='challenge';label='Challenge & Transfer';reason='Maîtrise et autonomie élevées : proposer un problème de transfert avec justification.';}
  else {action='transfer';label='Transfer';reason='La base est suffisamment solide : vérifier que le concept fonctionne dans un contexte différent.';}
  var intensity=clamp(Math.round((100-mastery)*.7+(1-indep)*30),10,95);
  return {action:action,label:label,reason:reason,intensity:intensity,mastery:mastery,independence:indep,attempts:attempts,hints:hints,missingConcepts:missing,misconceptions:mis,next:'',generatedAt:new Date().toISOString()};
 }
 function nextQuestionPrompt(state,topicId,ev){var s=strategy(state,topicId,ev),topic=(state.topics||[]).find(function(t){return t.id===topicId}),name=topic&&topic.title||topicId||'le chapitre';
  var base='Sur '+name+', '+s.reason+' Reste socratique et pose UNE seule question.';
  if(s.action==='repair')return base+' Demande à l’étudiant de repérer et corriger son raisonnement, sans révéler directement la réponse.';
  if(s.action==='scaffold')return base+' Commence par une question très simple sur le concept fondamental, puis attends la réponse.';
  if(s.action==='guided')return base+' Pose une question intermédiaire qui cible le concept manquant.';
  if(s.action==='transfer')return base+' Propose une situation nouvelle mais du même principe et demande une justification.';
  return base+' Propose un problème légèrement plus difficile, avec contrôle des hypothèses, unités et ordre de grandeur si pertinent.';
 }
 global.WWAdaptiveTeaching={version:VERSION,strategy:strategy,nextQuestionPrompt:nextQuestionPrompt};
})(window);
