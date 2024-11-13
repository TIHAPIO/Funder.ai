'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { ViewMode, ZoomLevel } from '@/types/campaign'
import { getTimelineMarkers } from '@/utils/campaign-helpers'
import { TimelineView } from '@/components/campaigns/TimelineView'
import { ListView } from '@/components/campaigns/ListView'
import { campaigns2024 } from '@/data/campaigns'

export default function CampaignsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('year')
  const [currentDate, setCurrentDate] = useState(new Date('2024-01-01'))

  useEffect(() => {
    console.log('Campaigns loaded:', campaigns2024)
  }, [])

  const navigateTimeline = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (zoomLevel === 'year') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const markers = getTimelineMarkers(currentDate, zoomLevel)

  return (
    <div className="min-h-screen bg-background">
      {/* Header Controls */}
      <div className="sticky top-0 z-10 p-4 bg-background/80 dark:bg-background/80 backdrop-blur-sm border-b border-border dark:border-border">
        <div className="flex justify-between items-center max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className={`${viewMode === 'timeline' ? 'bg-primary/20 border-primary' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Zeitstrahl
            </Button>
            <Button
              variant="outline"
              className={`${viewMode === 'list' ? 'bg-primary/20 border-primary' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4 mr-2" />
              Liste
            </Button>
            {viewMode === 'timeline' && (
              <Button
                variant="outline"
                onClick={() => setZoomLevel(zoomLevel === 'year' ? 'month' : 'year')}
              >
                {zoomLevel === 'year' ? (
                  <ZoomIn className="w-4 h-4 mr-2" />
                ) : (
                  <ZoomOut className="w-4 h-4 mr-2" />
                )}
                {zoomLevel === 'year' ? 'Monat' : 'Jahr'}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => navigateTimeline('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium px-4 py-2 bg-muted dark:bg-muted rounded-md text-foreground dark:text-foreground">
              {zoomLevel === 'year' 
                ? currentDate.getFullYear()
                : currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
              }
            </span>
            <Button 
              variant="outline"
              onClick={() => navigateTimeline('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Components */}
      <div className="flex-1">
        {viewMode === 'timeline' ? (
          <TimelineView
            campaigns={campaigns2024}
            markers={markers}
            zoomLevel={zoomLevel}
            currentDate={currentDate}
          />
        ) : (
          <ListView campaigns={campaigns2024} />
        )}
      </div>
    </div>
  )
}
