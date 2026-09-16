/* WHITE WOLF SCHOLAR V65.13 — Tutor Knowledge Graph */
(function(global){'use strict';
  var VERSION='65.20';
  var EDGES=[
    ['s1_1','s1_7','supports'],['s1_2','s1_7','supports'],['s1_3','s1_7','supports'],['s1_4','s1_7','supports'],
    ['s1_1','s1_8','prerequisite'],['s1_2','s1_8','prerequisite'],['s1_3','s1_8','prerequisite'],['s1_4','s1_8','prerequisite'],['s1_7','s1_8','supports'],
    ['s2_1','s2_2','prerequisite'],['s2_1','s2_3','prerequisite'],['s2_2','s2_3','supports'],['s2_1','s2_4','supports'],['s2_1','s2_5','prerequisite'],['s2_5','s2_6','prerequisite'],['s2_7','s2_1','context'],
    ['s3_1','s3_2','prerequisite'],['s3_3','s3_4','prerequisite'],['s3_4','s3_5','prerequisite'],['s3_4','s3_6','prerequisite'],['s3_4','s3_7','prerequisite'],['s3_4','s3_8','prerequisite'],['s3_3','s3_9','prerequisite'],
    ['s4_1','s4_3','prerequisite'],['s4_2','s4_1','context'],['s4_3','s4_4','prerequisite'],['s4_4','s4_5','supports'],['s4_3','s4_5','prerequisite'],['s4_1','s4_7','prerequisite'],
    ['s5_2','s5_3','prerequisite'],['s5_1','s5_4','supports'],['s5_2','s5_4','supports'],['s5_5','s5_6','prerequisite'],
    ['s8_1','s8_2','supports'],['s8_2','s8_3','prerequisite'],['s8_2','s8_4','supports'],['s8_5','s8_6','supports'],
    ['s9_1','s9_2','prerequisite'],['s9_1','s9_3','prerequisite'],['s9_3','s9_4','prerequisite'],['s9_4','s9_5','prerequisite'],
    ['s3_3','s1_1','supports'],['s3_3','s4_1','supports'],['s3_4','s4_1','supports'],['s3_3','s2_1','supports'],
    ['s8_1','s9_3','supports'],['s8_5','s9_4','supports']
  ];
  function arr(x){return Array.isArray(x)?x:[]}
  function topicMap(state){var m={};arr(state.topics).forEach(function(t){m[t.id]=t});return m}
  function active(state,t){if(!t)return false;if(global.wwTopicActive)return !!global.wwTopicActive(t);var sc=state.studyScope||{};return sc.topics&&Object.prototype.hasOwnProperty.call(sc.topics,t.id)?sc.topics[t.id]===true:sc.subjects&&sc.subjects[t.subject_id]===true}
  function mastery(state,id){return global.WWMastery&&global.WWMastery.score?Number(global.WWMastery.score(state,id)||0):Number(((state.progress||{})[id]||{}).score||0)}
  function evidence(state,id){return global.WWMastery&&global.WWMastery.evidence?global.WWMastery.evidence(state,id):{errorCount:0,sessions:0,studyMinutes:0}}
  function graph(state){var tm=topicMap(state),nodes=arr(state.topics).filter(function(t){return active(state,t)}).map(function(t){return {id:t.id,title:t.title,subjectId:t.subject_id,mastery:mastery(state,t.id)}}),ids={};nodes.forEach(function(n){ids[n.id]=true});var edges=[];EDGES.forEach(function(e){if(ids[e[0]]&&ids[e[1]])edges.push({from:e[0],to:e[1],type:e[2]})});return {nodes:nodes,edges:edges,topicMap:tm}}
  function neighbours(state,topicId){var g=graph(state),ids={};g.edges.forEach(function(e){if(e.from===topicId)ids[e.to]=true;if(e.to===topicId)ids[e.from]=true});return Object.keys(ids).map(function(id){var n=g.nodes.find(function(x){return x.id===id}),e=g.edges.find(function(x){return (x.from===topicId&&x.to===id)||(x.to===topicId&&x.from===id)});return n?{topic:n,type:e&&e.type,mastery:n.mastery}:null}).filter(Boolean)}
  function prerequisites(state,topicId){var g=graph(state),rows=g.edges.filter(function(e){return e.to===topicId&&e.type==='prerequisite'}).map(function(e){var n=g.nodes.find(function(x){return x.id===e.from});if(!n)return null;var ev=evidence(state,n.id);return {id:n.id,title:n.title,mastery:n.mastery,evidence:ev,ready:n.mastery>=70&&Number(ev.errorCount||0)===0}}).filter(Boolean);rows.sort(function(a,b){return a.mastery-b.mastery});return rows}
  function downstream(state,topicId){var g=graph(state);return g.edges.filter(function(e){return e.from===topicId}).map(function(e){var n=g.nodes.find(function(x){return x.id===e.to});return n?{id:n.id,title:n.title,type:e.type,mastery:n.mastery}:null}).filter(Boolean)}
  function diagnose(state,topicId){var t=(state.topics||[]).find(function(x){return x.id===topicId}),ps=prerequisites(state,topicId);if(!t)return {topic:null,blocked:false,prerequisites:[],next:null};var weak=ps.filter(function(x){return x.mastery<70||Number(x.evidence.errorCount||0)>0});var next=weak.length?weak[0]:null;return {topic:{id:t.id,title:t.title,mastery:mastery(state,t.id)},blocked:!!next,prerequisites:ps,next:next,downstream:downstream(state,topicId)}}
  function explain(state,topicId){var d=diagnose(state,topicId);if(!d.topic)return '🎯 Chapitre introuvable.';var out='🧭 **Prérequis — '+d.topic.title+'**\n\n';if(!d.prerequisites.length)return out+'Aucun prérequis explicite enregistré dans le Knowledge Graph.';d.prerequisites.forEach(function(p){out+=(p.ready?'✅':'⚠️')+' **'+p.title+'** — maîtrise '+Math.round(p.mastery)+'%'+(p.evidence.errorCount?' · '+p.evidence.errorCount+' erreur(s) non résolue(s)':'')+'\n'});if(d.next)out+='\n➡️ **Étape recommandée :** consolider **'+d.next.title+'** avant de poursuivre **'+d.topic.title+'**.';else out+='\n✅ Les prérequis enregistrés ne signalent pas de blocage.';return out}
  global.WWTutorGraph={version:VERSION,edges:EDGES,graph:graph,neighbours:neighbours,prerequisites:prerequisites,downstream:downstream,diagnose:diagnose,explain:explain};
})(window);
