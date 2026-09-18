/* WHITE WOLF SCHOLAR V65.33 — Legacy API Retirement
 * The old Domain/Repository/Application/Architecture v2 APIs are retired.
 * A tiny compatibility facade remains only for architecture health checks and
 * old state-save telemetry; academic data is handled by Academic OS services.
 */
(function(global){
  'use strict';
  var A=global.WWAcademicServices&&global.WWAcademicServices.api;
  var Bus=global.WWEventBus;
  global.WWApplication={
    version:'65.32-compat',
    deprecated:true,
    services:{
      record:function(type,payload){
        if(Bus&&Bus.emit) Bus.emit(type,Object.assign({source:'legacy-compat',at:Date.now()},payload||{}));
        return payload;
      },
      saveState:function(state){
        return A&&A.saveRuntimeProjection?A.saveRuntimeProjection(state):Promise.resolve(state);
      }
    }
  };
  global.WWLegacyRetirement={
    version:'65.32',
    retired:['WWDomain','WWRepositories','legacy WWApplication services','architecture-v2','architecture-integration'],
    compatibilityFacade:true,
    academicOSPrimary:true,
    health:function(){return {version:'65.32',retired:true,academicServices:!!A,compatibilityFacade:true};}
  };
})(window);
