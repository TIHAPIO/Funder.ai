import { Button } from "@/components/ui/button"
import { Plus, Phone, Mail, MapPin } from 'lucide-react'

export default function RecruitersPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Werber</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Werber hinzufügen
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Alle</option>
              <option>Aktiv</option>
              <option>Verfügbar</option>
              <option>Nicht verfügbar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Erfahrung</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Alle</option>
              <option>Junior</option>
              <option>Senior</option>
              <option>Teamleiter</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kampagne</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Alle</option>
              <option>München</option>
              <option>Hamburg</option>
              <option>Berlin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sortierung</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Name</option>
              <option>Status</option>
              <option>Erfahrung</option>
              <option>Verfügbarkeit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Werber List */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            id: 1,
            name: "Max Mustermann",
            status: "Aktiv",
            experience: "Senior",
            currentCampaign: "München",
            email: "max.mustermann@example.com",
            phone: "+49 123 456789",
            location: "München",
            availability: "01.12.2024 - 15.01.2025",
          },
          {
            id: 2,
            name: "Anna Schmidt",
            status: "Verfügbar",
            experience: "Junior",
            currentCampaign: null,
            email: "anna.schmidt@example.com",
            phone: "+49 234 567890",
            location: "Hamburg",
            availability: "Ab sofort",
          },
          {
            id: 3,
            name: "Tom Weber",
            status: "Aktiv",
            experience: "Teamleiter",
            currentCampaign: "Berlin",
            email: "tom.weber@example.com",
            phone: "+49 345 678901",
            location: "Berlin",
            availability: "15.12.2024 - 31.01.2025",
          },
        ].map((recruiter) => (
          <div
            key={recruiter.id}
            className="bg-white shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{recruiter.name}</h2>
                  <div className="text-sm text-gray-500">{recruiter.experience}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    recruiter.status === "Aktiv"
                      ? "bg-green-100 text-green-800"
                      : recruiter.status === "Verfügbar"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {recruiter.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  {recruiter.location}
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  {recruiter.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  {recruiter.phone}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium">Verfügbarkeit</div>
                <div className="text-sm text-gray-500">{recruiter.availability}</div>
              </div>

              {recruiter.currentCampaign && (
                <div className="mt-4">
                  <div className="text-sm font-medium">Aktuelle Kampagne</div>
                  <div className="text-sm text-gray-500">{recruiter.currentCampaign}</div>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline">Profil</Button>
                <Button variant="outline">Kontaktieren</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
