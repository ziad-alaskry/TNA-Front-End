'use client'

import React, { useState, useEffect } from 'react';
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout';
import Button from '@/components/ui/Button'; 
import Modal from '@/components/ui/Modal'; 
import Select from '@/components/ui/Select'; 
import { useFleetContext } from '@/context/FleetContext'; 
import { CarrierVehicle, CarrierStaff } from '@/lib/types/carrier'; 

// Assume t() function for translation is available
const t = (key: string) => key; // Placeholder for translation

export default function CarrierFleetPage() {
  // Consume global state from FleetContext
  const { fleetData, assignDriver, updateVehicleStatus } = useFleetContext();
  const { vehicles, staff } = fleetData;

  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>('unassigned');

  // Filter staff to get only available drivers
  const availableDrivers = staff.filter(s => s.position === 'DRIVER' && s.is_active);

  const handleAssignDriver = () => {
    if (!selectedVehicleId) return;

    const newDriverId = selectedDriverId === 'unassigned' ? null : selectedDriverId;
    const newStatus: CarrierVehicle['status'] = newDriverId ? 'ON_TRIP' : 'IDLE';

    // Call context function to update state
    assignDriver(selectedVehicleId, newDriverId);
    updateVehicleStatus(selectedVehicleId, newStatus);

    setIsAssignDriverModalOpen(false);
    setSelectedVehicleId(null); // Reset selection
    setSelectedDriverId('unassigned'); // Reset driver selection
    alert(`Driver assignment updated for vehicle ${selectedVehicleId}`);
  };

  const openAssignDriverModal = (vehicleId: string, currentDriverId: string | null) => {
    setSelectedVehicleId(vehicleId);
    setSelectedDriverId(currentDriverId || 'unassigned');
    setIsAssignDriverModalOpen(true);
  };

  // Define the columns for the DataTable, applying amber/orange branding and RTL support
  const vehicleColumns: DataTableColumn<CarrierVehicle>[] = [
    {
      key: 'vehicle_id',
      label: t('vehicleId'),
    },
    {
      key: 'plate_number',
      label: t('licensePlate'),
    },
    {
      key: 'assigned_staff_id', 
      label: t('assignedDriver'),
      render: (val, row) => {
        const driverId = row.assigned_staff_id;
        const driver = staff.find(s => s.staff_id === driverId);
        // Ensure RTL-friendly display for driver name and ID
        return (
          <div className="text-start">
            {driver ? (
              <span className="text-start pe-2">{driver.full_name} ({driver.staff_id})</span>
            ) : (
              <span className="text-gray-500">{t('unassigned')}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: t('status'),
      render: (val, row) => {
        const status = row.status;
        let badgeColor = 'bg-neutral-200 text-neutral-700';
        if (status === 'ON_TRIP') badgeColor = 'bg-warning-bg text-warning';
        if (status === 'IDLE') badgeColor = 'bg-success-bg text-success';

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor} text-start`}>
            {t(status)}
          </span>
        );
      },
    },
    {
      key: 'vehicle_id', // Required for typing
      label: t('actions'),
      render: (val, row) => {
        const vehicle = row;
        
        return (
          <div className="flex space-x-2 text-start">
            <Button 
              onClick={() => openAssignDriverModal(vehicle.vehicle_id, vehicle.assigned_staff_id || null)} 
              variant="outline" 
              className="border-warning text-warning hover:bg-warning-bg" // Warning/Amber accent
              disabled={vehicle.status === 'ON_TRIP'} // Disable if already on trip, or handle re-assignment logic
            >
              {t(vehicle.assigned_staff_id ? 'reassignDriver' : 'assignDriver')}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6 text-amber-600">{t('carrierFleetManagement')}</h1> {/* Amber accent for heading */}
      
      <DataTableLayout
        title={t('carrierFleetManagement')}
        columns={vehicleColumns}
        data={vehicles} // Use state data from context
        // Apply amber/orange theme to DataTableLayout elements if possible
      />

      {/* Assign Driver Modal */}
      <Modal
        isOpen={isAssignDriverModalOpen}
        onClose={() => {
          setIsAssignDriverModalOpen(false);
          setSelectedVehicleId(null);
          setSelectedDriverId('unassigned');
        }}
        title={t('assignDriverToVehicle')}
        footer={
          <div className="flex justify-end space-x-2">
            <Button onClick={() => {
                setIsAssignDriverModalOpen(false);
                setSelectedVehicleId(null);
                setSelectedDriverId('unassigned');
              }} 
              variant="outline" 
              className="border-gray-400 text-gray-700 hover:bg-gray-50"
            >
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleAssignDriver} 
              className="bg-amber-500 hover:bg-amber-600 text-white" // Amber accent
              disabled={!selectedVehicleId} // Disable if no vehicle is selected
            >
              {t('assign')}
            </Button>
          </div>
        }
      >
        {selectedVehicleId && (
          <>
            <p className="mb-4">{t('selectDriverForVehicle')}: {selectedVehicleId}</p>
            <Select
              label={t('driver')}
              options={[
                { value: 'unassigned', label: t('unassigned') },
                ...availableDrivers.map(staff => ({ value: staff.staffId, label: `${staff.name} (${staff.staffId})` })) // Display name and ID
              ]}
              value={selectedDriverId || 'unassigned'} // Set initial value
              onChange={(e) => setSelectedDriverId(e.target.value)}
              error="" // Placeholder for error
              className="mb-4"
              // Apply amber focus ring if available in Select component
            />
          </>
        )}
      </Modal>
    </div>
  );
}
