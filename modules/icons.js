(function(){
"use strict";
/* WHITE WOLF SCHOLAR — UI ICON MODULE
   Extracted from the legacy monolith. Public surface: window.WWIcons
*/
// ============================================================
//  WHITE WOLF SCHOLAR — SCRIPT 
//  Full with Advanced Stats (Heatmap + Charts)
// ============================================================


// ============================================================
//  WHITE WOLF ICON SYSTEM — Emoji-free professional UI
//  Converts legacy emoji labels/data into consistent inline SVG icons.
// ============================================================
var WW_ICON_PATHS = {
  wolf:'<path d="M4 7.5 8.5 4l3.5 2 4-2 4 3.5-1 7.5-7 4-7-4z"/><path d="M8 13.5h.01M16 13.5h.01M9 17c2 1.2 4 1.2 6 0"/>',
  chat:'<path d="M5 5.5h14v10H9l-4 3v-3H5z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>',
  light:'<path d="M9 18h6M10 21h4"/><path d="M8.5 14.5a6 6 0 1 1 7 0c-.8.6-1.5 1.5-1.5 2.5h-5c0-1-.7-1.9-1.5-2.5Z"/>',
  graduation:'<path d="m3 9 9-5 9 5-9 5z"/><path d="M7 11v5c2.8 2 7.2 2 10 0v-5M21 10v5"/>',
  globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.3 3.2 5.1 3.2 8.5s-1 6.2-3.2 8.5c-2.2-2.3-3.2-5.1-3.2-8.5s1-6.2 3.2-8.5Z"/>',
  code:'<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  python:'<path d="M12 3c-3.5 0-4.5 1.3-4.5 3.5V9H12v1.5H6C3.8 10.5 3 12 3 14.5S4.2 18 6.5 18H9v-3.5c0-2.2 1.2-3.5 3.5-3.5h3V7c0-2.2-1.5-4-3.5-4Z"/><path d="M12 21c3.5 0 4.5-1.3 4.5-3.5V15H12v-1.5h6c2.2 0 3 1.5 3 4S19.8 21 17.5 21H15v-3.5c0-2.2-1.2-3.5-3.5-3.5h-3V17c0 2.2 1.5 4 3.5 4Z"/>',
  coffee:'<path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 10h2a2 2 0 0 1 0 4h-2M7 5c0-1 1-1 1-2M11 5c0-1 1-1 1-2"/>',
  tools:'<path d="m14.5 6.5 3-3 3 3-3 3zM4 20l8.5-8.5M6 14l4 4M4 4l6 6"/>',
  flag:'<path d="M6 21V4"/><path d="M6 5c4-3 6 3 12 0v8c-6 3-8-3-12 0"/>',
  book:'<path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5z"/><path d="M5 4.5v17M8 6h8M8 10h7"/>',
  calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7 3v4M17 3v4M3.5 9h17"/>',
  chart:'<path d="M4 19V9M9 19V5M14 19v-8M19 19V3"/>',
  seed:'<path d="M12 20V10"/><path d="M12 13c-5 0-7-3-7-7 4 0 7 2 7 7ZM12 10c0-4 3-7 7-7 0 4-2 7-7 7Z"/>',
  clipboard:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5"/>',
  resources:'<path d="M4 6.5h6l2 2h8v10H4z"/><path d="M4 9h16"/>',
  bell:'<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .3 2l.1.1-1.8 1.8-.1-.1a1.8 1.8 0 0 0-2-.3 1.8 1.8 0 0 0-1.1 1.6v.2h-2.6v-.2a1.8 1.8 0 0 0-1.1-1.6 1.8 1.8 0 0 0-2 .3l-.1.1-1.8-1.8.1-.1a1.8 1.8 0 0 0 .3-2 1.8 1.8 0 0 0-1.6-1.1h-.2v-2.6H6a1.8 1.8 0 0 0 1.6-1.1 1.8 1.8 0 0 0-.3-2l-.1-.1L9 6.3l.1.1a1.8 1.8 0 0 0 2 .3A1.8 1.8 0 0 0 12.2 5v-.2h2.6V5a1.8 1.8 0 0 0 1.1 1.6 1.8 1.8 0 0 0 2-.3l.1-.1 1.8 1.8-.1.1a1.8 1.8 0 0 0-.3 2 1.8 1.8 0 0 0 1.6 1.1h.2v2.6H21a1.8 1.8 0 0 0-1.6 1.2Z"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  file:'<path d="M6 3h7l5 5v13H6z"/><path d="M13 3v5h5M9 13h6M9 17h6"/>',
  image:'<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="m5 17 4-4 3 3 2-2 5 4"/>',
  video:'<rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-2v8l-4-2z"/>',
  audio:'<path d="M5 9v6h4l5 4V5L9 9zM17 9a5 5 0 0 1 0 6M19 6a9 9 0 0 1 0 12"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 7 20l1.2-1.2"/>',
  folder:'<path d="M3 6h7l2 2h9v11H3z"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  fire:'<path d="M12 21c4 0 7-2.8 7-7 0-3.2-1.8-5.7-4.8-8.5.2 2.5-1 3.8-2.4 4.8.2-3.1-1.3-5.7-3.8-7.3.2 3.8-3 5.5-3 10 0 4.2 3 8 7 8Z"/>',
  trophy:'<path d="M7 4h10v4a5 5 0 0 1-10 0zM4 5h3v3a4 4 0 0 1-3-3ZM20 5h-3v3a4 4 0 0 0 3-3ZM12 13v4M8 21h8M9 17h6"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
  info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 10v6M12 7h.01"/>',
  help:'<circle cx="12" cy="12" r="8.5"/><path d="M9.5 9a2.7 2.7 0 1 1 4.3 2.2c-1.2.8-1.8 1.3-1.8 2.8M12 17h.01"/>',
  pause:'<path d="M9 5v14M15 5v14"/>',
  play:'<path d="m8 5 11 7-11 7z"/>',
  reset:'<path d="M5 8a8 8 0 1 1-1 7"/><path d="M5 4v4h4"/>',
  spark:'<path d="m12 3 1.5 6.5L20 12l-6.5 1.5L12 20l-1.5-6.5L4 12l6.5-2.5z"/>'
};
var WW_EMOJI_ICON = {
  '🐺':'wolf','💬':'chat','💡':'light','🎓':'graduation','🌐':'globe','🐍':'python','☕':'coffee','🔧':'tools',
  '🇩🇪':'flag','🇬🇧':'flag','🇪🇸':'flag','📚':'book','📖':'book','📅':'calendar','📊':'chart','📈':'chart','🌱':'seed',
  '📋':'clipboard','📁':'folder','📄':'file','📝':'file','🖼️':'image','🎥':'video','🎵':'audio','🔗':'link','🔔':'bell',
  '⚙️':'settings','⚙':'settings','✕':'close','❌':'close','➕':'plus','🔍':'search','⏰':'clock','⏱️':'clock','⏱':'clock',
  '🎯':'target','🔥':'fire','🏆':'trophy','⭐':'star','ℹ️':'info','ℹ':'info','🤔':'help','⏸️':'pause','▶️':'play','➤':'play',
  '🔴':'target','⏳':'clock','💪':'trophy','🌟':'star','🎉':'trophy','🧠':'light','📬':'resources','🛌':'pause','💻':'code',
  '🟢':'check','🟡':'clock','☑️':'check','✅':'check','❌':'close'
};
function wwSvgIcon(name, extra){
  var path=WW_ICON_PATHS[name]||WW_ICON_PATHS.spark;
  return '<span class="ww-icon '+(extra||'')+'" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false">'+path+'</svg></span>';
}
function wwReplaceEmojiInElement(root){
  if(!root||!document.createTreeWalker)return;
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  var nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
  var emojiRe=/(🇩🇪|🇬🇧|🇪🇸|🐺|💬|💡|🎓|🌐|🐍|☕|🔧|📚|📖|📅|📊|📈|🌱|📋|📁|📄|📝|🖼️|🎥|🎵|🔗|🔔|⚙️|⚙|✕|❌|➕|🔍|⏰|⏱️|⏱|🎯|🔥|🏆|⭐|ℹ️|ℹ|🤔|⏸️|▶️|➤|🔴|⏳|💪|🌟|🎉|🧠|📬|🛌|💻|🟢|🟡|☑️|✅)/g;
  nodes.forEach(function(node){
    if(node.parentElement&&node.parentElement.closest('.ww-icon')) return;
    var text=node.nodeValue; if(!emojiRe.test(text)){emojiRe.lastIndex=0;return;} emojiRe.lastIndex=0;
    var frag=document.createDocumentFragment(), last=0, m;
    while((m=emojiRe.exec(text))){
      if(m.index>last) frag.appendChild(document.createTextNode(text.slice(last,m.index)));
      var key=WW_EMOJI_ICON[m[0]]||'spark'; var holder=document.createElement('span'); holder.innerHTML=wwSvgIcon(key,'ww-icon-inline');
      frag.appendChild(holder.firstElementChild); last=m.index+m[0].length;
    }
    if(last<text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag,node);
  });
}
function wwUpgradeIcons(root){
  try{wwReplaceEmojiInElement(root||document.body)}catch(e){console.warn('Icon upgrade error',e)}
}

// ============================================================

  window.WWIcons={
    svgIcon:wwSvgIcon,
    replaceEmojiInElement:wwReplaceEmojiInElement,
    upgradeIcons:wwUpgradeIcons,
    paths:WW_ICON_PATHS
  };
})();
