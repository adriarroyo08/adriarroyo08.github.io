import { t, type Lang, defaultLang } from "./translations";

function getLang(): Lang {
  const stored = localStorage.getItem("lang");
  if (stored === "en" || stored === "es") return stored;
  return navigator.language?.startsWith("en") ? "en" : defaultLang;
}

function applyTranslations(lang: Lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n")!;
    const translated = t(lang, key);
    if (el.hasAttribute("data-i18n-html")) {
      el.innerHTML = translated;
    } else {
      el.textContent = translated;
    }
  });
  document.documentElement.lang = lang;
}

// Apply on load
const initialLang = getLang();
localStorage.setItem("lang", initialLang);
applyTranslations(initialLang);

// Listen for toggle
window.addEventListener("lang:change", ((e: CustomEvent<{ lang: Lang }>) => {
  applyTranslations(e.detail.lang);
}) as EventListener);
