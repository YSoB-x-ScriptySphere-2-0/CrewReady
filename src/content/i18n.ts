import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { stringsEn } from './strings.en';
import { stringsBn } from './strings.bn';
import { MISSION_TRANSLATIONS_BN } from './missionTranslations';

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
  if (lang === 'bn') {
    if (stringsBn[key]) return stringsBn[key];
    if (MISSION_TRANSLATIONS_BN[key]) return MISSION_TRANSLATIONS_BN[key];
  }
  return stringsEn[key] ?? key;
}

/** Translate mission prompts, tasks, options, reasons, bins and hints */
export function tMission(text: string): string {
  const lang = useI18n.getState().lang;
  if (lang === 'bn') {
    return MISSION_TRANSLATIONS_BN[text] ?? stringsBn[text] ?? text;
  }
  return text;
}
