"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { copy, type Language } from "@/lib/content";
import { getTranslation, type TranslationKey } from "@/lib/translations";

type TranslationFunction = ((key: TranslationKey) => string) & (typeof copy)[Language];

type LanguageContextValue = {
  lang: Language;
  dir: "ltr" | "rtl";
  t: TranslationFunction;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("haron-language") as Language | null;
    if (stored === "ar" || stored === "en") {
      setLang(stored);
      return;
    }

    if (navigator.language.toLowerCase().startsWith("ar")) {
      setLang("ar");
    }
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.documentElement.dataset.language = lang;
    window.localStorage.setItem("haron-language", lang);
  }, [lang]);

  const setLanguage = useCallback((language: Language) => setLang(language), []);
  const toggleLanguage = useCallback(
    () => setLang((current) => (current === "en" ? "ar" : "en")),
    [],
  );
  const translate = useCallback(
    (key: TranslationKey) => getTranslation(lang, key) ?? key,
    [lang],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      t: Object.assign(translate, copy[lang]),
      toggleLanguage,
      setLanguage,
    }),
    [lang, setLanguage, toggleLanguage, translate],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
