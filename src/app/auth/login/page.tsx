'use client';

import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Anmelden
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-ring focus:border-ring"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-ring focus:border-ring"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Anmelden
            </Button>
          </div>

          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">Noch kein Konto?</span>{' '}
            <Link href="/auth/signup" className="text-primary hover:text-primary/80 text-sm">
              Registrieren
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
