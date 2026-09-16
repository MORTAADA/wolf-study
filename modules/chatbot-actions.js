/* WHITE WOLF V64.2 — Chatbot Action Bridge */
(function(global){'use strict';
 function findTopic(state,text){var n=String(text||'').toLowerCase();return (state.topics||[]).filter(function(t){return global.WWChatContext.active(state,t)}).sort(function(a,b){return String(b.title||'').length-String(a.title||'').length}).find(function(t){return n.indexOf(String(t.title||'').toLowerCase())>=0})||null}
 function openTopic(topic){if(!topic)return false;try{if(global.navigate){global.navigate('topic',topic.id);return true}}catch(e){}try{if(global.router&&global.router.navigate){global.router.navigate('topic',topic.id);return true}}catch(e){}return false}
 global.WWChatActions={version:'64.2',findTopic:findTopic,openTopic:openTopic};
})(window);
