/* WHITE WOLF V65.1 — Section-Based Scientific Tutor */
(function(global){'use strict';
 var VERSION='65.20',MAX=240;
 var QUICK=[['🧠','Tutor socratique','socratic'],['🎯','Que dois-je étudier ?','revision'],['💡','Explique','explain'],['🧠','Rappel actif','recall'],['📝','Teste-moi','exam'],['🧑‍🏫','Tutor guidé','tutor'],['📖','Étudier une section','section'],['🔬','Démarrer la boucle','loop'],['✏️','Résous','solve'],['📊','Ma progression','stats']];
 var SCIENCE=[
  {keys:['beer-lambert','beer lambert','uv visible','uv/visible','absorbance'],title:'UV/Visible — Beer-Lambert',text:'La loi de Beer-Lambert s’écrit **A = εlc** dans les conditions où elle est applicable. A est l’absorbance, ε le coefficient d’extinction molaire, l le trajet optique et c la concentration.'},
  {keys:['ir','infrarouge','spectroscopie ir','vibration'],title:'Spectroscopie IR',text:'La spectroscopie IR renseigne principalement sur les **vibrations des liaisons moléculaires**. L’interprétation combine position, intensité et forme des bandes.'},
  {keys:['rmn 1h','rmn proton','proton rmn','deplacement chimique'],title:'RMN ¹H',text:'En RMN ¹H, le déplacement chimique **δ** est exprimé en ppm. On croise notamment déplacement chimique, intégration et multiplicité.'},
  {keys:['rmn 13c','carbone 13'],title:'RMN ¹³C',text:'La RMN ¹³C permet de distinguer les environnements chimiques des carbones. Des carbones équivalents peuvent produire un même signal.'},
  {keys:['absorption atomique','aas','spectroscopie atomique'],title:'Absorption atomique',text:'En AAS, l’échantillon doit fournir des **atomes libres** capables d’absorber un rayonnement caractéristique. L’atomisation est centrale.'},
  {keys:['chromatographie','chromatographique','separation'],title:'Chromatographie',text:'La chromatographie repose sur une distribution différentielle entre une phase stationnaire et une phase mobile.'},
  {keys:['bilan matiere','bilan de matiere','genie chimique'],title:'Bilan matière',text:'Un bilan matière applique la conservation : **Entrées − Sorties + Génération − Consommation = Accumulation**.'},
  {keys:['reynolds','nombre de reynolds','ecoulement'],title:'Nombre de Reynolds',text:'Le nombre de Reynolds compare les effets inertiels et visqueux et aide à caractériser le régime d’écoulement.'},
  {keys:['transfert thermique','conduction','convection','rayonnement'],title:'Transfert thermique',text:'Les trois modes fondamentaux sont **conduction, convection et rayonnement**.'}
 ];
 function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
 function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
 function create(ctx){
  var msgs=ctx.messages,input=ctx.input,state=ctx.state;if(!msgs)return{init:function(){}};
  var history=Array.isArray(state.chatbotHistory)?state.chatbotHistory:(state.chatbotHistory=[]);
  var pending=state.chatbotTutor||null;
  function fmt(t){return ctx.format?ctx.format(t):esc(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}
  function save(){if(ctx.save)ctx.save()}
  function saveBrain(mode,text){
    var b=state.chatbotTutorBrain||{};
    b.turns=Number(b.turns||0)+1;
    if(mode)b.mode=mode;
    b.lastActivity=new Date().toISOString();
    var topics=(state.topics||[]);
    var n=norm(text||'');
    var hit=topics.find(function(t){var title=norm(t.title||t.name||'');return title&&n.indexOf(title)>=0;});
    if(hit)b.lastTopicId=hit.id;
    state.chatbotTutorBrain=b;
    save();
  }
  function sessionStart(topic,mode){
    if(!global.WWTutorSession||!topic)return null;
    var cur=global.WWTutorSession.ensure(state);
    if(cur&&cur.active&&cur.topicId===topic.id)return cur;
    return global.WWTutorSession.start(state,{topicId:topic.id,topicTitle:topic.title||topic.name||'',mode:mode||'socratic',goal:'Comprendre, appliquer et démontrer la maîtrise du chapitre'});
  }
  function sessionRecord(ev){if(global.WWTutorSession)global.WWTutorSession.record(state,ev);save()}
  function sessionFinish(){
    if(!global.WWTutorSession)return null;
    var sum=global.WWTutorSession.finishSummary(state), t=global.WWTutorSession.ensure(state);
    if(sum&&global.WWTutorSession.learningProfile)sum.profile=global.WWTutorSession.learningProfile(state);
    if(t&&t.active)global.WWTutorSession.end(state,sum);
    save();return sum;
  }
  function modeFor(text){
    var d=global.WWChatModes&&global.WWChatModes.detect?global.WWChatModes.detect(text):null;
    return d||((state.chatbotTutorBrain||{}).mode)||'tutor';
  }
  function add(text,who,saveIt){var d=document.createElement('div');d.className='message '+who;d.innerHTML=fmt(text);msgs.appendChild(d);if(ctx.upgrade)ctx.upgrade(d);msgs.scrollTop=msgs.scrollHeight;if(saveIt!==false){history.push({role:who==='user'?'user':'assistant',text:String(text),at:new Date().toISOString()});if(history.length>MAX)history.splice(0,history.length-MAX);save()}}
  function typing(){var d=document.createElement('div');d.id='typing-indicator';d.className='typing-indicator';d.innerHTML='<span></span><span></span><span></span>';msgs.appendChild(d)}
  function hide(){var d=document.getElementById('typing-indicator');if(d)d.remove()}
  function open(){var w=document.getElementById('chatbot-window');if(w){w.classList.add('open');if(input)input.focus()}}
  function render(){msgs.innerHTML='';if(history.length)history.slice(-80).forEach(function(m){add(m.text,m.role==='user'?'user':'bot',false)});else add('🐺 <strong>White Wolf Academic Tutor</strong><br><br>Je peux maintenant te guider étape par étape : question → réponse → feedback → indice → nouvelle tentative.','bot',false)}
  function quick(){var old=document.getElementById('chatbot-quick-actions');if(old)old.remove();var box=document.createElement('div');box.id='chatbot-quick-actions';box.className='chatbot-quick-actions';QUICK.forEach(function(q){var b=document.createElement('button');b.type='button';b.dataset.chatQuick=q[2];b.textContent=q[0]+' '+q[1];box.appendChild(b)});var w=document.getElementById('chatbot-window');if(w)w.insertBefore(box,msgs)}
  function context(){return global.WWChatContext?global.WWChatContext.build(state):{topics:[],weak:[],errors:[],sessions:[],totalMinutes:0,activeCount:0,rows:[]}}
  function target(c,text){var found=global.WWChatActions&&global.WWChatActions.findTopic?global.WWChatActions.findTopic(state,text):null;return found||(c.weak[0]&&c.weak[0].topic)||c.topics[0]||null}
  function pdfContext(text){
    var p=state.chatbotPdfContext;if(!p||!p.text)return null;
    var n=norm(text),words=n.split(/[^a-z0-9]+/).filter(function(w){return w.length>=4}).slice(0,8);
    var src=String(p.text), low=norm(src), best=-1;
    for(var i=0;i<words.length;i++){var at=low.indexOf(words[i]);if(at>=0){best=at;break}}
    var excerpt=best>=0?src.slice(Math.max(0,best-450),Math.min(src.length,best+2200)):src.slice(0,2600);
    return {title:p.name||'PDF étudié',text:'📚 **Source locale : '+(p.name||'PDF')+'**\n\n'+excerpt+'\n\n_Je me limite au texte extrait de ce PDF ; les passages absents ne sont pas complétés par invention._'};
  }
  function science(text){var pc=pdfContext(text);if(pc)return pc;var n=norm(text);for(var i=0;i<SCIENCE.length;i++){for(var j=0;j<SCIENCE[i].keys.length;j++)if(n.indexOf(norm(SCIENCE[i].keys[j]))>=0)return SCIENCE[i]}return null}
  function revision(c){if(global.WWAdaptiveRevision)try{var q=global.WWAdaptiveRevision.build(state,6)||[];if(q.length)return '🔁 **Révision adaptative**\n\n'+q.map(function(x,i){return(i+1)+'. **'+(x.title||x.topicTitle||'Élément')+'**'+(x.reason?' — '+x.reason:'')}).join('\n')+'\n\n⏱️ Environ **'+q.reduce(function(a,x){return a+Number(x.estimatedMinutes||x.minutes||10)},0)+' min**.'}catch(e){}return c.topics.length?'🎯 **Priorités dans ton périmètre**\n\n'+c.weak.slice(0,5).map(function(x,i){return(i+1)+'. **'+x.topic.title+'** — '+x.score+'%'}).join('\n'):'🎯 Ton périmètre est vide. Active des chapitres.'}
  function stats(c){var avg=c.sessions.length?Math.round(c.totalMinutes/c.sessions.length):0,mastered=c.rows.filter(function(x){return x.score>=80}).length;return'📊 **Progression académique**\n\n🎯 Chapitres actifs : **'+c.activeCount+'**\n⏱️ Temps : **'+Math.round(c.totalMinutes)+' min**\n📚 Sessions : **'+c.sessions.length+'**\n⚠️ Erreurs : **'+c.errors.length+'**\n🧠 ≥80% : **'+mastered+'/'+c.activeCount+'**\n⏳ Moyenne/session : **'+avg+' min**'}
  function scope(c){return c.activeCount?'🎯 **Périmètre actif**\n\n'+c.topics.map(function(t){return'• '+t.title}).join('\n'):'🎯 Aucun chapitre actif.'}
  function getQuestion(topic){try{return global.WWAdaptiveQuiz&&global.WWAdaptiveQuiz.get?global.WWAdaptiveQuiz.get(topic,state):null}catch(e){return null}}
  function startTutor(topic){if(!topic)return'🎯 Active un chapitre dans ton périmètre pour commencer.';var qs=[],seen={},tries=0;while(qs.length<5&&tries<30){tries++;var q=getQuestion(topic);if(q&&q.id&&!seen[q.id]){seen[q.id]=true;qs.push(q)}}if(!qs.length)return'📝 Aucune question disponible pour **'+topic.title+'**. Ajoute des questions dans la Question Bank ou utilise Active Recall.';pending={type:'tutor',topic:topic,questions:qs,index:0,score:0,hints:0,wrong:0,startedAt:Date.now()};state.chatbotTutor=pending;save();return question()}
  function question(){var p=pending,q=p.questions[p.index];return'🧑‍🏫 **Tutor guidé — '+p.topic.title+'**\n\nQuestion **'+(p.index+1)+'/'+p.questions.length+'**\n\n'+q.q+'\n\n'+(q.options||[]).map(function(o,i){return'**'+String.fromCharCode(65+i)+'.** '+o}).join('\n')+'\n\nRéponds **A, B, C ou D**. Tu peux demander **indice** à tout moment.'}
  function hint(q){var exp=String(q.explanation||q.why||'');return '💡 **Indice :** '+(exp?exp.split(/[.!?]/)[0]+'.':'identifie d’abord le principe central et élimine les propositions incompatibles.')}
  function record(q,tid,ok){state.adaptiveQuestionStats=state.adaptiveQuestionStats||{};var bt=state.adaptiveQuestionStats[tid]||(state.adaptiveQuestionStats[tid]={}),s=bt[q.id]||(bt[q.id]={attempts:0,correct:0,wrong:0,lastAnswered:null});s.attempts++;if(ok)s.correct++;else s.wrong++;s.lastAnswered=Date.now()}
  function finish(p){var pct=Math.round(p.score/p.questions.length*100),out='🏁 **Session tutorée terminée**\n\n🎯 Score : **'+p.score+'/'+p.questions.length+' ('+pct+'%)**\n💡 Indices : **'+(p.hints||0)+'**\n🔁 Tentatives supplémentaires : **'+(p.wrong||0)+'**';pending=null;state.chatbotTutor=null;save();return out+'\n\n'+(pct>=80?'🚀 Les bases sont solides. Tu peux passer à des questions plus difficiles.':pct>=50?'🔁 Les notions sont en cours de consolidation. Une révision ciblée est utile.':'📚 Reprends les fondamentaux puis relance le tutorat.')}
  function answerTutor(text){var p=pending,n=norm(text);if(/^(quitter|annuler|stop|arret|arrêter)$/.test(n)){pending=null;state.chatbotTutor=null;save();return'⏹️ Session tutorée arrêtée. Tu peux la relancer quand tu veux.'}if(/^(indice|hint|aide|help|je ne sais pas|ns)$/.test(n)){p.hints=(p.hints||0)+1;state.chatbotTutor=p;state.chatbotTutorBrain=state.chatbotTutorBrain||{};state.chatbotTutorBrain.hintUsed=true;save();return hint(p.questions[p.index])}var q=p.questions[p.index],ev=global.WWChatEvaluator&&global.WWChatEvaluator.feedback?global.WWChatEvaluator.feedback(q,text):null;if(ev&&ev.kind==='free'){return'🧠 **Je peux analyser ta réponse, mais il me faut une réponse plus précise.**\n\nJe n’ai pas reconnu une option A/B/C/D. Réponds avec la lettre, le texte exact de l’option, ou demande **indice**.'}var ok=ev?ev.correct:false;record(q,p.topic.id,ok);if(global.WWMastery&&global.WWMastery.recordReview)global.WWMastery.recordReview(state,p.topic.id,ok);if(!ok){p.wrong++;state.chatbotTutor=p;save();return'❌ **Pas encore.**\n\n'+hint(q)+'\n\nJe garde la même question : reformule ta réponse ou choisis une autre option.'}p.score++;if(p.index===p.questions.length-1)return'✅ **Correct !**\n\n'+(q.explanation||q.why||'Bonne réponse.')+'\n\n'+finish(p);p.index++;p.wrongCurrent=0;state.chatbotTutor=p;state.xp=Number(state.xp||0)+3;save();return'✅ **Correct !**\n\n'+(q.explanation||q.why||'Bonne réponse.')+'\n\n'+question()}
  function documentEvidence(text){try{return global.WWDocumentIntel&&global.WWDocumentIntel.context?global.WWDocumentIntel.context(text,{limit:4}):null}catch(e){return null}}
  function formatEvidence(ev,deep){if(!ev||!ev.matches||!ev.matches.length)return '';var head=deep?'🔬 **Analyse fondée sur tes ressources**':'📚 **Source de ton cours**';var body=ev.matches.map(function(m,i){return'**'+(i+1)+'. '+m.source+'**\n'+m.text.slice(0,900)}).join('\n\n');return head+'\n\n'+body+'\n\n_Je distingue ici le contenu retrouvé dans tes ressources des connaissances générales._'}
  function openDocument(resourceId){try{if(global.state){global.state.documentIntelligence=global.state.documentIntelligence||{resources:{},activeResourceId:null};global.state.documentIntelligence.activeResourceId=resourceId;var r=global.WWDocumentIntel&&global.WWDocumentIntel.get?global.WWDocumentIntel.get(resourceId):null;if(r){global.state.chatbotPdfContext={name:r.name,text:(r.chunks||[]).join('\n\n'),extractedAt:r.updatedAt,method:r.method,resourceId:r.resourceId,topicId:r.topicId};if(global.saveState)global.saveState();}}open();process('explique le document ouvert');}catch(e){process('aide')}}
  function explain(c,text,deep){var ev=documentEvidence(text),s=science(text),t=target(c,text);if(ev)return formatEvidence(ev,deep)+'\n\n📌 Vérification : formule la notion avec tes propres mots.';if(s)return(deep?'🔬 **Deep Study — ':'💡 **Explain — ')+s.title+'\n\n'+s.text+'\n\n📌 Vérification : peux-tu donner une application ou expliquer une grandeur de cette notion ?';if(!t)return'🎯 Aucun chapitre actif correspondant. Active d’abord un chapitre dans ton périmètre.';return(deep?'🔬 **Deep Study — ':'💡 **Explain — ')+t.title+'\n\nDéfinition → principe → grandeurs → hypothèses → limites → application.\n\nPour une explication strictement fidèle à ton cours, envoie le passage ou la ressource correspondante.'}
  function startRecall(topic){if(!topic)return'🎯 Active un chapitre.';state.chatbotRecall={topicId:topic.id,topicTitle:topic.title,startedAt:Date.now()};save();return'🧠 **Active Recall — '+topic.title+'**\n\nExplique le principe central en **3–5 phrases**, sans notes.\n\nJe vais analyser ta réponse sur les concepts explicitement présents dans la référence disponible. Si le cours n’est pas encore fourni, je ne prétendrai pas vérifier des éléments absents de l’application.\n\nÉcris ta réponse maintenant.'}
  function evaluateRecall(text){var r=state.chatbotRecall;if(!r)return null;var topic=null;var c=context();for(var i=0;i<c.topics.length;i++)if(c.topics[i].id===r.topicId){topic=c.topics[i];break}var ref='';var s=science(r.topicTitle+' '+text);if(s)ref=s.text;else if(topic)ref=String(topic.title)+' '+String(topic.description||'');var ev=global.WWChatEvaluator?global.WWChatEvaluator.evaluateFree(text,ref):{coverage:0,verdict:'vide'};state.chatbotRecall=null;save();if(r.loop&&global.WWLearningLoop){var lp=global.WWLearningLoop.current();if(lp){lp.recall={coverage:ev.coverage,verdict:ev.verdict};global.WWLearningLoop.set(lp);}}if(r.loop){if(global.WWLearningLoop&&global.WWLearningLoop.current()){global.WWLearningLoop.advance('recall');}return (!ref||!ev.total)?'🧠 **Réponse enregistrée.**\n\nLa section ne fournit pas assez de référence textuelle pour une évaluation scientifique. Écris **suivant** pour passer au contrôle si tu souhaites continuer.':'🧠 **Active Recall : '+ev.coverage+'% de couverture.**\n\n'+(ev.coverage>=55?'Bonne récupération des éléments de référence.':'Plusieurs éléments importants manquent encore.')+'\n\nÉcris **suivant** pour passer au contrôle.';}if(!ref||!ev.total)return'🧠 **Réponse reçue.**\n\nJe peux vérifier la forme et enregistrer la tentative, mais je n’ai pas assez de contenu de cours dans l’application pour juger scientifiquement ta réponse. Envoie le passage du cours pour une correction fondée sur ta source.';if(ev.coverage>=55){if(global.WWMastery&&global.WWMastery.recordReview)global.WWMastery.recordReview(state,r.topicId,true);return'🟢 **Bonne couverture conceptuelle : '+ev.coverage+'%.**\n\nTu as repris plusieurs concepts de référence. Maintenant, ajoute une condition, une équation ou une application pour consolider l’autonomie.'}if(global.WWMastery&&global.WWMastery.recordReview)global.WWMastery.recordReview(state,r.topicId,false);return'🟠 **Couverture conceptuelle : '+ev.coverage+'%.**\n\nTa réponse mérite d’être approfondie. Reprends la définition, le principe et les grandeurs clés, puis réessaie.'}
  function loopStart(){
    var st=state.sectionTutor;
    if(!st)return '📖 Ouvre d’abord une section avec **étudier une section**.';
    var topic=(state.topics||[]).find(function(t){return t.id===st.topicId})||null;
    if(st.topicId&&global.wwTopicActive&&topic&&!global.wwTopicActive(topic))return '🎯 Cette section est hors périmètre. Active le chapitre avant de lancer la boucle.';
    if(!global.WWLearningLoop)return '🔬 Learning Loop indisponible.';
    var l=global.WWLearningLoop.build(st.resourceId,{id:st.sectionId,title:st.sectionTitle,topicId:st.topicId},topic);
    l.text=st.text||''; global.WWLearningLoop.set(l);
    return '🔬 **Full Learning Loop — '+st.sectionTitle+'**\n\n**Phase 1/5 · Lire**\n\n'+(st.text||'Aucun texte extrait disponible.')+'\n\nQuand tu as terminé, écris **suivant** pour passer à l’explication.';
  }
  function loopExplain(){
    var l=global.WWLearningLoop&&global.WWLearningLoop.current?global.WWLearningLoop.current():null;
    if(!l)return '🔬 Aucune boucle active. Lance **démarrer la boucle** depuis une section.';
    var text=String(l.text||'').trim();
    if(!text)return '📚 Cette section ne contient pas de texte exploitable.';
    global.WWLearningLoop.advance('explain');
    var short=text.length>5000?text.slice(0,5000)+'…':text;
    return '🔬 **Phase 2/5 · Comprendre**\n\n**Source : '+l.sectionTitle+'**\n\n'+short+'\n\n📌 Reformule maintenant le principe central avec tes propres mots. Écris **suivant** après ta reformulation.';
  }
  function loopRecall(){
    var l=global.WWLearningLoop&&global.WWLearningLoop.current?global.WWLearningLoop.current():null;
    if(!l)return '🔬 Aucune boucle active.';
    global.WWLearningLoop.advance('recall');
    state.chatbotRecall={topicId:l.topicId,topicTitle:l.topicTitle||l.sectionTitle,referenceText:l.text||'',loop:true,startedAt:Date.now()};
    save();
    return '🧠 **Phase 3/5 · Active Recall**\n\nSans regarder le texte : explique **le principe, les grandeurs/éléments clés et une conséquence ou application** en 3–6 phrases.\n\nTa réponse sera comparée uniquement au contenu disponible de cette section.';
  }
  function loopQuiz(){
    var l=global.WWLearningLoop&&global.WWLearningLoop.current?global.WWLearningLoop.current():null;
    if(!l)return '🔬 Aucune boucle active.';
    var topic=(state.topics||[]).find(function(t){return t.id===l.topicId})||null;
    if(!topic)return '📝 Cette section n’est pas reliée à un chapitre avec une Question Bank.';
    var q=getQuestion(topic);if(!q)return '📝 Aucune question disponible pour ce chapitre. Ajoute des questions dans Question Bank.';
    l.quiz={q:q,attempts:0,startedAt:Date.now()};l.phase='quiz';if(l.completed.indexOf('quiz')<0)l.completed.push('quiz');global.WWLearningLoop.set(l);
    return '📝 **Phase 4/5 · Contrôle**\n\n'+q.q+'\n\n'+(q.options||[]).map(function(o,i){return '**'+String.fromCharCode(65+i)+'.** '+o}).join('\n')+'\n\nRéponds A/B/C/D. Tu peux demander **indice**.';
  }
  function loopFinish(ok){
    var l=global.WWLearningLoop.current();if(!l)return '🔬 Aucune boucle active.';
    l.score=ok?100:0;l.phase='review';if(l.completed.indexOf('review')<0)l.completed.push('review');global.WWLearningLoop.set(l);
    if(l.topicId&&global.WWMastery&&global.WWMastery.recordReview)global.WWMastery.recordReview(state,l.topicId,!!ok);
    return '🏁 **Phase 5/5 · Bilan**\n\nRésultat du contrôle : **'+(ok?'réussi':'à consolider')+'**.\n\n🧠 Mastery : mise à jour à partir de cette tentative.\n\n🔁 Pour recommencer la boucle sur cette section : **démarrer la boucle**.\n⏹️ Pour fermer la session : **quitter boucle**.';
  }
  function sectionSession(){
    var st=state.sectionTutor;
    if(!st)return null;
    var r=global.WWSectionTutor&&global.WWSectionTutor.resource(st.resourceId),sec=r&&(r.sections||[]).find(function(x){return x.id===st.sectionId});
    if(!r||!sec)return null;
    return '📖 **Section étudiée : '+sec.title+'**\n\n📚 '+r.name+'\n🎯 '+(st.topicTitle||'Sans chapitre')+'\n\n'+(st.text||'Aucun texte extrait disponible.')+'\n\n**Mission :** résume cette section en 3–5 points, puis demande `test section` pour passer au contrôle.';
  }
  function startSection(text,c){
    if(!global.WWSectionTutor)return '📖 Module Section Tutor indisponible.';
    var active=state.documentIntelligence&&state.documentIntelligence.activeResourceId;
    if(!active)return '📚 Ouvre et analyse d’abord une ressource document dans le lecteur interne.';
    var sec=global.WWSectionTutor.find(active,text);
    if(!sec)return '📖 Aucune section détectée dans le document actif. Utilise d’abord **Sections** sur la ressource.';
    var topic=(state.topics||[]).find(function(t){return t.id===sec.topicId})||null;
    if(sec.topicId&&global.wwTopicActive&&!global.wwTopicActive(topic))return '🎯 Cette section appartient à un chapitre hors périmètre. Active-le avant de l’étudier.';
    var st=global.WWSectionTutor.build(active,sec,topic);global.WWSectionTutor.save(st);
    return sectionSession();
  }
  function sectionQuiz(){
    var st=state.sectionTutor;if(!st)return '📖 Aucune section active. Demande **étudier une section**.';
    var topic=(state.topics||[]).find(function(t){return t.id===st.topicId});
    if(!topic)return '📝 Cette section n’est pas reliée à un chapitre avec des questions.';
    var q=getQuestion(topic);if(!q)return '📝 Aucune question disponible pour ce chapitre. Ajoute des questions dans Question Bank.';
    st.quiz={q:q,score:0,startedAt:Date.now()};if(global.WWSectionTutor)global.WWSectionTutor.save(st);
    return '📝 **Contrôle de section — '+st.sectionTitle+'**\n\n'+q.q+'\n\n'+(q.options||[]).map(function(o,i){return '**'+String.fromCharCode(65+i)+'.** '+o}).join('\n')+'\n\nRéponds A/B/C/D.';
  }
  function renderEvaluation(ev,topicTitle){
    var icon=ev.verdict==='correct'?'🟢':ev.verdict==='partial'?'🟠':'🔴';
    var out=icon+' **Évaluation IA — '+(topicTitle||'réponse')+'**\n\n';
    out+='**Verdict :** '+(ev.verdict==='correct'?'Correct':ev.verdict==='partial'?'Partiellement correct':'Incorrect')+'\n';
    if(ev.feedback)out+='\n'+ev.feedback+'\n';
    if(ev.misconceptions&&ev.misconceptions.length)out+='\n⚠️ **Point à corriger :** '+ev.misconceptions.join(' · ')+'\n';
    if(ev.missingConcepts&&ev.missingConcepts.length)out+='\n📌 **À renforcer :** '+ev.missingConcepts.join(' · ')+'\n';
    if(ev.hint)out+='\n💡 **Indice :** '+ev.hint+'\n';
    if(ev.nextStep)out+='\n➡️ **Prochaine étape :** '+ev.nextStep;
    if(ev.teachingStrategy)out+='\n\n🧭 **Stratégie adaptative :** '+ev.teachingStrategy.label+' — '+ev.teachingStrategy.reason;
    return out;
  }
  function aiEvaluation(text){
    var b=state.chatbotTutorBrain||{};if(!b.pendingQuestion||!global.WWAI||!global.WWAI.evaluateAnswer||!global.WWAI.configured())return false;
    var topicId=b.lastTopicId||null,topic=(state.topics||[]).find(function(t){return t.id===topicId})||null;
    var started=Number(b.pendingStartedAt||0),latency=started?Math.max(0,Math.round((Date.now()-started)/1000)):0;
    var question=b.pendingQuestion;
    var source=String((state.sectionTutor&&state.sectionTutor.text)||(state.chatbotPdfContext&&state.chatbotPdfContext.text)||'');
    global.WWAI.evaluateAnswer(state,question,text,history.slice(-12),{topicId:topicId,sourceText:source}).then(function(res){
      if(!res.ok){add('⚠️ **Impossible d’évaluer cette tentative avec le cerveau IA.**\n\n'+res.code+'\n\nTu peux reformuler ou continuer le tutorat.','bot');return;}
      var ev=res.evaluation;ev.latency=latency;ev.hintUsed=!!b.hintUsed;
      if(global.WWStudentModel)global.WWStudentModel.update(state,{topicId:topicId,topicTitle:topic&&topic.title,verdict:ev.verdict,confidence:ev.confidence,hintUsed:ev.hintUsed,latency:latency,misconceptions:ev.misconceptions,strengths:ev.strengths});
      if(global.WWTutorMemory)global.WWTutorMemory.update(state,{topicId:topicId,topicTitle:topic&&topic.title,verdict:ev.verdict,missingConcepts:ev.missingConcepts,misconceptions:ev.misconceptions,strengths:ev.strengths,recommendedSupport:ev.recommendedSupport});
      if(topicId&&global.WWMastery){if(ev.verdict==='correct'||ev.verdict==='partial')global.WWMastery.recordReview(state,topicId,ev.verdict==='correct');else global.WWMastery.recordError(state,topicId);}
      state.chatbotTutorBrain.lastEvaluation=ev;state.chatbotTutorBrain.pendingQuestion=null;var orch=global.WWTutorOrchestrator?global.WWTutorOrchestrator.next(state,ev):null;var teach=global.WWAdaptiveTeaching&&global.WWAdaptiveTeaching.strategy?global.WWAdaptiveTeaching.strategy(state,topicId,ev):null;if(teach){ev.teachingStrategy=teach;}sessionRecord({verdict:ev.verdict,confidence:ev.confidence,hintUsed:!!state.chatbotTutorBrain.hintUsed,phase:orch&&orch.decision&&orch.decision.action,action:teach&&teach.action||orch&&orch.decision&&orch.decision.action,reason:teach&&teach.reason||orch&&orch.decision&&orch.decision.reason});state.chatbotTutorBrain.pendingStartedAt=null;state.chatbotTutorBrain.hintUsed=false;state.chatbotTutorBrain.lastTopicId=topicId;save();
      add(renderEvaluation(ev,topic&&topic.title),'bot');
      var follow=global.WWAdaptiveTeaching&&global.WWAdaptiveTeaching.nextQuestionPrompt?global.WWAdaptiveTeaching.nextQuestionPrompt(state,topicId,ev):(orch?orch.prompt:'Reste en mode socratique. Pose UNE seule question ciblée et attends la réponse.');
      save();
      global.WWAI.ask(state,follow,history.slice(-12),{sourceText:source,mode:'socratic'}).then(function(next){if(next.ok){state.chatbotTutorBrain.pendingQuestion=next.text;state.chatbotTutorBrain.pendingStartedAt=Date.now();state.chatbotTutorBrain.hintUsed=false;save();add('🧠 **Étape suivante**\n\n'+next.text,'bot')}});
    }).catch(function(err){add('⚠️ **Erreur d’évaluation : '+String(err.message||err)+'**','bot')});
    return true;
  }
  function process(raw){
    var text=String(raw||'').trim();
    if(!text)return;
    add(text,'user');
    if(input)input.value='';
    if((state.chatbotTutorBrain||{}).pendingQuestion && !/^(quitter|stop|arrêter|arret)$/.test(norm(text))){
      if(aiEvaluation(text))return;
    }
    typing();
    setTimeout(function(){
      hide();
      var c=context(),a;
      var n=norm(text);
      var det=global.WWChatModes&&global.WWChatModes.detect?global.WWChatModes.detect(text):null;
      saveBrain(det||null,text);
      if(/^(quitter boucle|stop boucle|annuler boucle)$/.test(n)){if(global.WWLearningLoop)global.WWLearningLoop.clear();a='⏹️ Boucle d’apprentissage fermée.';add(a,'bot');return;}
      if(/^(démarrer la boucle|demarrer la boucle|boucle d’apprentissage|learning loop)$/.test(n)){a=loopStart();add(a,'bot');return;}
      if(global.WWLearningLoop&&global.WWLearningLoop.current()&&/^(suivant|next)$/.test(n)){
        var lp=global.WWLearningLoop.current();
        if(lp.phase==='read')a=loopExplain();else if(lp.phase==='explain')a=loopRecall();else if(lp.phase==='review')a=loopStart();else a='📝 Termine d’abord la phase actuelle.';
        add(a,'bot');return;
      }
      if(state.chatbotRecall){a=evaluateRecall(text);add(a,'bot');return;}
      if(state.problemSolver&&state.problemSolver.active && /^(quitter|stop|arrêter|arret|annuler)$/.test(n)){global.WWProblemTutor.stop(state);save();add('⏹️ **Session de résolution arrêtée.**','bot');return;}
      if(state.problemSolver&&state.problemSolver.active && !/^(quitter|stop|arrêter|arret|annuler)$/.test(n)){
        if(det==='solve'||det==='exam'||/(indice|hint|aide)/.test(n)){
          state.problemSolver.hints=Number(state.problemSolver.hints||0)+1;
          var hp=global.WWProblemTutor?(global.WWProblemTutor.ensure(state).step):'identify';
          a='💡 **Indice progressif — '+hp+'**\n\n'+(hp==='identify'?'Commence par séparer les données connues des inconnues et note leurs unités.':hp==='model'?'Quelle loi relie directement les grandeurs que tu as identifiées ?':hp==='derive'?'Écris la relation littérale avant toute substitution numérique.':hp==='calculate'?'Calcule étape par étape et conserve les unités.':hp==='check'?'Vérifie les dimensions, le signe et l’ordre de grandeur.':'Interprète ton résultat et vérifie qu’il répond bien à la question.');
          save();add(a,'bot');return;
        }
        var ps=global.WWProblemTutor.ensure(state);ps.attempts=Number(ps.attempts||0)+1;
        if(global.WWAI&&global.WWAI.configured()){
          typing();
          var pp=ps.mode==='exam'?global.WWProblemTutor.examPrompt(state,text):global.WWProblemTutor.prompt(state,text);
          global.WWAI.ask(state,pp,history.slice(-12),{mode:ps.mode,sourceText:String((state.sectionTutor&&state.sectionTutor.text)||(state.chatbotPdfContext&&state.chatbotPdfContext.text)||'')}).then(function(res){hide();if(res.ok){add('🧪 **Feedback de résolution**\n\n'+res.text,'bot');var next=global.WWProblemTutor.nextStep(state);ps.step=next;ps.lastFeedback=res.text;save();}else add('⚠️ Impossible de contacter le cerveau IA. Continue étape par étape ou demande **indice**.','bot')});
        }else{
          a='🧪 **Coach de résolution local**\n\nÉtape actuelle : **'+ps.step+'**. Décompose ton travail puis demande **indice** si tu bloques. Prochaine étape : **'+global.WWProblemTutor.nextStep(state)+'**.';add(a,'bot');
        }
        return;
      }
      if(state.sectionTutor&&state.sectionTutor.quiz){
        var qst=state.sectionTutor.quiz,q=qst.q,ev=global.WWChatEvaluator&&global.WWChatEvaluator.feedback?global.WWChatEvaluator.feedback(q,text):null;
        if(ev&&ev.correct){state.sectionTutor.quiz=null;if(global.WWMastery&&global.WWMastery.recordReview)global.WWMastery.recordReview(state,state.sectionTutor.topicId,true);if(global.saveState)global.saveState();a='✅ **Correct.**\n\n'+(q.explanation||q.why||'Bonne réponse.')+'\n\n📖 Section : **'+state.sectionTutor.sectionTitle+'**';}
        else a='❌ **Pas encore.**\n\n'+hint(q)+'\n\nRéessaie.';
        add(a,'bot');return;
      }
      if(pending&&pending.type==='tutor'){a=answerTutor(text);add(a,'bot');return;}
      if(/^(test section|teste la section|quiz section)$/.test(n)){a=sectionQuiz();add(a,'bot');return;}
      if(/^(controle de la boucle|contrôle de la boucle|quiz boucle)$/.test(n)){a=loopQuiz();add(a,'bot');return;}
      if(/^(boucle|learning loop)$/.test(n)){a=loopStart();add(a,'bot');return;}
      if(/(etudier une section|étudier une section|section de ce document|etudie la section|étudie la section)/.test(n)){a=startSection(text.replace(/.*?(etudier une section|étudier une section|etudie la section|étudie la section)/i,'').trim(),c);add(a,'bot');return;}
      if(/^(aide|help|menu)$/.test(n)){a='🐺 **Academic Tutor 3.0 + AI Brain**\n\n🧑‍🏫 Tutor guidé · 💡 Explain · 🔬 Deep Study · 🧠 Active Recall · ✏️ Solve · ✅ Correct · 📝 Exam · 🔁 Revision · 📚 PDF local.\n\nPendant un test : **indice** donne un indice. Le cerveau IA peut aussi répondre aux questions libres et adapter l’explication à ton contexte académique.';add(a,'bot');return;}
      if(/(perimetre|périmètre|chapitres actifs|scope)/.test(n)){a=scope(c);add(a,'bot');return;}
      if(/(prérequis|prerequis|pré-requis|prerequisite)/.test(n)){var pt=target(c,text);a=window.WWPrerequisite&&pt?window.WWPrerequisite.explain(state,pt.id):'🎯 Active un chapitre puis demande ses prérequis.';add(a,'bot');return;}
      if(/(concept.*li|liens.*concept|knowledge graph|graphe)/.test(n)){var gt=target(c,text);var ns=window.WWTutorGraph&&gt?window.WWTutorGraph.neighbours(state,gt.id):[];a=gt?(ns.length?'🕸️ **Concepts liés à '+gt.title+'**\n\n'+ns.map(function(x){return '• **'+x.topic.title+'** — '+x.type+' · maîtrise '+Math.round(x.mastery)+'%'}).join('\n'):'🕸️ Aucun lien enregistré pour ce chapitre.'):'🎯 Active un chapitre.';add(a,'bot');return;}
      if(/(progress|stats|statistique|temps.*etud|combien.*etud)/.test(n)){a=stats(c);add(a,'bot');return;}
      if(/(point faible|faible|erreur|difficulte|difficulté)/.test(n)){a=c.weak&&c.weak.length?'🎯 **Point prioritaire : '+c.weak[0].topic.title+'** — maîtrise '+c.weak[0].score+'%.':'🧠 Pas assez de données de maîtrise.';add(a,'bot');return;}
      if(/(tutor|tuteur|accompagne-moi|guide-moi)/.test(n)){a=startTutor(target(c,text));add(a,'bot');return;}
      if(det==='revision'){a=revision(c);add(a,'bot');return;}
      if(det==='recall'){a=c.topics.length?startRecall(target(c,text)):'🎯 Active un chapitre.';add(a,'bot');return;}
      if(det==='socratic'){state.chatbotTutorBrain=state.chatbotTutorBrain||{mode:'tutor',turns:0,lastTopicId:null,lastActivity:null};state.chatbotTutorBrain.mode='socratic';state.chatbotTutorBrain.socratic=true;var socTopic=target(c,text);sessionStart(socTopic,'socratic');save();if(global.WWAI&&global.WWAI.configured&&global.WWAI.configured()){add('🧠 **Séance socratique démarrée.**<br><br>Objectif : comprendre → appliquer → démontrer. Je vais adapter la difficulté à tes réponses.','bot');var aiMode='socratic';saveBrain(aiMode,text);global.WWAI.ask(state,'Commence maintenant une séance socratique sur le chapitre actif le plus pertinent. Pose UNE seule question diagnostique courte et attends ma réponse. Ne donne pas la solution.',history.slice(-12),{sourceText:String((state.sectionTutor&&state.sectionTutor.text)||(state.chatbotPdfContext&&state.chatbotPdfContext.text)||''),mode:aiMode}).then(function(res){if(res.ok){state.chatbotTutorBrain.pendingQuestion=res.text;state.chatbotTutorBrain.pendingStartedAt=Date.now();state.chatbotTutorBrain.hintUsed=false;save();add(res.text,'bot')}else add('⚠️ Le cerveau IA est indisponible. Tu peux tout de même utiliser le tutor guidé local.','bot')});return;}a='🧠 **Mode socratique activé.**<br><br>'+((target(c,text))?'Choisis une question ou écris le thème que tu veux raisonner étape par étape.':'Active d’abord un chapitre dans ton périmètre.');add(a,'bot');return;}
      if(det==='exam'){var et=target(c,text);if(global.WWProblemTutor)global.WWProblemTutor.start(state,'exam',et,'');a='📝 **Mode Examen avancé activé.**\n\nEnvoie l’énoncé. Je corrigerai ta résolution étape par étape, avec une exigence renforcée sur les hypothèses, unités, justification et contrôle final. **Aucune solution complète avant ta tentative.**';save();add(a,'bot');return;}
      if(det==='explain'){a=explain(c,text,false);add(a,'bot');return;}
      if(det==='deep'){a=explain(c,text,true);add(a,'bot');return;}
      if(det==='solve'){var st=target(c,text);if(global.WWProblemTutor)global.WWProblemTutor.start(state,'solve',st,'');a='✏️ **Coach de résolution activé**\n\nEnvoie maintenant **l’énoncé complet**. Je suivrai : **données → inconnues → modèle → équations → calcul → unités → contrôle → conclusion**. Tu peux demander **indice** à chaque étape.';save();add(a,'bot');return;}
      if(det==='correct'){a='✅ **Correction**\n\nEnvoie l’énoncé et ta réponse complète. Je séparerai les éléments corrects, les erreurs, leur cause et la correction.';add(a,'bot');return;}
      if(/(quiz|teste-moi|test)/.test(n)){a=startTutor(target(c,text));add(a,'bot');return;}
      if(global.WWAI&&global.WWAI.configured&&global.WWAI.configured()){
        var localText=String((state.sectionTutor&&state.sectionTutor.text)||(state.chatbotPdfContext&&state.chatbotPdfContext.text)||'');
        var aiHistory=history.slice(-12);
        add('⏳ **Le cerveau IA réfléchit…**','bot');
        var aiMode=modeFor(text);saveBrain(aiMode,text);global.WWAI.ask(state,text,aiHistory,{sourceText:localText,mode:aiMode}).then(function(res){
          if(res.ok){if(aiMode==='socratic'){state.chatbotTutorBrain.pendingQuestion=res.text;state.chatbotTutorBrain.pendingStartedAt=Date.now();state.chatbotTutorBrain.hintUsed=false;save()}add(res.text,'bot');}
          else add('⚠️ **Le service IA n’a pas pu répondre.**\n\n'+(res.code==='API_KEY_MISSING'?'Configure ta clé API dans ⚙️ → 🧠 IA Tutor.':'Détail : '+res.code+'\n\nLe tutor local reste disponible.'),'bot');
        }).catch(function(err){add('⚠️ **Erreur IA : '+String(err.message||err)+'**\n\nLe tutor local reste disponible.','bot');});
        return;
      }
      var localScience=science(text);
      if(localScience){a=explain(c,text,false);add(a,'bot');return;}
      add('🤔 Essaie : **explique UV/Visible**, **teste-moi**, **tutor guidé**, **rappel actif**, **que dois-je étudier ?**, **indice** ou **corrige ma réponse**.\n\n🧠 Pour activer le cerveau IA, ouvre **⚙️ → IA Tutor**.','bot');
    },140);
  }
  function bind(){var fab=document.getElementById('chatbot-fab'),close=document.getElementById('chatbot-close'),send=document.getElementById('chatbot-send'),clear=document.getElementById('chatbot-clear');if(fab)fab.onclick=open;if(close)close.onclick=function(){var w=document.getElementById('chatbot-window');if(w)w.classList.remove('open')};if(send)send.onclick=function(){process(input&&input.value)};if(input)input.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();process(input.value)}};document.querySelectorAll('[data-chat-quick]').forEach(function(b){b.onclick=function(){open();var q=this.dataset.chatQuick;if(q==='socratic')process('tutor socratique');else if(q==='stats')process('analyse ma progression');else if(q==='explain')process('explique mon chapitre');else if(q==='recall')process('rappel actif');else if(q==='exam')process('teste-moi');else if(q==='tutor')process('tutor guidé');else if(q==='section')process('étudier une section');else if(q==='revision')process('que dois-je étudier ?');else process('aide')}});if(clear)clear.onclick=function(){history.length=0;pending=null;state.chatbotTutor=null;save();render()}}
  return{init:function(){render();quick();bind()},process:process,context:context,openDocument:openDocument,version:VERSION};
 }
 global.WWChatbot={create:create,version:VERSION};
})(window);
