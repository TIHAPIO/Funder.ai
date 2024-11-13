import React from 'react'
import { Button } from "@/components/ui/button"
import { Plus, Truck, MapPin, Calendar, AlertCircle } from 'lucide-react'

const TransportPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Transport</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Fahrzeug hinzufügen
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Verfügbare Fahrzeuge</h3>
          <div className="text-3xl font-bold text-green-600">5</div>
          <div className="text-sm text-gray-500 mt-1">von insgesamt 12 Fahrzeugen</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Aktuelle Einsätze</h3>
          <div className="text-3xl font-bold text-blue-600">7</div>
          <div className="text-sm text-gray-500 mt-1">in 4 verschiedenen Kampagnen</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Geplante Wartungen</h3>
          <div className="text-3xl font-bold text-yellow-600">2</div>
          <div className="text-sm text-gray-500 mt-1">in den nächsten 7 Tagen</div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Fahrzeugübersicht</h2>
          <div className="space-y-4">
            {[
              {
                id: 1,
                type: "Transporter",
                licensePlate: "M-RK 1234",
                status: "Im Einsatz",
                campaign: "München",
                location: "München Innenstadt",
                nextService: "15.01.2025",
                driver: "Max Mustermann",
              },
              {
                id: 2,
                type: "Kleintransporter",
                licensePlate: "HH-RK 5678",
                status: "Verfügbar",
                campaign: null,
                location: "Hamburg Depot",
                nextService: "01.02.2025",
                driver: null,
              },
              {
                id: 3,
                type: "Transporter",
                licensePlate: "B-RK 9012",
                status: "Wartung",
                campaign: null,
                location: "Berlin Werkstatt",
                nextService: "Aktuell",
                driver: null,
              },
            ].map((vehicle) => (
              <div
                key={vehicle.id}
                className="border rounded-lg p-6 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg font-medium">
                        {vehicle.type} - {vehicle.licensePlate}
                      </h3>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {vehicle.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Nächste Wartung: {vehicle.nextService}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.status === "Im Einsatz"
                        ? "bg-blue-100 text-blue-800"
                        : vehicle.status === "Verfügbar"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                {vehicle.campaign && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="text-sm font-medium">Aktuelle Kampagne</div>
                    <div className="text-sm text-gray-500">{vehicle.campaign}</div>
                    {vehicle.driver && (
                      <div className="text-sm text-gray-500 mt-1">
                        Fahrer: {vehicle.driver}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-3">
                  <Button variant="outline">Details</Button>
                  <Button variant="outline">Zuweisen</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-lg font-semibold">Wartungshinweise</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              vehicle: "M-RK 1234",
              type: "Ölwechsel",
              due: "In 5 Tagen",
              priority: "Hoch",
            },
            {
              vehicle: "HH-RK 5678",
              type: "Hauptuntersuchung",
              due: "In 2 Wochen",
              priority: "Mittel",
            },
          ].map((alert) => (
            <div
              key={alert.vehicle}
              className="flex items-center justify-between p-4 border rounded"
            >
              <div>
                <div className="font-medium">{alert.vehicle}</div>
                <div className="text-sm text-gray-500">
                  {alert.type} - Fällig: {alert.due}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  alert.priority === "Hoch"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {alert.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TransportPage
