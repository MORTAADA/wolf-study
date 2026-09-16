/* WHITE WOLF V65.1 — Section-Based Scientific Tutor */
(function(global){'use strict';
  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
  function resource(id){return global.WWDocumentIntel&&global.WWDocumentIntel.get?global.WWDocumentIntel.get(id):null}
  function activeTopic(id){if(!id)return true;try{if(global.wwTopicActive){var t=(global.state.topics||[]).find(function(x){return x.id===id});return t?!!global.wwTopicActive(t):false}}catch(e){}return true}
  function sectionText(r,sec){
    if(!r||!sec)return '';
    var all=(r.chunks||[]).join('\n\n');
    var low=norm(all), title=norm(sec.title), at=low.indexOf(title);
    if(at<0)return (r.chunks||[]).slice(Math.max(0,(sec.line||1)-1),Math.max(1,(sec.line||1)+3)).join('\n\n').slice(0,7000);
    var start=at, next=all.length;
    var sections=r.sections||[];
    var idx=sections.findIndex(function(x){return x.id===sec.id});
    if(idx>=0&&sections[idx+1]){var nt=norm(sections[idx+1].title), na=low.indexOf(nt,at+title.length);if(na>at)next=na;}
    return all.slice(start,next).slice(0,9000).trim();
  }
  function list(resourceId,topicId){var r=resource(resourceId);if(!r)return [];return (r.sections||[]).filter(function(s){return (!topicId||s.topicId===topicId)&&activeTopic(s.topicId||topicId)});}
  function find(resourceId,query,topicId){var ss=list(resourceId,topicId),q=norm(query);if(!ss.length)return null;var exact=ss.find(function(s){return norm(s.title)===q});if(exact)return exact;var hit=ss.find(function(s){return norm(s.title).indexOf(q)>=0||q.indexOf(norm(s.title))>=0});return hit||ss[0];}
  function build(resourceId,sec,topic){var r=resource(resourceId);if(!r||!sec)return null;var text=sectionText(r,sec);return {resourceId:resourceId,resourceName:r.name,sectionId:sec.id,sectionTitle:sec.title,topicId:sec.topicId||topic&&topic.id||null,topicTitle:topic&&topic.title||null,text:text,startedAt:new Date().toISOString()};}
  function save(session){if(global.state){global.state.sectionTutor=session;if(global.saveState)global.saveState();}}
  function clear(){if(global.state){global.state.sectionTutor=null;if(global.saveState)global.saveState();}}
  global.WWSectionTutor={version:'65.19',resource:resource,list:list,find:find,sectionText:sectionText,build:build,save:save,clear:clear};
})(window);
