'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useTranslation('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      setError(t('errors.resetPassword'));
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">{t('resetPassword')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('enterEmailForReset')}
          </p>
        </div>

        {success ? (
          <div className="p-4 rounded-md bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100">
            <p>
              {t('resetEmailSent', { email })}
            </p>
            <div className="mt-4">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-500"
              >
                {t('backToSignIn')}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
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
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('loading.sendingResetLink') : t('resetPassword')}
            </Button>

            <div className="text-center text-sm">
              <Link 
                href="/auth/login" 
                className="text-blue-600 hover:text-blue-500"
              >
                {t('backToSignIn')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
