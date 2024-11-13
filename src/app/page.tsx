import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Car,
  Building,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const criticalResources = [
    {
      category: "Fahrzeuge",
      item: "Mietautos",
      campaign: "Kampagne Süd",
      current: 2,
      required: 5,
      icon: Car,
    },
    {
      category: "Personal",
      item: "Werber-Teams",
      campaign: "Kampagne Nord",
      current: 3,
      required: 6,
      icon: Users,
    },
    {
      category: "Unterkünfte",
      item: "Hotelzimmer",
      campaign: "Kampagne West",
      current: 8,
      required: 15,
      icon: Building,
    }
  ]

  const pendingApprovals = [
    {
      title: "Neue Kampagne Nord-West",
      type: "Kampagne",
      requester: "Max Mustermann",
      priority: "high",
      date: "15.03.2024",
    },
    {
      title: "Zusätzliche Mietautos",
      type: "Ressource",
      requester: "Anna Schmidt",
      priority: "high",
      date: "14.03.2024",
    },
    {
      title: "T-Shirt Nachbestellung",
      type: "Bestellung",
      requester: "Lisa Weber",
      priority: "medium",
      date: "13.03.2024",
    }
  ]

  const upcomingCampaigns = [
    {
      name: "Kampagne Nord",
      startDate: "01.04.2024",
      status: "Vorbereitung",
      readiness: 75,
      missingResources: ["2 Fahrzeuge", "3 Tablets"],
    },
    {
      name: "Kampagne Süd",
      startDate: "15.04.2024",
      status: "Planung",
      readiness: 45,
      missingResources: ["3 Teams", "1 Unterkunft", "5 Tablets"],
    }
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      {/* Critical Resources */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold">Kritische Ressourcen</h2>
          </div>
          <Link href="/resources">
            <Button variant="outline" className="flex items-center">
              Alle Ressourcen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalResources.map((resource) => (
            <div key={resource.item} className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <resource.icon className="h-5 w-5 text-red-600 mr-2" />
                <span className="font-semibold text-red-900">{resource.category}</span>
              </div>
              <div className="space-y-1">
                <div className="font-medium">{resource.item}</div>
                <div className="text-sm text-red-700">
                  Verfügbar: {resource.current} von {resource.required}
                </div>
                <div className="text-sm text-gray-600">{resource.campaign}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Campaigns */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Anstehende Kampagnen</h2>
          </div>
          <Link href="/campaigns">
            <Button variant="outline" className="flex items-center">
              Alle Kampagnen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {upcomingCampaigns.map((campaign) => (
            <div key={campaign.name} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{campaign.name}</h3>
                  <div className="text-sm text-gray-500">Start: {campaign.startDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{campaign.status}</div>
                  <div className="text-sm text-gray-500">
                    Bereitschaft: {campaign.readiness}%
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm font-medium text-red-600">Fehlende Ressourcen:</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {campaign.missingResources.map((resource) => (
                    <span
                      key={resource}
                      className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
                    >
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">Ausstehende Genehmigungen</h2>
          </div>
          <Link href="/requests">
            <Button variant="outline" className="flex items-center">
              Alle Anfragen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <div key={approval.title} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">{approval.title}</div>
                <div className="text-sm text-gray-500">
                  Von: {approval.requester} • {approval.date}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    approval.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {approval.type}
                </span>
                <Button size="sm">Prüfen</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
