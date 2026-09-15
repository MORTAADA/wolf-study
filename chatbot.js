/* WHITE WOLF V61 — Chatbot Controller
 * Isolates the conversational UI from the application core.
 */
(function(global){
  'use strict';
  function create(ctx){
    var msgs=ctx.messages, input=ctx.input;
    if(!msgs) return {init:function(){}};
    function add(text,sender){var d=document.createElement('div');d.className='message '+sender;d.innerHTML=ctx.format(text);msgs.appendChild(d);ctx.upgrade(d);msgs.scrollTop=msgs.scrollHeight}
    function typing(){var d=document.createElement('div');d.className='typing-indicator';d.id='typing-indicator';d.innerHTML='<span></span><span></span><span></span>';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight}
    function hide(){var d=document.getElementById('typing-indicator');if(d)d.remove()}
    function intent(text){var t=text.toLowerCase().trim();if(/^(تنبيهات|notifications)/.test(t))return 'notifications';if(/^(إحصائيات|stats)/.test(t))return 'stats';if(/^(تقدم|progression)/.test(t))return 'progress';if(/^(شجعني|encourage)/.test(t))return 'encourage';if(/^(aide|help|مساعدة)/.test(t))return 'help';return 'unknown'}
    function process(text){typing();setTimeout(function(){hide();var i=intent(text);if(i==='help'){add('🐺 **Commandes:**\n\n🔔 "تنبيهات"\n📊 "إحصائيات"\n📈 "تقدم"\n💪 "شجعني"','bot');return}if(i==='notifications'){var n=ctx.state.notifications||[];add('🔔 **Notifications ('+n.length+')**\n\n'+(n.length?n.slice(0,5).map(function(x){return x.icon+' '+x.title}).join('\n'):'Aucune'),'bot');return}if(i==='stats'){add('📊 **Stats avancées:**\n\n⏱️ Total: '+ctx.totalHours()+'h\n📅 Moyenne/jour: '+ctx.average()+' min\n🔥 Série: '+ctx.streak()+'j\n📚 Sessions: '+ctx.state.sessions.length,'bot');return}if(i==='progress'){add('📊 **Progression:**\n\n⭐ '+ctx.state.xp+' XP\n🔥 '+ctx.state.studyStreak+'j\n🎓 '+(ctx.langDone('de')+ctx.langDone('en')+ctx.langDone('es'))+' leçons\n💻 '+ctx.progDone()+'/'+ctx.programmingCount,'bot');return}if(i==='encourage'){var m=['💪 Continue ! 🌟','🔥 Chaque effort compte !','🏆 Tu es un vrai loup blanc !'];add(m[Math.floor(Math.random()*m.length)],'bot');return}add('🤔 Écris "aide".','bot')},500)}
    function send(){if(!input||!input.value.trim())return;var t=input.value;add(t,'user');input.value='';process(t)}
    function init(){var fab=document.getElementById('chatbot-fab'),close=document.getElementById('chatbot-close'),sendBtn=document.getElementById('chatbot-send');if(fab)fab.onclick=function(){var w=document.getElementById('chatbot-window');if(w){w.classList.toggle('open');if(w.classList.contains('open'))input&&input.focus()}};if(close)close.onclick=function(){var w=document.getElementById('chatbot-window');if(w)w.classList.remove('open')};if(sendBtn)sendBtn.onclick=send;if(input)input.onkeydown=function(e){if(e.key==='Enter')send()}}
    return {init:init,addMessage:add,process:process};
  }
  global.WWChatbot={create:create};
})(window);
