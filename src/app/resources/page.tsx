'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Plus,
  Users,
  Package,
  Car,
  Building,
  Home,
  FolderHeart,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTranslation } from '@/hooks/useTranslation';
import { ShirtIcon } from 'lucide-react';

const categories = [
  {
    title: "categories.employees",
    icon: Users,
  },
  {
    title: "categories.equipment",
    icon: Package,
  },
  {
    title: "categories.clothing",
    icon: ShirtIcon,
  },
  {
    title: "categories.vehicles",
    icon: Car,
  },
  {
    title: "categories.districts",
    icon: Building,
  },
  {
    title: "categories.accommodation",
    icon: Home,
  },
];

export default function ResourcesPage() {
  const { t } = useTranslation('resources');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [filteredCategories] = useState(categories);

  const getContainerClass = (type: string) => {
    return type === 'header'
      ? 'mb-6'
      : 'bg-card p-6 rounded-lg shadow-sm';
  };

  return (
    <>
      <div className={getContainerClass('header')}>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
            >
              <FolderHeart className="mr-2 h-4 w-4" />
              {t('actions.internalResources')}
            </Button>
            <Button
              variant="outline"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('actions.externalResources')}
            </Button>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('actions.addResource')}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('messages.error')}</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        {/* Categories sidebar */}
        <div className="w-64 space-y-2">
          {filteredCategories.map((category) => (
            <button
              key={category.title}
              onClick={() => setSelectedCategory(category)}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                selectedCategory === category
                  ? 'bg-accent'
                  : 'hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center">
                <category.icon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                <h2 className="text-sm font-semibold">{t(category.title)}</h2>
              </div>
            </button>
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
                  <h2 className="text-xl font-semibold">{t(selectedCategory.title)}</h2>
                </div>
              </div>
              {/* Resource table or grid would go here */}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              {t('messages.selectCategory')}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
