/* WHITE WOLF SCHOLAR V83 — Task & Schedule Domain Utilities
 * Pure helpers extracted from the legacy UI monolith. No DOM access, no rendering.
 */
(function(global){
  'use strict';
  function scheduleToMinutes(t){
    var p=String(t||'').split(':');
    var h=Number(p[0]),m=Number(p[1]);
    if(!Number.isFinite(h))h=0;
    if(!Number.isFinite(m))m=0;
    return Math.max(0,Math.min(1439,h*60+m));
  }
  function scheduleDuration(c){return Math.max(0,scheduleToMinutes(c&&c.end)-scheduleToMinutes(c&&c.start));}
  function deadlineDateTime(t){
    if(!t||!t.date||!t.deadlineTime)return null;
    var d=new Date(t.date+'T'+t.deadlineTime+':00');
    return isNaN(d.getTime())?null:d;
  }
  function taskStatus(t, today, now){
    if(t&&t.isDone)return 'Terminée';
    now=now||new Date();
    today=today||((global.wwLocalDateISO&&global.wwLocalDateISO(now))||now.toISOString().slice(0,10));
    var deadline=deadlineDateTime(t);
    if(t&&((t.date&&t.date<today)||(deadline&&deadline.getTime()<now.getTime())))return 'En retard';
    return t&&t.status==='in_progress'?'En cours':'À faire';
  }
  function taskStatusClass(t,today,now){return taskStatus(t,today,now).toLowerCase().replace(/\s+/g,'-').replace('é','e');}
  function validateTimeRange(start,end){
    if(!start||!end)return {ok:true};
    var a=scheduleToMinutes(start),b=scheduleToMinutes(end);
    return b>a?{ok:true,start:a,end:b,duration:b-a}:{ok:false,reason:'end-before-start'};
  }
  global.WWTaskEngine={version:'83.0',scheduleToMinutes:scheduleToMinutes,scheduleDuration:scheduleDuration,deadlineDateTime:deadlineDateTime,taskStatus:taskStatus,taskStatusClass:taskStatusClass,validateTimeRange:validateTimeRange};
})(window);
