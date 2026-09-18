
/**
 * V65.24 — Planning Intelligence
 * Planning Hebdo remains the single source of truth.
 * This module derives workload, free windows, weekly execution and
 * a structured Daily Mission without creating a second editable plan.
 */
(() => {
  'use strict';

  const DAY_KEYS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const DAY_LABELS = {lundi:'Lundi',mardi:'Mardi',mercredi:'Mercredi',jeudi:'Jeudi',vendredi:'Vendredi',samedi:'Samedi',dimanche:'Dimanche'};

  function state(){ return window.WWAppCore && window.WWAppCore.state; }
  function todayKey(){ return DAY_KEYS[new Date().getDay()]; }
  function todayISO(){ return new Date().toISOString().slice(0,10); }

  function planning(){
    const s=state();
    if(!s) return {};
    const base=window.DEFAULT_SCHEDULE || {};
    return Object.assign({},base,s.customSchedule||{});
  }

  function split(text){
    return String(text||'').split(/\s*(?:\+|•|;|\n)\s*/).map(x=>x.trim()).filter(Boolean);
  }

  function estimateMinutes(text){
    const t=String(text||'').toLowerCase();
    if(/repos|🛌|pause/.test(t)) return 0;
    let n=45;
    if(/python|oop|dsa|programm|git|code/.test(t)) n=60;
    if(/révision|revision|exercices|td|tp|quiz/.test(t)) n=60;
    if(/spectro|chimie|analyse|chromato|génie|energie|énerg/.test(t)) n=50;
    if(/🏋️|gym|sport/.test(t)) return 0;
    return n;
  }

  function doneMap(){
    try { return JSON.parse(localStorage.getItem('wwDailyMissionDone')||'{}')||{}; }
    catch(_) { return {}; }
  }

  function hash(v){
    let h=2166136261;
    const x=todayISO()+'|'+v;
    for(let i=0;i<x.length;i++){ h^=x.charCodeAt(i); h=Math.imul(h,16777619); }
    return (h>>>0).toString(36);
  }

  function todayMission(){
    const raw=planning()[todayKey()]||'';
    const done=doneMap();
    return split(raw).map((text,i)=>({
      id:hash(i+'|'+text), text,
      minutes:estimateMinutes(text),
      done:!!done[hash(i+'|'+text)]
    })).filter(x=>!/^repos$/i.test(x.text));
  }

  function week(){
    const p=planning();
    return Object.keys(DAY_LABELS).map(day=>{
      const items=split(p[day]||'').filter(x=>!/repos|🛌/i.test(x));
      return {
        key:day,label:DAY_LABELS[day],items:items.length,
        minutes:items.reduce((n,x)=>n+estimateMinutes(x),0)
      };
    });
  }

  function scheduleForToday(){
    const s=state();
    const list=Array.isArray(window.COURSE_SCHEDULE)?window.COURSE_SCHEDULE:[];
    const key=todayKey();
    return list.filter(x=>x.day===key).map(x=>({
      start:x.start,end:x.end,subject:x.subject,type:x.type
    })).sort((a,b)=>a.start.localeCompare(b.start));
  }

  function freeWindows(){
    const classes=scheduleForToday();
    const busy=classes.map(x=>[toMin(x.start),toMin(x.end)]).filter(x=>x[0]<x[1]);
    // Day study windows used for guidance only; they never modify Planning.
    const windows=[[7*60,12*60],[13*60,19*60],[20*60,23*60]];
    const out=[];
    windows.forEach(w=>{
      let cursor=w[0];
      busy.forEach(b=>{
        if(b[1]<=cursor || b[0]>=w[1]) return;
        if(b[0]>cursor) out.push([cursor,Math.min(b[0],w[1])]);
        cursor=Math.max(cursor,b[1]);
      });
      if(cursor<w[1]) out.push([cursor,w[1]]);
    });
    return out.filter(x=>x[1]-x[0]>=25);
  }

  function toMin(v){
    const p=String(v||'').split(':').map(Number);
    return (p[0]||0)*60+(p[1]||0);
  }
  function fmt(n){return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}

  function tasksToday(){
    const s=state();
    if(!s) return [];
    return (s.tasks||[]).filter(t=>t.date===todayISO());
  }

  function summary(){
    const m=todayMission(), done=m.filter(x=>x.done).length;
    const mins=m.reduce((n,x)=>n+x.minutes,0);
    const doneMins=m.filter(x=>x.done).reduce((n,x)=>n+x.minutes,0);
    return {
      date:todayISO(),day:todayKey(),total:m.length,done,
      percent:m.length?Math.round(done/m.length*100):0,
      plannedMinutes:mins,completedMinutes:doneMins,
      freeMinutes:freeWindows().reduce((n,x)=>n+x[1]-x[0],0),
      tasks:tasksToday().length,
      classes:scheduleForToday()
    };
  }

  function render(){
    const root=document.getElementById('root');
    if(!root || !(state()||{}).onboardingDone || (state()||{}).route!=='planning') return;
    const host=root.querySelector('.app');
    if(!host || host.querySelector('#ww-planning-intelligence')) return;

    const s=summary(), m=todayMission(), w=week();
    const free=freeWindows();
    const missionRows=m.map(x=>`<div class="ww-pi-mission ${x.done?'done':''}">
      <span>${x.done?'✓':'○'}</span><b>${x.text}</b><small>${x.minutes?x.minutes+' min':''}</small>
    </div>`).join('') || '<div class="ww-pi-empty">Aucune mission académique détectée aujourd’hui.</div>';

    const freeRows=free.slice(0,4).map(x=>`<span>${fmt(x[0])}–${fmt(x[1])}</span>`).join('') ||
      '<span>Aucun créneau libre ≥ 25 min détecté</span>';

    const weekRows=w.map(x=>{
      const dayTotal=(planning()[x.key]||'').trim() ? split(planning()[x.key]).filter(Boolean).length : 0;
      return `<div class="ww-pi-week-row"><b>${x.label}</b><span>${dayTotal} éléments · ~${x.minutes} min</span></div>`;
    }).join('');

    const panel=document.createElement('section');
    panel.id='ww-planning-intelligence';
    panel.className='ww-planning-intelligence card';
    panel.innerHTML=`
      <div class="ww-pi-head">
        <div><div class="card-title">🧠 Planning Intelligence</div>
        <div class="ww-pi-sub">Analyse dérivée du Planning Hebdo — aucune modification automatique.</div></div>
        <strong>${s.percent}%</strong>
      </div>
      <div class="ww-pi-grid">
        <div><span>🎯 Mission</span><b>${s.done}/${s.total}</b></div>
        <div><span>⏱️ Charge estimée</span><b>${s.plannedMinutes} min</b></div>
        <div><span>📝 Tâches du jour</span><b>${s.tasks}</b></div>
        <div><span>🕐 Temps libre estimé</span><b>${s.freeMinutes} min</b></div>
      </div>
      <div class="ww-pi-section"><div class="ww-pi-title">🎯 Mission structurée</div>${missionRows}</div>
      <div class="ww-pi-section"><div class="ww-pi-title">🕐 Créneaux libres indicatifs</div><div class="ww-pi-free">${freeRows}</div></div>
      <div class="ww-pi-section"><div class="ww-pi-title">📅 Charge hebdomadaire</div>${weekRows}</div>
    `;
    const appContent=host.querySelector('.bottom-nav')?.previousElementSibling;
    if(appContent) appContent.prepend(panel);
    else host.prepend(panel);
  }

  window.WWPlanningIntelligence={
    today:todayMission, summary, week, freeWindows, render
  };

  if(window.WWEventBus) {
    WWEventBus.on && WWEventBus.on('render:complete', render);
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(render,0));
  window.addEventListener('online',()=>{});
})();
