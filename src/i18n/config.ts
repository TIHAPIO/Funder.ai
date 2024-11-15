import type { InitOptions } from 'i18next';

export const defaultNS = 'common';
export const fallbackLng = 'en';

export const i18nConfig: InitOptions = {
  defaultNS,
  fallbackLng,
  ns: ['common', 'auth', 'settings', 'chat', 'resources', 'requests', 'campaigns', 'home'],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  supportedLngs: ['en', 'de'],
  load: 'languageOnly',
};

export type I18nNamespaces = 'common' | 'auth' | 'settings' | 'chat' | 'resources' | 'requests' | 'campaigns' | 'home';
