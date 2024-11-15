'use client';

import { ThemeProvider as LocalThemeProvider } from './ThemeProvider';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { AuthProvider } from '../../context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class">
      <AuthProvider>
        <LocalThemeProvider>
          {children}
        </LocalThemeProvider>
      </AuthProvider>
    </NextThemeProvider>
  );
}
