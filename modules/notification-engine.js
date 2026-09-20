/* WHITE WOLF SCHOLAR V92.6 — Notification Engine
 * Local notifications for active/background app + service-worker click handling.
 * True closed-app timed delivery requires Web Push or platform alarm support;
 * this module never pretends setTimeout can survive process termination.
 */
(function(global){
  'use strict';
  var KEY='wwNotificationSettings';
  var timer=null, fired={};
  var DEFAULTS={enabled:false,leadMinutes:10,taskDeadlines:true,studySessions:true,revision:true,morning:true,evening:true};
  function settings(){
    try{return Object.assign({},DEFAULTS,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(_){return Object.assign({},DEFAULTS)}
  }
  function save(s){try{localStorage.setItem(KEY,JSON.stringify(Object.assign({},DEFAULTS,s)));}catch(_){} return settings()}
  function supported(){return 'Notification' in global && global.isSecureContext !== false}
  async function request(){if(!supported())return 'unsupported';try{return await Notification.requestPermission()}catch(_){return 'denied'}}
  async function enable(){var p=Notification.permission;if(p!=='granted')p=await request();var s=settings();s.enabled=p==='granted';save(s);return p}
  function disable(){var s=settings();s.enabled=false;save(s);return s}
  function key(id){return String(id||'')+'|'+new Date().toISOString().slice(0,10)}
  function show(title,body,data){
    var s=settings(); if(!s.enabled||!supported()||Notification.permission!=='granted')return false;
    try{
      if(global.navigator&&navigator.serviceWorker&&navigator.serviceWorker.controller){navigator.serviceWorker.controller.postMessage({type:'WW_SHOW_NOTIFICATION',title:title,body:body,data:data||{}});return true;}
      new Notification(title,{body:body,tag:'white-wolf-'+(data&&data.tag||'general'),icon:'./icons/icon-192.png',badge:'./icons/icon-192.png',data:data||{}});return true;
    }catch(_){return false}
  }
  function parseTime(v){if(global.WWTimeEngine)return global.WWTimeEngine.parse(v);var m=String(v||'').match(/^(\d{1,2}):(\d{2})$/);return m?Number(m[1])*60+Number(m[2]):null}
  function minutesNow(d){d=d||new Date();return d.getHours()*60+d.getMinutes()}
  function todayISO(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function checkTasks(state,now){var s=settings();if(!s.taskDeadlines)return;var tasks=state&&Array.isArray(state.tasks)?state.tasks:[];var today=todayISO(now);tasks.forEach(function(t){if(!t||t.date!==today||t.status==='done'||t.isDone||!t.deadlineTime)return;var dl=parseTime(t.deadlineTime);if(dl==null)return;var diff=dl-minutesNow(now);if(diff>=0&&diff<=s.leadMinutes){var k=key('deadline:'+t.id+':'+t.deadlineTime);if(!fired[k]){fired[k]=1;show('🔴 White Wolf — Deadline','« '+(t.text||t.title||'Task')+' » arrive bientôt.',{tag:'deadline',taskId:t.id});}}});}
  function checkSessions(state,now){var s=settings();if(!s.studySessions)return;var n=minutesNow(now),today=todayISO(now),list=[];
    (state&&Array.isArray(state.tasks)?state.tasks:[]).forEach(function(t){if(t&&t.date===today&&!t.isDone&&t.time)list.push({id:t.id,start:t.time,title:t.text||t.title||'Task'});});
    var schedule=state&&state.customSchedule&&typeof state.customSchedule==='object'?state.customSchedule:{};
    var days=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],raw=String(schedule[days[now.getDay()]]||'');
    var re=/(\d{1,2}:\d{2})\s*(?:-|–|—|→|à)\s*(\d{1,2}:\d{2})/g,m;
    while((m=re.exec(raw))){list.push({id:'planning-'+m.index,start:m[1],title:'Session planifiée'});}
    list.forEach(function(x){var st=parseTime(x.start);if(st==null)return;var diff=st-n;if(diff>=0&&diff<=s.leadMinutes){var k=key('session:'+x.id+':'+st);if(!fired[k]){fired[k]=1;show('📚 White Wolf — Session','Ta session commence à '+x.start+'.',{tag:'study-session',eventId:x.id});}}});
  }
  function localDate(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function withinMinute(now,target){var n=minutesNow(now);return n>=target&&n<target+1}
  function morning(now){var s=settings();if(!s.morning)return;var target=300;try{var c=global.WWTimeEngine&&global.WWTimeEngine.config?global.WWTimeEngine.config():null;if(c&&c.wakeTime!=null)target=c.wakeTime}catch(_){}if(!withinMinute(now,target))return;var k='morning|'+localDate(now);if(!fired[k]){fired[k]=1;show('🐺 Good morning','Ta journée d’étude est prête. Consulte ton plan.',{tag:'morning'});}}
  function evening(now){var s=settings();if(!s.evening)return;var target=1380;try{var c=global.WWTimeEngine&&global.WWTimeEngine.config?global.WWTimeEngine.config():null;if(c&&c.sleepStart!=null)target=Math.max(0,c.sleepStart-25)}catch(_){}if(!withinMinute(now,target))return;var k='evening|'+localDate(now);if(!fired[k]){fired[k]=1;show('🌙 White Wolf — Evening Review','Il reste environ 25 minutes avant ton heure de sommeil.',{tag:'evening'});}}
  function revision(state,now){var s=settings();if(!s.revision||!global.WWAdaptiveRevision||!global.WWAdaptiveRevision.summary)return;try{var r=global.WWAdaptiveRevision.summary(state);var first=r&&r.queue&&r.queue[0];if(!first)return;var k=key('revision:'+first.type+':'+(first.topicId||first.errorId||first.title));if(!fired[k]){fired[k]=1;show('🧠 White Wolf — Revision','Une révision prioritaire est prête : '+String(first.title||'réviser maintenant').slice(0,120),{tag:'revision',topicId:first.topicId||null,errorId:first.errorId||null});}}catch(_){} }
  function tick(){var st=global.WWAppCore&&global.WWAppCore.state||global.state;var now=new Date();if(!st)return;checkTasks(st,now);checkSessions(st,now);revision(st,now);morning(now);evening(now);}
  function start(state){stop();if(!settings().enabled)return;tick();timer=setInterval(tick,30000);return settings()}
  function stop(){if(timer){clearInterval(timer);timer=null}}
  function get(){return settings()}
  global.WWNotifications={version:'92.6.0',defaults:DEFAULTS,supported:supported,request:request,enable:enable,disable:disable,save:save,get:get,start:start,stop:stop,show:show,tick:tick};
})(window);
