import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { I18nNamespaces } from '../i18n/config';

type Language = 'en' | 'de';

type TranslationFunction = {
  (key: string, options?: object): string;
};

export function useTranslation(ns: I18nNamespaces = 'common') {
  const translation = useI18nTranslation(ns, {
    useSuspense: false
  });

  const switchLanguage = async (lang: Language) => {
    try {
      await translation.i18n.changeLanguage(lang);
      localStorage.setItem('preferred-language', lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return {
    t: translation.t as TranslationFunction,
    currentLanguage: translation.i18n.language as Language,
    switchLanguage,
  };
}
