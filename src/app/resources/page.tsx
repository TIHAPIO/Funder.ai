'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useSheets } from "@/hooks/useSheets";
import { sheetConfigs, Category } from "./types";
import { 
  Plus, 
  ShirtIcon, 
  Package, 
  AlertTriangle, 
  Car, 
  Building, 
  Users, 
  Home,
  ExternalLink,
  FolderHeart,
  X,
  Loader2
} from 'lucide-react';
import { useTheme } from "@/components/providers/ThemeProvider";

const generateSampleData = (category: string) => {
  const config = sheetConfigs[category as keyof typeof sheetConfigs];
  const headers = [...config.headers]; // Convert readonly array to mutable array
  const sampleData: (string | number)[][] = [];

  for (let i = 1; i <= 10; i++) {
    switch (category) {
      case 'employees':
        sampleData.push([
          `Mitarbeiter ${i}`,
          ['Aktiv', 'In Schulung', 'Urlaub'][i % 3],
          `Kampagne ${Math.floor(i/3) + 1}`,
          ['S', 'M', 'L', 'XL'][i % 4],
          ['S', 'M', 'L', 'XL'][i % 4],
          ['S', 'M', 'L', 'XL'][i % 4],
          ['Tablet', 'Laptop', 'Smartphone'][i % 3],
        ]);
        break;
      case 'equipment':
        sampleData.push([
          `Gerät ${i}`,
          ['Tablet', 'Laptop', 'Smartphone', 'Drucker'][i % 4],
          ['Verfügbar', 'In Benutzung', 'Wartung'][i % 3],
          `Mitarbeiter ${i}`,
          `SN-${Math.floor(Math.random() * 10000)}`,
        ]);
        break;
      case 'clothing':
        sampleData.push([
          ['T-Shirt', 'Jacke', 'Hose', 'Weste', 'Mütze'][i % 5],
          Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 20),
        ]);
        break;
      case 'vehicles':
        sampleData.push([
          `Fahrzeug ${i}`,
          ['Verfügbar', 'Im Einsatz', 'Wartung'][i % 3],
          `Kampagne ${Math.floor(i/3) + 1}`,
          `Notiz für Fahrzeug ${i}`,
          ['Intern', 'Extern', 'Gemietet'][i % 3],
        ]);
        break;
      case 'districts':
        sampleData.push([
          `Kreisverband ${i}`,
          ['Aktiv', 'In Planung', 'Pausiert'][i % 3],
          Math.floor(Math.random() * 100) + 50,
          `kontakt${i}@kreis.de`,
        ]);
        break;
      case 'accommodations':
        sampleData.push([
          `Unterkunft ${i}`,
          `Stadt ${i}`,
          Math.floor(Math.random() * 50) + 20,
          `Kampagne ${Math.floor(i/3) + 1}`,
          `unterkunft${i}@kontakt.de`,
        ]);
        break;
    }
  }

  return [headers, ...sampleData];
};

const categories: Category[] = [
  {
    title: "Mitarbeiter",
    icon: Users,
    key: 'employees',
    resourceType: 'internal'
  },
  {
    title: "Ausrüstung",
    icon: Package,
    key: 'equipment',
    resourceType: 'internal'
  },
  {
    title: "Kleidung",
    icon: ShirtIcon,
    key: 'clothing',
    resourceType: 'internal'
  },
  {
    title: "Fahrzeuge",
    icon: Car,
    key: 'vehicles',
    resourceType: 'external'
  },
  {
    title: "Kreisverbände",
    icon: Building,
    key: 'districts',
    resourceType: 'external'
  },
  {
    title: "Unterkünfte",
    icon: Home,
    key: 'accommodations',
    resourceType: 'external'
  }
];

export default function ResourcesPage() {
  const { getCardClass, getContainerClass } = useTheme();
  const [resourceType, setResourceType] = useState<'internal' | 'external'>('internal');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const { data, loading, error, updateData, refreshData } = useSheets(
    selectedCategory?.key || ''
  );

  const filteredCategories = categories.filter(category => 
    category.resourceType === resourceType
  );

  const handleSaveData = async (data: any[][]) => {
    if (!selectedCategory) return;
    
    try {
      await updateData(data);
      await refreshData();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleAddSampleData = async () => {
    if (!selectedCategory) return;
    
    const sampleData = generateSampleData(selectedCategory.key);
    try {
      await updateData(sampleData);
      await refreshData();
    } catch (error) {
      console.error('Error adding sample data:', error);
    }
  };

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
        {selectedCategory ? (
          <Button onClick={handleAddSampleData}>
            <Plus className="mr-2 h-4 w-4" />
            Beispieldaten hinzufügen
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ressource hinzufügen
          </Button>
        )}
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
              onClick={() => handleCategorySelect(category)}
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
          {loading ? (
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
                headers={sheetConfigs[selectedCategory.key].headers}
                data={data}
                editable={true}
                onSave={handleSaveData}
              />
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
