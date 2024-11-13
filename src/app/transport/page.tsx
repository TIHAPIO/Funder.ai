'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Truck, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

const TransportPage: React.FC = () => {
  const { getCardClass, getBadgeClass, getContainerClass, getTextClass } = useTheme();

  return (
    <div className={getContainerClass('base')}>
      <div className={getContainerClass('header')}>
        <h1 className="text-4xl font-bold">Transport</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Fahrzeug hinzufügen
        </Button>
      </div>

      {/* Overview Cards */}
      <div className={getContainerClass('grid')}>
        <div className={getCardClass()}>
          <h3 className="text-lg font-semibold mb-2">Verfügbare Fahrzeuge</h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">5</div>
          <div className={`text-sm ${getTextClass('muted')} mt-1`}>von insgesamt 12 Fahrzeugen</div>
        </div>

        <div className={getCardClass()}>
          <h3 className="text-lg font-semibold mb-2">Aktuelle Einsätze</h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">7</div>
          <div className={`text-sm ${getTextClass('muted')} mt-1`}>in 4 verschiedenen Kampagnen</div>
        </div>

        <div className={getCardClass()}>
          <h3 className="text-lg font-semibold mb-2">Geplante Wartungen</h3>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">2</div>
          <div className={`text-sm ${getTextClass('muted')} mt-1`}>in den nächsten 7 Tagen</div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className={getCardClass()}>
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
                className={getCardClass({ hover: true })}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Truck className={`h-5 w-5 ${getTextClass('muted')} mr-2`} />
                      <h3 className="text-lg font-medium">
                        {vehicle.type} - {vehicle.licensePlate}
                      </h3>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className={`flex items-center text-sm ${getTextClass('muted')}`}>
                        <MapPin className="h-4 w-4 mr-1" />
                        {vehicle.location}
                      </div>
                      <div className={`flex items-center text-sm ${getTextClass('muted')}`}>
                        <Calendar className="h-4 w-4 mr-1" />
                        Nächste Wartung: {vehicle.nextService}
                      </div>
                    </div>
                  </div>
                  <span
                    className={getBadgeClass(
                      vehicle.status === "Im Einsatz"
                        ? "info"
                        : vehicle.status === "Verfügbar"
                        ? "success"
                        : "warning"
                    )}
                  >
                    {vehicle.status}
                  </span>
                </div>

                {vehicle.campaign && (
                  <div className="mt-4 p-3 bg-secondary dark:bg-accent rounded-md">
                    <div className="text-sm font-medium">Aktuelle Kampagne</div>
                    <div className={`text-sm ${getTextClass('muted')}`}>{vehicle.campaign}</div>
                    {vehicle.driver && (
                      <div className={`text-sm ${getTextClass('muted')} mt-1`}>
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
      <div className={getCardClass()}>
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
              className="flex items-center justify-between p-4 border border-border rounded"
            >
              <div>
                <div className="font-medium">{alert.vehicle}</div>
                <div className={`text-sm ${getTextClass('muted')}`}>
                  {alert.type} - Fällig: {alert.due}
                </div>
              </div>
              <span
                className={getBadgeClass(
                  alert.priority === "Hoch" ? "error" : "warning"
                )}
              >
                {alert.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportPage;
