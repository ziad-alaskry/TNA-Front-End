'use client'

import React from 'react';
import Button from '@/components/ui/Button'; // Assuming Button component is available
import { ChartPlaceholder } from '@/components/ui/ChartPlaceholder'; // Placeholder for charts
import { useFleetContext } from '@/context/FleetContext'; // Import FleetContext

// Assume t() function for translation is available
const t = (key: string) => key; // Placeholder for translation

// --- KPI Card Component ---
interface KpiCardProps {
  title: string;
  value: string | number;
  metric: string; // e.g., 'ON_TRIP', 'DRIVER_UTILIZATION'
  accentColor: string; // e.g., 'warning'
  description?: string; // Optional description for the KPI
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, metric, accentColor, description }) => {
  // Dynamic styling for accent border and text
  const borderStartClass = `border-s-4 border-warning`; // Using logical property 'border-s'
  const textClass = `text-brand-navy`;

  return (
    <div className={`p-6 rounded-md shadow-card bg-surface-200 ${borderStartClass} border-neutral-200`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-lg font-bold ${textClass}`}>{title}</h3>
      </div>
      <p className="text-3xl font-black text-neutral-900">{value}</p>
      {description && <p className="text-caption text-neutral-500 mt-1 font-medium">{description}</p>}
    </div>
  );
};

export default function CarrierReportsPage() {
  // Consume global state for fleet data
  const { fleetData } = useFleetContext();
  const { vehicles, staff } = fleetData; // Destructure vehicles and staff from fleetData

  // Calculate KPIs dynamically from context data
  const activeFleetCount = vehicles.filter(v => v.status === 'ON_TRIP').length;
  const totalDrivers = staff.filter(s => s.position === 'DRIVER').length;
  const driversOnTripOrAssigned = staff.filter(s => s.position === 'DRIVER' && !s.is_active).length; 
  
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
