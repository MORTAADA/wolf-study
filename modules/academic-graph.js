/* WHITE WOLF SCHOLAR V84 — Unified Academic Graph */
(function(global){
  'use strict';
  var E=global.WWAcademicEntities, R=global.WWAcademicRepositories;
  function state(){return global.__WW_STATE||global.state||null}
  function byId(a,id){return (a||[]).find(function(x){return x&&x.id===id})||null}
  function subject(subjectId){var s=state();return byId(s&&s.subjects,subjectId)}
  function topic(topicId){var s=state();return byId(s&&s.topics,topicId)}
  function concept(conceptId){var s=state();return byId(s&&s.concepts,conceptId)}
  function chapterPath(topicId){var t=topic(topicId);return t?{subjectId:t.subject_id||t.subjectId||null,topicId:t.id,name:t.title||t.name||''}:null}
  function activity(x){return E.normalize('studyActivity',x||{})}
  function link(x){x=x||{};var t=topic(x.topicId||x.topic_id),c=concept(x.conceptId||x.concept_id),sub=subject(x.subjectId||x.subject_id)||(t&&subject(t.subject_id||t.subjectId));return {subject:sub||null,topic:t||null,concept:c||null,subjectId:(sub&&sub.id)||x.subjectId||x.subject_id||null,topicId:(t&&t.id)||x.topicId||x.topic_id||null,conceptId:(c&&c.id)||x.conceptId||x.concept_id||null}}
  function graph(x){var l=link(x);return {subject:l.subject,chapter:l.topic,concept:l.concept,taskId:x&&x.taskId||null,activityId:x&&x.activityId||null,sessionId:x&&x.sessionId||null,resourceId:x&&x.resourceId||null,examId:x&&x.examId||null,masteryId:x&&x.masteryId||null,revisionId:x&&x.revisionId||null}}
  function resolveTaskContext(task){var x=task||{},l=link({subjectId:x.subjectId||x.subject_id,topicId:x.topicId||x.topic_id});return {subject:l.subject,topic:l.topic,concept:l.concept,subjectId:l.subjectId,topicId:l.topicId,subjectTitle:l.subject&&(l.subject.name||l.subject.title)||'',topicTitle:l.topic&&(l.topic.title||l.topic.name)||''}}
  async function createActivity(x){var a=activity(x);var v=E.validate('studyActivity',a);if(!v.ok)throw new Error('Invalid studyActivity: '+v.errors.join(','));return R.studyActivities.upsert(a)}
  async function getActivity(id){return R.studyActivities.getById(id)}
  async function listActivities(filters){var a=await R.studyActivities.getAll();filters=filters||{};return a.filter(function(x){return (!filters.subjectId||x.subjectId===filters.subjectId)&&(!filters.topicId||x.topicId===filters.topicId)&&(!filters.conceptId||x.conceptId===filters.conceptId)})}
  function health(){return {version:'84.0',entities:!!E,repositories:!!R,state:!!state(),unifiedLinks:true}}
  global.WWAcademicGraph={version:'84.0',subject:subject,topic:topic,concept:concept,chapterPath:chapterPath,link:link,graph:graph,resolveTaskContext:resolveTaskContext,activity:activity,createActivity:createActivity,getActivity:getActivity,listActivities:listActivities,health:health};
})(window);
