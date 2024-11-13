'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
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
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div 
      className={`
        flex flex-col h-full border-r transition-all duration-300 ease-in-out relative
        bg-background
      `}
    >
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          absolute -right-3 top-6 w-6 h-6 border rounded-full flex items-center justify-center
          bg-background transition-transform duration-300
          ${isExpanded ? 'transform rotate-180' : ''}
        `}
      >
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                  ${isExpanded ? '' : 'justify-center'}
                `}
                title={!isExpanded ? item.name : undefined}
              >
                <Icon
                  className={`
                    flex-shrink-0 h-5 w-5
                    ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                    ${isExpanded ? 'mr-3' : ''}
                  `}
                />
                {isExpanded && item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-4 py-2 border-t">
        <Button
          variant="ghost"
          size="icon"
          className="w-full flex items-center justify-center h-10"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {isExpanded && (
            <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </Button>
      </div>

      <div className={`flex-shrink-0 flex border-t p-4 ${isExpanded ? '' : 'justify-center'}`}>
        <Button
          variant="ghost"
          className={`
            flex items-center
            ${isExpanded ? 'w-full' : 'w-10 h-10 p-0'}
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
