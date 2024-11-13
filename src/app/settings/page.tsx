import { Button } from "../../components/ui/button"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-xl font-bold">
            TH
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">Profil</h2>
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
          <h2 className="text-lg font-semibold mb-4">Profil Einstellungen</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
                defaultValue="Tim Hanspaul"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">E-Mail</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
                defaultValue="tim.hanspaul@fundr.ai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Position</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
                defaultValue="Geschäftsführer"
              />
            </div>
            <Button>Speichern</Button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Benachrichtigungen</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">E-Mail Benachrichtigungen</h3>
                <p className="text-sm text-muted-foreground">Erhalten Sie Updates per E-Mail</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </label>
            <label className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">WhatsApp Benachrichtigungen</h3>
                <p className="text-sm text-muted-foreground">Erhalten Sie Updates per WhatsApp</p>
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
          <h2 className="text-lg font-semibold mb-4">Sicherheit</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Passwort ändern</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Passwort bestätigen</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring"
              />
            </div>
            <Button>Passwort ändern</Button>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-card rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">System</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Sprache</label>
              <select className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring">
                <option>Deutsch</option>
                <option>English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Zeitzone</label>
              <select className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring">
                <option>Europe/Berlin (GMT+1)</option>
                <option>UTC</option>
              </select>
            </div>
            <label className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">Dunkles Erscheinungsbild aktivieren</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={theme === 'dark'}
                  onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
