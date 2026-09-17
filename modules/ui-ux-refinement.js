
/* V65.23 UI/UX refinement helpers — non-invasive */
(() => {
  'use strict';

  // Make keyboard users' focus state appear after keyboard navigation.
  let keyboardMode = false;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      keyboardMode = true;
      document.documentElement.dataset.inputMode = 'keyboard';
    }
  }, {passive:true});
  document.addEventListener('pointerdown', () => {
    keyboardMode = false;
    document.documentElement.dataset.inputMode = 'pointer';
  }, {passive:true});

  // Keep a tiny, accessible connectivity state when the browser changes it.
  const updateNetworkState = () => {
    document.documentElement.dataset.network = navigator.onLine ? 'online' : 'offline';
    document.dispatchEvent(new CustomEvent('wws:networkchange', {
      detail: {online: navigator.onLine}
    }));
  };
  window.addEventListener('online', updateNetworkState, {passive:true});
  window.addEventListener('offline', updateNetworkState, {passive:true});
  updateNetworkState();

  // Avoid dead buttons/links with no accessible label where an aria-label exists
  // through title text; do not rewrite existing application content.
  document.querySelectorAll('button, [role="button"]').forEach((el) => {
    if (!el.getAttribute('aria-label') && !el.textContent.trim() && el.title) {
      el.setAttribute('aria-label', el.title);
    }
  });
})();
