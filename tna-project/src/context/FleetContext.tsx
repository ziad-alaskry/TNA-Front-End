'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CarrierVehicle, CarrierStaff, FleetData } from '@/lib/types/carrier';

interface FleetContextType {
  fleetData: FleetData;
  assignDriver: (vehicleId: string, driverId: string | null) => void;
  updateVehicleStatus: (vehicleId: string, status: CarrierVehicle['status']) => void;
}

const initialCarrierVehiclesData: CarrierVehicle[] = [
  { vehicle_id: 'VIN12345', carrier_id: 'C1', plate_number: 'ABC-123', vehicle_type: 'Truck', driverId: null, status: 'IDLE', updated_at: new Date().toISOString() } as any,
  { vehicle_id: 'VIN67890', carrier_id: 'C1', plate_number: 'DEF-456', vehicle_type: 'Van', driverId: 'STAFF001', status: 'ON_TRIP', updated_at: new Date().toISOString() } as any,
  { vehicle_id: 'VIN11223', carrier_id: 'C1', plate_number: 'GHI-789', vehicle_type: 'Truck', driverId: null, status: 'IDLE', updated_at: new Date().toISOString() } as any,
];

const initialCarrierStaffData: CarrierStaff[] = [
  { staff_id: 'STAFF001', user_id: 'U1', carrier_id: 'C1', full_name: 'Alice Johnson', position: 'DRIVER', is_active: true, created_at: new Date().toISOString() },
  { staff_id: 'STAFF002', user_id: 'U2', carrier_id: 'C1', full_name: 'Bob Williams', position: 'DRIVER', is_active: true, created_at: new Date().toISOString() },
  { staff_id: 'STAFF003', user_id: 'U3', carrier_id: 'C1', full_name: 'Charlie Brown', position: 'DRIVER', is_active: true, created_at: new Date().toISOString() },
  { staff_id: 'STAFF004', user_id: 'U4', carrier_id: 'C1', full_name: 'David Green', position: 'MANAGER', is_active: true, created_at: new Date().toISOString() },
];

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider = ({ children }: { children: ReactNode }) => {
  const [vehicles, setVehicles] = useState<CarrierVehicle[]>(initialCarrierVehiclesData as any);
  const [staff, setStaff] = useState<CarrierStaff[]>(initialCarrierStaffData);

  const assignDriver = (vehicleId: string, newDriverId: string | null) => {
    setVehicles(currentVehicles =>
      currentVehicles.map(vehicle => {
        if (vehicle.vehicle_id === vehicleId) {
          return { ...vehicle, assigned_staff_id: newDriverId, status: newDriverId ? 'ON_TRIP' : 'IDLE' } as any;
        }
        return vehicle;
      })
    );
  };

  const updateVehicleStatus = (vehicleId: string, status: CarrierVehicle['status']) => {
    setVehicles(current => current.map(v => v.vehicle_id === vehicleId ? { ...v, status } : v));
  };

  return (
    <FleetContext.Provider value={{ 
        fleetData: { vehicles, staff }, 
        assignDriver, 
        updateVehicleStatus 
    }}>
      {children}
    </FleetContext.Provider>
  );
};

export const useFleetContext = () => {
  const context = useContext(FleetContext);
  if (context === undefined) {
    throw new Error('useFleetContext must be used within a FleetProvider');
  }
  return context;
};
