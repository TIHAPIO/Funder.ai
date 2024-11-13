import { where, QueryConstraint, QueryDocumentSnapshot } from 'firebase/firestore';
import { BaseFirestoreService } from './base';
import { Employee, Equipment, Vehicle, Accommodation, RedCrossOffice } from '../../types/resources';

export class EmployeeService extends BaseFirestoreService<Employee> {
  constructor() {
    super('employees');
  }

  async getAllEmployees(pageNumber: number = 1): Promise<{
    items: Employee[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber);
  }

  async getActiveEmployees(pageNumber: number = 1): Promise<{
    items: Employee[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('status', '==', 'active')]);
  }

  async getEmployeesByCampaign(campaignId: number, pageNumber: number = 1): Promise<{
    items: Employee[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('campaignId', '==', campaignId)]);
  }

  async assignToCampaign(employeeId: number, campaignId: number): Promise<void> {
    return this.update(employeeId, { campaignId });
  }

  async updateEquipment(employeeId: number, equipment: Employee['equipment']): Promise<void> {
    return this.update(employeeId, { equipment });
  }
}

export class EquipmentService extends BaseFirestoreService<Equipment> {
  constructor() {
    super('equipment');
  }

  async getAllEquipment(pageNumber: number = 1): Promise<{
    items: Equipment[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber);
  }

  async getEquipmentByType(type: Equipment['type'], pageNumber: number = 1): Promise<{
    items: Equipment[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('type', '==', type)]);
  }

  async getAvailableEquipment(pageNumber: number = 1): Promise<{
    items: Equipment[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('status', '==', 'available')]);
  }

  async assignToEmployee(equipmentId: number, employeeId: number): Promise<void> {
    return this.update(equipmentId, { 
      assignedTo: employeeId,
      status: 'assigned'
    });
  }

  async updateQuantity(equipmentId: number, quantity: Equipment['quantity']): Promise<void> {
    return this.update(equipmentId, { quantity });
  }
}

export class VehicleService extends BaseFirestoreService<Vehicle> {
  constructor() {
    super('vehicles');
  }

  async getAllVehicles(pageNumber: number = 1): Promise<{
    items: Vehicle[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber);
  }

  async getAvailableVehicles(pageNumber: number = 1): Promise<{
    items: Vehicle[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('status', '==', 'available')]);
  }

  async getVehiclesByCampaign(campaignId: number, pageNumber: number = 1): Promise<{
    items: Vehicle[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('campaignId', '==', campaignId)]);
  }

  async assignToCampaign(vehicleId: number, campaignId: number): Promise<void> {
    return this.update(vehicleId, { 
      campaignId,
      status: 'inUse'
    });
  }

  async updateMaintenance(
    vehicleId: number, 
    maintenance: Vehicle['maintenance']
  ): Promise<void> {
    return this.update(vehicleId, { maintenance });
  }
}

export class AccommodationService extends BaseFirestoreService<Accommodation> {
  constructor() {
    super('accommodations');
  }

  async getAllAccommodations(pageNumber: number = 1): Promise<{
    items: Accommodation[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber);
  }

  async getAvailableAccommodations(pageNumber: number = 1): Promise<{
    items: Accommodation[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('capacity.available', '>', 0)]);
  }

  async getAccommodationsByCampaign(campaignId: number, pageNumber: number = 1): Promise<{
    items: Accommodation[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('campaignId', '==', campaignId)]);
  }

  async assignToCampaign(
    accommodationId: number, 
    campaignId: number,
    booking: Accommodation['booking']
  ): Promise<void> {
    return this.update(accommodationId, { 
      campaignId,
      booking
    });
  }

  async updateCapacity(
    accommodationId: number, 
    capacity: Accommodation['capacity']
  ): Promise<void> {
    return this.update(accommodationId, { capacity });
  }
}

export class RedCrossOfficeService extends BaseFirestoreService<RedCrossOffice> {
  constructor() {
    super('redCrossOffices');
  }

  async getAllOffices(pageNumber: number = 1): Promise<{
    items: RedCrossOffice[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber);
  }

  async getActiveOffices(pageNumber: number = 1): Promise<{
    items: RedCrossOffice[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('status', '==', 'active')]);
  }

  async getOfficesByState(state: string, pageNumber: number = 1): Promise<{
    items: RedCrossOffice[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    return this.getPage(pageNumber, [where('location.state', '==', state)]);
  }

  async updateCapacity(
    officeId: number, 
    capacity: RedCrossOffice['capacity']
  ): Promise<void> {
    return this.update(officeId, { capacity });
  }
}

// Export service instances
export const employeeService = new EmployeeService();
export const equipmentService = new EquipmentService();
export const vehicleService = new VehicleService();
export const accommodationService = new AccommodationService();
export const redCrossOfficeService = new RedCrossOfficeService();
