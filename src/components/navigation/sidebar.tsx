'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { useTheme as useNextTheme } from 'next-themes';
import {
  Globe,
  FileText,
  Users,
  Truck,
  Settings,
  LogOut,
  Home,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Kampagnen', href: '/campaigns', icon: Globe },
  { name: 'Anfragen', href: '/requests', icon: FileText },
  { name: 'Recruiter', href: '/recruiters', icon: Users },
  { name: 'Transport', href: '/transport', icon: Truck },
  { name: 'Ressourcen', href: '/resources', icon: FileText },
];

export function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { getTextClass } = useTheme();
  const { theme, setTheme } = useNextTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div 
      className={`
        flex flex-col h-full border-r transition-all duration-300 ease-in-out relative
        bg-background border-border
      `}
    >
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          absolute -right-3 top-6 w-6 h-6 border rounded-full flex items-center justify-center
          bg-background border-border
          hover:bg-accent transition-all duration-300
          ${isExpanded ? 'transform rotate-180' : ''}
        `}
      >
        <ChevronRight className={`w-4 h-4 ${getTextClass('muted')}`} />
      </button>

      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className={`flex items-center flex-shrink-0 px-4 ${isExpanded ? '' : 'justify-center'}`}>
          {isExpanded ? (
            <h1 className="text-xl font-bold">fundr.ai</h1>
          ) : (
            <h1 className="text-xl font-bold">f</h1>
          )}
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-accent text-accent-foreground'
                    : `${getTextClass('muted')} hover:bg-accent hover:text-accent-foreground`
                  }
                  ${isExpanded ? '' : 'justify-center'}
                `}
                title={!isExpanded ? item.name : undefined}
              >
                <Icon
                  className={`
                    flex-shrink-0 h-5 w-5
                    ${isActive ? 'text-accent-foreground' : getTextClass('muted')}
                    ${isExpanded ? 'mr-3' : ''}
                  `}
                />
                {isExpanded && item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 flex flex-col border-t border-border p-4 space-y-2">
        <Button
          variant="ghost"
          className={`
            flex items-center hover:bg-accent
            ${isExpanded ? 'w-full justify-start' : 'w-10 h-10 p-0 justify-center'}
          `}
          onClick={toggleTheme}
          title={!isExpanded ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {theme === 'dark' ? (
            <Sun className={`h-5 w-5 ${isExpanded ? 'mr-3' : ''}`} />
          ) : (
            <Moon className={`h-5 w-5 ${isExpanded ? 'mr-3' : ''}`} />
          )}
          {isExpanded && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
        </Button>
        <Button
          variant="ghost"
          className={`
            flex items-center hover:bg-accent
            ${isExpanded ? 'w-full justify-start' : 'w-10 h-10 p-0 justify-center'}
          `}
          onClick={handleLogout}
          title={!isExpanded ? 'Abmelden' : undefined}
        >
          <LogOut className={`h-5 w-5 ${isExpanded ? 'mr-3' : ''}`} />
          {isExpanded && 'Abmelden'}
        </Button>
      </div>
    </div>
  );
}
