'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Calendar, List, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { TimelineView } from '../../components/campaigns/TimelineView';
import { ListView } from '../../components/campaigns/ListView';
import type { Campaign, TimelineMarker } from '../../types/campaign';

type ViewMode = 'timeline' | 'list';
type ZoomLevel = 'year' | 'month';

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Q1 2024 Campaign',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    status: 'active',
    location: 'Berlin',
    team: {
      current: [],
      maxSize: 10
    },
    resources: {
      accommodation: {
        confirmed: 5,
        required: 5,
        details: {
          address: 'Musterstraße 1, Berlin',
          contact: 'Hotel Manager',
          checkIn: '2024-01-01',
          checkOut: '2024-03-31'
        }
      },
      vehicles: {
        confirmed: 2,
        required: 2,
        list: []
      },
      equipment: {
        confirmed: 20,
        required: 20,
        list: []
      },
      promotional: {
        flyers: 1000,
        keychains: 500,
        other: []
      }
    },
    redCrossOffice: {
      id: 1,
      name: 'DRK Berlin',
      location: 'Berlin',
      contact: {
        name: 'Max Mustermann',
        role: 'Coordinator',
        phone: '+49123456789',
        email: 'max@drk-berlin.de'
      },
      address: {
        street: 'Hauptstraße 1',
        city: 'Berlin',
        zip: '10115'
      }
    }
  },
  {
    id: 2,
    name: 'Q2 2024 Campaign',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    status: 'planned',
    location: 'Hamburg',
    team: {
      current: [],
      maxSize: 8
    },
    resources: {
      accommodation: {
        confirmed: 4,
        required: 4
      },
      vehicles: {
        confirmed: 2,
        required: 2,
        list: []
      },
      equipment: {
        confirmed: 16,
        required: 16,
        list: []
      },
      promotional: {
        flyers: 800,
        keychains: 400,
        other: []
      }
    },
    redCrossOffice: {
      id: 2,
      name: 'DRK Hamburg',
      location: 'Hamburg',
      contact: {
        name: 'Anna Schmidt',
        role: 'Coordinator',
        phone: '+49987654321',
        email: 'anna@drk-hamburg.de'
      },
      address: {
        street: 'Hafenstraße 1',
        city: 'Hamburg',
        zip: '20095'
      }
    }
  }
];

// Mock timeline markers
const mockMarkers: TimelineMarker[] = [
  {
    date: new Date('2024-02-15'),
    label: 'Mid Q1 Review',
    isMonth: false,
    isWeekStart: true,
    weekNumber: 7
  },
  {
    date: new Date('2024-05-01'),
    label: 'Q2 Launch',
    isMonth: true
  },
  {
    date: new Date('2024-08-15'),
    label: 'Q3 Checkpoint',
    isMonth: false,
    isWeekStart: true,
    weekNumber: 33
  }
];

export default function CampaignsPage() {
  const { t } = useTranslation('campaigns');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('year');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaigns] = useState(mockCampaigns);
  const [markers] = useState(mockMarkers);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'INPUT') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          navigateTimeline('prev');
          break;
        case 'ArrowRight':
          navigateTimeline('next');
          break;
        case 'v':
          if (e.ctrlKey || e.metaKey) {
            setViewMode(prev => prev === 'timeline' ? 'list' : 'timeline');
          }
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey && viewMode === 'timeline') {
            setZoomLevel(prev => prev === 'year' ? 'month' : 'year');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const navigateTimeline = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (zoomLevel === 'year') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  }, [currentDate, zoomLevel]);

  const getTimeframeText = useCallback(() => {
    if (zoomLevel === 'year') {
      return t('timeframe.year', { year: currentDate.getFullYear() });
    }
    return t('timeframe.month', {
      month: currentDate.toLocaleString('de-DE', { month: 'long' }),
      year: currentDate.getFullYear()
    });
  }, [currentDate, zoomLevel, t]);

  if (loading) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="text-lg text-muted-foreground">{t('loading.initializing')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex flex-col items-center gap-4 p-6 bg-destructive/10 rounded-lg">
          <div className="text-lg text-destructive font-medium">{t('error.title')}</div>
          <div className="text-muted-foreground">{error}</div>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            {t('error.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background"
      role="main"
      aria-label={t('pageTitle')}
    >
      {/* Header Controls */}
      <div 
        className="sticky top-0 z-10 p-4 bg-background/80 dark:bg-background/80 backdrop-blur-sm border-b border-border dark:border-border"
        role="toolbar"
        aria-label={t('controls.toolbar')}
      >
        <div className="flex justify-between items-center max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className={`${viewMode === 'timeline' ? 'bg-primary/20 border-primary' : ''}`}
              onClick={() => setViewMode('timeline')}
              aria-pressed={viewMode === 'timeline'}
              aria-label={t('controls.switchToTimeline')}
            >
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              {t('views.timeline')}
            </Button>
            <Button
              variant="outline"
              className={`${viewMode === 'list' ? 'bg-primary/20 border-primary' : ''}`}
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              aria-label={t('controls.switchToList')}
            >
              <List className="w-4 h-4 mr-2" aria-hidden="true" />
              {t('views.list')}
            </Button>
            {viewMode === 'timeline' && (
              <Button
                variant="outline"
                onClick={() => setZoomLevel(zoomLevel === 'year' ? 'month' : 'year')}
                aria-label={t(zoomLevel === 'year' ? 'controls.zoomIn' : 'controls.zoomOut')}
              >
                {zoomLevel === 'year' ? (
                  <ZoomIn className="w-4 h-4 mr-2" aria-hidden="true" />
                ) : (
                  <ZoomOut className="w-4 h-4 mr-2" aria-hidden="true" />
                )}
                {zoomLevel === 'year' ? t('actions.zoomIn') : t('actions.zoomOut')}
              </Button>
            )}
          </div>

          <div 
            className="flex items-center gap-2"
            role="group"
            aria-label={t('controls.navigation')}
          >
            <Button
              variant="outline"
              onClick={() => navigateTimeline('prev')}
              aria-label={t('controls.previousPeriod')}
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </Button>
            <span 
              className="font-medium px-4 py-2 bg-muted dark:bg-muted rounded-md text-foreground dark:text-foreground"
              role="status"
              aria-live="polite"
            >
              {getTimeframeText()}
            </span>
            <Button
              variant="outline"
              onClick={() => navigateTimeline('next')}
              aria-label={t('controls.nextPeriod')}
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Components */}
      <div className="flex-1">
        {loading ? (
          <div 
            className="flex items-center justify-center h-[calc(100vh-200px)]"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="text-lg text-muted-foreground">{t('loading.loadingCampaigns')}</div>
            </div>
          </div>
        ) : viewMode === 'timeline' ? (
          <TimelineView
            zoomLevel={zoomLevel}
            currentDate={currentDate}
            campaigns={campaigns}
            markers={markers}
          />
        ) : (
          <ListView campaigns={campaigns} />
        )}
      </div>
    </div>
  );
}
