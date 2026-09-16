/* WHITE WOLF V64.4 — Academic Answer Evaluator */
(function(global){'use strict';
 var STOP={le:1,la:1,les:1,un:1,une:1,des:1,de:1,du:1,et:1,en:1,est:1,sont:1,que:1,qui:1,une:1,avec:1,pour:1,dans:1,sur:1,par:1,au:1,aux:1,ce:1,cette:1,ces:1,du:1,of:1,the:1,and:1,is:1,are:1};
 function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim()}
 function words(v){return norm(v).split(' ').filter(function(x){return x.length>=4&&!STOP[x]})}
 function choice(q,text){var n=norm(text),m=n.match(/(?:^|\s)([abcd])(?:\s|$)/);if(m)return 'abcd'.indexOf(m[1]);var opts=q&&Array.isArray(q.options)?q.options:[];for(var i=0;i<opts.length;i++){var o=norm(opts[i]);if(o&&n.indexOf(o)>=0)return i}return -1}
 function evaluateFree(text,reference){var a=words(text),b=words(reference),set={};b.forEach(function(w){set[w]=1});var hits=0;a.forEach(function(w){if(set[w])hits++});var coverage=b.length?hits/b.length:0;var verdict=coverage>=.55?'fort':'partiel';if(!a.length)verdict='vide';return{coverage:Math.round(coverage*100),hits:hits,total:b.length,verdict:verdict}}
 function evaluateMCQ(q,text){var c=choice(q,text);if(c<0)return{kind:'free',choice:-1};return{kind:'choice',choice:c,correct:c===Number(q.answer)}}
 function feedback(q,text){var r=evaluateMCQ(q,text);if(r.kind==='choice')return r;var ref=String((q&&q.explanation)||'')+' '+String((q&&q.why)||'');var f=evaluateFree(text,ref);return{kind:'free',score:f.coverage,verdict:f.verdict,reference:ref}}
 global.WWChatEvaluator={version:'64.4',normalize:norm,choice:choice,evaluateFree:evaluateFree,evaluateMCQ:evaluateMCQ,feedback:feedback};
})(window);
