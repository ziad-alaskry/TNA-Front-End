'use client'

import React from 'react';
import Button from '@/components/ui/Button'; // Assuming Button component is available
import { ChartPlaceholder } from '@/components/ui/ChartPlaceholder'; // Placeholder for charts
import { useTNAContext } from '@/context/TNAContext'; // Import TNAContext
import { VehicleStatus, CarrierVehicle, CarrierStaff } from '@/context/TNAContext'; // Import types from context

// Assume t() function for translation is available
const t = (key: string) => key; // Placeholder for translation

// --- KPI Card Component ---
interface KpiCardProps {
  title: string;
  value: string | number;
  metric: string; // e.g., 'ON_TRIP', 'DRIVER_UTILIZATION'
  accentColor: string; // e.g., 'amber-500'
  description?: string; // Optional description for the KPI
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, metric, accentColor, description }) => {
  // Dynamic styling for accent border and text
  const borderStartClass = `border-s-4 border-${accentColor}`; // Using logical property 'border-s'
  const textClass = `text-${accentColor}`;

  return (
    <div className={`p-6 rounded-lg shadow-sm bg-white ${borderStartClass} border-gray-200`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-lg font-semibold ${textClass}`}>{title}</h3>
        {/* Placeholder for an icon if needed */}
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
};

export default function CarrierReportsPage() {
  // Consume global state for fleet data
  const { fleetData } = useTNAContext();
  const { vehicles, staff } = fleetData; // Destructure vehicles and staff from fleetData

  // Calculate KPIs dynamically from context data
  const activeFleetCount = vehicles.filter(v => v.status === 'ON_TRIP').length;
  const totalDrivers = staff.filter(s => s.role === 'DRIVER').length;
  // Assuming drivers are considered 'on trip' if they are assigned to a vehicle that is 'ON_TRIP'
  // Or, more accurately, if they are not available (is_available: false) and are drivers.
  const driversOnTripOrAssigned = staff.filter(s => s.role === 'DRIVER' && !s.is_available).length; 
  
  const driverUtilization = totalDrivers > 0 ? ((driversOnTripOrAssigned / totalDrivers) * 100).toFixed(1) : '0.0';
  const avgTurnaroundTime = "N/A"; // Placeholder for calculation

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6 text-amber-600">{t('logisticsAnalytics')}</h1>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-4 lg:grid-cols-3 gap-6 mb-8">
        <KpiCard
          title={t('activeFleet')}
          value={activeFleetCount}
          metric="ON_TRIP"
          accentColor="amber-500"
          description={t('vehiclesCurrentlyOnTrip')}
        />
        <KpiCard
          title={t('driverUtilization')}
          value={`${driverUtilization}%`}
          metric="DRIVER_UTILIZATION"
          accentColor="amber-500"
          description={t('percentageOfDriversOnDuty')}
        />
        <KpiCard
          title={t('avgTurnaroundTime')}
          value={avgTurnaroundTime}
          metric="AVG_TURNAROUND"
          accentColor="amber-500"
          description={t('averageTimeForDeliveries')}
        />
      </div>

      {/* Visualization Placeholder */}
      <div className="p-6 rounded-lg shadow-sm bg-amber-50 border border-amber-200">
        <h3 className="text-lg font-semibold mb-4 text-amber-700">{t('fleetCompositionChart')}</h3>
        <div className="h-64 flex items-center justify-center text-amber-600">
          <ChartPlaceholder /> {/* Placeholder component */}
        </div>
      </div>
    </div>
  );
}
