/* WHITE WOLF SCHOLAR V65.13 — Prerequisite Intelligence */
(function(global){'use strict';
  var VERSION='65.20';
  function plan(state,topicId){
    var d=global.WWTutorGraph?global.WWTutorGraph.diagnose(state,topicId):null;
    if(!d||!d.topic)return null;
    var chain=[],seen={};
    function visit(id,depth){if(depth>4||seen[id])return;seen[id]=true;var ps=global.WWTutorGraph.prerequisites(state,id)||[];ps.sort(function(a,b){return a.mastery-b.mastery});ps.forEach(function(p){visit(p.id,depth+1);chain.push({id:p.id,title:p.title,mastery:p.mastery,depth:depth+1,ready:p.ready})})}
    visit(topicId,0);
    var unique={};chain=chain.filter(function(x){if(unique[x.id])return false;unique[x.id]=true;return true});
    var blocking=chain.filter(function(x){return !x.ready});
    return {topic:d.topic,chain:chain,blocking:blocking,next:blocking[0]||null,ready:!blocking.length,generatedAt:new Date().toISOString()};
  }
  function explain(state,topicId){var p=plan(state,topicId);if(!p)return '🎯 Chapitre introuvable.';var out='🧠 **Prerequisite Intelligence — '+p.topic.title+'**\n\n';if(!p.chain.length)return out+'Aucun prérequis explicite n’est enregistré pour ce chapitre.';out+='**Chaîne détectée :**\n';p.chain.forEach(function(x){out+=(x.ready?'✅':'⚠️')+' '+x.title+' — '+Math.round(x.mastery)+'%\n'});if(p.next)out+='\n🔎 **Pourquoi commencer ici ?** '+p.next.title+' est le premier maillon de la chaîne qui présente un signal de consolidation dans le périmètre actif.\n\n➡️ **Prochaine action :** travaille '+p.next.title+' puis réévalue la chaîne.';else out+='\n✅ Aucun maillon de la chaîne ne présente actuellement de blocage selon les données locales.';return out;}
  global.WWPrerequisite={version:VERSION,plan:plan,explain:explain};
})(window);
