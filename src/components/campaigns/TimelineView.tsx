import { useRef, useEffect, useMemo, useState } from 'react'
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
  completed: 'bg-muted dark:bg-muted border-border dark:border-border text-muted-foreground dark:text-muted-foreground',
  active: 'bg-green-100/50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
  preparation: 'bg-yellow-100/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
  planned: 'bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
}

export function TimelineView({ campaigns, markers: initialMarkers, zoomLevel, currentDate }: TimelineViewProps) {
  const router = useRouter()
  const timelineRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredCampaign, setHoveredCampaign] = useState<number | null>(null)

  const handleCampaignClick = (campaignId: number) => {
    router.push(`/campaigns/${campaignId}`)
  }

  // Generate markers for all months when in month view
  const allMarkers = useMemo(() => {
    if (zoomLevel === 'year') {
      return initialMarkers
    }

    // Generate markers for all months in the year
    const yearMarkers: TimelineMarker[] = []
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(currentDate.getFullYear(), month, 1)
      const monthMarkers = getTimelineMarkers(monthDate, 'month')
      yearMarkers.push(...monthMarkers)
    }
    return yearMarkers
  }, [zoomLevel, currentDate, initialMarkers])

  // Sync horizontal scroll between timeline and header
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = (e: Event) => {
      const scrollLeft = (e.target as HTMLElement).scrollLeft
      if (headerRef.current) {
        headerRef.current.style.transform = `translateX(-${scrollLeft}px)`
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to current month when in month view
  useEffect(() => {
    if (zoomLevel === 'month' && containerRef.current) {
      const monthWidth = 1200 // Width of each month in pixels
      const scrollPosition = currentDate.getMonth() * monthWidth
      containerRef.current.scrollLeft = scrollPosition
    }
  }, [zoomLevel, currentDate])

  const getCampaignPosition = (campaign: Campaign) => {
    const startDate = new Date(campaign.startDate)
    const endDate = new Date(campaign.endDate)
    
    if (zoomLevel === 'year') {
      const yearStart = new Date(currentDate.getFullYear(), 0, 1)
      const yearEnd = new Date(currentDate.getFullYear(), 11, 31)
      const daysInYear = 365 // Simplified, not accounting for leap years
      
      const daysFromYearStart = Math.max(0, (startDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
      const campaignDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      
      return {
        left: `${(daysFromYearStart / daysInYear) * 100}%`,
        width: `${(campaignDays / daysInYear) * 100}%`,
        isVisible: startDate <= yearEnd && endDate >= yearStart
      }
    } else {
      const yearStart = new Date(currentDate.getFullYear(), 0, 1)
      const totalDaysInYear = 365 // Simplified
      const daysFromYearStart = Math.max(0, (startDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
      const campaignDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      
      return {
        left: `${(daysFromYearStart / totalDaysInYear) * 1200 * 12}px`, // 1200px per month
        width: `${(campaignDays / totalDaysInYear) * 1200 * 12}px`,
        isVisible: startDate.getFullYear() === currentDate.getFullYear()
      }
    }
  }

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
            return campaignStart > existingEnd || campaignEnd < existingStart
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
  }, [campaigns, currentDate, zoomLevel])

  const timelineWidth = zoomLevel === 'year' ? 'w-[2400px]' : 'w-[14400px]' // 1200px per month in month view

  return (
    <div className="h-screen bg-background">
      {/* Timeline Header */}
      <div className="sticky top-0 border-b pb-2 bg-background z-10 overflow-hidden">
        <div className="text-center text-xl font-medium py-2">
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
                const statusColor = statusColors[campaign.status]

                return (
                  <div
                    key={campaign.id}
                    className="absolute mb-1 group cursor-pointer"
                    style={{
                      left: position.left,
                      width: position.width,
                      top: `${rowIndex * 70}px`,
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleCampaignClick(campaign.id)}
                    onMouseEnter={() => setHoveredCampaign(campaign.id)}
                    onMouseLeave={() => setHoveredCampaign(null)}
                  >
                    <div className={`
                      p-2 rounded-lg border shadow-sm transition-all duration-200
                      ${isHovered ? 'shadow-md ring-2 ring-primary/20 -translate-y-0.5' : ''}
                      ${statusColor}
                    `}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 mb-0.5">
                            <h3 className="font-medium text-sm truncate">{campaign.name}</h3>
                            <span className="text-[10px] px-1.5 rounded-full bg-background/50 dark:bg-background/50 capitalize whitespace-nowrap">
                              {campaign.status}
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
                        <div className="flex items-center gap-1" title="Team Status">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{campaign.team.current.length}/{campaign.team.maxSize}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Accommodation Status">
                          <Building className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">
                            {campaign.resources.accommodation.confirmed}/{campaign.resources.accommodation.required}
                          </span>
                        </div>
                        <div className="flex items-center gap-1" title="Vehicle Status">
                          <Car className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">
                            {campaign.resources.vehicles.confirmed}/{campaign.resources.vehicles.required}
                          </span>
                        </div>
                        <div className="flex items-center gap-1" title="Equipment Status">
                          <Box className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">
                            {campaign.resources.equipment.confirmed}/{campaign.resources.equipment.required}
                          </span>
                        </div>
                      </div>

                      {/* Hover Details */}
                      {isHovered && (
                        <div className="absolute left-full top-0 ml-2 z-50 w-64 p-3 rounded-lg shadow-lg bg-background dark:bg-background border">
                          <div className="text-sm font-medium mb-2">{campaign.name}</div>
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="text-muted-foreground">Status:</span>{' '}
                              <span className="capitalize">{campaign.status}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location:</span>{' '}
                              {campaign.location}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Team Size:</span>{' '}
                              {campaign.team.current.length}/{campaign.team.maxSize}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Contact:</span>{' '}
                              {campaign.redCrossOffice.contact.name}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Office:</span>{' '}
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
