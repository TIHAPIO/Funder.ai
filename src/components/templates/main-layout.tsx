'use client';

import { Sidebar } from '../navigation/sidebar';
import { useState } from 'react';
import { useTheme } from '../providers/ThemeProvider';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getTextClass } = useTheme();

  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out" 
           style={{ width: isExpanded ? '16rem' : '4rem' }}>
        <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </div>
      <div className="flex-1 transition-all duration-300 ease-in-out pl-16"
           style={{ paddingLeft: isExpanded ? '16rem' : '4rem' }}>
        <main className={`p-8 bg-background ${getTextClass('base')}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
