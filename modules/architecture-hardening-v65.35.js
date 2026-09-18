/* WHITE WOLF SCHOLAR V65.35 — Architecture Dependency Audit + Data Integrity Gate */
(function(global){
  'use strict';
  var forbiddenLegacy=['domain-model.js','repository.js','application-services.js','architecture-v2.js','architecture-integration.js'];
  var layers={core:[],persistence:[],domain:[],events:[],services:[],features:[],ui:[]};
  function auditRuntime(){
    var checks={
      entities:!!global.WWAcademicEntities,
      repositories:!!global.WWAcademicRepositories,
      services:!!global.WWAcademicServices,
      events:!!global.WWEventBus,
      runtime:!!global.WWAcademicRuntime,
      architecture:!!global.WWArchitectureV3,
      renderer:!!global.WWRenderer
    };
    var ok=Object.keys(checks).every(function(k){return checks[k]===true});
    return {ok:ok,checks:checks};
  }
  function auditDependencies(){
    var html=document.documentElement?document.documentElement.innerHTML:'';
    var legacyRefs=forbiddenLegacy.filter(function(x){return html.indexOf(x)>=0});
    return {ok:legacyRefs.length===0,legacyRefs:legacyRefs};
  }
  function auditData(){
    var R=global.WWAcademicRepositories;
    return Promise.resolve().then(async function(){
      if(!R) return {ok:false,reason:'repositories-unavailable'};
      var out={ok:true,invalid:[],counts:{}};
      var E=global.WWAcademicEntities;
      var kinds=['subjects','topics','sessions','tasks','resources','exams','errors','flashcards','mastery','planning'];
      var typeMap={subjects:'subject',topics:'topic',sessions:'session',tasks:'task',resources:'resource',exams:'exam',errors:'error',flashcards:'flashcard',mastery:'mastery',planning:'planning'};
      for(var i=0;i<kinds.length;i++){
        var kind=kinds[i], arr=await R[kind].getAll(); out.counts[kind]=arr.length;
        var type=typeMap[kind];
        arr.forEach(function(e){var v=E.validate(type,e);if(!v.ok)out.invalid.push({kind:kind,id:e.id,errors:v.errors})});
      }
      return out;
    });
  }
  async function run(){
    var runtime=auditRuntime(),deps=auditDependencies(),data=await auditData();
    var result={version:'65.35',healthy:runtime.ok&&deps.ok&&data.ok, runtime:runtime, dependencies:deps, data:data, generatedAt:new Date().toISOString()};
    global.__WW_ARCHITECTURE_HEALTH=result; return result;
  }
  global.WWArchitectureHardeningV65_35={version:'65.35',run:run,auditRuntime:auditRuntime,auditDependencies:auditDependencies,auditData:auditData};
  global.addEventListener('load',function(){setTimeout(function(){run().catch(function(e){console.error('V65.35 gate failed',e)})},0)});
})(window);
