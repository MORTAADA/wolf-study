/* WHITE WOLF SCHOLAR V93.2 — Unified Activities Core */
(function(){
  'use strict';
  var TYPES={study:{label:'Étude',icon:'📚',group:'academic'},task:{label:'Task',icon:'✅',group:'work'},growth:{label:'Growth',icon:'🌱',group:'personal'},sport:{label:'Sport',icon:'🏋️',group:'personal'},project:{label:'Projet',icon:'🚀',group:'work'},personal:{label:'Personnel',icon:'👤',group:'personal'},research:{label:'Recherche',icon:'🔬',group:'academic'}};
  function ensure(state){if(!Array.isArray(state.activities))state.activities=[];return state.activities}
  function create(state,input){input=input||{};var type=TYPES[input.type]?input.type:'personal';var start=input.startedAt||new Date().toISOString();return {id:input.id||('act_'+Date.now()+'_'+Math.random().toString(36).slice(2,8)),type:type,title:String(input.title||TYPES[type].label),status:input.status||'completed',date:input.date||start.slice(0,10),duration:Math.max(0,Math.floor(Number(input.duration)||0)),started_at:start,ended_at:input.endedAt||null,subjectId:input.subjectId||null,topicId:input.topicId||null,taskId:input.taskId||null,source:input.source||'focus',academicSessionId:input.academicSessionId||null,notes:String(input.notes||'').trim(),created_at:input.createdAt||new Date().toISOString()}}
  function add(state,input){var list=ensure(state),a=create(state,input);list.push(a);return a}
  function complete(state,input){input=input||{};input.status='completed';return add(state,input)}
  function byDate(state,date){return ensure(state).filter(function(a){return a.date===date})}
  function minutes(state,from,to){var list=ensure(state);return list.reduce(function(n,a){if(from&&a.date<from)return n;if(to&&a.date>to)return n;return n+(Number(a.duration)||0)},0)}
  function remove(state,id){var list=ensure(state),i=list.findIndex(function(a){return a.id===id});if(i<0)return false;list.splice(i,1);return true}
  window.WWActivities={TYPES:TYPES,ensure:ensure,create:create,add:add,complete:complete,byDate:byDate,minutes:minutes,remove:remove,version:'93.2.0'};
})();
