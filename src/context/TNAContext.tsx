'use client'

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { CarrierVehicle } from '@/types/logistics'; // Assuming types are in this path
import { CarrierStaff } from '@/types/logistics'; // Assuming types are in this path
import { PendingTna } from '@/types/logistics'; // Assuming types are in this path

// --- Type Definitions ---
export type ActiveRole = 'GOV' | 'CARRIER' | 'ADMIN';

// Assume initial mock data structures are consistent with what was defined
// In a real app, these might be fetched or managed differently.
const initialFleetData: { vehicles: CarrierVehicle[]; staff: CarrierStaff[] } = {
  vehicles: [], // Placeholder - data will be managed here
  staff: [],    // Placeholder - data will be managed here
};
const initialTnaData: PendingTna[] = []; // Placeholder

// --- Context Definitions ---
interface TNAContextProps {
  activeRole: ActiveRole;
  setActiveRole: Dispatch<SetStateAction<ActiveRole>>;
  fleetData: { vehicles: CarrierVehicle[]; staff: CarrierStaff[] };
  setFleetData: Dispatch<SetStateAction<{ vehicles: CarrierVehicle[]; staff: CarrierStaff[] }>>;
  tnaData: PendingTna[];
  setTnaData: Dispatch<SetStateAction<PendingTna[]>>;
  
  // Actions
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  assignDriver: (vehicleId: string, driverId: string | null) => void;
  updateTnaStatus: (tnaId: string, status: 'APPROVED' | 'REJECTED') => void;
}

const TNAContext = createContext<TNAContextProps | undefined>(undefined);

// --- Provider Component ---
interface TNAProviderProps {
  children: ReactNode;
}

export const TNAProvider: React.FC<TNAProviderProps> = ({ children }) => {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<ActiveRole>('GOV'); // Default role
  const [fleetData, setFleetData] = useState(initialFleetData);
  const [tnaData, setTnaData] = useState(initialTnaData);

  // --- Action Functions ---

  // Updates the status of a specific vehicle
  const updateVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setFleetData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v => 
        v.vehicleId === vehicleId ? { ...v, status: status } : v
      )
    }));
  };

  // Assigns a driver to a vehicle and updates their availability
  const assignDriver = (vehicleId: string, driverId: string | null) => {
    setFleetData(prev => {
      const updatedVehicles = prev.vehicles.map(v => {
        if (v.vehicleId === vehicleId) {
          const newStatus: VehicleStatus = driverId ? 'ON_TRIP' : 'IDLE';
          // Update driver's availability: if a driver is assigned, they become unavailable. If unassigned, they become available.
          const updatedStaff = prev.staff.map(s => {
            if (s.staffId === driverId) return { ...s, is_available: false }; // Newly assigned driver is unavailable
            if (s.staffId === v.driverId && driverId !== null) return { ...s, is_available: true }; // Previously assigned driver becomes available
            if (s.staffId === driverId && driverId === null) return { ...s, is_available: true }; // Driver being unassigned becomes available
            return s;
          });
          setStaff(updatedStaff); // Update staff state separately

          return { ...v, driverId: driverId, status: newStatus };
        }
        // If a driver is being reassigned, ensure the old driver becomes available
        if (v.vehicleId !== vehicleId && v.driverId === driverId && driverId !== null) {
             // This logic handles the case where a driver is reassigned from another vehicle
             // If the *new* driver is already assigned to another vehicle, this needs more complex handling.
             // For now, assuming unique driver assignments or simple reassignments.
        }
        return v;
      });

      return { ...prev, vehicles: updatedVehicles };
    });
  };

  // Updates the status of a pending TNA
  const updateTnaStatus = (tnaId: string, status: 'APPROVED' | 'REJECTED') => {
    setTnaData(prev => 
      prev.map(tna => 
        tna.id === tnaId ? { ...tna, status: status } : tna
      )
    );
  };

  // Effect to set initial data from mock sources or fetch if needed
  useEffect(() => {
    // In a real app, you might fetch initial data here.
    // For now, we'll set them with placeholder data or keep them empty.
    // If you have initial mock data available globally or from a config, you can set it here.
    // Example: setFleetData({ vehicles: fetchedVehicles, staff: fetchedStaff });
    // Example: setTnaData(fetchedTnas);
    
    // For demonstration, let's populate with some mock data that matches Batch 2 types
    setFleetData({
      vehicles: [
        { vehicleId: 'VIN12345', model: 'Truck XYZ', plateNumber: 'ABC-123', driverId: null, status: 'IDLE' },
        { vehicleId: 'VIN67890', model: 'Van LMN', plateNumber: 'DEF-456', driverId: 'STAFF001', status: 'ON_TRIP' },
        { vehicleId: 'VIN11223', model: 'Truck PQR', licensePlate: 'GHI-789', driverId: null, status: 'IDLE' },
      ],
      staff: [
        { staffId: 'STAFF001', name: 'Alice Johnson', role: 'DRIVER', is_available: false },
        { staffId: 'STAFF002', name: 'Bob Williams', role: 'DRIVER', is_available: true },
        { staffId: 'STAFF003', name: 'Charlie Brown', role: 'DRIVER', is_available: true },
        { staffId: 'STAFF004', name: 'David Green', role: 'OTHER', is_available: true },
      ]
    });
    setTnaData([
      { id: 'tna-001', visitorName: 'John Doe', propertyBuilding: 'Building Alpha', requestedDuration: '1 Month', status: 'PENDING' },
      { id: 'tna-002', visitorName: 'Jane Smith', propertyBuilding: 'Complex Beta', requestedDuration: '6 Months', status: 'PENDING' },
    ]);
  }, []); // Empty dependency array means this runs once on mount

  // Provide context value
  const contextValue: TNAContextProps = {
    activeRole,
    setActiveRole,
    fleetData,
    setFleetData,
    tnaData,
    setTnaData,
    updateVehicleStatus,
    assignDriver,
    updateTnaStatus,
  };

  return (
    <TNAContext.Provider value={contextValue}>
      {children}
    </TNAContext.Provider>
  );
};

// --- Custom Hook ---
export const useTNAContext = (): TNAContextProps => {
  const context = useContext(TNAContext);
  if (!context) {
    throw new Error('useTNAContext must be used within a TNAProvider');
  }
  return context;
};
