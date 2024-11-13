'use client';

import { ThemeProvider as LocalThemeProvider } from './ThemeProvider';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class">
      <LocalThemeProvider>
        {children}
      </LocalThemeProvider>
    </NextThemeProvider>
  );
}
