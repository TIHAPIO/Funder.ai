import React from 'react'
import { Button } from "@/components/ui/button"
import { Save, User, Bell, Shield, Globe, Phone } from 'lucide-react'

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Einstellungen</h1>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Änderungen speichern
        </Button>
      </div>

      {/* Support Contact */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Phone className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Support Kontakt</h2>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">Tim Hanspaul</p>
          <p className="text-gray-600">+017647804845</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">Profil Einstellungen</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ihr Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-Mail</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ihre.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ihre Position"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">Benachrichtigungen</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">E-Mail Benachrichtigungen</h3>
                  <p className="text-sm text-gray-500">Erhalten Sie Updates per E-Mail</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">WhatsApp Benachrichtigungen</h3>
                  <p className="text-sm text-gray-500">Erhalten Sie Updates per WhatsApp</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">Sicherheit</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Passwort ändern</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Neues Passwort"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Passwort bestätigen</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Passwort bestätigen"
                />
              </div>
              <Button variant="outline" className="w-full">
                Passwort aktualisieren
              </Button>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold">System</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sprache</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Deutsch</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Zeitzone</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Berlin (GMT+1)</option>
                  <option>London (GMT)</option>
                  <option>New York (GMT-5)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Dunkles Erscheinungsbild aktivieren</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
