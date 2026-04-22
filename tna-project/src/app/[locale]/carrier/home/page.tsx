'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { Truck, Package, Clock, ShieldCheck } from 'lucide-react'

export default function CarrierHomePage() {
  const stats = [
    { label: 'Fleet Size', value: '24 Units', icon: <Truck size={24} /> },
    { label: 'Active Shipments', value: '142', icon: <Package size={24} /> },
    { label: 'Pending Dispatch', value: '12', icon: <Clock size={24} /> },
    { label: 'Insurance Verify', value: 'Verified', icon: <ShieldCheck size={24} /> },
  ]

  const activity = [
    {
      id: '1',
      title: 'Bulk Dispatch #99281',
      description: '45 shipments assigned to King Fahd District route.',
      timestamp: '15 mins ago',
      status: 'success' as const,
    },
    {
      id: '2',
      title: 'Maintenance Alert: TRK-011',
      description: 'Routine oil change required for Hino light truck.',
      timestamp: '2 hours ago',
      status: 'pending' as const,
    },
    {
      id: '3',
      title: 'Carrier License Synced',
      description: 'MOT verification completed for 2026 fleet operations.',
      timestamp: 'Yesterday',
      status: 'success' as const,
    },
  ]

  return (
    <AppShell 
      role="Carrier" 
      header={<h1 className="text-xl font-bold">Logistics Command Center</h1>}
    >
      <DashboardLayout
        title="Fleet & Logistics Overview"
        subtitle="Fleet performance and shipment distribution overview."
        stats={stats}
        activity={activity}
      />
    </AppShell>
  )
}
