import { useState, useEffect } from "react";

export default function LanguageToggle() {
  const [lang, setLang] = useState<"es" | "en">("es");

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "es") setLang(stored);
    else {
      const browserLang = navigator.language?.startsWith("en") ? "en" : "es";
      setLang(browserLang);
    }
  }, []);

  const toggle = () => {
    const next = lang === "es" ? "en" : "es";
    setLang(next);
    localStorage.setItem("lang", next);
    // Dispatch event for Astro components to listen
    window.dispatchEvent(new CustomEvent("lang:change", { detail: { lang: next } }));
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center px-3 py-1.5 rounded-full
        border border-white/20 text-white/70 text-xs font-semibold tracking-widest
        hover:border-[#00ff88]/60 hover:text-[#00ff88] transition-all duration-200
        cursor-pointer select-none"
      aria-label="Toggle language"
    >
      {lang === "es" ? "EN" : "ES"}
    </button>
  );
}
