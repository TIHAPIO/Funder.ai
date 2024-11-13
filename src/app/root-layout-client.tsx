'use client';

import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  // For testing: always render children since we have a mock user
  return children;
}
