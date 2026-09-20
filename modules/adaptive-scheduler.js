/* WHITE WOLF SCHOLAR V86 — Adaptive Scheduler
 * Explainable, read-only scheduler. Produces ranked task/session suggestions without mutating user data.
 */
(function(global){
  'use strict';
  var DAY=86400000;
  function state(){return global.WWAppCore&&global.WWAppCore.state||global.state||null}
  function num(v,d){var n=Number(v);return Number.isFinite(n)?n:(d||0)}
  function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
  function dateKey(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function daysUntil(date,time){if(!date)return 999;var d=new Date(String(date)+'T'+(time||'23:59')+':00');if(isNaN(d.getTime()))return 999;var now=new Date();if(d.getTime()<now.getTime())return -1;var today=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();var target=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();return Math.round((target-today)/DAY)}
  function priority(v){return ({Haute:30,High:30,Moyenne:18,Medium:18,Basse:8,Low:8}[v]||12)}
  function topicForTask(s,t){var g=global.WWAcademicGraph;if(g&&g.resolveTaskContext){try{return g.resolveTaskContext(t,s)}catch(e){}}var topicId=t&&(t.topicId||t.topic_id);return topicId?(s.topics||[]).find(function(x){return x.id===topicId})||null:null}
  function mastery(s,topic){if(!topic)return 50;try{if(global.WWMastery&&global.WWMastery.score)return global.WWMastery.score(s,topic.id)}catch(e){}var p=(s.progress&&s.progress[topic.id])||{};return clamp(num(p.level)*25,0,100)}
  function revisionSignals(s,topic){if(!topic)return null;try{if(global.WWAdaptiveRevision&&global.WWAdaptiveRevision.scoreTopic)return global.WWAdaptiveRevision.scoreTopic(s,topic)}catch(e){}return null}
  function sessionHistory(s,topic){var ss=(s.sessions||[]).filter(function(x){return topic&&x.topic_id===topic.id});var mins=ss.reduce(function(a,x){return a+num(x.duration)},0);var hours={};ss.forEach(function(x){var d=new Date(String(x.date||'')+'T'+(x.started_at?String(x.started_at).slice(11,16):'12:00'));if(!isNaN(d.getTime())){var h=d.getHours();hours[h]=(hours[h]||0)+num(x.duration)}});var best=null;Object.keys(hours).forEach(function(h){if(best===null||hours[h]>hours[best])best=h});return {sessions:ss.length,minutes:mins,bestHour:best===null?null:Number(best)}}
  function taskInStudyScope(s,t){var topicId=t&&(t.topicId||t.topic_id),subjectId=t&&(t.subjectId||t.subject_id);if(!topicId&&!subjectId)return true;var topics=Array.isArray(s.topics)?s.topics:[],topic=topicId?topics.find(function(x){return x&&x.id===topicId}):null;if(topic){if(s.studyScope&&s.studyScope.topics&&Object.prototype.hasOwnProperty.call(s.studyScope.topics,topic.id))return s.studyScope.topics[topic.id]===true;if(s.studyScope&&s.studyScope.subjects&&Object.prototype.hasOwnProperty.call(s.studyScope.subjects,topic.subject_id))return s.studyScope.subjects[topic.subject_id]===true;return true}if(subjectId&&s.studyScope&&s.studyScope.subjects&&Object.prototype.hasOwnProperty.call(s.studyScope.subjects,subjectId))return s.studyScope.subjects[subjectId]===true;return true}
  function taskScore(s,t,now){var score=priority(t.priority),reasons=[];var due=daysUntil(t.date,t.deadlineTime);if(due<0){score+=40;reasons.push('متأخرة')}else if(due===0){score+=35;reasons.push('موعدها اليوم')}else if(due===1){score+=25;reasons.push('الموعد غدًا')}else if(due<=3){score+=15;reasons.push('الموعد خلال '+due+' أيام')}var topic=topicForTask(s,t),m=mastery(s,topic),rev=revisionSignals(s,topic);if(topic){if(m<40){score+=24;reasons.push('إتقان منخفض '+Math.round(m)+'%')}else if(m<65){score+=12;reasons.push('إتقان يحتاج تعزيزًا')}if(rev&&rev.score>=50){score+=Math.min(20,Math.round(rev.score*.2));reasons.push('أولوية مراجعة تكيفية '+rev.score)}}var est=num(t.estimatedMinutes,30);if(est>=90){score-=3;reasons.push('مهمة طويلة '+Math.round(est)+' دقيقة')}var h=sessionHistory(s,topic);if(h.bestHour!==null)reasons.push('أفضل أداء مسجل قرب '+String(h.bestHour).padStart(2,'0')+':00');if(t.time)reasons.push('وقت البداية محدد '+t.time);return {score:Math.round(clamp(score,0,100)),reasons:reasons,topic:topic,mastery:Math.round(m),revision:rev,history:h,dueDays:due,minutes:est}}
  function rankTasks(tasks){var s=state()||{},now=new Date();return (tasks||[]).filter(function(t){return t&&!t.isDone&&!['done','completed'].includes(String(t.status||'').toLowerCase())&&taskInStudyScope(s,t)}).map(function(t){var x=taskScore(s,t,now);return {task:t,score:x.score,reasons:x.reasons,topic:x.topic,mastery:x.mastery,revision:x.revision,history:x.history,dueDays:x.dueDays,minutes:x.minutes}}).sort(function(a,b){return b.score-a.score||a.dueDays-b.dueDays||a.minutes-b.minutes})}
  function recommend(tasks,freeWindows,limit){
    var ranked=rankTasks(tasks),windows=(freeWindows||[]).map(function(x){return [x[0],x[1]]}),out=[];
    ranked.slice(0,limit||8).forEach(function(r){
      var left=r.minutes,alloc=[],t=r.task||{},start=t.time?((global.WWTimeEngine&&global.WWTimeEngine.parse)?global.WWTimeEngine.parse(t.time):null):null;
      var deadline=null;
      if(t.deadlineTime){deadline=(global.WWTimeEngine&&global.WWTimeEngine.parse)?global.WWTimeEngine.parse(t.deadlineTime):null;}
      for(var i=0;i<windows.length&&left>0;i++){
        var a=windows[i][0],b=windows[i][1];
        if(start!=null)a=Math.max(a,start);
        if(deadline!=null)b=Math.min(b,deadline);
        if(b-a<15)continue;
        var take=Math.min(left,b-a);
        if(take>0){alloc.push([a,a+take]);left-=take;}
        // Consume the original free window only by the allocated amount. This
        // keeps capacity available for later tasks while never crossing a task's
        // explicit start/deadline constraints.
        windows[i][0]=Math.max(windows[i][0],a+take);
      }
      out.push({task:r.task,score:r.score,reasons:r.reasons,topic:r.topic,mastery:r.mastery,revision:r.revision,history:r.history,dueDays:r.dueDays,minutes:r.minutes,allocated:alloc,remaining:left,feasible:left<=0});
    });
    return out;
  }
  function dailyBrief(tasks,freeWindows){var ranked=rankTasks(tasks),capacity=(freeWindows||[]).reduce(function(a,x){return a+x[1]-x[0]},0),required=ranked.reduce(function(a,x){return a+x.minutes},0);return {date:dateKey(),capacity:capacity,required:required,overloaded:required>capacity,ranked:ranked,recommendations:recommend(tasks,freeWindows,8),generatedAt:new Date().toISOString()}}
  global.WWAdaptiveScheduler={version:'86.0',rankTasks:rankTasks,recommend:recommend,dailyBrief:dailyBrief,taskScore:taskScore,taskInStudyScope:taskInStudyScope};
})(window);
