/* WHITE WOLF SCHOLAR V65.29 — Academic OS bootstrap */
(function(global){
  'use strict';
  var done=false;
  async function boot(){
    if(done)return; done=true;
    try{
      var state=global.__WW_STATE||null;
      if(global.WWAcademicServices&&global.WWAcademicServices.api) await global.WWAcademicServices.api.migrateLegacyState(state);
      global.dispatchEvent(new CustomEvent('ww:academic-os-ready',{detail:{version:'65.29'}}));
    }catch(e){done=false;console.warn('White Wolf Academic OS bootstrap failed',e)}
  }
  if(global.document) global.addEventListener('DOMContentLoaded',boot,{once:true});
  global.WWAcademicOS={version:'65.29',boot:boot};
})(window);
