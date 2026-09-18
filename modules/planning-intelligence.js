/**
 * White Wolf Scholar V80.1 — Task ↔ Planning Intelligence
 * Planning Hebdo remains the source of truth. Tasks are inputs, not silent edits.
 */
(() => {
  'use strict';
  const DAY_KEYS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const DAY_LABELS={lundi:'Lundi',mardi:'Mardi',mercredi:'Mercredi',jeudi:'Jeudi',vendredi:'Vendredi',samedi:'Samedi',dimanche:'Dimanche'};
  const app=()=>window.WWAppCore&&window.WWAppCore.state;
  const iso=d=>window.wwLocalDateISO?window.wwLocalDateISO(d||new Date()):new Date((d||new Date()).getTime()-(d||new Date()).getTimezoneOffset()*60000).toISOString().slice(0,10);
  const dayKey=()=>DAY_KEYS[new Date().getDay()];
  const min=v=>{const p=String(v||'').split(':').map(Number);return Number.isFinite(p[0])?p[0]*60+(p[1]||0):0};
  const fmt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(Math.round(n%60)).padStart(2,'0');
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function planning(){const s=app();return Object.assign({},window.DEFAULT_SCHEDULE||{},s&&s.customSchedule||{});}
  function split(v){return String(v||'').split(/\s*(?:\+|•|;|\n)\s*/).map(x=>x.trim()).filter(Boolean);}
  function estimate(v){const t=String(v||'').toLowerCase();if(/repos|pause|gym|sport|🏋️|🛌/.test(t))return 0;if(/python|programm|git|code|oop|dsa/.test(t))return 60;if(/révision|revision|exercices|td|tp|quiz/.test(t))return 60;if(/spectro|chimie|analyse|chromato|génie|energie|énerg/.test(t))return 50;return 45;}
  function taskMinutes(t){const n=Number(t&&t.estimatedMinutes);if(n>0)return Math.min(1440,n);if(t&&t.time&&t.deadlineTime&&min(t.deadlineTime)>min(t.time))return min(t.deadlineTime)-min(t.time);return 30;}
  function todayTasks(){const s=app();return (s&&Array.isArray(s.tasks)?s.tasks:[]).filter(t=>t&&t.date===iso()&&!t.isDone);}
  function schedule(){const list=Array.isArray(window.COURSE_SCHEDULE)?window.COURSE_SCHEDULE:[];return list.filter(x=>x.day===dayKey()).map(x=>[min(x.start),min(x.end)]).filter(x=>x[1]>x[0]).sort((a,b)=>a[0]-b[0]);}
  function freeWindows(){
    const busy=schedule(),out=[],base=[[7*60,12*60],[13*60,19*60],[20*60,23*60]];
    base.forEach(w=>{let c=w[0];busy.forEach(b=>{if(b[1]<=c||b[0]>=w[1])return;if(b[0]>c)out.push([c,Math.min(b[0],w[1])]);c=Math.max(c,b[1]);});if(c<w[1])out.push([c,w[1]]);});
    return out.filter(x=>x[1]-x[0]>=25);
  }
  function assessTasks(){
    const capacity=freeWindows().map(x=>x.slice());
    return todayTasks().sort((a,b)=>({Haute:0,Moyenne:1,Basse:2}[a.priority]??1)-({Haute:0,Moyenne:1,Basse:2}[b.priority]??1)).map(t=>{
      const mins=taskMinutes(t),deadline=t.deadlineTime?min(t.deadlineTime):null;
      let remaining=mins,available=0,allocated=[];
      for(let i=0;i<capacity.length&&remaining>0;i++){
        const end=deadline==null?capacity[i][1]:Math.min(capacity[i][1],deadline);
        if(end<=capacity[i][0])continue;
        available+=end-capacity[i][0];
        const take=Math.min(remaining,end-capacity[i][0]);
        if(take>0){allocated.push([capacity[i][0],capacity[i][0]+take]);capacity[i][0]+=take;remaining-=take;}
      }
      if(remaining>0&&deadline!=null)for(let i=0;i<capacity.length;i++){const end=Math.min(capacity[i][1],deadline);if(end>capacity[i][0])available+=end-capacity[i][0];}
      return {task:t,minutes:mins,deadline,availableBefore:available,feasible:remaining<=0,allocated};
    });
  }
  function mission(){
    let done={};try{done=JSON.parse(localStorage.getItem('wwDailyMissionDone')||'{}')||{};}catch(e){}
    return split(planning()[dayKey()]||'').filter(x=>!/^repos$/i.test(x)).map((text,i)=>{
      let h=2166136261,k=iso()+'|'+i+'|'+text;for(let j=0;j<k.length;j++){h^=k.charCodeAt(j);h=Math.imul(h,16777619);}
      const id=(h>>>0).toString(36);return{id,text,minutes:estimate(text),done:!!done[id]};
    });
  }
  function week(){const p=planning();return Object.keys(DAY_LABELS).map(k=>{const a=split(p[k]||'').filter(x=>!/repos|🛌/i.test(x));return{key:k,label:DAY_LABELS[k],items:a.length,minutes:a.reduce((n,x)=>n+estimate(x),0)};});}
  function summary(){const m=mission(),t=todayTasks(),a=assessTasks(),f=freeWindows();return{date:iso(),day:dayKey(),total:m.length,done:m.filter(x=>x.done).length,plannedMinutes:m.reduce((n,x)=>n+x.minutes,0),freeMinutes:f.reduce((n,x)=>n+x[1]-x[0],0),tasks:t.length,taskMinutes:t.reduce((n,x)=>n+taskMinutes(x),0),taskAssessment:a,classes:schedule()};}
  function render(){
    const s=app();if(!s||!s.onboardingDone||s.route!=='planning')return;
    const root=document.getElementById('root'),host=root&&root.querySelector('.app');if(!host)return;
    const old=host.querySelector('#ww-planning-intelligence');if(old)old.remove();
    const x=summary(),m=mission(),w=week(),f=freeWindows();
    const tasks=x.taskAssessment.map(a=>`<div class="ww-pi-mission ${a.feasible?'':'conflict'}"><span>${a.feasible?'🟡':'⚠️'}</span><b>${esc(a.task.text)}</b><small>${a.minutes} min${a.deadline!==null?' · limite '+fmt(a.deadline):' · sans limite horaire'} · ${a.feasible?'capacité indicative disponible':'temps insuffisant avant la limite'}</small></div>`).join('')||'<div class="ww-pi-empty">Aucune tâche ouverte aujourd’hui.</div>';
    const missionRows=m.map(q=>`<div class="ww-pi-mission ${q.done?'done':''}"><span>${q.done?'✓':'○'}</span><b>${esc(q.text)}</b><small>${q.minutes?q.minutes+' min':''}</small></div>`).join('')||'<div class="ww-pi-empty">Aucune mission académique aujourd’hui.</div>';
    const freeRows=f.slice(0,5).map(q=>`<span>${fmt(q[0])}–${fmt(q[1])}</span>`).join('')||'<span>Aucun créneau libre ≥ 25 min détecté</span>';
    const weekRows=w.map(q=>`<div class="ww-pi-week-row"><b>${q.label}</b><span>${q.items} éléments · ~${q.minutes} min</span></div>`).join('');
    const panel=document.createElement('section');panel.id='ww-planning-intelligence';panel.className='ww-planning-intelligence card';
    panel.innerHTML=`<div class="ww-pi-head"><div><div class="card-title">🧠 Planning Intelligence</div><div class="ww-pi-sub">Planning Hebdo = source de vérité. Les tâches sont analysées sans modifier le planning.</div></div><strong>${x.total?Math.round(x.done/x.total*100):0}%</strong></div>
    <div class="ww-pi-grid"><div><span>🎯 Mission</span><b>${x.done}/${x.total}</b></div><div><span>⏱️ Charge planning</span><b>${x.plannedMinutes} min</b></div><div><span>📝 Tâches ouvertes</span><b>${x.tasks}</b></div><div><span>🕐 Libre indicatif</span><b>${x.freeMinutes} min</b></div></div>
    <div class="ww-pi-section"><div class="ww-pi-title">🎯 Mission structurée</div>${missionRows}</div>
    <div class="ww-pi-section"><div class="ww-pi-title">📝 Tâches prises en compte</div>${tasks}</div>
    <div class="ww-pi-section"><div class="ww-pi-title">🕐 Créneaux libres indicatifs</div><div class="ww-pi-free">${freeRows}</div></div>
    <div class="ww-pi-section"><div class="ww-pi-title">📅 Charge hebdomadaire</div>${weekRows}</div>`;
    const content=host.querySelector('.bottom-nav')?.previousElementSibling;if(content)content.prepend(panel);else host.prepend(panel);
  }
  window.WWPlanningIntelligence={today:mission,summary,week,freeWindows,taskAssessment:assessTasks,render};
  if(window.WWEventBus&&WWEventBus.on)WWEventBus.on('render:complete',render);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(render,0));
})();
