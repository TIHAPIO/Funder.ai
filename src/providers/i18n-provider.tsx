'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '../i18n/client';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && ['en', 'de'].includes(savedLanguage)) {
      i18next.changeLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      const supportedLang = ['en', 'de'].includes(browserLang) ? browserLang : 'en';
      i18next.changeLanguage(supportedLang);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18next}>
      {children}
    </I18nextProvider>
  );
}
