/* White Wolf Scholar V80.4 — Notification Core
 * Deterministic reminders, future-date aware deadlines, deduplication,
 * quiet hours, notification center state, and Web Push receiver integration.
 * Planning remains the source of truth; this module never edits planning.
 */
(function(){'use strict';
var KEY='wwNotificationSystemV807';
var DEFAULTS={enabled:true,categories:{planning:true,tasks:true,exams:true,review:true,resources:false,intelligence:false,progress:false,streak:false,weekly:true},timings:{deadline:[1440,360,60,15],session:[15],exam:[10080,4320,1440,0],review:[0]},quietHours:{enabled:false,start:'22:00',end:'07:00'},push:{enabled:false,endpoint:'',vapidPublicKey:''}};
function clone(x){return JSON.parse(JSON.stringify(x));}
function load(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null')||{};return Object.assign(clone(DEFAULTS),x,{categories:Object.assign({},DEFAULTS.categories,x.categories||{}),timings:Object.assign({},DEFAULTS.timings,x.timings||{}),quietHours:Object.assign({},DEFAULTS.quietHours,x.quietHours||{}),push:Object.assign({},DEFAULTS.push,x.push||{})});}catch(e){return clone(DEFAULTS)}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch(e){}}
function toMin(v){var p=String(v||'').split(':');return Number(p[0]||0)*60+Number(p[1]||0)}
function isoDate(d){if(window.wwLocalDateISO)return window.wwLocalDateISO(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function dateTime(date,time){if(!date)return null;var v=String(date)+'T'+(time||'23:59');var d=new Date(v);return isNaN(d.getTime())?null:d}
function quiet(s,now){if(!s.quietHours.enabled)return false;var a=toMin(s.quietHours.start),b=toMin(s.quietHours.end),m=now.getHours()*60+now.getMinutes();return a<b?m>=a&&m<b:m>=a||m<b}
function permission(){if(!('Notification' in window))return Promise.resolve('unsupported');if(Notification.permission==='granted')return Promise.resolve('granted');return Notification.requestPermission()}
function add(out,s,id,cat,type,icon,title,text,now,extra){if(!s.enabled||!s.categories[cat])return;out.push(Object.assign({id:id,category:cat,type:type,icon:icon,title:title,text:text,date:isoDate(now),when:now.toISOString()},extra||{}))}
function wasCrossed(diff, threshold, prevDiff){
  // Fire when the countdown enters the threshold window, even if a 60s tick jumps over the exact minute.
  if(diff<0 && threshold===0) return prevDiff===null || prevDiff>=0;
  if(threshold<0) return false;
  return diff<=threshold && (prevDiff===null || prevDiff>threshold);
}
function readRuntime(){try{return JSON.parse(localStorage.getItem('wwNotifRuntime805')||'null')||{}}catch(e){return {}}}
function writeRuntime(x){try{localStorage.setItem('wwNotifRuntime805',JSON.stringify(x))}catch(e){}}
function previousNow(now){var r=readRuntime();return r.lastNow?new Date(r.lastNow):null}
function rememberNow(now){writeRuntime({lastNow:now.toISOString()})}
function build(state,now){state=state||{};now=now||new Date();var prev=previousNow(now),s=load(),out=[],today=isoDate(now),dayNames=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  var schedule=window.COURSE_SCHEDULE||[]; schedule.filter(function(c){return c.day===dayNames[now.getDay()]}).forEach(function(c){var sm=toMin(c.start),nm=now.getHours()*60+now.getMinutes();var diff=sm-nm;if(s.timings.session.indexOf(15)>=0&&wasCrossed(diff,15,prev?((sm-(prev.getHours()*60+prev.getMinutes()))):null)){add(out,s,'session_'+(c.id||c.subject)+'_'+today+'_'+c.start,'planning','warning','⏳','Session bientôt',c.subject+' à '+c.start,now,{action:'planning',minutesBefore:15})}});
  var tasks=Array.isArray(state.tasks)?state.tasks:[];tasks.forEach(function(t){if(!t||t.isDone)return;var date=t.deadlineDate||t.date;var dl=dateTime(date,t.deadlineTime);if(!dl)return;var diff=Math.round((dl-now)/60000);s.timings.deadline.forEach(function(x){if(x>=0&&wasCrossed(diff,x,prev?Math.round((dl-prev)/60000):null)){var label=x===1440?'demain':x===360?'dans 6 h':x===60?'dans 1 h':x===15?'dans 15 min':'bientôt';add(out,s,'deadline_'+t.id+'_'+date+'_'+x,'tasks',x<=60?'urgent':'warning','⏰','Deadline '+label,(t.text||'Tâche')+' — limite '+date+' '+t.deadlineTime,now,{taskId:t.id,minutesBefore:x,deadlineDate:date,deadlineTime:t.deadlineTime})}});if(diff<0)add(out,s,'overdue_'+t.id+'_'+date,'tasks','urgent','🚨','Tâche en retard',(t.text||'Tâche')+' — deadline '+date+' '+t.deadlineTime,now,{taskId:t.id,deadlineDate:date,deadlineTime:t.deadlineTime})});
  (state.exams||[]).forEach(function(e){var d=dateTime(e.date,e.time||'23:59');if(!d)return;var diff=Math.round((d-now)/60000),mins=[10080,4320,1440,0];mins.forEach(function(x){if(wasCrossed(diff,x,prev?Math.round((d-prev)/60000):null)){var label=x===10080?'7 jours':x===4320?'3 jours':x===1440?'demain':"aujourd’hui";add(out,s,'exam_'+e.id+'_'+x,'exams',x<=1440?'urgent':'warning','📅','Examen '+label,e.title||'Examen',now,{examId:e.id,minutesBefore:x})}})});
  var todayTasks=tasks.filter(function(t){return !t.isDone&&(t.date===today||t.deadlineDate===today)});if(todayTasks.length)add(out,s,'daily_tasks_'+today,'planning','info','📋','Mission du jour',todayTasks.length+' tâche'+(todayTasks.length>1?'s':'')+' à prendre en compte aujourd’hui',now,{count:todayTasks.length,action:'tasks'});
  try{var ed=window.getErrorsDueToday?window.getErrorsDueToday():[];if(ed.length)add(out,s,'review_errors_'+today,'review','warning','⚠️',ed.length+' erreur'+(ed.length>1?'s':'')+' à réviser','Révision ciblée disponible',now,{count:ed.length})}catch(e){}
  try{var fc=0;(state.languages||[]).forEach(function(L){if(window.getCardsDueToday)fc+=window.getCardsDueToday(L.id).length});if(fc)add(out,s,'review_cards_'+today,'review','info','🃏',fc+' carte'+(fc>1?'s':'')+' à réviser','Flashcards disponibles',now,{count:fc})}catch(e){}
  return out;
}
function shouldSend(n,state){var s=load();if(!s.enabled||!s.categories[n.category]||quiet(s,new Date()))return false;state._wwNotificationSent=state._wwNotificationSent||{};return !state._wwNotificationSent[n.id]}
function show(n){if(!('Notification' in window)||Notification.permission!=='granted')return Promise.resolve(false);var opts={body:n.text,tag:n.id,icon:n.icon||'./icons/icon-192.png',badge:'./icons/icon-192.png',data:Object.assign({category:n.category,url:'./'},n.data||{})};if(n.taskId)opts.data.taskId=n.taskId;if(n.examId)opts.data.examId=n.examId;if(n.type==='urgent')opts.requireInteraction=true;try{if(navigator.serviceWorker&&navigator.serviceWorker.ready)return navigator.serviceWorker.ready.then(function(reg){return reg.showNotification(n.title,opts).then(function(){return true})}).catch(function(){return false});return Promise.resolve(!!new Notification(n.title,opts))}catch(e){return Promise.resolve(false)}}
function tick(state,send){var now=new Date(),list=build(state,now);state.notifications=list;state._wwNotificationSent=state._wwNotificationSent||{};if(send)list.forEach(function(n){if(shouldSend(n,state)){show(n);state._wwNotificationSent[n.id]=Date.now()}});state.lastNotifCheck=now.toISOString();rememberNow(now);return list}
function notifyNow(title,body,category){return show({id:'manual_'+Date.now(),category:category||'intelligence',type:'info',title:title,text:body})}
function updateSettings(p){var s=load();p=p||{};if(p.categories)s.categories=Object.assign({},s.categories,p.categories);if(p.timings)s.timings=Object.assign({},s.timings,p.timings);if(p.quietHours)s.quietHours=Object.assign({},s.quietHours,p.quietHours);if(p.push)s.push=Object.assign({},s.push,p.push);if(typeof p.enabled==='boolean')s.enabled=p.enabled;save(s);return s}
function configurePush(cfg){var s=load();s.push=Object.assign({},s.push,cfg||{});save(s);return s.push}
function pushStatus(){var s=load();return {enabled:!!s.push.enabled,configured:!!(s.push.endpoint&&s.push.vapidPublicKey),endpoint:s.push.endpoint||'',permission:('Notification' in window?Notification.permission:'unsupported'),supported:!!(navigator.serviceWorker&&window.PushManager)}}
async function subscribePush(){var s=load();if(!s.push.enabled||!s.push.endpoint||!s.push.vapidPublicKey)return {ok:false,reason:'push_gateway_not_configured'};if(!navigator.serviceWorker||!window.PushManager)return {ok:false,reason:'push_unsupported'};var reg=await navigator.serviceWorker.ready;var raw=s.push.vapidPublicKey.replace(/-/g,'+').replace(/_/g,'/');while(raw.length%4)raw+='=';var key=Uint8Array.from(atob(raw),function(c){return c.charCodeAt(0)});var sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});var res=await fetch(s.push.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(sub)});return {ok:res.ok,status:res.status,subscription:sub.toJSON?sub.toJSON():sub}}
window.WWNotifications={version:'80.7',defaults:clone(DEFAULTS),settings:load,updateSettings:updateSettings,requestPermission:permission,build:build,tick:tick,show:show,notifyNow:notifyNow,configurePush:configurePush,pushStatus:pushStatus,subscribePush:subscribePush};
})();
