export interface Employee {
  id: number;
  name: string;
  role: 'teamleader' | 'werber';
  status: 'active' | 'inactive' | 'onLeave';
  campaignId?: number;
  equipment: {
    clothing: {
      shirtSize: string;
      jacketSize: string;
      pantsSize: string;
    };
    tablet?: string;
    ids: {
      drk: string;
      connext: string;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
}

export interface Equipment {
  id: number;
  name: string;
  type: 'tablet' | 'clothing' | 'promotional' | 'other';
  status: 'available' | 'assigned' | 'maintenance' | 'lost';
  assignedTo?: number; // employeeId
  serialNumber?: string;
  details?: {
    size?: string;
    color?: string;
    condition?: string;
  };
  quantity: {
    total: number;
    available: number;
  };
}

export interface Vehicle {
  id: number;
  name: string;
  type: 'rental' | 'owned';
  status: 'available' | 'inUse' | 'maintenance';
  campaignId?: number;
  licensePlate: string;
  details: {
    make: string;
    model: string;
    year: number;
    seats: number;
  };
  rental?: {
    company: string;
    contact: string;
    startDate: string;
    endDate: string;
    cost: number;
    contract?: string;
  };
  maintenance?: {
    lastService: string;
    nextService: string;
    notes: string;
  };
}

export interface Accommodation {
  id: number;
  name: string;
  type: 'hotel' | 'apartment' | 'hostel';
  location: {
    street: string;
    city: string;
    zip: string;
    state: string;
  };
  capacity: {
    total: number;
    available: number;
  };
  campaignId?: number;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  booking: {
    checkIn: string;
    checkOut: string;
    cost: number;
    contract?: string;
  };
  amenities: string[];
  notes?: string;
}

export interface RedCrossOffice {
  id: number;
  name: string;
  location: {
    street: string;
    city: string;
    zip: string;
    state: string;
  };
  contact: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
  capacity: {
    campaigns: number;
    teams: number;
  };
  status: 'active' | 'inactive';
  notes?: string;
}
