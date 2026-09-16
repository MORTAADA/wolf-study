/* WHITE WOLF V63.0 — Study Analytics Engine
 * Read-only analytical layer over recorded study sessions, errors and mastery.
 * It never mutates Planning or academic progression.
 */
(function(global){
  'use strict';
  function num(v){var n=Number(v);return Number.isFinite(n)?n:0}
  function dateKey(v){
    if(!v)return '';
    var s=String(v);
    if(/^\d{4}-\d{2}-\d{2}/.test(s))return s.slice(0,10);
    var d=new Date(v);if(isNaN(d.getTime()))return '';
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function daysAgo(n,base){var d=new Date(base||new Date());d.setHours(12,0,0,0);d.setDate(d.getDate()-n);return dateKey(d)}
  function sessions(state){return (state.sessions||[]).filter(function(s){return num(s.duration)>0&&dateKey(s.date)})}
  function dayMap(state){var out={};sessions(state).forEach(function(s){var k=dateKey(s.date);out[k]=(out[k]||0)+num(s.duration)});return out}
  function rangeMinutes(state,days,offset){var map=dayMap(state),total=0,count=0,active=0,base=offset||0;for(var i=base;i<base+days;i++){var m=map[daysAgo(i)];total+=m||0;if(m>0)active++;count++}return{minutes:total,activeDays:active,days:count}}
  function streak(state){var map=dayMap(state),n=0;for(var i=0;i<366;i++){var m=map[daysAgo(i)];if(m>0)n++;else if(i>0)break}return n}
  function bestRun(state,windowDays){var map=dayMap(state),best=0,run=0,limit=windowDays||365;for(var i=limit-1;i>=0;i--){if(map[daysAgo(i)]>0){run++;if(run>best)best=run}else run=0}return best}
  function weekComparison(state){var cur=rangeMinutes(state,7,0),prev=rangeMinutes(state,7,7),delta=prev.minutes?Math.round((cur.minutes-prev.minutes)/prev.minutes*100):(cur.minutes?100:0);return{current:cur,previous:prev,delta:delta}}
  function subjectBreakdown(state){var map={};sessions(state).forEach(function(s){if(!s.subject_id)return;var sub=(state.subjects||[]).find(function(x){return x.id===s.subject_id});var key=s.subject_id;if(!map[key])map[key]={id:key,name:sub?sub.name:'Matière inconnue',minutes:0,sessions:0};map[key].minutes+=num(s.duration);map[key].sessions++});return Object.keys(map).map(function(k){var x=map[k];x.avg=Math.round(x.minutes/Math.max(1,x.sessions));return x}).sort(function(a,b){return b.minutes-a.minutes})}
  function topicBreakdown(state){var map={};sessions(state).forEach(function(s){if(!s.topic_id)return;var t=(state.topics||[]).find(function(x){return x.id===s.topic_id});if(!map[s.topic_id])map[s.topic_id]={id:s.topic_id,name:t?t.title:'Chapitre inconnu',subjectId:t?t.subject_id:null,minutes:0,sessions:0};map[s.topic_id].minutes+=num(s.duration);map[s.topic_id].sessions++});return Object.keys(map).map(function(k){var x=map[k];var m=global.WWMastery&&state.mastery?global.WWMastery.evidence(state,k):null;x.mastery=m?m.stage:((state.progress&&state.progress[k]||{}).level||0);x.score=global.WWMastery?global.WWMastery.score(state,k):x.mastery*25;x.avg=Math.round(x.minutes/Math.max(1,x.sessions));return x}).sort(function(a,b){return a.score-b.score||b.minutes-a.minutes})}
  function masteryDistribution(state){var d=[0,0,0,0,0];(state.topics||[]).forEach(function(t){var l=global.WWMastery&&state.mastery?global.WWMastery.ensure(state,t.id).stage:((state.progress&&state.progress[t.id]||{}).level||0);l=Math.max(0,Math.min(4,Number(l)||0));d[l]++});return d}
  function errorStats(state){var e=state.errors||[],byStatus={to_review:0,in_progress:0,mastered:0};e.forEach(function(x){if(byStatus[x.status]!==undefined)byStatus[x.status]++});var due=e.filter(function(x){if(!x.next_review)return true;var d=new Date(x.next_review);return isNaN(d.getTime())||d.getTime()<=Date.now()}).length;return{total:e.length,due:due,byStatus:byStatus}}
  function hardestTopics(state,limit){var topics=topicBreakdown(state);var errors=state.errors||[];topics.forEach(function(t){var es=errors.filter(function(e){return e.topic_id===t.id||((state.topics||[]).find(function(x){return x.id===t.id})||{}).subject_id===e.subject_id});t.errors=es.length;t.unresolved=es.filter(function(e){return e.status!=='mastered'}).length;t.heat=Math.round(t.unresolved*12+t.errors*4+Math.max(0,50-t.score));});return topics.sort(function(a,b){return b.heat-a.heat}).slice(0,limit||5)}
  function dailySeries(state,days){var map=dayMap(state),out=[];for(var i=(days||14)-1;i>=0;i--){var k=daysAgo(i);out.push({date:k,minutes:map[k]||0})}return out}
  function dataQuality(state){var ss=state.sessions||[],valid=0,invalid=0,orphanTopicSessions=0;ss.forEach(function(x){if(num(x.duration)<=0||!dateKey(x.date)){invalid++;return}valid++;if(x.topic_id&&!((state.topics||[]).find(function(t){return t.id===x.topic_id})))orphanTopicSessions++;});return{sessions:ss.length,valid:valid,invalid:invalid,orphanTopicSessions:orphanTopicSessions}}
  function summary(state){var ss=sessions(state),total=ss.reduce(function(a,s){return a+num(s.duration)},0),w=rangeMinutes(state,7,0),cmp=weekComparison(state),es=errorStats(state);return{totalMinutes:total,totalHours:Math.round(total/60*10)/10,sessions:ss.length,weekMinutes:w.minutes,weekSessions:ss.filter(function(s){return daysAgo(6)<=dateKey(s.date)}).length,streak:streak(state),bestRun28:bestRun(state,28),comparison:cmp,errors:es,mastery:masteryDistribution(state),activeDays:w.activeDays,quality:dataQuality(state)}}
  global.WWAnalytics={version:'63.0',sessions:sessions,dayMap:dayMap,rangeMinutes:rangeMinutes,streak:streak,bestRun:bestRun,weekComparison:weekComparison,subjectBreakdown:subjectBreakdown,topicBreakdown:topicBreakdown,masteryDistribution:masteryDistribution,errorStats:errorStats,hardestTopics:hardestTopics,dailySeries:dailySeries,dataQuality:dataQuality,summary:summary};
})(window);
