/* WHITE WOLF V64.9 — Local PDF text extraction (no network dependency) */
(function(global){'use strict';
  var MAX_BYTES=24*1024*1024, MAX_TEXT=180000;
  function bytesToLatin(bytes){var s='',n=bytes.length;for(var i=0;i<n;i++)s+=String.fromCharCode(bytes[i]);return s}
  function decodePdfString(raw){
    var out='';
    for(var i=0;i<raw.length;i++){
      var c=raw[i];
      if(c==='\\'){
        var nx=raw[++i];
        if(nx===undefined)break;
        if(nx==='n')out+='\n'; else if(nx==='r')out+='\r'; else if(nx==='t')out+='\t'; else if(nx==='b')out+='\b'; else if(nx==='f')out+='\f';
        else if(nx==='('||nx===')'||nx==='\\')out+=nx;
        else if(/[0-7]/.test(nx)){var oct=nx;for(var k=0;k<2&&i+1<raw.length&&/[0-7]/.test(raw[i+1]);k++)oct+=raw[++i];out+=String.fromCharCode(parseInt(oct,8));}
        else out+=nx;
      }else out+=c;
    }
    return out;
  }
  function decodeHex(raw){var h=raw.replace(/\s+/g,'');if(h.length%2)h+='0';var out='';for(var i=0;i<h.length;i+=2){var v=parseInt(h.slice(i,i+2),16);if(!isNaN(v))out+=String.fromCharCode(v)}return out}
  async function inflate(data){
    if(typeof DecompressionStream!=='function')return null;
    try{
      var ds=new DecompressionStream('deflate'),stream=new Blob([data]).stream().pipeThrough(ds),buf=await new Response(stream).arrayBuffer();return new Uint8Array(buf);
    }catch(e){return null}
  }
  function clean(s){return s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/[ \t]+/g,' ').replace(/\n[ \t]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim()}
  function extractOperators(s){
    var chunks=[];
    var re=/\(((?:\\.|[^\\)])*)\)\s*T[Jj]/g,m;
    while((m=re.exec(s))!==null)chunks.push(decodePdfString(m[1]));
    var tj=/\[((?:.|\n|\r)*?)\]\s*TJ/g;
    while((m=tj.exec(s))!==null){var a=m[1],sr=/\(((?:\\.|[^\\)])*)\)|<([0-9A-Fa-f\s]+)>/g,x,buf='';while((x=sr.exec(a))!==null)buf+=x[1]!==undefined?decodePdfString(x[1]):decodeHex(x[2]);if(buf)chunks.push(buf)}
    return chunks.join('\n');
  }
  async function extract(file){
    if(!file)throw new Error('PDF manquant');
    if(file.size>MAX_BYTES)throw new Error('PDF trop volumineux (>24 MB)');
    var bytes=new Uint8Array(await file.arrayBuffer());
    var latin=bytesToLatin(bytes), streams=[], pos=0;
    while((pos=latin.indexOf('stream',pos))>=0){
      var start=pos+6;if(latin[start]==='\r')start++;if(latin[start]==='\n')start++;
      var end=latin.indexOf('endstream',start);if(end<0)break;
      var raw=bytes.slice(start,end);var header=latin.slice(Math.max(0,pos-500),pos);
      if(/FlateDecode/i.test(header)){var dec=await inflate(raw);if(dec)raw=dec;}
      streams.push(bytesToLatin(raw));pos=end+9;
      if(streams.length>800)break;
    }
    var text=extractOperators(streams.join('\n'));
    if(!text){
      text=extractOperators(latin);
    }
    text=clean(text);
    if(text.length>MAX_TEXT)text=text.slice(0,MAX_TEXT)+'\n\n[Extraction tronquée à '+MAX_TEXT+' caractères.]';
    return {text:text,pages:null,bytes:file.size,extractedAt:new Date().toISOString(),method:'local-pdf-heuristic'};
  }
  global.WWPDFReader={extract:extract,version:'64.9'};
})(window);
