/* WHITE WOLF V64.9 — Scientific Document → Topic Mapper */
(function(global){'use strict';
  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim()}
  function tokens(s){return norm(s).split(' ').filter(function(x){return x.length>2})}
  function unique(a){var o={},r=[];(a||[]).forEach(function(x){if(x&&!o[x]){o[x]=1;r.push(x)}});return r}
  function headings(text){
    var lines=String(text||'').replace(/\r/g,'').split('\n'), out=[], seen={};
    lines.forEach(function(line,i){
      var raw=line.trim(); if(!raw||raw.length<3||raw.length>180)return;
      var isMd=/^#{1,4}\s+/.test(raw), isNum=/^(?:\d+(?:\.\d+)*[.)]?|[IVXLC]+[.)])\s+/.test(raw);
      var words=raw.split(/\s+/).length;
      var alpha=(raw.match(/[A-Za-zÀ-ÿ]/g)||[]).length;
      var upper=alpha>0 && alpha/(raw.replace(/[^A-Za-zÀ-ÿ]/g,'').length||1)>.72;
      if(!(isMd||isNum||(upper&&words<=12)))return;
      var title=raw.replace(/^#{1,4}\s+/,'').replace(/^(?:\d+(?:\.\d+)*[.)]?|[IVXLC]+[.)])\s+/i,'').trim();
      if(title.length<3)return;
      var key=norm(title); if(seen[key])return; seen[key]=1;
      out.push({id:'sec_'+out.length,title:title,line:i+1,kind:isMd?'heading':(isNum?'numbered':'caps')});
    });
    return out;
  }
  function score(title,topic){
    var a=tokens(title),b=tokens(topic.title), hits=0;
    a.forEach(function(x){if(b.indexOf(x)>=0)hits++});
    var phrase=norm(topic.title), nt=norm(title), bonus=phrase.length>4&&nt.indexOf(phrase)>=0?4:0;
    return hits*2+bonus;
  }
  function suggest(resource,state){
    var r=global.WWDocumentIntel&&global.WWDocumentIntel.get?global.WWDocumentIntel.get(resource.resourceId):null;
    if(!r)return {sections:[],mapped:0};
    var text=(r.chunks||[]).join('\n\n'), hs=headings(text), topics=(state&&state.topics)||[];
    var sections=hs.map(function(h){
      var candidates=topics.filter(function(t){return !resource.topicId||t.subject_id===resource.subjectId}).map(function(t){return {topicId:t.id,title:t.title,score:score(h.title,t)}}).filter(function(x){return x.score>0}).sort(function(a,b){return b.score-a.score});
      var chosen=candidates[0]||null;
      return {id:h.id,title:h.title,line:h.line,kind:h.kind,topicId:chosen?chosen.topicId:null,confidence:chosen?Math.min(0.99,0.35+chosen.score*0.1):0,candidates:candidates.slice(0,4)};
    });
    return {sections:sections,mapped:sections.filter(function(x){return !!x.topicId}).length};
  }
  function save(resourceId,sections){
    if(!global.state||!global.WWDocumentIntel)return false;
    var r=global.WWDocumentIntel.get(resourceId);if(!r)return false;
    r.sections=Array.isArray(sections)?sections.map(function(s){return {id:s.id,title:s.title,line:s.line,kind:s.kind,topicId:s.topicId||null,confidence:Number(s.confidence)||0}}):[];
    r.mappedAt=new Date().toISOString();
    if(global.state.documentIntelligence)global.state.documentIntelligence.activeResourceId=resourceId;
    if(global.saveState)global.saveState();
    return true;
  }
  function sectionContext(resourceId,topicId,query){
    var r=global.WWDocumentIntel&&global.WWDocumentIntel.get?global.WWDocumentIntel.get(resourceId):null;if(!r)return null;
    var secs=(r.sections||[]).filter(function(s){return !topicId||s.topicId===topicId});
    if(!secs.length)return null;
    var words=tokens(query), chunks=r.chunks||[];
    var matches=[];
    secs.forEach(function(s){var start=Math.max(0,s.line-1), base=chunks[Math.min(chunks.length-1,start)]||'';var n=norm(base),sc=words.reduce(function(z,w){return z+(n.indexOf(w)>=0?1:0)},0);matches.push({sectionId:s.id,title:s.title,topicId:s.topicId,confidence:s.confidence,text:base,score:sc})});
    matches.sort(function(a,b){return b.score-a.score});return matches.slice(0,5);
  }
  global.WWDocumentMap={version:'64.9',headings:headings,suggest:suggest,save:save,sectionContext:sectionContext};
})(window);
