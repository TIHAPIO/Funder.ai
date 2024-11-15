'use client';

import { Inter } from 'next/font/google';
import { I18nProvider } from '../providers/i18n-provider';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { Providers } from '../components/providers/Providers';
import { MainLayout } from '../components/templates/main-layout';
import { usePathname } from 'next/navigation';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Pages that don't need the sidebar
const authPages = ['/auth/login', '/auth/signup', '/auth/reset-password'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = authPages.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <I18nProvider>
            <ThemeProvider>
              {isAuthPage ? (
                <div className="min-h-screen flex flex-col">
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
              ) : (
                <MainLayout>
                  {children}
                </MainLayout>
              )}
            </ThemeProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
