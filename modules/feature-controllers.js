/* WHITE WOLF V63.2 — Feature Controllers
 * Thin orchestration layer. Controllers receive explicit dependencies from the app;
 * they do not reach into private application scope or own persistence.
 */
(function(global){
  'use strict';
  function create(ctx){
    var state=ctx.state;
    function finish(){ctx.saveState();ctx.render()}
    var quran={
      tab:function(el){state.quranTab=el.dataset.quranTab;finish()},
      level:function(id,delta){ctx.wwQuranEnsureData();var s=state.quranSurahs.find(function(x){return x.id===id});if(!s)return;if(delta>0&&s.level<4){s.level++;s.lastReviewed=ctx.wwTodayISO();s.reviews=(s.reviews||0)+1}else if(delta<0&&s.level>0){s.level--;s.lastReviewed=ctx.wwTodayISO()}finish()},
      juz:function(id){ctx.wwQuranEnsureData();var j=state.quranJuz.find(function(x){return x.id===id});if(!j)return;j.read=!j.read;j.readAt=j.read?ctx.wwTodayISO():null;var active=ctx.wwQuranCurrentKhatma();var read=state.quranJuz.filter(function(x){return x.read}).length;if(active&&read===30){active.completedAt=ctx.wwTodayISO();active.status='completed';var kid=ctx.generateId(),nextNum=state.quranKhatmas.length+1;state.quranKhatmas.push({id:kid,number:nextNum,startedAt:ctx.wwTodayISO(),completedAt:null,status:'active'});state.quranCurrentKhatmaId=kid;state.quranJuz=ctx.wwQuranDefaultJuz();ctx.showToast('🏆 مبارك! أتممت الختمة #'+active.number)}finish()},
      newKhatma:function(){if(!confirm('بدء ختمة جديدة؟ سيتم الاحتفاظ بكل الختمات السابقة.'))return;var active=ctx.wwQuranCurrentKhatma();if(active&&state.quranJuz.some(function(j){return j.read}))active.status='paused';var id=ctx.generateId(),nextNum=state.quranKhatmas.length+1;state.quranKhatmas.push({id:id,number:nextNum,startedAt:ctx.wwTodayISO(),completedAt:null,status:'active'});state.quranCurrentKhatmaId=id;state.quranJuz=ctx.wwQuranDefaultJuz();finish()}
    };
    var planning={
      edit:function(){state.isEditingPlanning=true;ctx.render()},
      cancel:function(){state.isEditingPlanning=false;ctx.render()},
      resetDay:function(key){var i=document.getElementById('planning-input-'+key);if(i)i.value=ctx.DEFAULT_SCHEDULE[key]||''},
      save:function(){var keys=['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'],ns={};keys.forEach(function(k){var i=document.getElementById('planning-input-'+k);if(i)ns[k]=String(i.value||'').replace(/\r\n?/g,'\n').trim()});state.customSchedule=ns;state.isEditingPlanning=false;if(window.WWAcademicEvents)WWAcademicEvents.emit('PLANNING_UPDATED',{schedule:Object.assign({},ns),updatedAt:new Date().toISOString(),source:'planning'});finish()}
    };
    var tasks={
      add:function(){state.modal={type:'task'};ctx.render()},
      save:function(){var text=document.getElementById('task-text').value.trim(),date=document.getElementById('task-date').value,time=(document.getElementById('task-time')||{}).value||'',deadlineTime=(document.getElementById('task-deadline-time')||{}).value||'',estimatedMinutes=Math.max(0,Number((document.getElementById('task-estimated-min')||{}).value)||0),priority=document.getElementById('task-priority').value;if(!text){alert('Écrire une tâche');return}if(time&&deadlineTime){var a=time.split(':').map(Number),b=deadlineTime.split(':').map(Number),am=(a[0]||0)*60+(a[1]||0),bm=(b[0]||0)*60+(b[1]||0);if(bm<=am){alert('L’heure limite doit être après l’heure de début.');return}if(!estimatedMinutes)estimatedMinutes=bm-am}if(!estimatedMinutes)estimatedMinutes=30;var task={id:ctx.generateId(),text:text,priority:priority,date:date,time:time,deadlineTime:deadlineTime,estimatedMinutes:estimatedMinutes,isDone:false};state.tasks.push(task);if(window.WWAcademicEvents)WWAcademicEvents.emit('TASK_CREATED',{taskId:task.id,date:date,time:time,deadlineTime:deadlineTime,estimatedMinutes:estimatedMinutes,priority:priority});state.modal=null;finish()},
      done:function(id){var t=state.tasks.find(function(x){return x.id===id});if(t){t.isDone=true;state.xp+=5;if(window.WWAcademicEvents)WWAcademicEvents.emit('TASK_COMPLETED',{taskId:t.id,subjectId:t.subject_id||t.subjectId||null,topicId:t.topic_id||t.topicId||null});finish()}},
      remove:function(id){state.tasks=state.tasks.filter(function(x){return x.id!==id});finish()}
    };
    var exams={
      add:function(){state.modal={type:'exam'};ctx.render()},
      save:function(){var title=document.getElementById('exam-title').value,date=document.getElementById('exam-date').value,time=document.getElementById('exam-time').value,subjectId=document.getElementById('exam-subject').value,room=document.getElementById('exam-room').value.trim();if(!title||!date){alert('Titre et date requis');return}var exam={id:ctx.generateId(),title:title,date:date,time:time,subject_id:subjectId||null,room:room};state.exams.push(exam);if(window.WWAcademicEvents)WWAcademicEvents.emit('EXAM_UPDATED',{examId:exam.id,subjectId:subjectId||null,title:title,date:date,source:'exam'});state.modal=null;finish()},
      remove:function(id){state.exams=state.exams.filter(function(x){return x.id!==id});finish()}
    };
    var study={
      open:function(topicId){state.modal={type:'session',topicId:topicId};ctx.render()},
      save:function(topicId){var date=document.getElementById('session-date').value,duration=parseInt(document.getElementById('session-duration').value),p=ctx.getProgress(topicId);p.level=Math.min(p.level+1,4);p.score=ctx.computeMasteryScore(topicId);p.last_studied=ctx.wwLocalDateISO(new Date());state.progress[topicId]=p;state.xp+=5;var started=new Date(date+'T12:00:00').toISOString();state.sessions.push({id:ctx.generateId(),topic_id:topicId,subject_id:(state.topics.find(function(t){return t.id===topicId})||{}).subject_id||null,date:date,duration:duration,source:'manual',started_at:started,ended_at:new Date(new Date(started).getTime()+duration*60000).toISOString()});if(window.WWMastery)window.WWMastery.recordSession(state,topicId,duration);if(window.WWAcademicEvents)WWAcademicEvents.emit('SESSION_COMPLETED',{sessionId:state.sessions[state.sessions.length-1].id,subjectId:(state.topics.find(function(t){return t.id===topicId})||{}).subject_id||null,topicId:topicId,actualMinutes:duration,startedAt:started,endedAt:new Date(new Date(started).getTime()+duration*60000).toISOString(),activityType:'manual'});state.modal=null;ctx.showToast('✅ Session enregistrée');finish()}
    };
    var flashcards={
      start:function(){var L=ctx.getLang(state.fcLang||state.langId),due=ctx.getCardsDueToday(L.id);if(!due.length){ctx.showToast('Aucune carte');return}state.fcSession={cards:due,currentIdx:0,reviewed:0,correct:0};state.fcScreen='session';state.fcFlipped=false;ctx.render()},
      smart:function(){var L=ctx.getLang(state.fcLang||state.langId),q=ctx.wwSR2Queue(L.id,12);if(!q.length){ctx.showToast('Aucune carte prioritaire');return}state.fcSession={cards:q.map(function(x){return x.card}),currentIdx:0,reviewed:0,correct:0,smart:true};state.fcScreen='session';state.fcFlipped=false;ctx.render()},
      end:function(){state.fcSession=null;state.fcScreen='list';state.fcFlipped=false;ctx.render()},
      flip:function(){state.fcFlipped=!state.fcFlipped;ctx.render()},
      quality:function(quality){var L=ctx.getLang(state.fcLang||state.langId);if(!state.fcSession)return;var card=state.fcSession.cards[state.fcSession.currentIdx];if(!card)return;ctx.updateCardReview(L.id,card.id,quality);if(window.WWAcademicEvents)WWAcademicEvents.emit('FLASHCARD_REVIEWED',{cardId:card.id,success:quality!=='hard',source:'flashcard'});state.fcSession.reviewed++;if(quality!=='hard')state.fcSession.correct++;state.xp+=2;state.fcSession.currentIdx++;state.fcFlipped=false;finish()},
      add:function(){state.modal={type:'addFcManual'};ctx.render()},
      save:function(){var q=document.getElementById('fc-q').value,a=document.getElementById('fc-a').value;if(!q||!a){alert('Question et réponse requises');return}var L=ctx.getLang(state.fcLang||state.langId);if(!state.flashcards[L.id])ctx.getFlashcardsForLanguage(L.id);state.flashcards[L.id].push({id:'fc_manual_'+ctx.generateId(),langId:L.id,question:q,answer:a,hint:'',auto:false});state.modal=null;ctx.showToast('✅ Ajoutée');finish()},
      remove:function(id){var L=ctx.getLang(state.fcLang||state.langId);if(state.flashcards[L.id]){state.flashcards[L.id]=state.flashcards[L.id].filter(function(c){return c.id!==id});if(state.fcReview[L.id]&&state.fcReview[L.id][id])delete state.fcReview[L.id][id];finish()}}
    };
    function bind(root){
      if(!root||root.dataset.wwControllersBound==='1')return;
      root.dataset.wwControllersBound='1';
      root.addEventListener('click',function(e){
        var el=e.target.closest('[data-quran-tab],[data-quran-level-up],[data-quran-level-down],[data-juz-toggle],[data-start-new-khatma],[data-edit-planning],[data-cancel-planning],[data-save-planning],[data-reset-day],[data-add-task],[data-save-task],[data-task-done],[data-task-delete],[data-add-exam],[data-save-exam],[data-delete-exam],[data-session-topic],[data-save-session],[data-start-fc-session],[data-start-smart-fc],[data-end-fc-session],[data-flip-card],[data-fc-quality],[data-add-fc-manual],[data-save-fc],[data-delete-fc]');
        if(!el)return;
        if(el.matches('[data-quran-tab]')){e.stopPropagation();return quran.tab(el)}
        if(el.matches('[data-quran-level-up]')){e.stopPropagation();return quran.level(el.dataset.quranLevelUp,1)}
        if(el.matches('[data-quran-level-down]')){e.stopPropagation();return quran.level(el.dataset.quranLevelDown,-1)}
        if(el.matches('[data-juz-toggle]'))return quran.juz(el.dataset.juzToggle);
        if(el.matches('[data-start-new-khatma]'))return quran.newKhatma();
        if(el.matches('[data-edit-planning]'))return planning.edit();
        if(el.matches('[data-cancel-planning]'))return planning.cancel();
        if(el.matches('[data-save-planning]'))return planning.save();
        if(el.matches('[data-reset-day]'))return planning.resetDay(el.dataset.resetDay);
        if(el.matches('[data-add-task]'))return tasks.add();
        if(el.matches('[data-save-task]'))return tasks.save();
        if(el.matches('[data-task-done]')){e.stopPropagation();return tasks.done(el.dataset.taskDone)}
        if(el.matches('[data-task-delete]')){e.stopPropagation();return tasks.remove(el.dataset.taskDelete)}
        if(el.matches('[data-add-exam]'))return exams.add();
        if(el.matches('[data-save-exam]'))return exams.save();
        if(el.matches('[data-delete-exam]')){e.stopPropagation();return exams.remove(el.dataset.deleteExam)}
        if(el.matches('[data-session-topic]')){e.stopPropagation();return study.open(el.dataset.sessionTopic)}
        if(el.matches('[data-save-session]'))return study.save(el.dataset.saveSession);
        if(el.matches('[data-start-fc-session]'))return flashcards.start();
        if(el.matches('[data-start-smart-fc]'))return flashcards.smart();
        if(el.matches('[data-end-fc-session]'))return flashcards.end();
        if(el.matches('[data-flip-card]'))return flashcards.flip();
        if(el.matches('[data-fc-quality]'))return flashcards.quality(el.dataset.fcQuality);
        if(el.matches('[data-add-fc-manual]'))return flashcards.add();
        if(el.matches('[data-save-fc]'))return flashcards.save();
        if(el.matches('[data-delete-fc]')){e.stopPropagation();return flashcards.remove(el.dataset.deleteFc)}
      });
    }
    return {bind:bind,quran:quran,planning:planning,tasks:tasks,exams:exams,study:study,flashcards:flashcards};
  }
  global.WWFeatureControllers={create:create};
})(window);
