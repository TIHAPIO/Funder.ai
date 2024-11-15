'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Input validation
      if (!email.trim()) {
        throw new Error(t('errors.invalidEmail'));
      }
      if (!password.trim()) {
        throw new Error(t('errors.requiredField'));
      }

      // Attempt login
      await login(email.trim(), password.trim());
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        // Use the specific error message from Firebase/Auth context
        setError(error.message);
      } else {
        // Fallback to generic error message
        setError(t('errors.login'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t('signIn')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('signInToAccount')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                {t('email')}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('placeholders.email')}
                disabled={isLoading}
                className="mt-1"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                {t('password')}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('placeholders.password')}
                disabled={isLoading}
                className="mt-1"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link 
              href="/auth/reset-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t('loading.signingIn') : t('signIn')}
          </Button>

          <div className="text-center text-sm">
            {t('dontHaveAccount')}{' '}
            <Link 
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-500"
            >
              {t('signUp')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
