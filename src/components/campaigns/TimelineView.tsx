import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { Campaign, TimelineMarker, ZoomLevel } from '../../types/campaign'
import { Users, Car, Building, Box } from 'lucide-react'
import { getResourceStatus, getTeamStatus, formatDate, getTimelineMarkers } from '../../utils/campaign-helpers'
import { useRouter } from 'next/navigation'

interface TimelineViewProps {
  campaigns: Campaign[]
  markers: TimelineMarker[]
  zoomLevel: ZoomLevel
  currentDate: Date
}

const statusColors = {
  completed: 'bg-muted/50 dark:bg-muted/50 border-border/50 dark:border-border/50 text-muted-foreground dark:text-muted-foreground',
  active: 'bg-green-100/50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
  preparation: 'bg-yellow-100/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
  planned: 'bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
}

const statusLabels = {
  completed: 'Abgeschlossen',
  active: 'Aktiv',
  preparation: 'In Vorbereitung',
  planned: 'Geplant'
}

export function TimelineView({ campaigns, markers: initialMarkers, zoomLevel, currentDate }: TimelineViewProps) {
  const router = useRouter()
  const timelineRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredCampaign, setHoveredCampaign] = useState<number | null>(null)
  const [focusedCampaign, setFocusedCampaign] = useState<number | null>(null)

  const handleCampaignClick = useCallback((campaignId: number) => {
    router.push(`/campaigns/${campaignId}`)
  }, [router])

  const handleKeyPress = useCallback((e: React.KeyboardEvent, campaignId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCampaignClick(campaignId)
    }
  }, [handleCampaignClick])

  // Generate markers for all months when in month view
  const allMarkers = useMemo(() => {
    if (zoomLevel === 'year') {
      return initialMarkers
    }

    const yearMarkers: TimelineMarker[] = []
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(currentDate.getFullYear(), month, 1)
      const monthMarkers = getTimelineMarkers(monthDate, 'month')
      yearMarkers.push(...monthMarkers)
    }
    return yearMarkers
  }, [zoomLevel, currentDate, initialMarkers])

  // Sync horizontal scroll between timeline and header with debounce
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout
    const handleScroll = (e: Event) => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      
      scrollTimeout = setTimeout(() => {
        const scrollLeft = (e.target as HTMLElement).scrollLeft
        if (headerRef.current) {
          headerRef.current.style.transform = `translateX(-${scrollLeft}px)`
        }
      }, 10)
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [])

  // Scroll to current month when in month view with smooth animation
  useEffect(() => {
    if (zoomLevel === 'month' && containerRef.current) {
      const monthWidth = 1200 // Width of each month in pixels
      const scrollPosition = currentDate.getMonth() * monthWidth
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [zoomLevel, currentDate])

  const getCampaignPosition = useCallback((campaign: Campaign) => {
    const startDate = new Date(campaign.startDate)
    const endDate = new Date(campaign.endDate)
    
    if (zoomLevel === 'year') {
      const yearStart = new Date(currentDate.getFullYear(), 0, 1)
      const yearEnd = new Date(currentDate.getFullYear(), 11, 31)
      const daysInYear = new Date(currentDate.getFullYear(), 11, 31).getDate() === 31 ? 366 : 365
      
      const daysFromYearStart = Math.max(0, (startDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
      const campaignDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      
      return {
        left: `${(daysFromYearStart / daysInYear) * 100}%`,
        width: `${(campaignDays / daysInYear) * 100}%`,
        isVisible: startDate <= yearEnd && endDate >= yearStart
      }
    } else {
      const yearStart = new Date(currentDate.getFullYear(), 0, 1)
      const daysInYear = new Date(currentDate.getFullYear(), 11, 31).getDate() === 31 ? 366 : 365
      const daysFromYearStart = Math.max(0, (startDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
      const campaignDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      
      return {
        left: `${(daysFromYearStart / daysInYear) * 1200 * 12}px`,
        width: `${(campaignDays / daysInYear) * 1200 * 12}px`,
        isVisible: startDate.getFullYear() === currentDate.getFullYear()
      }
    }
  }, [zoomLevel, currentDate])

  const campaignRows = useMemo(() => {
    const rows: Campaign[][] = []
    const sortedCampaigns = [...campaigns]
      .filter(campaign => {
        const position = getCampaignPosition(campaign)
        return position.isVisible
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    sortedCampaigns.forEach(campaign => {
      let rowIndex = 0
      let placed = false

      while (!placed) {
        if (!rows[rowIndex]) {
          rows[rowIndex] = [campaign]
          placed = true
        } else {
          const canFitInRow = rows[rowIndex].every(existingCampaign => {
            const existingStart = new Date(existingCampaign.startDate)
            const existingEnd = new Date(existingCampaign.endDate)
            const campaignStart = new Date(campaign.startDate)
            const campaignEnd = new Date(campaign.endDate)
            
            // Add buffer between campaigns
            const buffer = 24 * 60 * 60 * 1000 // 1 day in milliseconds
            return campaignStart.getTime() > (existingEnd.getTime() + buffer) || 
                   campaignEnd.getTime() < (existingStart.getTime() - buffer)
          })

          if (canFitInRow) {
            rows[rowIndex].push(campaign)
            placed = true
          } else {
            rowIndex++
          }
        }
      }
    })

    return rows
  }, [campaigns, getCampaignPosition])

  const timelineWidth = zoomLevel === 'year' ? 'w-[2400px]' : 'w-[14400px]'

  return (
    <div className="h-screen bg-background" role="region" aria-label="Kampagnen-Zeitstrahl">
      {/* Timeline Header */}
      <div className="sticky top-0 border-b pb-2 bg-background z-10 overflow-hidden">
        <div className="text-center text-xl font-medium py-2" role="heading" aria-level={1}>
          {zoomLevel === 'year' 
            ? currentDate.getFullYear().toString()
            : new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }).format(currentDate)
          }
        </div>
        <div ref={headerRef} className={`${timelineWidth}`}>
          <div className="grid" style={{ 
            gridTemplateColumns: `repeat(${allMarkers.length}, 1fr)`
          }}>
            {allMarkers.map((marker, index) => (
              <div key={index} className="text-center border-l border-border first:border-l-0">
                {marker.isWeekStart && (
                  <div className="text-xs text-muted-foreground mb-1">KW{marker.weekNumber}</div>
                )}
                <div className="text-sm text-muted-foreground">{marker.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Container */}
      <div 
        ref={containerRef}
        className="overflow-x-auto overflow-y-hidden"
        style={{ 
          height: 'calc(100vh - 180px)',
          scrollBehavior: 'smooth'
        }}
        role="list"
        aria-label="Kampagnen Liste"
      >
        <div className={`relative px-4 ${timelineWidth}`}>
          {/* Grid Lines */}
          <div className="absolute inset-0 grid" style={{ 
            gridTemplateColumns: `repeat(${allMarkers.length}, 1fr)`,
            height: campaignRows.length * 70 + 'px'
          }}>
            {allMarkers.map((_, index) => (
              <div key={index} className="border-l border-border/30 first:border-l-0 h-full" />
            ))}
          </div>

          {/* Campaigns */}
          <div className="relative" style={{ 
            minHeight: campaignRows.length * 70 + 'px'
          }}>
            {campaignRows.map((row, rowIndex) => (
              row.map((campaign) => {
                const position = getCampaignPosition(campaign)
                const isHovered = hoveredCampaign === campaign.id
                const isFocused = focusedCampaign === campaign.id
                const statusColor = statusColors[campaign.status]
                const teamStatus = getTeamStatus(campaign.team)
                const resourceStatus = {
                  accommodation: getResourceStatus(campaign.resources.accommodation.confirmed, campaign.resources.accommodation.required),
                  vehicles: getResourceStatus(campaign.resources.vehicles.confirmed, campaign.resources.vehicles.required),
                  equipment: getResourceStatus(campaign.resources.equipment.confirmed, campaign.resources.equipment.required)
                }

                return (
                  <div
                    key={campaign.id}
                    className="absolute mb-1 group"
                    style={{
                      left: position.left,
                      width: position.width,
                      top: `${rowIndex * 70}px`,
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleCampaignClick(campaign.id)}
                    onMouseEnter={() => setHoveredCampaign(campaign.id)}
                    onMouseLeave={() => setHoveredCampaign(null)}
                    onFocus={() => setFocusedCampaign(campaign.id)}
                    onBlur={() => setFocusedCampaign(null)}
                    onKeyDown={(e) => handleKeyPress(e, campaign.id)}
                    role="listitem"
                    tabIndex={0}
                    aria-label={`Kampagne ${campaign.name}, Status: ${statusLabels[campaign.status]}`}
                  >
                    <div className={`
                      p-2 rounded-lg border shadow-sm transition-all duration-200
                      ${(isHovered || isFocused) ? 'shadow-md ring-2 ring-primary/20 -translate-y-0.5' : ''}
                      ${statusColor}
                    `}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 mb-0.5">
                            <h3 className="font-medium text-sm truncate">{campaign.name}</h3>
                            <span className="text-[10px] px-1.5 rounded-full bg-background/50 dark:bg-background/50 capitalize whitespace-nowrap">
                              {statusLabels[campaign.status]}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{campaign.location}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/50 dark:bg-background/50 whitespace-nowrap">
                            {formatDate(campaign.startDate)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/50 dark:bg-background/50 whitespace-nowrap">
                            {formatDate(campaign.endDate)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-1 mt-1">
                        <div 
                          className="flex items-center gap-1" 
                          title={`Team Status: ${teamStatus.text} Mitglieder`}
                          role="status"
                          aria-label={`Team Status: ${teamStatus.text} Mitglieder`}
                        >
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{teamStatus.text}</span>
                        </div>
                        <div 
                          className="flex items-center gap-1" 
                          title={`Unterkunft Status: ${resourceStatus.accommodation.text}`}
                          role="status"
                          aria-label={`Unterkunft Status: ${resourceStatus.accommodation.text}`}
                        >
                          <Building className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{resourceStatus.accommodation.text}</span>
                        </div>
                        <div 
                          className="flex items-center gap-1" 
                          title={`Fahrzeug Status: ${resourceStatus.vehicles.text}`}
                          role="status"
                          aria-label={`Fahrzeug Status: ${resourceStatus.vehicles.text}`}
                        >
                          <Car className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{resourceStatus.vehicles.text}</span>
                        </div>
                        <div 
                          className="flex items-center gap-1" 
                          title={`Ausrüstung Status: ${resourceStatus.equipment.text}`}
                          role="status"
                          aria-label={`Ausrüstung Status: ${resourceStatus.equipment.text}`}
                        >
                          <Box className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{resourceStatus.equipment.text}</span>
                        </div>
                      </div>

                      {/* Hover/Focus Details */}
                      {(isHovered || isFocused) && (
                        <div 
                          className="absolute left-full top-0 ml-2 z-50 w-64 p-3 rounded-lg shadow-lg bg-background dark:bg-background border"
                          role="tooltip"
                        >
                          <div className="text-sm font-medium mb-2">{campaign.name}</div>
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="text-muted-foreground">Status:</span>{' '}
                              <span className="capitalize">{statusLabels[campaign.status]}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Standort:</span>{' '}
                              {campaign.location}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Teamgröße:</span>{' '}
                              {campaign.team.current.length}/{campaign.team.maxSize}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Kontakt:</span>{' '}
                              {campaign.redCrossOffice.contact.name}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Büro:</span>{' '}
                              {campaign.redCrossOffice.name}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
