'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Carrier Fleet Types ---
export type StaffRole = 'DRIVER' | 'OTHER';

export interface CarrierStaff {
  staffId: string;
  name: string;
  role: StaffRole;
  is_available: boolean;
}

export type VehicleStatus = 'IDLE' | 'ON_TRIP';

export interface CarrierVehicle {
  vehicleId: string;
  model: string;
  plateNumber: string;
  driverId: string | null;
  status: VehicleStatus;
}

export interface FleetData {
  vehicles: CarrierVehicle[];
  staff: CarrierStaff[];
}

// --- Governance / TNA Verification Types ---
export type ActiveRole = 'gov' | 'visitor' | 'owner' | 'carrier';

export interface PendingTna {
  id: string;
  visitorName: string;
  propertyBuilding: string;
  requestedDuration: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface VisitorTna {
  id: string;
  visitorName: string;
  na_id: string;
  status: 'PENDING_OWNER_APPROVAL' | 'ACTIVE' | 'REJECTED';
  issuance_fee: number;
}

export interface OwnerAccount {
  ownerId: string;
  current_balance: number;
}

interface TNAContextType {
  // Carrier Fleet context
  fleetData: FleetData;
  assignDriver: (vehicleId: string, driverId: string | null) => void;
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;

  // Gov Verification context
  tnaData: PendingTna[];
  updateTnaStatus: (id: string, status: PendingTna['status']) => void;
  activeRole: ActiveRole;

  // Visitor & Owner Binding context
  visitorTnas: VisitorTna[];
  addVisitorTna: (tna: Omit<VisitorTna, 'id'>) => void;
  acceptBindingRequest: (id: string) => void;
  ownerAccount: OwnerAccount;
}

const initialCarrierVehiclesData: CarrierVehicle[] = [
  { vehicleId: 'VIN12345', model: 'Truck XYZ', plateNumber: 'ABC-123', driverId: null, status: 'IDLE' },
  { vehicleId: 'VIN67890', model: 'Van LMN', plateNumber: 'DEF-456', driverId: 'STAFF001', status: 'ON_TRIP' },
  { vehicleId: 'VIN11223', model: 'Truck PQR', plateNumber: 'GHI-789', driverId: null, status: 'IDLE' },
];

const initialCarrierStaffData: CarrierStaff[] = [
  { staffId: 'STAFF001', name: 'Alice Johnson', role: 'DRIVER', is_available: false },
  { staffId: 'STAFF002', name: 'Bob Williams', role: 'DRIVER', is_available: true },
  { staffId: 'STAFF003', name: 'Charlie Brown', role: 'DRIVER', is_available: true },
  { staffId: 'STAFF004', name: 'David Green', role: 'OTHER', is_available: true },
];

const initialGovTnaData: PendingTna[] = [
    { id: 'tna-01', visitorName: 'John Doe', propertyBuilding: 'Sunset Towers', requestedDuration: '6 Months', status: 'PENDING' },
    { id: 'tna-02', visitorName: 'Jane Smith', propertyBuilding: 'Oasis Apartments', requestedDuration: '1 Year', status: 'PENDING' },
    { id: 'tna-03', visitorName: 'Mike Johnson', propertyBuilding: 'Desert Villas', requestedDuration: '3 Months', status: 'PENDING' },
];

const TNAContext = createContext<TNAContextType | undefined>(undefined);

export const TNAProvider = ({ children }: { children: ReactNode }) => {
  const [vehicles, setVehicles] = useState<CarrierVehicle[]>(initialCarrierVehiclesData);
  const [staff, setStaff] = useState<CarrierStaff[]>(initialCarrierStaffData);
  const [tnaData, setTnaData] = useState<PendingTna[]>(initialGovTnaData);
  const [visitorTnas, setVisitorTnas] = useState<VisitorTna[]>([]);
  const [ownerAccount, setOwnerAccount] = useState<OwnerAccount>({
    ownerId: 'owner-01',
    current_balance: 0,
  });

  // --- Persistence Logic ---
  
  // 1. Initialize from localStorage on mount (Client-side only)
  useEffect(() => {
    const savedTnas = localStorage.getItem('tna_visitor_tnas');
    const savedAccount = localStorage.getItem('tna_owner_account');

    if (savedTnas) {
      try {
        setVisitorTnas(JSON.parse(savedTnas));
      } catch (e) {
        console.error('Failed to parse visitorTnas from localStorage', e);
      }
    }

    if (savedAccount) {
      try {
        setOwnerAccount(JSON.parse(savedAccount));
      } catch (e) {
        console.error('Failed to parse ownerAccount from localStorage', e);
      }
    }
  }, []);

  // 2. Sync to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('tna_visitor_tnas', JSON.stringify(visitorTnas));
  }, [visitorTnas]);

  useEffect(() => {
    localStorage.setItem('tna_owner_account', JSON.stringify(ownerAccount));
  }, [ownerAccount]);
  
  // We mock the user role for testing purposes
  const [activeRole] = useState<ActiveRole>('gov');

  const addVisitorTna = (tna: Omit<VisitorTna, 'id'>) => {
    const newTna: VisitorTna = {
      ...tna,
      id: `vtna-${Math.random().toString(36).substr(2, 9)}`,
    };
    setVisitorTnas(prev => [...prev, newTna]);
  };

  const acceptBindingRequest = (id: string) => {
    setVisitorTnas(currentTnas =>
      currentTnas.map(tna => {
        if (tna.id === id) {
          // Increment balance
          setOwnerAccount(prev => ({
            ...prev,
            current_balance: prev.current_balance + tna.issuance_fee,
          }));
          return { ...tna, status: 'ACTIVE' };
        }
        return tna;
      })
    );
  };

  const assignDriver = (vehicleId: string, newDriverId: string | null) => {
    setVehicles(currentVehicles =>
      currentVehicles.map(vehicle => {
        if (vehicle.vehicleId === vehicleId) {
          const newStatus: VehicleStatus = newDriverId ? 'ON_TRIP' : 'IDLE';

          setStaff(currentStaff => 
            currentStaff.map(s => {
              if (s.staffId === newDriverId) return { ...s, is_available: false };
              if (s.staffId === vehicle.driverId && newDriverId !== null) return { ...s, is_available: true };
              if (s.staffId === vehicle.driverId && newDriverId === null) return { ...s, is_available: true };
              return s;
            })
          );
          
          return { ...vehicle, driverId: newDriverId, status: newStatus };
        }
        return vehicle;
      })
    );
  };

  const updateVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setVehicles(current => current.map(v => v.vehicleId === vehicleId ? { ...v, status } : v));
  };

  const updateTnaStatus = (id: string, status: PendingTna['status']) => {
    setTnaData(current => current.map(tna => tna.id === id ? { ...tna, status } : tna));
  }

  return (
    <TNAContext.Provider value={{ 
        fleetData: { vehicles, staff }, 
        assignDriver, 
        updateVehicleStatus,
        tnaData,
        updateTnaStatus,
        activeRole,
        visitorTnas,
        addVisitorTna,
        acceptBindingRequest,
        ownerAccount
    }}>
      {children}
    </TNAContext.Provider>
  );
};

export const useTNAContext = () => {
  const context = useContext(TNAContext);
  if (context === undefined) {
    throw new Error('useTNAContext must be used within a TNAProvider');
  }
  return context;
};
