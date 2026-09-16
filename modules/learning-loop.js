/* WHITE WOLF V65.1 — Full Learning Loop */
(function(global){'use strict';
  var VERSION='65.20';
  function now(){return new Date().toISOString()}
  function save(){if(global.saveState)global.saveState()}
  function activeTopic(id){if(!id)return true;try{var t=(global.state&&global.state.topics||[]).find(function(x){return x.id===id});return t&&global.wwTopicActive?!!global.wwTopicActive(t):true}catch(e){return true}}
  function build(resourceId,section,topic){
    if(!section)return null;
    return {resourceId:resourceId,sectionId:section.id,sectionTitle:section.title,topicId:topic&&topic.id||section.topicId||null,topicTitle:topic&&topic.title||null,phase:'read',startedAt:now(),completed:[],score:null,recall:null,quiz:null};
  }
  function set(loop){if(!global.state)return;global.state.learningLoop=loop;save()}
  function clear(){if(global.state){global.state.learningLoop=null;save()}}
  function current(){return global.state&&global.state.learningLoop||null}
  function advance(phase){var l=current();if(!l)return null;l.phase=phase;if(l.completed.indexOf(phase)<0)l.completed.push(phase);set(l);return l}
  function summary(){var l=current();if(!l)return null;return {phase:l.phase,sectionTitle:l.sectionTitle,topicTitle:l.topicTitle,completed:l.completed.slice(),score:l.score}}
  global.WWLearningLoop={version:VERSION,build:build,set:set,clear:clear,current:current,advance:advance,summary:summary,activeTopic:activeTopic};
})(window);
