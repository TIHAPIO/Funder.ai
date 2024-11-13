import { CampaignService } from './campaigns';
import { 
  EmployeeService, 
  EquipmentService, 
  VehicleService, 
  AccommodationService,
  RedCrossOfficeService 
} from './resources';
import type { Employee, Equipment, Vehicle, Accommodation, RedCrossOffice } from '../../types/resources';

// Create service instances
export const campaignService = new CampaignService();
export const employeeService = new EmployeeService();
export const equipmentService = new EquipmentService();
export const vehicleService = new VehicleService();
export const accommodationService = new AccommodationService();
export const redCrossOfficeService = new RedCrossOfficeService();

// Utility function to seed the database with example data
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Generate and seed campaigns
    await campaignService.seedDatabase();
    console.log('✓ Campaigns seeded');

    // Generate and seed employees
    const employees: Omit<Employee, 'id'>[] = Array.from({ length: 50 }, (_, i) => ({
      name: `Employee ${i + 1}`,
      role: i < 10 ? 'teamleader' as const : 'werber' as const,
      status: 'active' as const,
      equipment: {
        clothing: {
          shirtSize: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
          jacketSize: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
          pantsSize: ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)]
        },
        tablet: `TB-2024-${i + 1}`,
        ids: {
          drk: `DRK-${Math.floor(Math.random() * 10000)}`,
          connext: `CNX-${Math.floor(Math.random() * 10000)}`
        }
      },
      contact: {
        phone: `+49 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
        email: `employee${i + 1}@connext.de`
      }
    }));
    await employeeService.bulkAdd(employees);
    console.log('✓ Employees seeded');

    // Generate and seed equipment
    const equipment: Omit<Equipment, 'id'>[] = Array.from({ length: 100 }, (_, i) => ({
      name: `Equipment ${i + 1}`,
      type: ['tablet', 'clothing', 'promotional', 'other'][Math.floor(Math.random() * 4)] as Equipment['type'],
      status: 'available' as const,
      serialNumber: `EQ-2024-${i + 1}`,
      quantity: {
        total: 10,
        available: 10
      }
    }));
    await equipmentService.bulkAdd(equipment);
    console.log('✓ Equipment seeded');

    // Generate and seed vehicles
    const vehicles: Omit<Vehicle, 'id'>[] = Array.from({ length: 20 }, (_, i) => ({
      name: `Vehicle ${i + 1}`,
      type: i < 10 ? 'rental' as const : 'owned' as const,
      status: 'available' as const,
      licensePlate: `B-CN ${Math.floor(Math.random() * 900 + 100)}`,
      details: {
        make: ['VW', 'Mercedes', 'Ford'][Math.floor(Math.random() * 3)],
        model: ['Transporter', 'Sprinter', 'Transit'][Math.floor(Math.random() * 3)],
        year: 2024,
        seats: 9
      }
    }));
    await vehicleService.bulkAdd(vehicles);
    console.log('✓ Vehicles seeded');

    // Generate and seed accommodations
    const accommodations: Omit<Accommodation, 'id'>[] = Array.from({ length: 30 }, (_, i) => ({
      name: `Accommodation ${i + 1}`,
      type: ['hotel', 'apartment', 'hostel'][Math.floor(Math.random() * 3)] as Accommodation['type'],
      location: {
        street: `Street ${i + 1}`,
        city: ['Berlin', 'Hamburg', 'Munich', 'Cologne'][Math.floor(Math.random() * 4)],
        zip: `${Math.floor(Math.random() * 90000 + 10000)}`,
        state: ['Berlin', 'Hamburg', 'Bavaria', 'North Rhine-Westphalia'][Math.floor(Math.random() * 4)]
      },
      capacity: {
        total: 20,
        available: 20
      },
      contact: {
        name: `Contact ${i + 1}`,
        phone: `+49 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
        email: `accommodation${i + 1}@example.com`
      },
      booking: {
        checkIn: '15:00',
        checkOut: '11:00',
        cost: Math.floor(Math.random() * 1000 + 500)
      },
      amenities: ['WiFi', 'Parking', 'Breakfast']
    }));
    await accommodationService.bulkAdd(accommodations);
    console.log('✓ Accommodations seeded');

    // Generate and seed Red Cross offices
    const offices: Omit<RedCrossOffice, 'id'>[] = Array.from({ length: 15 }, (_, i) => ({
      name: `DRK Office ${i + 1}`,
      location: {
        street: `Street ${i + 1}`,
        city: ['Berlin', 'Hamburg', 'Munich', 'Cologne'][Math.floor(Math.random() * 4)],
        zip: `${Math.floor(Math.random() * 90000 + 10000)}`,
        state: ['Berlin', 'Hamburg', 'Bavaria', 'North Rhine-Westphalia'][Math.floor(Math.random() * 4)]
      },
      contact: {
        name: `Office Contact ${i + 1}`,
        role: 'Coordinator',
        phone: `+49 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
        email: `office${i + 1}@drk.de`
      },
      capacity: {
        campaigns: 5,
        teams: 10
      },
      status: 'active' as const
    }));
    await redCrossOfficeService.bulkAdd(offices);
    console.log('✓ Red Cross offices seeded');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
