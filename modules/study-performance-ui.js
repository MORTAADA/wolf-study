
(() => {
  'use strict';
  const render = () => {
    const api = window.WhiteWolfStudyPerformance;
    if (!api) return;
    const s = api.summary(7);
    const set=(k,v)=>{const el=document.querySelector(`[data-wws-stat="${k}"]`);if(el)el.textContent=v;};
    set('sessions',s.sessions);
    set('minutes',`${s.minutes} min`);
    set('pomodoros',s.pomodoros);
    set('quiz',s.quizAverage==null?'—':`${Math.round(s.quizAverage)}%`);
    const i=document.querySelector('[data-wws-insight]');
    if(i){
      if(!s.sessions && !s.pomodoros) i.textContent='ابدأ أول جلسة دراسة لتظهر تحليلاتك هنا.';
      else i.textContent=`خلال آخر 7 أيام: ${s.sessions} جلسة، ${s.minutes} دقيقة، ${s.pomodoros} Pomodoros و${s.quizzes} اختبارات.`;
    }
  };
  document.addEventListener('DOMContentLoaded',render,{once:true});
  window.addEventListener('wws:study-event',render);
  window.addEventListener('wws:study-engine-ready',render);
})();
