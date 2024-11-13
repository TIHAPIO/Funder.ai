'use client';

import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Passwort zurücksetzen
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen.
          </p>
        </div>
        {!submitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

            <div>
              <Button type="submit" className="w-full">
                Zurücksetzen
              </Button>
            </div>

            <div className="text-center">
              <Link href="/auth/login" className="text-primary hover:text-primary/80 text-sm">
                Zurück zum Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <p className="text-center text-foreground">
              Eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts wurde an {email} gesendet.
            </p>
            <div className="text-center">
              <Link href="/auth/login" className="text-primary hover:text-primary/80 text-sm">
                Zurück zum Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
