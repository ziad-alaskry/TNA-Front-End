import { Carrier, CarrierStaff, CarrierVehicle } from '../types/carrier';

export const mockCarriers: Carrier[] = [
  {
    carrier_id: 'carrier-1',
    company_name: 'Fast Track Logistics',
    commercial_registration: '1010123456',
    license_number: 'LIC-789-FTL',
    contact_email: 'ops@fasttrack.test',
    contact_phone: '+966 50 123 4567',
    is_verified: true,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  }
];

export const mockDrivers: CarrierStaff[] = [
  {
    staff_id: 'driver-1',
    user_id: 'user-carrier-1',
    carrier_id: 'carrier-1',
    full_name: 'Mohammed Ali',
    employee_id: 'EMP-001',
    mobile: '+966 55 111 2222',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  }
];

export const mockVehicles: CarrierVehicle[] = [
  {
    vehicle_id: 'veh-1',
    carrier_id: 'carrier-1',
    plate_number: 'ABC 1234',
    vehicle_type: 'Van',
    status: 'IDLE',
    updated_at: '2024-01-01T00:00:00Z',
  }
];

// Mock data for dashboard widgets
export const mockFleetUtilization = 75; // Percentage
export const mockTaskDistribution = {
  pending: 40,
  in_transit: 35,
  delivered: 25
};
