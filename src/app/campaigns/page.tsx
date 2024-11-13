'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import {
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
  Users,
  Car,
  Building,
  Box,
  AlertTriangle,
  ZoomIn,
  ZoomOut
} from 'lucide-react'

interface Vehicle {
  id: number
  type: 'rental' | 'owned'
  name: string
  licensePlate?: string
  rental?: {
    company: string
    contact: string
    startDate: string
    endDate: string
    cost: number
  }
}

interface Equipment {
  id: number
  type: 'clothing' | 'tablet' | 'other'
  name: string
  quantity: {
    total: number
    assigned: number
  }
  status: 'available' | 'partially_available' | 'unavailable'
}

interface TeamMember {
  id: number
  role: 'teamleader' | 'werber'
  name: string
  confirmed: boolean
  startDate: string
  endDate: string
  contact: {
    phone: string
    email: string
  }
  equipment: {
    tablet?: string
    clothing: string[]
  }
}

interface RedCrossOffice {
  id: number
  name: string
  location: string
  contact: {
    name: string
    role: string
    phone: string
    email: string
  }
  address: {
    street: string
    city: string
    zip: string
  }
}

interface Campaign {
  id: number
  name: string
  startDate: string
  endDate: string
  status: 'planned' | 'preparation' | 'active' | 'completed'
  location: string
  team: {
    current: TeamMember[]
    maxSize: number
  }
  resources: {
    accommodation: { 
      confirmed: number
      required: number
      details?: {
        address: string
        contact: string
        checkIn: string
        checkOut: string
      }
    }
    vehicles: { 
      confirmed: number
      required: number
      list: Vehicle[]
    }
    equipment: { 
      confirmed: number
      required: number
      list: Equipment[]
    }
  }
  redCrossOffice: RedCrossOffice
}

interface TimelineMarker {
  label: string
  isMonth: boolean
  isWeekStart?: boolean
  weekNumber?: number
  date: Date
}

type ViewMode = 'timeline' | 'list'
type ZoomLevel = 'year' | 'month'

const campaigns: Campaign[] = [
  // 2023 Campaigns
  {
    id: 1,
    name: "Winterkampagne Bayern",
    startDate: "2023-01-15",
    endDate: "2023-02-26",
    status: "completed",
    location: "München",
    team: {
      current: [
        { 
          id: 1, 
          role: 'teamleader', 
          name: 'Sarah Weber', 
          confirmed: true, 
          startDate: '2023-01-15', 
          endDate: '2023-02-26',
          contact: {
            phone: '+49 123 456789',
            email: 'sarah.weber@example.com'
          },
          equipment: {
            tablet: 'TB-001',
            clothing: ['Jacket-M', 'Shirt-M-2x']
          }
        }
      ],
      maxSize: 15
    },
    resources: {
      accommodation: { 
        confirmed: 12, 
        required: 12,
        details: {
          address: 'Hotel Central, Karlsplatz 3, 80335 München',
          contact: 'Fr. Müller +49 89 123456',
          checkIn: '14:00',
          checkOut: '11:00'
        }
      },
      vehicles: { 
        confirmed: 3, 
        required: 3,
        list: [
          {
            id: 1,
            type: 'rental',
            name: 'VW Transporter',
            licensePlate: 'M-AB 123',
            rental: {
              company: 'AutoRent München',
              contact: 'Hr. Schmidt +49 89 987654',
              startDate: '2023-01-14',
              endDate: '2023-02-27',
              cost: 1200
            }
          }
        ]
      },
      equipment: { 
        confirmed: 15, 
        required: 15,
        list: [
          {
            id: 1,
            type: 'tablet',
            name: 'iPad 2022',
            quantity: {
              total: 5,
              assigned: 5
            },
            status: 'available'
          }
        ]
      }
    },
    redCrossOffice: {
      id: 1,
      name: 'DRK München',
      location: 'München',
      contact: {
        name: 'Fr. Bauer',
        role: 'Kampagnenkoordinator',
        phone: '+49 89 123789',
        email: 'bauer@drk-muenchen.de'
      },
      address: {
        street: 'Rotkreuzplatz 8',
        city: 'München',
        zip: '80634'
      }
    }
  },
  // Add more campaigns here...
]

