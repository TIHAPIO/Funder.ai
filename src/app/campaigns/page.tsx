'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/button'
import {
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { ViewMode, ZoomLevel, Campaign } from '../../types/campaign'
import { getTimelineMarkers } from '../../utils/campaign-helpers'
import { TimelineView } from '../../components/campaigns/TimelineView'
import { ListView } from '../../components/campaigns/ListView'
import { campaignService } from '../../lib/services'
import { useRouter } from 'next/navigation'

export default function CampaignsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('year')
  const [currentDate, setCurrentDate] = useState(new Date('2024-01-01'))
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return

    // If no user after auth load completes, redirect to login
    if (!user) {
      router.push('/auth/login')
      return
    }

    loadCampaigns()
  }, [user, authLoading, currentDate, router])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)
      const yearStart = new Date(currentDate.getFullYear(), 0, 1)
      const yearEnd = new Date(currentDate.getFullYear(), 11, 31)
      const result = await campaignService.getCampaignsByDateRange(yearStart, yearEnd)
      setCampaigns(result.items)
    } catch (error) {
      console.error('Error loading campaigns:', error)
      setError('Fehler beim Laden der Kampagnen. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(false)
    }
  }

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

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Initialisiere...</div>
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-destructive">{error}</div>
      </div>
    )
  }

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
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-lg text-muted-foreground">Lade Kampagnen...</div>
          </div>
        ) : viewMode === 'timeline' ? (
          <TimelineView
            campaigns={campaigns}
            markers={markers}
            zoomLevel={zoomLevel}
            currentDate={currentDate}
          />
        ) : (
          <ListView campaigns={campaigns} />
        )}
      </div>
    </div>
  )
}
