/* WHITE WOLF SCHOLAR V65.19 — AI Gateway / Tutor Brain */
(function(global){'use strict';
  var VERSION='65.20';
  var KEY='ww_ai_gateway_config_v1';
  var DEFAULT={provider:'gemini',model:'gemini-2.5-flash',enabled:false};
  function load(){try{var x=JSON.parse(localStorage.getItem(KEY)||'null');return Object.assign({},DEFAULT,x||{})}catch(e){return Object.assign({},DEFAULT)}}
  function save(c){try{localStorage.setItem(KEY,JSON.stringify(Object.assign({},DEFAULT,c||{})));return true}catch(e){return false}}
  function clear(){try{localStorage.removeItem(KEY)}catch(e){} }
  function configured(){var c=load();return !!(c.enabled&&c.apiKey)}
  function cleanText(x,max){x=String(x==null?'':x);return x.length>max?x.slice(0,max)+'…':x}
  function buildPrompt(state,userText,extra){
    var c=global.WWChatContext&&global.WWChatContext.build?global.WWChatContext.build(state):{topics:[],weak:[],errors:[],sessions:[],totalMinutes:0};
    var active=(c.topics||[]).slice(0,30).map(function(t){return {id:t.id,title:t.title,subject:t.subject_name||t.subjectName||'',mastery:t.score||t.mastery||0}});
    var weak=(c.weak||[]).slice(0,8).map(function(x){return {title:x.topic&&x.topic.title||'',score:x.score||0,evidence:x.evidence||{}}});
    var errors=(c.errors||[]).slice(0,10).map(function(e){return {description:e.description||e.desc||'',topic:e.topic_title||e.topicTitle||'',difficulty:e.difficulty||'',reviewed:e.reviewed||0,status:e.status||''}});
    var section=state.sectionTutor||null, pdf=state.chatbotPdfContext||null;
    var brain=state.chatbotTutorBrain||{};
    var profile=global.WWTutorSession&&global.WWTutorSession.learningProfile?global.WWTutorSession.learningProfile(state):null;
    var memory=global.WWTutorMemory&&global.WWTutorMemory.context?global.WWTutorMemory.context(state,brain.lastTopicId||null):null;
    var prerequisite=global.WWPrerequisite&&brain.lastTopicId?global.WWPrerequisite.plan(state,brain.lastTopicId):null;
    var teaching=global.WWAdaptiveTeaching&&global.WWAdaptiveTeaching.strategy?global.WWAdaptiveTeaching.strategy(state,brain.lastTopicId,null):null;

    var student=global.WWStudentModel&&global.WWStudentModel.profile?global.WWStudentModel.profile(state,brain.lastTopicId||null):null;
    var sourceText=(extra&&extra.sourceText)||(section&&section.text)||(pdf&&pdf.text)||'';
    if(global.WWTutorHardening&&global.WWTutorHardening.sanitizeMemory)global.WWTutorHardening.sanitizeMemory(state);
    var hard=global.WWTutorHardening&&global.WWTutorHardening.compactContext?global.WWTutorHardening.compactContext(state):null;
    var mode=(extra&&extra.mode)||brain.mode||'tutor';
    var modeRules={
      socratic:'Sois un tuteur socratique strict : ne donne pas directement la réponse. Pose UNE question ciblée à la fois pour faire construire le raisonnement par l’étudiant. Si sa réponse est correcte, augmente légèrement le niveau; si elle est fausse ou partielle, identifie le point précis puis pose une question plus simple ou un indice. N’avance jamais plus d’une étape à la fois.',
      tutor:'Conduis un tutorat socratique : diagnostique d’abord, donne une petite étape, attends la réponse, puis adapte. Ne donne pas immédiatement toute la solution d’un exercice si un guidage est possible.',
      explain:'Explique progressivement. Commence simple puis augmente le niveau. Termine par une mini-question de vérification.',
      deep:'Fais une étude approfondie : définitions, hypothèses, dérivation, équations, interprétation physique/chimique, limites et liens avec les autres notions.',
      recall:'Teste la récupération active. Pose UNE question à la fois, sans donner la réponse avant la tentative. Après réponse : corrige, explique brièvement et augmente/réduis la difficulté.',
      solve:'Guide la résolution : données → inconnues → modèle/loi → unités → calcul → contrôle. Demande une étape à l’étudiant quand c’est pédagogiquement utile.',
      correct:'Analyse la réponse de l’étudiant. Sépare exact, incomplet, erreur conceptuelle, erreur de calcul et correction. Explique la cause plutôt que seulement donner la bonne réponse.',
      exam:'Agis comme examinateur. Une question à la fois, difficulté adaptée au niveau de maîtrise, feedback seulement après tentative et bilan final.',
      revision:'Construis une révision ciblée uniquement dans le périmètre actif, en donnant des priorités explicables puis une courte activité.'
    };
    return [
      'IDENTITÉ: Tu es le cerveau IA du Academic Tutor de White Wolf Scholar, un tuteur universitaire personnel en Analyse Physicochimique.',
      'RÔLE: Tu n’es pas un chatbot généraliste. Tu accompagnes un étudiant sur la durée et adaptes ton enseignement à son état académique.',
      'OBJECTIF: faire progresser compréhension, application, exercices et autonomie. Cherche la compréhension réelle plutôt que la simple production de réponses. En mode socratique, la conversation doit ressembler à un dialogue de raisonnement, pas à un cours magistral.',
      'MODE ACTUEL: '+mode+' — '+(modeRules[mode]||modeRules.tutor),
      'RÈGLE ABSOLUE DU PÉRIMÈTRE: le périmètre d’étude choisi par l’étudiant est la frontière active. N’enseigne, ne propose ni ne planifie spontanément un chapitre hors périmètre. Un sujet hors périmètre peut seulement être expliqué si l’étudiant le demande explicitement.',
      'RÈGLE DE CONTEXTE: utilise les données ci-dessous pour personnaliser le tutorat, mais ne prétends pas connaître une information qui n’y figure pas.',
      'RÈGLE DE SOURCE: si un texte de cours/section est fourni, traite-le comme source prioritaire pour ce contenu. Distingue clairement source locale et connaissances générales. N’invente jamais citation, page, définition ou résultat absent de la source.',
      'RÈGLE SCIENTIFIQUE: vérifie unités, dimensions, hypothèses, signes, ordres de grandeur et cohérence physique/chimique lorsque pertinent. Signale les hypothèses nécessaires.',
      'RÈGLE PÉDAGOGIQUE: ne surcharge pas. Une réponse doit généralement avoir une prochaine action claire pour l’étudiant. Pose une seule question à la fois lorsqu’une réponse de l’étudiant est nécessaire. En mode socratique, termine par une question unique et n’ajoute pas la solution juste après.',
      'ADAPTATION: maîtrise faible → plus d’intuition, exemples et indices; maîtrise moyenne → questions intermédiaires; maîtrise élevée → problèmes transférables, pièges et justification. Ne change pas les données de Mastery toi-même.',
      'ANTI-CHEAT PÉDAGOGIQUE: si l’étudiant demande seulement la réponse d’un exercice, propose d’abord un indice ou la prochaine étape, sauf s’il demande explicitement la solution complète.',
      'STYLE: réponds en français, clair, scientifique et structuré. Utilise Markdown et équations lisibles.',
      'ÉTAT DU TUTEUR:', JSON.stringify({mode:mode,turns:brain.turns||0,lastTopicId:brain.lastTopicId||null,lastActivity:brain.lastActivity||null,pendingQuestion:cleanText(brain.pendingQuestion||'',5000)}),
      'HARDENING / CONTEXTE SÛR:', JSON.stringify(hard||{}),
      'MODÈLE DE L’ÉTUDIANT:', JSON.stringify(student||{}),
      'MÉMOIRE LONG TERME DU TUTEUR:', JSON.stringify(memory||{}),
      'PREREQUISITE INTELLIGENCE:', JSON.stringify(prerequisite||{}),
      'ADAPTIVE TEACHING STRATEGY:', JSON.stringify(teaching||{}),
      'KNOWLEDGE GRAPH: les relations sont des métadonnées explicites de l’application. Elles servent à proposer une vérification de prérequis; elles ne constituent pas à elles seules une preuve de causalité ni de maîtrise.',
      'ÉTAT ACADÉMIQUE:', JSON.stringify({activeTopics:active,weakTopics:weak,errors:errors,totalStudyMinutes:c.totalMinutes||0,activeCount:c.activeCount||active.length}),
      'CONTEXTE SECTION:', JSON.stringify(section?{title:section.sectionTitle,topicId:section.topicId,topicTitle:section.topicTitle}:null),
      'SOURCE LOCALE:', cleanText(sourceText,22000),
      'QUESTION DE L’ÉTUDIANT:', cleanText(userText,14000)
    ].join('\n\n');
  }
  function extractJSON(text){
    var raw=String(text||'').trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
    try{return JSON.parse(raw)}catch(e){}
    var a=raw.indexOf('{'),b=raw.lastIndexOf('}');
    if(a>=0&&b>a){try{return JSON.parse(raw.slice(a,b+1))}catch(e){}}
    return null;
  }
  async function evaluateAnswer(state,question,answer,history,extra){
    var cfg=load();if(!cfg.apiKey)return {ok:false,code:'API_KEY_MISSING'};
    var c=global.WWChatContext&&global.WWChatContext.build?global.WWChatContext.build(state):{};
    var topicId=(extra&&extra.topicId)||(state.chatbotTutorBrain&&state.chatbotTutorBrain.lastTopicId)||null;
    var profile=global.WWStudentModel&&global.WWStudentModel.profile?global.WWStudentModel.profile(state,topicId):{};
    var teaching=global.WWAdaptiveTeaching&&global.WWAdaptiveTeaching.strategy?global.WWAdaptiveTeaching.strategy(state,topicId,null):null;
    var prompt=[
      'Évalue la réponse de l’étudiant comme un enseignant universitaire en Analyse Physicochimique.',
      'QUESTION/TÂCHE DU TUTEUR:',cleanText(question,9000),
      'RÉPONSE DE L’ÉTUDIANT:',cleanText(answer,9000),
      'CONTEXTE DE SECTION:',cleanText((extra&&extra.sourceText)||'',12000),
      'PROFIL ÉTUDIANT:',JSON.stringify(profile),
      'STRATÉGIE PÉDAGOGIQUE COURANTE:',JSON.stringify(teaching||{}),
      'Réponds UNIQUEMENT en JSON valide avec les champs: verdict (correct|partial|incorrect), confidence (0..1), detectedConcepts (array), missingConcepts (array), misconceptions (array), strengths (array), feedback (string), hint (string), nextStep (string), recommendedSupport (intuition|guided|challenge), masterySignal (positive|neutral|negative).',
      'Ne donne pas une solution complète si un guidage suffit. Base-toi sur la source fournie lorsqu’elle existe; sinon indique l’incertitude.'
    ].join('\n\n');
    try{
      var model=cfg.model||DEFAULT.model;
      var url='https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent?key='+encodeURIComponent(cfg.apiKey);
      var body={systemInstruction:{parts:[{text:'Tu es l’évaluateur pédagogique de White Wolf Scholar.\n'+prompt}]},contents:contentsFromHistory(history||[],answer),generationConfig:{temperature:0.15,maxOutputTokens:1200,responseMimeType:'application/json'}};
      var r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});var data={};try{data=await r.json()}catch(e){}
      if(!r.ok)throw new Error((data.error&&data.error.message)||('HTTP_'+r.status));
      var text='';if(data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts)text=data.candidates[0].content.parts.map(function(p){return p.text||''}).join('');
      var obj=extractJSON(text);if(!obj)throw new Error('INVALID_EVALUATION_JSON');
      obj.verdict=['correct','partial','incorrect'].indexOf(obj.verdict)>=0?obj.verdict:'partial';obj.confidence=Math.max(0,Math.min(1,Number(obj.confidence)||0));return {ok:true,evaluation:obj,provider:'gemini',model:model};
    }catch(e){return {ok:false,code:String(e.message||e),provider:'gemini'}}
  }
  function contentsFromHistory(history,userText){
    var h=(history||[]).filter(function(x){return x&&x.role&&x.text}).slice(-12);
    var out=h.map(function(x){return {role:x.role==='user'?'user':'model',parts:[{text:cleanText(x.text,5000)}]}});
    out.push({role:'user',parts:[{text:userText}]});return out;
  }
  async function gemini(state,userText,history,extra){
    var cfg=load();if(!cfg.apiKey)throw new Error('API_KEY_MISSING');
    var model=cfg.model||DEFAULT.model;
    var url='https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+':generateContent?key='+encodeURIComponent(cfg.apiKey);
    var body={systemInstruction:{parts:[{text:'Tu es le cerveau pédagogique de White Wolf Scholar.\n'+buildPrompt(state,userText,extra)}]},contents:contentsFromHistory(history,userText),generationConfig:{temperature:0.35,maxOutputTokens:1800}};
    var r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    var data={};try{data=await r.json()}catch(e){}
    if(!r.ok)throw new Error((data.error&&data.error.message)||('HTTP_'+r.status));
    var text='';if(data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts)text=data.candidates[0].content.parts.map(function(p){return p.text||''}).join('');
    if(!text)throw new Error('EMPTY_RESPONSE');return text.trim();
  }
  async function ask(state,userText,history,extra){
    var cfg=load();
    if(!cfg.enabled||!cfg.apiKey)return {ok:false,code:'NOT_CONFIGURED'};
    if(cfg.provider!=='gemini')return {ok:false,code:'PROVIDER_NOT_IMPLEMENTED'};
    try{return {ok:true,text:await gemini(state,userText,history,extra),provider:'gemini',model:cfg.model||DEFAULT.model}}catch(e){return {ok:false,code:String(e.message||e),provider:'gemini'}}
  }
  global.WWAI={version:VERSION,defaults:DEFAULT,load:load,save:save,clear:clear,configured:configured,ask:ask,evaluateAnswer:evaluateAnswer,buildPrompt:buildPrompt};
})(window);
