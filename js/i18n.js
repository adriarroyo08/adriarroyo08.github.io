const I18n = (() => {
  let currentLang = 'es';
  let translations = {};

  function detectLang() {
    const stored = localStorage.getItem('lang');
    if (stored && (stored === 'es' || stored === 'en')) return stored;
    const browserLang = navigator.language || navigator.userLanguage || '';
    if (browserLang.startsWith('en')) return 'en';
    return 'es';
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) el.textContent = translations[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (translations[key]) el.innerHTML = translations[key];
    });
    document.documentElement.lang = currentLang;
    const toggle = document.querySelector('.lang-toggle');
    if (toggle) toggle.textContent = currentLang === 'es' ? 'EN' : 'ES';
  }

  async function loadLang(lang) {
    try {
      const response = await fetch('i18n/' + lang + '.json');
      if (!response.ok) throw new Error('HTTP ' + response.status);
      translations = await response.json();
      currentLang = lang;
      localStorage.setItem('lang', lang);
      applyTranslations();
    } catch (e) {
      console.warn('i18n: could not load ' + lang + '.json, using inline fallback');
    }
  }

  function toggle() {
    const next = currentLang === 'es' ? 'en' : 'es';
    loadLang(next);
  }

  function init() {
    currentLang = detectLang();
    loadLang(currentLang);
  }

  return { init, toggle, getCurrentLang: () => currentLang };
})();

document.addEventListener('DOMContentLoaded', () => I18n.init());
