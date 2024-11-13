import { Inter } from 'next/font/google'
import { MainLayout } from '@/components/templates/main-layout'
import { Providers } from '@/components/providers/Providers'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <MainLayout>{children}</MainLayout>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
