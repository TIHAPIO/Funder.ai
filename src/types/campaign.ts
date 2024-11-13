export type ViewMode = 'timeline' | 'list'
export type ZoomLevel = 'year' | 'month'

export interface TeamMember {
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
    ids: {
      drk: string
      connext: string
    }
  }
}

export interface Equipment {
  id: number
  type: 'clothing' | 'tablet' | 'promotional' | 'other'
  name: string
  quantity: {
    total: number
    assigned: number
  }
  status: 'available' | 'partially_available' | 'unavailable'
  details?: {
    size?: string
    type?: string
  }
}

export interface RedCrossOffice {
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

export interface Vehicle {
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

export interface Campaign {
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
    promotional: {
      flyers: number
      keychains: number
      other: { name: string, quantity: number }[]
    }
  }
  redCrossOffice: RedCrossOffice
}

export interface TimelineMarker {
  label: string
  isMonth: boolean
  isWeekStart?: boolean
  weekNumber?: number
  date: Date
}
