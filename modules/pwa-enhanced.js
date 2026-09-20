
/* V65.24 — PWA install/update/offline UX */
(() => {
  'use strict';
  let deferredPrompt=null;

  function toast(msg){
    try{
      if(typeof window.showToast==='function'){ window.showToast(msg); return; }
      const t=document.getElementById('toast');
      if(t){t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}
    }catch(_){}
  }

  function updateNetwork(){
    document.documentElement.dataset.network=navigator.onLine?'online':'offline';
    const old=document.getElementById('ww-network-badge');
    if(old) old.remove();
    if(!navigator.onLine){
      const b=document.createElement('div');
      b.id='ww-network-badge';
      b.className='ww-network-badge';
      b.textContent='⛓️ Hors connexion · données locales';
      document.body.appendChild(b);
    }
  }

  window.addEventListener('online',()=>{updateNetwork();toast('🌐 Connexion rétablie');});
  window.addEventListener('offline',()=>{updateNetwork();toast('📴 Mode hors connexion activé');});
  updateNetwork();

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault(); deferredPrompt=e;
    document.documentElement.dataset.installable='true';
    window.WWInstallPWA=async()=>{
      if(!deferredPrompt)return false;
      deferredPrompt.prompt();
      try{await deferredPrompt.userChoice;}catch(_){}
      deferredPrompt=null;
      return true;
    };
  });

  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    document.documentElement.dataset.installable='false';
    toast('📱 White Wolf est installé');
  });

  if('serviceWorker' in navigator){
    // V92: one canonical registration path; the legacy pwa.js bridge no longer registers again.
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
    navigator.serviceWorker.addEventListener('message',e=>{
      if(e.data?.type==='WW_SW_READY') {
        document.documentElement.dataset.swVersion=e.data.version||'';
      }
      if(e.data?.type==='WW_SW_UPDATE_AVAILABLE') toast('🔄 Mise à jour disponible');
    });
    navigator.serviceWorker.ready.then(reg=>{
      if(reg && reg.update) setTimeout(()=>reg.update().catch(()=>{}),1500);
    }).catch(()=>{});
  }
})();

/* V92 notification bootstrap */
(() => {
  'use strict';
  function sync(){
    try{
      const st=window.WWNotifications;
      if(!st)return;
      const s=st.get();
      if(s.enabled && Notification.permission==='granted') st.start(window.WWAppCore&&window.WWAppCore.state||window.state);
    }catch(_){ }
  }
  window.addEventListener('load',()=>setTimeout(sync,1200));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')sync();});
})();
