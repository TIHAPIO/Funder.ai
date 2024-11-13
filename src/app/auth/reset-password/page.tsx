'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSuccess(true);
      setError('');
    } catch (error) {
      setError('Passwort zurücksetzen fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail-Adresse.');
      setSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Passwort zurücksetzen</h2>
          <p className="mt-2 text-muted-foreground">
            Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 p-4 rounded-md">
            <p>
              Eine E-Mail zum Zurücksetzen des Passworts wurde an {email} gesendet.
              Bitte überprüfen Sie Ihren Posteingang und folgen Sie den Anweisungen.
            </p>
            <div className="mt-4">
              <a
                href="/auth/login"
                className="text-primary hover:underline"
              >
                Zurück zur Anmeldung
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                E-Mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@beispiel.de"
              />
            </div>

            <div>
              <Button type="submit" className="w-full">
                Passwort zurücksetzen
              </Button>
            </div>

            <div className="text-center text-sm">
              <a href="/auth/login" className="text-primary hover:underline">
                Zurück zur Anmeldung
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
