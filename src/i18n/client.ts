import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18nConfig } from './config';

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...i18nConfig,
    lng: 'en',
  });

export default i18next;
