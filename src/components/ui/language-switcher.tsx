'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

interface LanguageOption {
  code: 'en' | 'de';
  label: string;
}

const languages: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
];

export function LanguageSwitcher() {
  const { t, currentLanguage, switchLanguage } = useTranslation();

  const handleLanguageChange = (lang: 'en' | 'de') => {
    if (lang !== currentLanguage) {
      switchLanguage(lang);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          variant={currentLanguage === lang.code ? 'default' : 'outline'}
          size="sm"
          className="min-w-[80px]"
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}

// Compact version for navigation bars
export function CompactLanguageSwitcher() {
  const { currentLanguage, switchLanguage } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'de' : 'en';
    switchLanguage(newLanguage);
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      className="w-12"
    >
      {currentLanguage ? currentLanguage.toUpperCase() : 'EN'}
    </Button>
  );
}
