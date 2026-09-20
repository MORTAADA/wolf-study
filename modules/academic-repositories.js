/* WHITE WOLF SCHOLAR V65.28 — Unified repository contracts */
(function(global){
  'use strict';
  var P=global.WWCorePersistence, E=global.WWAcademicEntities, M=global.WWAcademicMigrations;
  var cache=Object.create(null), queues=Object.create(null);
  function serial(key,fn){var prev=queues[key]||Promise.resolve();var next=prev.then(fn,fn);queues[key]=next.catch(function(){});return next}
  function repo(type,key){
    return {
      type:type,key:key,version:M.current,
      async getAll(){if(cache[key])return cache[key].map(E.clone);var raw=await P.get(key);var arr=Array.isArray(raw)?raw:(raw&&raw.items)||[];cache[key]=arr.map(function(x){return E.normalize(type,x)});return cache[key].map(E.clone)},
      async replace(items){return serial(key,async function(){var arr=(items||[]).map(function(x){return E.normalize(type,x)});cache[key]=arr;await P.set(key,{__schemaVersion:M.current,items:arr});return arr.map(E.clone)})},
      async add(item){return serial(key,async function(){var e=E.normalize(type,item),v=E.validate(type,e);if(!v.ok)throw new Error('Invalid '+type+': '+v.errors.join(','));var a=cache[key]?cache[key].slice():[];if(!cache[key]){var raw=await P.get(key);a=((raw&&raw.items)||[]).map(function(x){return E.normalize(type,x)})}a.push(e);cache[key]=a;await P.set(key,{__schemaVersion:M.current,items:a});return E.clone(e)})},
      async upsert(item){return serial(key,async function(){var e=E.normalize(type,item),a=cache[key]?cache[key].slice():[],i;if(!cache[key]){var raw=await P.get(key);a=((raw&&raw.items)||[]).map(function(x){return E.normalize(type,x)})}i=a.findIndex(function(x){return x.id===e.id});if(i<0)a.push(e);else a[i]=e;cache[key]=a;await P.set(key,{__schemaVersion:M.current,items:a});return E.clone(e)})},
      async getById(id){var a=await this.getAll();return a.find(function(x){return x.id===id})||null},
      async clear(){return serial(key,async function(){cache[key]=[];await P.set(key,{__schemaVersion:M.current,items:[]});return []})},
      async removeById(id){return serial(key,async function(){var a=cache[key]?cache[key].slice():[];if(!cache[key]){var raw=await P.get(key);a=((raw&&raw.items)||[]).map(function(x){return E.normalize(type,x)})}var next=a.filter(function(x){return x.id!==id});if(next.length===a.length)return false;cache[key]=next;await P.set(key,{__schemaVersion:M.current,items:next});return true})}
    };
  }
  var R={version:'66.0',subjects:repo('subject','wws.entity.subjects.v3'),topics:repo('topic','wws.entity.topics.v3'),sessions:repo('session','wws.entity.sessions.v3'),tasks:repo('task','wws.entity.tasks.v3'),resources:repo('resource','wws.entity.resources.v3'),exams:repo('exam','wws.entity.exams.v3'),errors:repo('error','wws.entity.errors.v3'),flashcards:repo('flashcard','wws.entity.flashcards.v3'),mastery:repo('mastery','wws.entity.mastery.v3'),concepts:repo('concept','wws.entity.concepts.v1'),studyActivities:repo('studyActivity','wws.entity.studyActivities.v1'),planning:repo('planning','wws.entity.planning.v3')};
  R.batchReplace=async function(map){
    var entries=[];Object.keys(map||{}).forEach(function(k){if(!R[k])return;var r=R[k],items=(map[k]||[]).map(function(x){return E.normalize(r.type,x)});cache[r.key]=items;entries.push({key:r.key,value:{__schemaVersion:M.current,items:items}})});
    if(P.batchSet)await P.batchSet(entries);else for(var i=0;i<entries.length;i++)await P.set(entries[i].key,entries[i].value);
    var out={};Object.keys(map||{}).forEach(function(k){out[k]=(cache[R[k].key]||[]).map(E.clone)});return out;
  };
  R.invalidate=function(kind){if(R[kind])delete cache[R[kind].key]};
  R.clearCache=function(){cache=Object.create(null)};
  global.WWAcademicRepositories=R;
})(window);
