/* WHITE WOLF SCHOLAR V82 — Time Engine
 * Single source of truth for hard time constraints.
 * Default sleep: 23:00 → 05:00. No study slot may be generated inside sleep.
 */
(function(global){
  'use strict';
  var DEFAULTS={sleepStart:'23:00',wakeTime:'05:00'};
  var DAYS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  function state(){return global.WWAppCore&&global.WWAppCore.state||global.state||null}
  function parse(v){
    if(typeof v==='number'&&isFinite(v))return Math.max(0,Math.min(1440,v));
    var m=String(v==null?'':v).trim().match(/^(\d{1,2}):(\d{2})$/);
    if(!m)return null;
    var h=Number(m[1]),n=Number(m[2]);
    return h<=23&&n<=59?h*60+n:null;
  }
  function fmt(n){n=((Math.round(Number(n)||0)%1440)+1440)%1440;return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
  function config(){
    var s=state()||{}, c=s.settings&&s.settings.timeConstraints||{};
    var sleepStart=parse(c.sleepStart);var wakeTime=parse(c.wakeTime);
    return {sleepStart:sleepStart==null?parse(DEFAULTS.sleepStart):sleepStart,wakeTime:wakeTime==null?parse(DEFAULTS.wakeTime):wakeTime};
  }
  function sleepBlocks(){
    var c=config(),a=c.sleepStart,b=c.wakeTime;
    if(a===b)return [[0,1440]];
    if(a>b)return normalizeBlocks([[0,b],[a,1440]]);
    return [[a,b]];
  }
  function awakeWindows(){
    var c=config(),a=c.sleepStart,b=c.wakeTime;
    if(a===b)return [];
    if(a>b)return [[b,a]];
    return normalizeBlocks([[0,a],[b,1440]]);
  }
  function normalizeBlocks(blocks){
    return (blocks||[]).filter(function(x){return x&&isFinite(x[0])&&isFinite(x[1])&&x[1]>x[0]}).sort(function(a,b){return a[0]-b[0]})
      .reduce(function(out,x){var a=Math.max(0,x[0]),b=Math.min(1440,x[1]);if(!out.length||a>out[out.length-1][1])out.push([a,b]);else out[out.length-1][1]=Math.max(out[out.length-1][1],b);return out},[]);
  }
  function subtract(windows,busy){
    var bs=normalizeBlocks(busy),out=[];
    (windows||[]).forEach(function(w){var cursor=w[0];bs.forEach(function(b){if(b[1]<=cursor||b[0]>=w[1])return;if(b[0]>cursor)out.push([cursor,Math.min(b[0],w[1])]);cursor=Math.max(cursor,b[1]);});if(cursor<w[1])out.push([cursor,w[1]]);});
    return out.filter(function(x){return x[1]-x[0]>=1});
  }
  function dayKey(d){return DAYS[(d||new Date()).getDay()]}
  function describe(){var c=config();return {sleepStart:fmt(c.sleepStart),wakeTime:fmt(c.wakeTime),sleepDuration:c.sleepStart>=c.wakeTime?(1440-c.sleepStart+c.wakeTime):(c.wakeTime-c.sleepStart)} }
  global.WWTimeEngine={version:'82.0',defaults:DEFAULTS,parse:parse,format:fmt,config:config,sleepBlocks:sleepBlocks,awakeWindows:awakeWindows,subtract:subtract,dayKey:dayKey,describe:describe};
})(window);
