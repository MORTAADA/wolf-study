/* WHITE WOLF SCHOLAR V65.28 — Cross-feature application services */
(function(global){
  'use strict';
  var R=global.WWAcademicRepositories, B=global.WWEventBus, E=global.WWAcademicEntities;
  function emit(type,payload){if(B&&B.emit)B.emit(type,Object.assign({source:'academic-services',at:Date.now()},payload||{}))}
  async function saveEntity(kind,data,eventType){var e=await R[kind].upsert(data);if(eventType)emit(eventType,{entityId:e.id,entityType:e.type,subjectId:e.subjectId||null,topicId:e.topicId||null,entity:e});return e}
  var api={
    async savePlanning(x){return saveEntity('planning',x,'PLANNING_UPDATED')},
    async saveSession(x){return saveEntity('sessions',x,null)},
    async completeSession(x){return saveEntity('sessions',x,'SESSION_COMPLETED')},
    async saveTask(x){return saveEntity('tasks',x,null)},
    async saveResource(x){return saveEntity('resources',x,null)},
    async saveExam(x){return saveEntity('exams',x,'EXAM_UPDATED')},
    async saveError(x){return saveEntity('errors',x,'ERROR_CREATED')},
    async saveFlashcard(x){return saveEntity('flashcards',x,null)},
    async reviewFlashcard(x){var e=await saveEntity('flashcards',x,'FLASHCARD_REVIEWED');return e},
    async saveMastery(x){return saveEntity('mastery',x,'MASTERY_CHANGED')},
    async saveRuntimeProjection(state){ return state; },
    async getAcademicContext(){
      var all=await Promise.all([R.subjects.getAll(),R.topics.getAll(),R.sessions.getAll(),R.tasks.getAll(),R.resources.getAll(),R.exams.getAll(),R.errors.getAll(),R.mastery.getAll()]);
      return {subjects:all[0],topics:all[1],sessions:all[2],tasks:all[3],resources:all[4],exams:all[5],errors:all[6],mastery:all[7]};
    },
    async migrateLegacyState(state){
      state=state||{};
      var maps=[['topics','topics'],['sessions','sessions'],['tasks','tasks'],['exams','exams']];
      for(var i=0;i<maps.length;i++){var source=state[maps[i][0]];if(Array.isArray(source)){var target=R[maps[i][1]];var current=await target.getAll();var ids={};current.forEach(function(x){ids[x.id]=1});for(var j=0;j<source.length;j++){if(source[j]&&source[j].id&&!ids[source[j].id]){await target.add(source[j]);ids[source[j].id]=1}}}}
      return {migrated:true,version:'65.32'};
    }
  };
  global.WWAcademicServices={version:'65.32',api:api};
})(window);
