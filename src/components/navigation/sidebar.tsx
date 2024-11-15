'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { useTheme as useNextTheme } from 'next-themes';
import {
  Globe,
  FileText,
  Settings,
  LogOut,
  Home,
  ChevronRight,
  Sun,
  Moon,
  MessageSquare,
  Database,
  Languages,
  LucideIcon
} from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { useTranslation } from '../../hooks/useTranslation';

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

interface NavigationItem {
  key: string;
  href: string;
  icon: LucideIcon;
}

type TextClassVariant = 'title' | 'base' | 'muted';

const NAVIGATION_ITEMS: NavigationItem[] = [
  { key: 'home', href: '/', icon: Home },
  { key: 'campaigns', href: '/campaigns', icon: Globe },
  { key: 'resources', href: '/resources', icon: Database },
  { key: 'chat', href: '/chat', icon: MessageSquare },
];

function NavigationLink({ 
  item, 
  isActive, 
  isExpanded, 
  getTextClass,
  label 
}: { 
  item: NavigationItem; 
  isActive: boolean; 
  isExpanded: boolean;
  getTextClass: (variant: TextClassVariant) => string;
  label: string;
}) {
  const Icon = item.icon;
  
  return (
    <Link
      href={item.href}
      className={`
        group flex items-center px-2 py-2 text-sm font-medium rounded-md
        ${isActive
          ? 'bg-accent text-accent-foreground'
          : `${getTextClass('muted')} hover:bg-accent hover:text-accent-foreground`
        }
        ${isExpanded ? '' : 'justify-center'}
      `}
      title={!isExpanded ? label : undefined}
    >
      <Icon
        className={`
          flex-shrink-0 h-5 w-5
          ${isActive ? 'text-accent-foreground' : getTextClass('muted')}
          ${isExpanded ? 'mr-3' : ''}
        `}
      />
      {isExpanded && label}
    </Link>
  );
}

function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  t
}: {
  currentLanguage: string;
  onLanguageChange: (lang: 'en' | 'de') => void;
  t: any;
}) {
  return (
    <div className="py-1">
      <button
        onClick={() => onLanguageChange('en')}
        className={`
          flex items-center w-full px-4 py-2 text-sm
          ${currentLanguage === 'en' ? 'bg-accent' : 'hover:bg-accent'}
        `}
      >
        <Languages className="h-4 w-4 mr-2" />
        English
      </button>
      <button
        onClick={() => onLanguageChange('de')}
        className={`
          flex items-center w-full px-4 py-2 text-sm
          ${currentLanguage === 'de' ? 'bg-accent' : 'hover:bg-accent'}
        `}
      >
        <Languages className="h-4 w-4 mr-2" />
        Deutsch
      </button>
    </div>
  );
}

export function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { getTextClass } = useTheme();
  const { theme, setTheme } = useNextTheme();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const { t: tCommon, currentLanguage, switchLanguage } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageChange = (lang: 'en' | 'de') => {
    if (lang !== currentLanguage) {
      switchLanguage(lang);
      setShowSettingsMenu(false);
    }
  };

  return (
    <div className="h-full flex flex-col border-r bg-background border-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          absolute -right-3 top-6 w-6 h-6 border rounded-full flex items-center justify-center
          bg-background border-border hover:bg-accent transition-transform duration-300
          ${isExpanded ? 'transform rotate-180' : ''}
        `}
      >
        <ChevronRight className={`w-4 h-4 ${getTextClass('muted')}`} />
      </button>

      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className={`flex items-center flex-shrink-0 px-4 ${isExpanded ? '' : 'justify-center'}`}>
          <h1 className="text-xl font-bold">
            {isExpanded ? tCommon('appName') : tCommon('appNameShort')}
          </h1>
        </div>

        <nav className="mt-5 flex-1 px-2 space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <NavigationLink
              key={item.key}
              item={item}
              isActive={pathname === item.href}
              isExpanded={isExpanded}
              getTextClass={getTextClass}
              label={tCommon(`navigation.${item.key}`)}
            />
          ))}
        </nav>
      </div>

      <div className="flex-shrink-0 flex flex-col border-t border-border p-4 space-y-2 relative z-50">
        <div className="relative">
          <Button
            variant="ghost"
            className={`
              flex items-center hover:bg-accent w-full
              ${isExpanded ? 'justify-start' : 'w-10 h-10 p-0 justify-center'}
            `}
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          >
            <Settings className={`h-5 w-5 ${isExpanded ? 'mr-3' : ''}`} />
            {isExpanded && tSettings('title')}
          </Button>

          {showSettingsMenu && (
            <div 
              className={`
                absolute ${isExpanded ? 'right-0' : 'left-full ml-2'} bottom-full mb-2
                w-48 bg-background border border-border rounded-md shadow-lg
                transition-all duration-200 ease-in-out z-[9999]
              `}
            >
              <div className="py-1">
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-accent"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 mr-2" />
                  ) : (
                    <Moon className="h-4 w-4 mr-2" />
                  )}
                  {theme === 'dark' ? tSettings('theme.options.light') : tSettings('theme.options.dark')}
                </button>

                <LanguageSelector
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  t={tSettings}
                />

                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                  onClick={() => setShowSettingsMenu(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {tSettings('sections.general')}
                </Link>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className={`
            flex items-center hover:bg-accent w-full
            ${isExpanded ? 'justify-start' : 'w-10 h-10 p-0 justify-center'}
          `}
          onClick={handleLogout}
        >
          <LogOut className={`h-5 w-5 ${isExpanded ? 'mr-3' : ''}`} />
          {isExpanded && tCommon('actions.logout')}
        </Button>
      </div>
    </div>
  );
}
