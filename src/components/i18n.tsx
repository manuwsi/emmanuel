'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export type Lang = 'fr' | 'en';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'fr',
  setLang: () => {},
});

const STORAGE_KEY = 'lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  // Restore the visitor's choice (French by default)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'fr') setLangState(saved);
    } catch {
      /* storage unavailable: keep French */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** t('texte français', 'English text') — works for strings and JSX. */
export function useT() {
  const { lang } = useLang();
  return useCallback(<T,>(fr: T, en: T): T => (lang === 'fr' ? fr : en), [lang]);
}
