/* WHITE WOLF SCHOLAR V65.24 — Resource Intelligence */
(function(global){'use strict';
  function all(){return global.WWResourceAPI&&global.WWResourceAPI.getAllResources?global.WWResourceAPI.getAllResources():[]}
  function topic(id){return (global.state&&global.state.topics||[]).find(function(t){return t.id===id})||null}
  function subject(id){return (global.state&&global.state.subjects||[]).find(function(s){return s.id===id})||null}
  function mastery(id){try{var p=global.state&&global.state.progress&&global.state.progress[id];return p?Number(p.level||0):0}catch(e){return 0}}
  function activeTopic(t){try{return global.wwTopicActive?global.wwTopicActive(t):true}catch(e){return true}}
  function daysSince(v){if(!v)return 999;var d=new Date(v),n=new Date();if(isNaN(d.getTime()))return 999;return Math.max(0,Math.floor((new Date(n.getFullYear(),n.getMonth(),n.getDate())-new Date(d.getFullYear(),d.getMonth(),d.getDate()))/86400000))}
  function resourceTopic(r){return r.topic_id||r.topicId||null}
  function topicCoverage(){var rs=all(), active=(global.state&&global.state.topics||[]).filter(activeTopic), covered={};rs.forEach(function(r){var tid=resourceTopic(r);if(tid)covered[tid]=(covered[tid]||0)+1});var coveredActive=active.filter(function(t){return covered[t.id]>0}).length;return {activeTopics:active.length,coveredTopics:coveredActive,percent:active.length?Math.round(coveredActive/active.length*100):0,uncovered:active.filter(function(t){return !covered[t.id]})}}
  function score(r){var tid=resourceTopic(r),p=mastery(tid),age=daysSince(r.lastAccessedAt||r.lastOpenedAt||r.dateAdded),usage=Number(r.studyMinutes||0),s=0; if(tid){s+=(4-p)*18;s+=Math.max(0,Math.min(25,age>365?25:age*1.5));}else s+=8;if(r.favorite)s+=8;if(r.studied)s-=4;if(usage===0)s+=8;return Math.round(Math.max(0,Math.min(100,s)))}
  function recommendations(limit){return all().filter(function(r){var tid=resourceTopic(r),t=tid&&topic(tid);return !tid||!t||activeTopic(t)}).map(function(r){return Object.assign({},r,{resourceScore:score(r),topic:resourceTopic(r)?topic(resourceTopic(r)):null})}).sort(function(a,b){return b.resourceScore-a.resourceScore}).slice(0,limit||5)}
  function usage(){var rs=all(),totalMinutes=0,recent=0,used=0,orphan=0;rs.forEach(function(r){totalMinutes+=Number(r.studyMinutes||0);if(r.studied||Number(r.studyMinutes||0)>0)used++;if(!resourceTopic(r))orphan++;if(daysSince(r.lastAccessedAt)<=7)recent++});return {total:rs.length,totalMinutes:totalMinutes,used:used,recent:recent,orphan:orphan}}
  function brokenLocal(){return all().filter(function(r){return r.fileKey&&!r.fileName})}
  function searchContent(query,limit){if(!query||!global.WWDocumentIntel||!global.WWDocumentIntel.search)return [];return global.WWDocumentIntel.search(query,{limit:limit||8})}
  function analyze(r){var tid=resourceTopic(r),t=tid&&topic(tid),s=tid&&subject(t&&t.subject_id),di=global.WWDocumentIntel&&global.WWDocumentIntel.get?global.WWDocumentIntel.get(r.id):null;return {score:score(r),topic:t,subject:s,mastery:tid?mastery(tid):null,daysSinceAccess:daysSince(r.lastAccessedAt||r.lastOpenedAt),indexed:!!di,characters:di?Number(di.chars||0):0,chunks:di?Number((di.chunks||[]).length):0}}
  global.WWResourceIntel={version:'65.24',all:all,topicCoverage:topicCoverage,recommendations:recommendations,usage:usage,brokenLocal:brokenLocal,searchContent:searchContent,analyze:analyze};
})(window);
