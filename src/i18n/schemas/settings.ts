export interface SettingsTranslations {
  profile: {
    title: string;
    settings: string;
    name: string;
    email: string;
    position: string;
  };
  notifications: {
    title: string;
    email: {
      title: string;
      description: string;
    };
    whatsapp: {
      title: string;
      description: string;
    };
  };
  security: {
    title: string;
    changePassword: string;
    confirmPassword: string;
  };
  system: {
    title: string;
    language: string;
    timezone: string;
    darkMode: {
      title: string;
      description: string;
    };
  };
}