export default function CampaignsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('year')
  const [currentDate, setCurrentDate] = useState(new Date())
  const timelineRef = useRef<HTMLDivElement>(null)

  const getTimelineMarkers = (): TimelineMarker[] => {
    const year = currentDate.getFullYear()
    
    if (zoomLevel === 'year') {
      return Array.from({ length: 12 }, (_, month) => ({
        label: new Date(year, month, 1).toLocaleDateString('de-DE', { month: 'short' }),
        isMonth: true,
        date: new Date(year, month, 1)
      }))
    } else {
      const allMarkers: TimelineMarker[] = []
      
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day)
          const isWeekStart = date.getDay() === 1
          
          allMarkers.push({
            label: day.toString(),
            isMonth: false,
            isWeekStart,
            weekNumber: isWeekStart ? getWeekNumber(date) : undefined,
            date
          })
        }
      }
      
      return allMarkers
    }
  }

  const getWeekNumber = (date: Date): number => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  const getResourceStatus = (confirmed: number, required: number) => {
    const percentage = (confirmed / required) * 100
    return {
      color: percentage === 100 
        ? 'bg-green-100 text-green-700' 
        : percentage >= 80 
          ? 'bg-yellow-100 text-yellow-700' 
          : 'bg-red-100 text-red-700',
      text: `${confirmed}/${required}`
    }
  }

  const getTeamStatus = (team: Campaign['team']) => {
    const confirmed = team.current.filter(m => m.confirmed).length
    const percentage = (confirmed / team.maxSize) * 100
    return {
      text: `${confirmed}/${team.maxSize}`,
      color: percentage >= 80 ? 'bg-green-500' : 'bg-red-500'
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

    if (zoomLevel === 'month' && timelineRef.current) {
      const monthWidth = timelineRef.current.scrollWidth / 12
      const targetScroll = monthWidth * newDate.getMonth()
      timelineRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }

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

  // Sort campaigns to show current/upcoming first
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    const now = new Date()
    const aStart = new Date(a.startDate)
    const bStart = new Date(b.startDate)
    
    // If campaign is currently running, it should be first
    const aActive = now >= aStart && now <= new Date(a.endDate)
    const bActive = now >= bStart && now <= new Date(b.endDate)
    
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    
    // Then sort by start date
    return aStart.getTime() - bStart.getTime()
  })

  const markers = getTimelineMarkers()

  return (
    <div className="h-full w-full overflow-hidden bg-background">
      {/* Header Controls */}
      <div className="sticky top-0 z-10 p-4 bg-background/80 backdrop-blur-sm border-b">
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
            <span className="font-medium px-4 py-2 bg-muted rounded-md">
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

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="h-[calc(100%-4rem)] bg-background">
          <div 
            ref={timelineRef}
            className="h-full overflow-x-auto overflow-y-auto"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Timeline Header */}
            <div className="sticky top-0 border-b pb-4 mb-8 bg-background">
              <div className="grid" style={{ 
                gridTemplateColumns: `repeat(${markers.length}, 1fr)`,
                minWidth: zoomLevel === 'year' ? '1800px' : '4800px'
              }}>
                {markers.map((marker, index) => (
                  <div key={index} className="text-center">
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

            {/* Campaigns */}
            <div className="relative px-4">
              <div className="absolute inset-0" style={{ 
                minWidth: zoomLevel === 'year' ? '1800px' : '4800px'
              }}>
                {sortedCampaigns.map((campaign, index) => {
                  const position = getCampaignPosition(campaign)
                  if (!position.isVisible) return null

                  return (
                    <div
                      key={campaign.id}
                      className="absolute mb-4"
                      style={{
                        left: position.left,
                        width: position.width,
                        top: `${index * 160}px`
                      }}
                    >
                      <div className={`
                        p-4 rounded-lg border
                        ${campaign.status === 'completed' ? 'bg-card border-border' :
                          campaign.status === 'active' ? 'bg-green-100 border-green-200' :
                          campaign.status === 'preparation' ? 'bg-yellow-100 border-yellow-200' :
                          'bg-blue-100 border-blue-200'}
                      `}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">{campaign.location}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-muted">
                              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{getTeamStatus(campaign.team).text}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {getResourceStatus(
                                campaign.resources.accommodation.confirmed,
                                campaign.resources.accommodation.required
                              ).text}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {getResourceStatus(
                                campaign.resources.vehicles.confirmed,
                                campaign.resources.vehicles.required
                              ).text}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Box className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {getResourceStatus(
                                campaign.resources.equipment.confirmed,
                                campaign.resources.equipment.required
                              ).text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="h-[calc(100%-4rem)] overflow-auto px-4">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid gap-4">
              {sortedCampaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className={`
                    p-6 rounded-lg border
                    ${campaign.status === 'completed' ? 'bg-card border-border' :
                      campaign.status === 'active' ? 'bg-green-100 border-green-200' :
                      campaign.status === 'preparation' ? 'bg-yellow-100 border-yellow-200' :
                      'bg-blue-100 border-blue-200'}
                  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{campaign.name}</h3>
                      <p className="text-muted-foreground">{campaign.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-sm px-3 py-1 rounded-full bg-muted">
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Team</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.team.current.map(member => (
                          <div key={member.id} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${member.confirmed ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span>{member.name}</span>
                          </div>
                        ))}
                        {campaign.team.current.length < campaign.team.maxSize && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{campaign.team.maxSize - campaign.team.current.length} offene Positionen</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Unterkunft</span>
                      </div>
                      <div className={`text-sm px-2 py-1 rounded ${getResourceStatus(
                        campaign.resources.accommodation.confirmed,
                        campaign.resources.accommodation.required
                      ).color}`}>
                        {getResourceStatus(
                          campaign.resources.accommodation.confirmed,
                          campaign.resources.accommodation.required
                        ).text}
                      </div>
                      {campaign.resources.accommodation.details && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div>{campaign.resources.accommodation.details.address}</div>
                          <div>{campaign.resources.accommodation.details.contact}</div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Fahrzeuge</span>
                      </div>
                      <div className={`text-sm px-2 py-1 rounded ${getResourceStatus(
                        campaign.resources.vehicles.confirmed,
                        campaign.resources.vehicles.required
                      ).color}`}>
                        {getResourceStatus(
                          campaign.resources.vehicles.confirmed,
                          campaign.resources.vehicles.required
                        ).text}
                      </div>
                      {campaign.resources.vehicles.list.length > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {campaign.resources.vehicles.list.map(vehicle => (
                            <div key={vehicle.id} className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${vehicle.type === 'owned' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                              <span>{vehicle.name} ({vehicle.licensePlate})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Box className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Ausrüstung</span>
                      </div>
                      <div className={`text-sm px-2 py-1 rounded ${getResourceStatus(
                        campaign.resources.equipment.confirmed,
                        campaign.resources.equipment.required
                      ).color}`}>
                        {getResourceStatus(
                          campaign.resources.equipment.confirmed,
                          campaign.resources.equipment.required
                        ).text}
                      </div>
                      {campaign.resources.equipment.list.length > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {campaign.resources.equipment.list.map(item => (
                            <div key={item.id} className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                item.status === 'available' ? 'bg-green-500' :
                                item.status === 'partially_available' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} />
                              <span>{item.name} ({item.quantity.assigned}/{item.quantity.total})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <div className="font-medium mb-1">DRK Ansprechpartner:</div>
                      <div>{campaign.redCrossOffice.contact.name}</div>
                      <div>{campaign.redCrossOffice.contact.role}</div>
                      <div>{campaign.redCrossOffice.contact.phone}</div>
                      <div>{campaign.redCrossOffice.contact.email}</div>
                      <div className="mt-1">{campaign.redCrossOffice.name}</div>
                      <div>{campaign.redCrossOffice.address.street}</div>
                      <div>{campaign.redCrossOffice.address.zip} {campaign.redCrossOffice.address.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
