'use client';

import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Tablet, 
  ShirtIcon, 
  Package, 
  AlertTriangle, 
  Car, 
  Building, 
  Users, 
  Home,
  Edit,
  Trash,
  Link as LinkIcon
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface BaseResource {
  id: number;
  type: 'car' | 'district' | 'recruiter' | 'tablet' | 'clothing' | 'accommodation';
}

interface CarResource extends BaseResource {
  type: 'car';
  name: string;
  status: string;
  campaign: string;
  notes: string;
}

interface DistrictResource extends BaseResource {
  type: 'district';
  name: string;
  status: string;
  capacity: string;
  contact: string;
}

interface RecruiterResource extends BaseResource {
  type: 'recruiter';
  name: string;
  status: string;
  campaign: string | null;
  members: number;
}

interface TabletResource extends BaseResource {
  type: 'tablet';
  name: string;
  status: string;
  assignedTo: string | null;
}

interface ClothingResource extends BaseResource {
  type: 'clothing';
  itemType: string;
  sizes: {
    S: number;
    M: number;
    L: number;
    XL: number;
  };
}

interface AccommodationResource extends BaseResource {
  type: 'accommodation';
  name: string;
  location: string;
  capacity: number;
  campaign: string;
}

type ResourceItem = 
  | CarResource 
  | DistrictResource 
  | RecruiterResource 
  | TabletResource 
  | ClothingResource 
  | AccommodationResource;

interface ResourceCategory {
  title: string;
  icon: any;
  items: ResourceItem[];
  needsReview: boolean;
}

export default function ResourcesPage() {
  const { getCardClass, getBadgeClass, getContainerClass, getTextClass } = useTheme();

  const resourceCategories: ResourceCategory[] = [
    {
      title: "Mietautos",
      icon: Car,
      items: [
        { id: 1, type: 'car', name: "VW Golf", status: "Verfügbar", campaign: "Kampagne Nord", notes: "Vollkasko versichert" },
        { id: 2, type: 'car', name: "Ford Transit", status: "Im Einsatz", campaign: "Kampagne Süd", notes: "Rückgabe: 15.03" },
      ],
      needsReview: true
    },
    {
      title: "Kreisverbände",
      icon: Building,
      items: [
        { id: 1, type: 'district', name: "Kreisverband Nord", status: "Aktiv", capacity: "15 Teams", contact: "Max Mustermann" },
        { id: 2, type: 'district', name: "Kreisverband Süd", status: "Aktiv", capacity: "12 Teams", contact: "Anna Schmidt" },
      ],
      needsReview: false
    },
    {
      title: "Werber",
      icon: Users,
      items: [
        { id: 1, type: 'recruiter', name: "Team Alpha", status: "Im Einsatz", campaign: "Kampagne Nord", members: 5 },
        { id: 2, type: 'recruiter', name: "Team Beta", status: "Verfügbar", campaign: null, members: 4 },
      ],
      needsReview: true
    },
    {
      title: "Tablets",
      icon: Tablet,
      items: [
        { id: 1, type: 'tablet', name: "Samsung Tab A8", status: "Verfügbar", assignedTo: null },
        { id: 2, type: 'tablet', name: "iPad 9", status: "Im Einsatz", assignedTo: "Team Alpha" },
      ],
      needsReview: false
    },
    {
      title: "Kleidung",
      icon: ShirtIcon,
      items: [
        { id: 1, type: 'clothing', itemType: "T-Shirts", sizes: { S: 20, M: 15, L: 5, XL: 10 } },
        { id: 2, type: 'clothing', itemType: "Jacken", sizes: { S: 10, M: 8, L: 3, XL: 5 } },
      ],
      needsReview: false
    },
    {
      title: "Unterkünfte",
      icon: Home,
      items: [
        { id: 1, type: 'accommodation', name: "Hotel Central", location: "Hamburg", capacity: 20, campaign: "Kampagne Nord" },
        { id: 2, type: 'accommodation', name: "Pension Schmitt", location: "München", capacity: 15, campaign: "Kampagne Süd" },
      ],
      needsReview: true
    }
  ]

  const renderItemContent = (item: ResourceItem) => {
    switch (item.type) {
      case 'clothing':
        return (
          <>
            <div className="font-medium">{item.itemType}</div>
            <div className={`text-sm ${getTextClass('muted')}`}>
              Größen: {Object.entries(item.sizes).map(([size, count]) => 
                `${size}(${count})`).join(', ')}
            </div>
          </>
        );
      case 'car':
      case 'district':
      case 'recruiter':
      case 'tablet':
      case 'accommodation':
        return (
          <>
            <div className="font-medium">{item.name}</div>
            {'status' in item && (
              <div className={`text-sm ${getTextClass('muted')}`}>Status: {item.status}</div>
            )}
            {'campaign' in item && item.campaign && (
              <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                <LinkIcon className="h-3 w-3 mr-1" />
                {item.campaign}
              </div>
            )}
            {'location' in item && (
              <div className={`text-sm ${getTextClass('muted')}`}>Standort: {item.location}</div>
            )}
            {'capacity' in item && (
              <div className={`text-sm ${getTextClass('muted')}`}>
                Kapazität: {typeof item.capacity === 'number' ? `${item.capacity} Personen` : item.capacity}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className={getContainerClass('base')}>
      <div className={getContainerClass('header')}>
        <h1 className="text-4xl font-bold">Ressourcen</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ressource hinzufügen
        </Button>
      </div>

      {/* Resource Categories */}
      <div className={getContainerClass('grid')}>
        {resourceCategories.map((category) => (
          <div key={category.title} className={getCardClass()}>
            {category.needsReview && (
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-yellow-400 rounded-full" 
                   title="Überprüfung erforderlich"/>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <category.icon className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-2" />
                <h2 className="text-lg font-semibold">{category.title}</h2>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {category.items.map((item) => (
                <div key={item.id} className={getCardClass({ hover: true })}>
                  <div className="flex justify-between items-start">
                    <div>
                      {renderItemContent(item)}
                    </div>
                    <div className="hidden group-hover:flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Critical Resources Alert */}
      <div className={getCardClass()}>
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mr-2" />
          <h2 className="text-lg font-semibold">Kritische Ressourcen</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              item: "T-Shirts Größe L",
              current: 5,
              minimum: 10,
              status: "Kritisch",
              campaign: "Kampagne Nord"
            },
            {
              item: "Tablets",
              current: 15,
              minimum: 20,
              status: "Niedrig",
              campaign: "Alle Kampagnen"
            },
            {
              item: "Mietautos",
              current: 2,
              minimum: 5,
              status: "Kritisch",
              campaign: "Kampagne Süd"
            },
          ].map((alert) => (
            <div
              key={alert.item}
              className={`flex items-center justify-between p-4 ${getCardClass()}`}
            >
              <div>
                <div className="font-medium">{alert.item}</div>
                <div className={`text-sm ${getTextClass('muted')}`}>
                  Aktuell: {alert.current} (Minimum: {alert.minimum})
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  {alert.campaign}
                </div>
              </div>
              <span
                className={getBadgeClass(
                  alert.status === "Kritisch" ? "error" : "warning"
                )}
              >
                {alert.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
