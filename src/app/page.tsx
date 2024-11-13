'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Willkommen bei fundr.ai
        </h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Sie sind eingeloggt als <span className="font-medium">{user?.email}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Kampagnen</h3>
            <p className="text-gray-500 mb-4">Verwalten Sie Ihre Fundraising-Kampagnen</p>
            <Button
              onClick={() => router.push('/campaigns')}
              variant="outline"
            >
              Zu den Kampagnen
            </Button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Anfragen</h3>
            <p className="text-gray-500 mb-4">Sehen Sie alle eingegangenen Anfragen</p>
            <Button
              onClick={() => router.push('/requests')}
              variant="outline"
            >
              Zu den Anfragen
            </Button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ressourcen</h3>
            <p className="text-gray-500 mb-4">Greifen Sie auf wichtige Ressourcen zu</p>
            <Button
              onClick={() => router.push('/resources')}
              variant="outline"
            >
              Zu den Ressourcen
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Schnellstart</h2>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Erstellen Sie eine neue Kampagne
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verwalten Sie Ihre Kontakte
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Überprüfen Sie die Statistiken
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
