import { useRef, useEffect, useMemo, useState } from 'react'
import { Campaign, TimelineMarker, ZoomLevel } from '@/types/campaign'
import { Users, Car, Building, Box } from 'lucide-react'
import { getResourceStatus, getTeamStatus, formatDate } from '@/utils/campaign-helpers'
import { useRouter } from 'next/navigation'

interface TimelineViewProps {
  campaigns: Campaign[]
  markers: TimelineMarker[]
  zoomLevel: ZoomLevel
  currentDate: Date
}

const statusColors = {
  completed: 'bg-gray-50 border-gray-200 text-gray-600',
  active: 'bg-green-50 border-green-200 text-green-700',
  preparation: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  planned: 'bg-blue-50 border-blue-200 text-blue-700'
}

export function TimelineView({ campaigns, markers, zoomLevel, currentDate }: TimelineViewProps) {
  const router = useRouter()
  const timelineRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [hoveredCampaign, setHoveredCampaign] = useState<number | null>(null)

  // Sync horizontal scroll between timeline and header
  useEffect(() => {
    const timeline = timelineRef.current
    const header = headerRef.current

    if (!timeline || !header) return

    const handleScroll = () => {
      header.scrollLeft = timeline.scrollLeft
    }

    timeline.addEventListener('scroll', handleScroll)
    return () => timeline.removeEventListener('scroll', handleScroll)
  }, [])

  const getCampaignPosition = (campaign: Campaign) => {
    const startDate = new Date(campaign.startDate)
    const endDate = new Date(campaign.endDate)
    const year = currentDate.getFullYear()
    const yearStart = new Date(year, 0, 1)
    const yearEnd = new Date(year, 11, 31)
    
    if (zoomLevel === 'year') {
      const totalDays = 365
      const daysFromStart = Math.max(0, (startDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
      const campaignDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      
      return {
        left: `${(daysFromStart / totalDays) * 100}%`,
        width: `${(campaignDays / totalDays) * 100}%`,
        isVisible: startDate <= yearEnd && endDate >= yearStart
      }
    } else {
      const daysInYear = 365
      const startDayOfYear = (startDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
      const campaignDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      
      return {
        left: `${(startDayOfYear / daysInYear) * 1200}%`,
        width: `${(campaignDays / daysInYear) * 1200}%`,
        isVisible: startDate <= yearEnd && endDate >= yearStart
      }
    }
  }

  const campaignRows = useMemo(() => {
    const rows: Campaign[][] = []
    const sortedCampaigns = [...campaigns].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )

    sortedCampaigns.forEach(campaign => {
      const campaignStart = new Date(campaign.startDate)
      const campaignEnd = new Date(campaign.endDate)
      const position = getCampaignPosition(campaign)
      if (!position.isVisible) return

      let rowIndex = 0
      let foundRow = false

      while (!foundRow && rowIndex < rows.length) {
        const row = rows[rowIndex]
        let canFit = true

        for (const existingCampaign of row) {
          const existingStart = new Date(existingCampaign.startDate)
          const existingEnd = new Date(existingCampaign.endDate)

          if (campaignStart <= existingEnd && campaignEnd >= existingStart) {
            canFit = false
            break
          }
        }

        if (canFit) {
          foundRow = true
          row.push(campaign)
        }

        rowIndex++
      }

      if (!foundRow) {
        rows.push([campaign])
      }
    })

    return rows
  }, [campaigns, currentDate, zoomLevel])

  const timelineWidth = zoomLevel === 'year' ? '1800px' : '4800px'

  const handleCampaignClick = (campaignId: number) => {
    router.push(`/campaigns/${campaignId}`)
  }

  return (
    <div className="h-screen bg-background">
      {/* Timeline Header */}
      <div className="sticky top-0 border-b pb-2 bg-background z-10 overflow-hidden">
        <div 
          ref={headerRef}
          className="overflow-x-hidden no-scrollbar"
          style={{ width: '100%' }}
        >
          <div className="grid" style={{ 
            gridTemplateColumns: `repeat(${markers.length}, 1fr)`,
            minWidth: timelineWidth
          }}>
            {markers.map((marker, index) => (
              <div key={index} className="text-center border-l border-gray-100 first:border-l-0">
                {marker.isMonth ? (
                  <div className="font-medium text-muted-foreground">{marker.label}</div>
                ) : (
                  <>
                    {marker.isWeekStart && (
                      <div className="text-xs text-muted-foreground mb-1">KW{marker.weekNumber}</div>
                    )}
                    <div className="text-sm text-muted-foreground">{marker.label}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns Container */}
      <div 
        ref={timelineRef}
        className="overflow-x-auto overflow-y-auto"
        style={{ 
          height: 'calc(100vh - 180px)',
          scrollBehavior: 'smooth'
        }}
      >
        <div className="relative px-4">
          {/* Grid Lines */}
          <div className="absolute inset-0 grid" style={{ 
            gridTemplateColumns: `repeat(${markers.length}, 1fr)`,
            minWidth: timelineWidth,
            height: campaignRows.length * 70 + 'px'
          }}>
            {markers.map((_, index) => (
              <div key={index} className="border-l border-gray-100 first:border-l-0 h-full" />
            ))}
          </div>

          {/* Campaigns */}
          <div className="relative" style={{ 
            minWidth: timelineWidth,
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
                            <span className="text-[10px] px-1.5 rounded-full bg-white/50 capitalize whitespace-nowrap">
                              {campaign.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{campaign.location}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/80 whitespace-nowrap">
                            {formatDate(campaign.startDate)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/80 whitespace-nowrap">
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
                        <div className="absolute left-full top-0 ml-2 z-50 w-64 p-3 rounded-lg shadow-lg bg-white border">
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
