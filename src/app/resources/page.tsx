'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { 
  Plus, 
  ShirtIcon, 
  Package, 
  Car, 
  Building, 
  Users, 
  Home,
  ExternalLink,
  FolderHeart,
  Loader2
} from 'lucide-react';
import { useTheme } from "@/components/providers/ThemeProvider";
import { 
  employeeService, 
  equipmentService, 
  vehicleService, 
  accommodationService, 
  redCrossOfficeService 
} from '@/lib/services/resources';
import type { 
  Employee, 
  Equipment, 
  Vehicle, 
  Accommodation, 
  RedCrossOffice 
} from '@/types/resources';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

type Resource = Employee | Equipment | Vehicle | Accommodation | RedCrossOffice;

interface CategoryConfig {
  title: string;
  icon: any;
  key: 'employees' | 'equipment' | 'clothing' | 'vehicles' | 'districts' | 'accommodations';
  resourceType: 'internal' | 'external';
  service: any;
  headers: string[];
}

const categories: CategoryConfig[] = [
  {
    title: "Mitarbeiter",
    icon: Users,
    key: 'employees',
    resourceType: 'internal',
    service: employeeService,
    headers: ['Name', 'Status', 'Rolle', 'Kampagne', 'Ausrüstung', 'Kontakt']
  },
  {
    title: "Ausrüstung",
    icon: Package,
    key: 'equipment',
    resourceType: 'internal',
    service: equipmentService,
    headers: ['Name', 'Typ', 'Status', 'Zugewiesen an', 'Seriennummer', 'Verfügbar']
  },
  {
    title: "Kleidung",
    icon: ShirtIcon,
    key: 'clothing',
    resourceType: 'internal',
    service: equipmentService,
    headers: ['Artikel', 'Größe', 'Status', 'Verfügbar', 'Gesamt']
  },
  {
    title: "Fahrzeuge",
    icon: Car,
    key: 'vehicles',
    resourceType: 'external',
    service: vehicleService,
    headers: ['Name', 'Status', 'Typ', 'Kennzeichen', 'Kampagne', 'Wartung']
  },
  {
    title: "Kreisverbände",
    icon: Building,
    key: 'districts',
    resourceType: 'external',
    service: redCrossOfficeService,
    headers: ['Name', 'Status', 'Stadt', 'Kapazität', 'Kontakt']
  },
  {
    title: "Unterkünfte",
    icon: Home,
    key: 'accommodations',
    resourceType: 'external',
    service: accommodationService,
    headers: ['Name', 'Typ', 'Stadt', 'Verfügbar', 'Kampagne', 'Kontakt']
  }
];

const formatResourceData = (data: Resource[]): (string | number)[][] => {
  return data.map(item => {
    switch(true) {
      case 'role' in item: // Employee
        const employee = item as Employee;
        return [
          employee.name,
          employee.status,
          employee.role,
          employee.campaignId?.toString() || '-',
          `${employee.equipment?.tablet || '-'}, ${employee.equipment?.clothing?.shirtSize || '-'}`,
          employee.contact?.email || '-'
        ];
      case 'serialNumber' in item: // Equipment
        const equipment = item as Equipment;
        if (equipment.type === 'clothing') {
          return [
            equipment.name,
            equipment.details?.size || '-',
            equipment.status,
            equipment.quantity?.available.toString() || '0',
            equipment.quantity?.total.toString() || '0'
          ];
        }
        return [
          equipment.name,
          equipment.type,
          equipment.status,
          equipment.assignedTo?.toString() || '-',
          equipment.serialNumber || '-',
          `${equipment.quantity?.available}/${equipment.quantity?.total}`
        ];
      case 'licensePlate' in item: // Vehicle
        const vehicle = item as Vehicle;
        return [
          vehicle.name,
          vehicle.status,
          vehicle.type,
          vehicle.licensePlate,
          vehicle.campaignId?.toString() || '-',
          vehicle.maintenance?.nextService || '-'
        ];
      case 'teams' in item: // RedCrossOffice
        const office = item as RedCrossOffice;
        return [
          office.name,
          office.status,
          office.location.city,
          `${office.capacity.teams}/${office.capacity.campaigns}`,
          office.contact.email
        ];
      case 'booking' in item: // Accommodation
        const accommodation = item as Accommodation;
        return [
          accommodation.name,
          accommodation.type,
          accommodation.location.city,
          `${accommodation.capacity.available}/${accommodation.capacity.total}`,
          accommodation.campaignId?.toString() || '-',
          accommodation.contact.email
        ];
      default:
        return [];
    }
  });
};

