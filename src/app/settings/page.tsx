'use client';

import { Button } from "../../components/ui/button";
import { useTheme } from "next-themes";
import { useTranslation } from "@/hooks/useTranslation";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('settings');

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-xl font-bold">
            TH
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{t('profile.title')}</h2>
            <div className="space-y-2">
              <p className="text-muted-foreground">Tim Hanspaul</p>
              <p className="text-muted-foreground">+017647804845</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-card rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('profile.settings')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">{t('profile.name')}</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
                defaultValue="Tim Hanspaul"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">{t('profile.email')}</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
                defaultValue="tim.hanspaul@fundr.ai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">{t('profile.position')}</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
                defaultValue="Geschäftsführer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('notifications.title')}</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t('notifications.email.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('notifications.email.description')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </label>
            <label className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t('notifications.whatsapp.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('notifications.whatsapp.description')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-card rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('security.title')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">{t('security.changePassword')}</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">{t('security.confirmPassword')}</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-card rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">{t('system.title')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">{t('system.language')}</label>
              <select className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring">
                <option>Deutsch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">{t('system.timezone')}</label>
              <select className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring">
                <option>Europe/Berlin (GMT+1)</option>
              </select>
            </div>
            <label className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t('system.darkMode.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('system.darkMode.description')}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
