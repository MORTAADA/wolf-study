/* WHITE WOLF SCHOLAR V65.28 — Persistence migrations */
(function(global){
  'use strict';
  var CURRENT=4;
  function migrate(value,from,to){
    var v=Number(from||1), out=value;
    while(v<to){
      if(v===1) out=migrate1to2(out);
      else if(v===2) out=migrate2to3(out);
      else if(v===3) out=migrate3to4(out);
      v++;
    }
    return out;
  }
  function migrate1to2(v){
    if(v&&typeof v==='object'&&!Array.isArray(v)){v.__schemaVersion=2} return v;
  }
  function migrate2to3(v){
    if(v&&typeof v==='object'&&!Array.isArray(v)){v.__schemaVersion=3} return v;
  }
  function migrate3to4(v){
    if(v&&typeof v==='object'&&!Array.isArray(v)){v.__schemaVersion=4;v.__cutover='academic-os'} return v;
  }
  global.WWAcademicMigrations={current:CURRENT,migrate:migrate,steps:{'1→2':'schema marker','2→3':'schema marker','3→4':'Academic OS cutover marker'}};
})(window);
