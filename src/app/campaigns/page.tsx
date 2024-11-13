'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Car,
  Building,
  Tablet
} from 'lucide-react'

interface Campaign {
  id: number
  name: string
  startDate: string
  endDate: string
  status: 'planned' | 'preparation' | 'active' | 'completed'
  location: string
  resources: {
    teams: number
    vehicles: number
    tablets: number
    accommodation: string
  }
}

type ViewMode = 'timeline' | 'list'
type TimeUnit = 'month' | 'quarter' | 'year'

export default function CampaignsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('month')
  const [currentYear, setCurrentYear] = useState(2024)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())

  const campaigns: Campaign[] = [
    {
      id: 1,
      name: "Kampagne Nord",
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      status: "preparation",
      location: "Hamburg",
      resources: {
        teams: 5,
        vehicles: 3,
        tablets: 10,
        accommodation: "Hotel Central"
      }
    },
    {
      id: 2,
      name: "Kampagne Süd",
      startDate: "2024-05-15",
      endDate: "2024-08-15",
      status: "planned",
      location: "München",
      resources: {
        teams: 4,
        vehicles: 2,
        tablets: 8,
        accommodation: "Pension Schmitt"
      }
    },
    {
      id: 3,
      name: "Kampagne West",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      status: "planned",
      location: "Köln",
      resources: {
        teams: 6,
        vehicles: 4,
        tablets: 12,
        accommodation: "City Hotel"
      }
    }
  ]

  const timeViews = [
    { label: "Monat", value: "month" as TimeUnit },
    { label: "Quartal", value: "quarter" as TimeUnit },
    { label: "Jahr", value: "year" as TimeUnit }
  ]

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800'
      case 'preparation':
        return 'bg-yellow-100 text-yellow-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'planned':
        return 'Geplant'
      case 'preparation':
        return 'In Vorbereitung'
      case 'active':
        return 'Aktiv'
      case 'completed':
        return 'Abgeschlossen'
    }
  }

  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ]

  const handleTimeUnitChange = (unit: TimeUnit) => {
    setTimeUnit(unit)
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (timeUnit === 'month') {
      if (direction === 'prev') {
        if (currentMonth === 0) {
          setCurrentMonth(11)
          setCurrentYear(currentYear - 1)
        } else {
          setCurrentMonth(currentMonth - 1)
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0)
          setCurrentYear(currentYear + 1)
        } else {
          setCurrentMonth(currentMonth + 1)
        }
      }
    } else if (timeUnit === 'quarter') {
      setCurrentYear(direction === 'prev' ? currentYear - 1 : currentYear + 1)
    } else {
      setCurrentYear(direction === 'prev' ? currentYear - 1 : currentYear + 1)
    }
  }

  const getVisibleMonths = () => {
    if (timeUnit === 'month') {
      return months.slice(currentMonth, currentMonth + 1)
    } else if (timeUnit === 'quarter') {
      const quarterStart = Math.floor(currentMonth / 3) * 3
      return months.slice(quarterStart, quarterStart + 3)
    } else {
      return months
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Kampagnen</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Neue Kampagne
        </Button>
      </div>

      {/* View Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className={viewMode === 'timeline' ? 'bg-blue-50' : ''}
            onClick={() => setViewMode('timeline')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Zeitstrahl
          </Button>
          <Button 
            variant="outline"
            className={viewMode === 'list' ? 'bg-blue-50' : ''}
            onClick={() => setViewMode('list')}
          >
            <List className="mr-2 h-4 w-4" />
            Liste
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {timeViews.map((view) => (
              <Button
                key={view.value}
                variant="outline"
                className={timeUnit === view.value ? 'bg-blue-50' : ''}
                onClick={() => handleTimeUnitChange(view.value)}
              >
                {view.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleNavigate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-2 font-medium">
              {timeUnit === 'month' 
                ? `${months[currentMonth]} ${currentYear}`
                : timeUnit === 'quarter'
                ? `Q${Math.floor(currentMonth / 3) + 1} ${currentYear}`
                : currentYear}
            </span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => handleNavigate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-12 gap-4 mb-4">
            {getVisibleMonths().map((month) => (
              <div key={month} className="text-sm font-medium text-center">
                {month}
              </div>
            ))}
          </div>
          
          <div className="space-y-6">
            {campaigns.map((campaign) => {
              const startMonth = new Date(campaign.startDate).getMonth()
              const endMonth = new Date(campaign.endDate).getMonth()
              const duration = endMonth - startMonth + 1
              
              return (
                <div key={campaign.id} className="relative">
                  <div className="grid grid-cols-12 gap-4">
                    <div
                      className={`col-start-${startMonth + 1} col-span-${duration} 
                      bg-blue-100 rounded-lg p-3 cursor-pointer hover:bg-blue-200 transition-colors`}
                    >
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-gray-600">{campaign.location}</div>
                      <div className="mt-2 flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {getStatusText(campaign.status)}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          {campaign.resources.teams}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Car className="h-4 w-4" />
                          {campaign.resources.vehicles}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Tablet className="h-4 w-4" />
                          {campaign.resources.tablets}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{campaign.name}</h3>
                    <div className="text-sm text-gray-500">{campaign.location}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusText(campaign.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline">Details</Button>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Teams</div>
                      <div className="text-lg font-semibold">{campaign.resources.teams}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                    <Car className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Fahrzeuge</div>
                      <div className="text-lg font-semibold">{campaign.resources.vehicles}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                    <Tablet className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Tablets</div>
                      <div className="text-lg font-semibold">{campaign.resources.tablets}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                    <Building className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">Unterkunft</div>
                      <div className="text-lg font-semibold">{campaign.resources.accommodation}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
