/* WHITE WOLF SCHOLAR V65.28 — Unified repository contracts */
(function(global){
  'use strict';
  var P=global.WWCorePersistence, E=global.WWAcademicEntities, M=global.WWAcademicMigrations;
  function repo(type,key){
    return {
      type:type,key:key,version:M.current,
      async getAll(){var raw=await P.get(key);var arr=Array.isArray(raw)?raw:(raw&&raw.items)||[];return arr.map(function(x){return E.normalize(type,x)})},
      async replace(items){var arr=(items||[]).map(function(x){return E.normalize(type,x)});await P.set(key,{__schemaVersion:M.current,items:arr});return arr},
      async add(item){var e=E.normalize(type,item),v=E.validate(type,e);if(!v.ok)throw new Error('Invalid '+type+': '+v.errors.join(','));var a=await this.getAll();a.push(e);await this.replace(a);return e},
      async upsert(item){var e=E.normalize(type,item),a=await this.getAll(),i=a.findIndex(function(x){return x.id===e.id});if(i<0)a.push(e);else a[i]=e;await this.replace(a);return e},
      async getById(id){var a=await this.getAll();return a.find(function(x){return x.id===id})||null},
      async clear(){await P.set(key,{__schemaVersion:M.current,items:[]});return []}
    };
  }
  var R={version:'65.31',subjects:repo('subject','wws.entity.subjects.v3'),topics:repo('topic','wws.entity.topics.v3'),sessions:repo('session','wws.entity.sessions.v3'),tasks:repo('task','wws.entity.tasks.v3'),resources:repo('resource','wws.entity.resources.v3'),exams:repo('exam','wws.entity.exams.v3'),errors:repo('error','wws.entity.errors.v3'),flashcards:repo('flashcard','wws.entity.flashcards.v3'),mastery:repo('mastery','wws.entity.mastery.v3'),planning:repo('planning','wws.entity.planning.v3')};
  global.WWAcademicRepositories=R;
})(window);
