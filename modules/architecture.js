/* WHITE WOLF SCHOLAR — ARCHITECTURE CONTRACT / V62.5
   Keeps feature modules discoverable without exposing internal state.
*/
(function(){
  "use strict";
  var modules={};
  function getApp(){ return window.WWV46App||{}; }
  function register(name,api){ modules[name]=api||{}; return modules[name]; }
  function get(name){ return modules[name]||null; }
  function diagnostics(){
    var app=getApp();
    return {
      version:"62.5",
      schemaVersion:2,
      core:!!app.state,
      persistence:!!window.WWPersistence,
      reader:!!window.wwOpenFileInReader,
      backup:!!window.WWBackup,
      search:!!window.WWGlobalSearch,
      resourceAPI:!!window.WWResourceAPI
    };
  }
  window.WWArchitecture={register:register,get:get,diagnostics:diagnostics};
  register("core",getApp());
  register("icons",window.WWIcons);
  window.addEventListener("load",function(){
    register("core",getApp());
    register("reader",{openFile:window.wwOpenFileInReader,openStored:window.wwOpenStoredResource});
    register("backup",window.WWBackup);
    register("search",window.WWGlobalSearch);
    register("resources",window.WWResourceAPI);
  });
})();
