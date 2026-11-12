import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stringsEn } from './strings.en';
import { stringsBn } from './strings.bn';

export type Language = 'en' | 'bn';

interface I18nStore {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useI18n = create<I18nStore>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'crewready_lang' },
  ),
);

export function t(key: string): string {
  const lang = useI18n.getState().lang;
  if (lang === 'bn' && stringsBn[key]) {
    return stringsBn[key];
  }
  return stringsEn[key] ?? key;
}
