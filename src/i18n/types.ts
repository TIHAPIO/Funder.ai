import 'i18next';
import type { AuthTranslations } from './schemas/auth';
import type { CommonTranslations } from './schemas/common';
import type { SettingsTranslations } from './schemas/settings';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: CommonTranslations;
      auth: AuthTranslations;
      settings: SettingsTranslations;
      chat: any;
      resources: any;
      requests: any;
      campaigns: any;
      home: any;
    };
  }
}
