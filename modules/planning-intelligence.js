/* White Wolf Scholar V80.3 — Planning Intelligence
 * Tasks are planning inputs. Planning Hebdo remains the source of truth.
 */
(function(){'use strict';
  var DAYS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  var LABELS={lundi:'Lundi',mardi:'Mardi',mercredi:'Mercredi',jeudi:'Jeudi',vendredi:'Vendredi',samedi:'Samedi',dimanche:'Dimanche'};
  function S(){return window.WWAppCore&&window.WWAppCore.state||window.state||null}
  function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function day(){return DAYS[new Date().getDay()]}
  function mins(v){var p=String(v||'').split(':').map(Number);return Number.isFinite(p[0])?p[0]*60+(p[1]||0):null}
  function fmt(n){return String(Math.floor(n/60)).padStart(2,'0')+':'+String(Math.round(n%60)).padStart(2,'0')}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function plan(){var s=S()||{};return Object.assign({},window.DEFAULT_SCHEDULE||{},s.customSchedule||{})}
  function split(v){return String(v||'').split(/\s*(?:\+|•|;|\n)\s*/).map(function(x){return x.trim()}).filter(Boolean)}
  function estimate(x){x=String(x||'').toLowerCase();if(/repos|pause|gym|sport|🛌/.test(x))return 0;if(/python|programm|git|code|oop|dsa/.test(x))return 60;if(/révision|revision|exercices|td|tp|quiz/.test(x))return 60;if(/spectro|chimie|analyse|chromato|génie|energie|énerg/.test(x))return 50;return 45}
  function taskMinutes(t){var n=Number(t&&t.estimatedMinutes);return n>0?Math.min(1440,n):30}
  function planningItems(){return split(plan()[day()]).filter(function(x){return !/^repos$/i.test(x)})}
  function tasks(){var s=S()||{};return (Array.isArray(s.tasks)?s.tasks:[]).filter(function(t){return t&&t.date===today()&&!t.isDone})}
  function classBusy(){var a=Array.isArray(window.COURSE_SCHEDULE)?window.COURSE_SCHEDULE:[],d=day();return a.filter(function(c){return c.day===d}).map(function(c){return [mins(c.start),mins(c.end)]}).filter(function(x){return x[0]!=null&&x[1]>x[0]}).sort(function(a,b){return a[0]-b[0]})}
  function free(){var busy=classBusy(),base=[[7*60,12*60],[13*60,19*60],[20*60,23*60]],out=[];base.forEach(function(w){var c=w[0];busy.forEach(function(b){if(b[1]<=c||b[0]>=w[1])return;if(b[0]>c)out.push([c,Math.min(b[0],w[1])]);c=Math.max(c,b[1])});if(c<w[1])out.push([c,w[1]])});return out.filter(function(x){return x[1]-x[0]>=25})}
  function assess(){var cap=free().map(function(x){return x.slice()});return tasks().sort(function(a,b){var p={Haute:0,Moyenne:1,Basse:2};return (p[a.priority]??1)-(p[b.priority]??1)}).map(function(t){var need=taskMinutes(t),left=need,deadline=mins(t.deadlineTime),alloc=[];for(var i=0;i<cap.length&&left>0;i++){var end=deadline==null?cap[i][1]:Math.min(cap[i][1],deadline);if(end<=cap[i][0])continue;var take=Math.min(left,end-cap[i][0]);if(take>0){alloc.push([cap[i][0],cap[i][0]+take]);cap[i][0]+=take;left-=take}}return{task:t,minutes:need,deadline:deadline,feasible:left<=0,allocated:alloc,remaining:left}})}
  function html(){var a=assess(), pi=planningItems(), fr=free(), pmins=pi.reduce(function(n,x){return n+estimate(x)},0), tmins=a.reduce(function(n,x){return n+x.minutes},0), conflicts=a.filter(function(x){return !x.feasible}).length;
    var planRows=pi.map(function(x){return '<div class="ww-pi-row"><span>📋</span><div><b>'+esc(x)+'</b><small>جزء من Planning Hebdo · ~'+estimate(x)+' min</small></div></div>'}).join('')||'<div class="ww-pi-empty">لا توجد مهمة أكاديمية مخططة اليوم.</div>';
    var taskRows=a.map(function(x){return '<div class="ww-pi-row '+(x.feasible?'':'conflict')+'"><span>'+(x.feasible?'📝':'⚠️')+'</span><div><b>'+esc(x.task.text)+'</b><small>'+x.minutes+' min'+(x.deadline!=null?' · deadline '+fmt(x.deadline):' · بدون deadline')+(x.feasible?' · يمكن استيعابها في الوقت المتاح':' · الوقت المتاح قبل deadline غير كافٍ')+'</small></div></div>'}).join('')||'<div class="ww-pi-empty">لا توجد مهام مفتوحة اليوم.</div>';
    var freeRows=fr.slice(0,6).map(function(x){return '<span>'+fmt(x[0])+'–'+fmt(x[1])+'</span>'}).join('')||'<span>لا يوجد créneau libre ≥ 25 min</span>';
    return '<section class="ww-planning-intelligence card"><div class="ww-pi-head"><div><div class="card-title">🧠 Planning Intelligence</div><div class="ww-pi-sub">Planning Hebdo = Source of Truth · les tâches sont des contraintes analysées, jamais des modifications silencieuses.</div></div><strong>'+(conflicts?'⚠️ '+conflicts+' conflit'+(conflicts>1?'s':''):'✓ OK')+'</strong></div><div class="ww-pi-grid"><div><span>📋 Planning</span><b>~'+pmins+' min</b></div><div><span>📝 Tâches</span><b>~'+tmins+' min</b></div><div><span>🕐 Temps libre</span><b>~'+fr.reduce(function(n,x){return n+x[1]-x[0]},0)+' min</b></div><div><span>🎯 Entrées</span><b>'+a.length+'</b></div></div><div class="ww-pi-section"><div class="ww-pi-title">🎯 Mission issue du Planning</div>'+planRows+'</div><div class="ww-pi-section"><div class="ww-pi-title">📝 Tâches intégrées à l’analyse</div>'+taskRows+'</div><div class="ww-pi-section"><div class="ww-pi-title">🕐 Créneaux disponibles</div><div class="ww-pi-free">'+freeRows+'</div></div>'+(conflicts?'<div class="ww-pi-conflict">⚠️ <b>Planning Conflict</b> — une ou plusieurs tâches ne tiennent pas dans les créneaux disponibles avant leur deadline. White Wolf ne déplace pas automatiquement ton Planning.</div>':'<div class="ww-pi-ok">✓ Les tâches ouvertes ont été prises en compte dans l’analyse de la journée.</div>')+'</section>';
  }
  window.WWPlanningIntelligence={renderHTML:html,summary:function(){return{planningItems:planningItems(),tasks:tasks(),assessment:assess(),freeWindows:free()}}};
})();
