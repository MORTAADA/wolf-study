/* WHITE WOLF SCHOLAR V65.33 — Full Feature Migration Bridge
 * Feature writes now have explicit Academic OS service entry points.
 * The legacy runtime state remains a UI projection only.
 */
(function(global){
  'use strict';
  var S=global.WWAcademicServices&&global.WWAcademicServices.api;
  var wired=false;
  function ensure(){return !!S}
  async function write(kind,data,opts){
    if(!ensure()) return null;
    opts=opts||{};
    var fn=S[kind]; if(typeof fn!=='function') throw new Error('Academic service unavailable: '+kind);
    return fn.call(S,data,opts);
  }
  function start(){
    if(wired||!S)return false;
    wired=true;
    global.__WW_ACADEMIC_FEATURE_MIGRATION=true;
    return true;
  }
  global.WWFeatureMigration={version:'65.31',start:start,write:write,health:function(){return{version:'65.31',wired:wired,services:!!S,primary:!!global.__WW_ACADEMIC_OS_PRIMARY}}};
  start();
})(window);