export default function ResourcesPage() {
  const { getCardClass, getContainerClass } = useTheme();
  const [resourceType, setResourceType] = useState<'internal' | 'external'>('internal');
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  useEffect(() => {
    if (selectedCategory) {
      // Reset pagination when category changes
      setCurrentPage(1);
      setHasMore(false);
      setLastDoc(null);
      setData([]);
      fetchData();
    }
  }, [selectedCategory]);

  const fetchData = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      switch (selectedCategory.key) {
        case 'employees':
          result = await employeeService.getAllEmployees(currentPage);
          break;
        case 'equipment':
          result = await equipmentService.getAllEquipment(currentPage);
          break;
        case 'clothing':
          result = await equipmentService.getEquipmentByType('clothing', currentPage);
          break;
        case 'vehicles':
          result = await vehicleService.getAllVehicles(currentPage);
          break;
        case 'districts':
          result = await redCrossOfficeService.getAllOffices(currentPage);
          break;
        case 'accommodations':
          result = await accommodationService.getAllAccommodations(currentPage);
          break;
        default:
          result = { items: [], lastDoc: null, hasMore: false };
      }
      
      setData(currentPage === 1 ? result.items : [...data, ...result.items]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (lastDoc) {
      setCurrentPage(currentPage + 1);
      await fetchData();
    }
  };

  const handleSaveData = async (updatedData: (string | number)[][]) => {
    if (!selectedCategory) return;
    
    try {
      // TODO: Implement save functionality with Firebase
      // This will require mapping the table data back to the proper resource type
      // and using the appropriate service to update
      await fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Fehler beim Speichern der Daten');
    }
  };

  const filteredCategories = categories.filter(category => 
    category.resourceType === resourceType
  );

  return (
    <div className={getContainerClass('base')}>
      <div className={getContainerClass('header')}>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Ressourcen</h1>
          <div className="flex gap-2">
            <Button 
              variant={resourceType === 'internal' ? 'default' : 'outline'}
              onClick={() => setResourceType('internal')}
            >
              <FolderHeart className="mr-2 h-4 w-4" />
              Interne Ressourcen
            </Button>
            <Button 
              variant={resourceType === 'external' ? 'default' : 'outline'}
              onClick={() => setResourceType('external')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Externe Ressourcen
            </Button>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ressource hinzufügen
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Fehler!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        {/* Categories sidebar */}
        <div className="w-64 space-y-2">
          {filteredCategories.map((category) => (
            <div 
              key={category.title} 
              className={`${getCardClass()} cursor-pointer transition-transform hover:scale-105 ${
                selectedCategory?.key === category.key ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="flex items-center">
                <category.icon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                <h2 className="text-sm font-semibold">{category.title}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {loading && currentPage === 1 ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : selectedCategory ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <selectedCategory.icon className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-2" />
                  <h2 className="text-xl font-semibold">{selectedCategory.title}</h2>
                </div>
              </div>
              
              <DataTable
                headers={selectedCategory.headers}
                data={formatResourceData(data)}
                editable={true}
                onSave={handleSaveData}
              />

              {hasMore && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Mehr laden
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Wählen Sie eine Kategorie aus der Liste aus
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
