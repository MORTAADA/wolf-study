/* WHITE WOLF SCHOLAR — ARCHITECTURE CONTRACT / V55
   Keeps feature modules discoverable without exposing internal state.
*/
(function(){
  "use strict";
  var app=window.WWV46App||{};
  var modules={};
  function register(name,api){ modules[name]=api||{}; return modules[name]; }
  function get(name){ return modules[name]||null; }
  function diagnostics(){
    return {
      version:"55.0",
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
  register("core",app);
  register("icons",window.WWIcons);
  window.addEventListener("load",function(){
    register("reader",{openFile:window.wwOpenFileInReader,openStored:window.wwOpenStoredResource});
    register("backup",window.WWBackup);
    register("search",window.WWGlobalSearch);
    register("resources",window.WWResourceAPI);
  });
})();
