'use client';

import { Sidebar } from "@/components/navigation/sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) {
    return children;
  }

  return (
    <div className="flex h-screen">
      {user && (
        <div className="w-64 h-full">
          <Sidebar />
        </div>
      )}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RootLayoutContent>
        {children}
      </RootLayoutContent>
    </AuthProvider>
  );
}
