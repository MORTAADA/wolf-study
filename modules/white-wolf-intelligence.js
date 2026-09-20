/* WHITE WOLF SCHOLAR V91 — White Wolf Intelligence
 * Read-only orchestration layer: Planning + Emploi + Tasks + Mastery + Revision + Scheduler.
 * It recommends; it never mutates the user's plan or tasks automatically.
 */
(function(global){'use strict';
  function state(){return global.WWAppCore&&global.WWAppCore.state||global.state||null}
  function mins(x){if(global.WWTimeEngine&&global.WWTimeEngine.parse)return global.WWTimeEngine.parse(x);var m=String(x||'').match(/^(\d{1,2}):(\d{2})$/);return m?Number(m[1])*60+Number(m[2]):null}
  function fmt(n){return global.WWTimeEngine&&global.WWTimeEngine.format?global.WWTimeEngine.format(n):String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function snapshot(){
    var s=state()||{}, p=global.WWPlanningIntelligence, z=p&&p.summary?p.summary():null;
    var tasks=z?(z.activeTasks||z.tasks):((s.tasks||[]).filter(function(t){return t&&!t.isDone}));
    var brief=z&&z.adaptive?z.adaptive:(global.WWAdaptiveScheduler&&global.WWAdaptiveScheduler.dailyBrief?global.WWAdaptiveScheduler.dailyBrief(tasks,z?z.availableNow:[]):null);
    var rec=(brief&&brief.recommendations||[]).filter(function(x){return x&&x.allocated&&x.allocated.length});
    var now=rec[0]||null;
    var next=rec.slice(0,5);
    var due=(tasks||[]).filter(function(t){var d=mins(t.deadlineTime);return d!=null}).sort(function(a,b){return mins(a.deadlineTime)-mins(b.deadlineTime)});
    var revision=[];
    try{var ar=global.WWAdaptiveRevision;if(ar){if(ar.getDueTopics){revision=ar.getDueTopics(s)||[]}else if(ar.summary){var rs=ar.summary(s);revision=(rs&&rs.queue)||[]}}}catch(e){}
    return {summary:z,brief:brief,now:now,next:next,tasks:tasks,deadlineTask:due[0]||null,revision:revision,generatedAt:new Date().toISOString()};
  }
  function current(){var x=snapshot(),z=x.summary||{},now=x.now, status='متوازن', detail='لا توجد أولوية حرجة مكتشفة الآن.';
    if(x.brief&&x.brief.overloaded){status='ضغط مرتفع';detail='الوقت المطلوب للمهام يتجاوز السعة الحرة الحالية؛ الاقتراحات لا تغيّر جدولك تلقائيًا.'}
    else if(now){status='اقتراح جاهز';detail='هذا الاقتراح يجمع الأولوية والموعد النهائي والإتقان ووقت الفراغ المتاح.'}
    else if(z.availableNowMinutes===0){status='لا توجد نافذة الآن';detail='انتظر أول نافذة حرة بعد Emploi والالتزامات والنوم.'}
    return {status:status,detail:detail,task:now};
  }
  function html(){var x=snapshot(),z=x.summary||{},c=current(),task=c.task;
    var allocated=task&&task.allocated||[];
    var reasons=task&&task.reasons||[];
    var plan=allocated.length?allocated.map(function(a){return '<span class="ww-wi-chip">'+fmt(a[0])+'–'+fmt(a[1])+'</span>'}).join(''):'<span class="ww-wi-muted">لا توجد جلسة مقترحة الآن</span>';
    var rows=(x.next||[]).map(function(r){var slots=(r.allocated||[]).map(function(a){return fmt(a[0])+'–'+fmt(a[1])}).join(' · ');return '<div class="ww-wi-row"><div><b>'+esc(r.task.text)+'</b><small>'+slots+' · '+r.minutes+' min</small></div><em>'+esc((r.reasons||[]).slice(0,2).join(' · ')||'إشارة أكاديمية متاحة')+'</em></div>'}).join('');
    if(!rows)rows='<div class="ww-wi-muted">لا توجد مهام قابلة للجدولة في النوافذ الحرة الحالية.</div>';
    var revCount=0; try { var ar=global.WWAdaptiveRevision; if(ar&&ar.summary){ var rs=ar.summary(state()||{}); revCount=Number(rs&&rs.total||rs&&rs.dueCount||rs&&rs.count||((rs&&rs.queue)||[]).length)||0; } } catch(e) {}
    return '<section class="ww-white-wolf-intelligence card"><div class="ww-wi-head"><div><div class="card-title">🐺 White Wolf Intelligence</div><div class="ww-wi-sub">Mastery + Revision + Tasks + Emploi + Time Engine → Daily Plan</div></div><span class="ww-wi-status">'+esc(c.status)+'</span></div><div class="ww-wi-hero"><div class="ww-wi-kicker">الخطوة المقترحة الآن</div><strong>'+(task?esc(task.task.text):'لا توجد مهمة فورية')+'</strong><div class="ww-wi-meta">'+plan+' '+(task?' · '+task.minutes+' min · Score '+task.score:'')+'</div><div class="ww-wi-reasons">'+(reasons.slice(0,3).map(function(r){return '<span>• '+esc(r)+'</span>'}).join('')||'<span>'+esc(c.detail)+'</span>')+'</div></div><div class="ww-wi-stats"><div><span>🕐 متاح الآن</span><b>'+Number(z.availableNowMinutes||0)+' min</b></div><div><span>📝 مطلوب اليوم</span><b>'+Number(z.taskMinutes||0)+' min</b></div><div><span>📚 Revision</span><b>'+revCount+' إشارات</b></div><div><span>😴 Sleep</span><b>'+(z.timeConstraints?(z.timeConstraints.sleepStart+' → '+z.timeConstraints.wakeTime):'23:00 → 05:00')+'</b></div></div><div class="ww-wi-section"><div class="ww-wi-title">🧠 ترتيب اليوم</div>'+rows+'</div><div class="ww-wi-note">اقتراحات White Wolf لا تعدّل Planning أو Tasks تلقائيًا. القبول/التنفيذ يبقى بقرارك.</div></section>';
  }
  global.WWWhiteWolfIntelligence={version:'92.6.0',snapshot:snapshot,current:current,renderHTML:html};
})(window);
