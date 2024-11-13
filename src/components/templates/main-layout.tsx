'use client';

import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/navigation/sidebar';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const [isExpanded, setIsExpanded] = useState(false);
  const { getCardClass, getTextClass } = useTheme();

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background">
      {user && (
        <div 
          className="h-full transition-all duration-300 ease-in-out"
          style={{ width: isExpanded ? '16rem' : '4rem' }}
        >
          <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </div>
      )}
      <div className="flex-1 overflow-auto transition-all duration-300 ease-in-out">
        <main className={`p-8 bg-background ${getTextClass('base')}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
