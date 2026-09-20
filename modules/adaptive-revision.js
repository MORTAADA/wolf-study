/* WHITE WOLF V63.2 — Adaptive Revision Engine
 * Read-only planner over Planning, sessions, errors, mastery and exams.
 * It produces explainable revision priorities; it never changes Planning automatically.
 */
(function(global){
  'use strict';
  function num(v){var n=Number(v);return Number.isFinite(n)?n:0}
  function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
  function dateKey(v){if(!v)return '';var s=String(v);if(/^\d{4}-\d{2}-\d{2}/.test(s))return s.slice(0,10);var d=new Date(v);if(isNaN(d.getTime()))return '';return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function daysSince(v){if(!v)return 999;var d=new Date(v);if(isNaN(d.getTime()))return 999;return Math.max(0,Math.floor((Date.now()-d.getTime())/86400000))}
  function topicProgress(state,id){var p=(state.progress&&state.progress[id])||{};return {level:clamp(num(p.level),0,4),lastStudied:p.last_studied||null}}
  function topicEvidence(state,id){var m=global.WWMastery&&state.mastery?global.WWMastery.evidence(state,id):null;return m||{stage:topicProgress(state,id).level,sessions:0,studyMinutes:0,errorCount:0,errorSuccess:0,reviewCount:0}}
  function topicActive(state,topic){return !!(topic&&state.studyScope&&state.studyScope.topics&&Object.prototype.hasOwnProperty.call(state.studyScope.topics,topic.id)?state.studyScope.topics[topic.id]:(state.studyScope&&state.studyScope.subjects&&state.studyScope.subjects[topic.subject_id]===true));}
  function unresolvedErrors(state,topic){return (state.errors||[]).filter(function(e){return e.status!=='mastered'&&(e.topic_id===topic.id||(!e.topic_id&&e.subject_id===topic.subject_id))})}
  function nearestExam(state,subjectId){var now=Date.now(),best=null; (state.exams||[]).forEach(function(e){if(subjectId&&e.subject_id&&e.subject_id!==subjectId)return;var d=new Date(String(e.date||'')+'T'+(e.time||'23:59'));if(isNaN(d.getTime())||d.getTime()<now)return;if(!best||d.getTime()<best.ts)best={exam:e,ts:d.getTime(),days:Math.ceil((d.getTime()-now)/86400000)} });return best}
  function scoreTopic(state,topic){if(!topicActive(state,topic))return null;var p=topicProgress(state,topic.id),e=topicEvidence(state,topic.id),errors=unresolvedErrors(state,topic),need=global.WWMastery&&global.WWMastery.needsReview?global.WWMastery.needsReview(state,topic.id):null,score=0,reasons=[];
    if(errors.length){score+=Math.min(38,18+errors.length*7);reasons.push(errors.length+' erreur'+(errors.length>1?'s':'')+' non maîtrisée'+(errors.length>1?'s':''))}
    score+=Math.max(0,(4-p.level)*9);if(p.level<4)reasons.push('maîtrise niveau '+p.level+'/4');
    var stale=daysSince(p.lastStudied);if(stale>=7){score+=Math.min(20,8+Math.floor(stale/3));reasons.push(stale===999?'jamais étudié':'non étudié depuis '+stale+' j')}
    else if(stale>=3){score+=8;reasons.push('révision récente à consolider')}
    if(e.sessions===0){score+=6;reasons.push('aucune session enregistrée')}
    if(need&&need.needed){score+=Math.min(18,Math.round(need.score*.18));reasons.push('besoin de révision '+Math.round(need.score)+'%')}
    if(e.quizAttempts){if(e.quizRate<55){score+=12;reasons.push('rappel faible au quiz '+e.quizRate+'%')}else if(e.quizRate>=80){score-=3;reasons.push('rappel solide au quiz '+e.quizRate+'%')}}
    var ex=nearestExam(state,topic.subject_id);if(ex){if(ex.days<=1){score+=22;reasons.push('examen dans ≤ 1 j')}else if(ex.days<=3){score+=18;reasons.push('examen dans '+ex.days+' j')}else if(ex.days<=7){score+=12;reasons.push('examen dans '+ex.days+' j')}else if(ex.days<=14){score+=6;reasons.push('examen dans '+ex.days+' j')}}
    return {type:'topic',topicId:topic.id,subjectId:topic.subject_id,title:topic.title,level:p.level,score:Math.round(clamp(score,0,100)),reasons:reasons,errors:errors.length,exam:ex?ex.exam:null,duration:errors.length?20:(need&&need.score>=70?30:(p.level<=1?30:25))};
  }
  function errorItems(state){var out=[];(state.errors||[]).filter(function(e){return e.status!=='mastered'}).forEach(function(e){var topic=e.topic_id?(state.topics||[]).find(function(t){return t.id===e.topic_id}):null;if(topic&&!topicActive(state,topic))return;if(!topic&&e.subject_id&&!(state.studyScope&&state.studyScope.subjects&&state.studyScope.subjects[e.subject_id]===true))return;var overdue=0;if(e.next_review){var d=new Date(e.next_review);if(!isNaN(d.getTime()))overdue=Math.max(0,Math.floor((Date.now()-d.getTime())/86400000))}else overdue=1;var score=32+Math.min(28,overdue*7)+(e.difficulty==='hard'?10:e.difficulty==='easy'?0:5)+(e.revisions===0?8:0);var ex=nearestExam(state,topic?topic.subject_id:e.subject_id);if(ex&&ex.days<=7)score+=Math.max(0,14-ex.days*2);var reasons=[];if(overdue>0)reasons.push(overdue+' j de retard');else reasons.push('révision due');if(e.revisions===0)reasons.push('jamais révisée');if(topic)reasons.push(topic.title);if(ex&&ex.days<=7)reasons.push('examen dans '+ex.days+' j');out.push({type:'error',errorId:e.id,topicId:topic?topic.id:null,subjectId:e.subject_id||null,title:e.description,level:topic?topicProgress(state,topic.id).level:null,score:Math.round(clamp(score,0,100)),reasons:reasons,errors:1,exam:ex?ex.exam:null,duration:10});});return out}
  function build(state,limit){var topics=(state.topics||[]).map(function(t){return scoreTopic(state,t)}).filter(Boolean),items=errorItems(state).concat(topics.filter(function(t){return t.score>=25}));
    items.sort(function(a,b){return b.score-a.score||((a.type==='error'?0:1)-(b.type==='error'?0:1))});
    var seen={},topicHasError={};items.forEach(function(x){if(x.type==='error'&&x.topicId)topicHasError[x.topicId]=1});var out=[];items.forEach(function(x){var key=x.type==='error'?'e:'+x.errorId:'t:'+x.topicId;if(seen[key])return;if(x.type==='topic'&&topicHasError[x.topicId])return;seen[key]=1;out.push(x)});
    return out.slice(0,limit||8);
  }
  function summary(state){var q=build(state,8),minutes=q.reduce(function(a,x){return a+x.duration},0),errors=q.filter(function(x){return x.type==='error'}).length,topics=q.filter(function(x){return x.type==='topic'}).length;return {queue:q,total:q.length,estimatedMinutes:minutes,errors:errors,topics:topics,generatedAt:new Date().toISOString()}}
  global.WWAdaptiveRevision={version:'87.0',build:build,summary:summary,scoreTopic:scoreTopic,errorItems:errorItems};
})(window);
