'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { ShieldAlert, MapPin, CheckCircle, Clock } from 'lucide-react'

export default function GovHomePage() {
  const stats = [
    { 
      label: 'Total Pending TNAs', 
      value: '142', 
      icon: <ShieldAlert size={24} />,
      description: "visitor_tnas where status is 'PENDING'"
    },
    { 
      label: 'Unverified Addresses', 
      value: '22', 
      icon: <MapPin size={24} />,
      description: "owner_national_addresses where is_verified is false" 
    },
    { 
      label: 'System Audit Score', 
      value: '99.2%', 
      icon: <CheckCircle size={24} />,
    },
    { 
      label: 'Avg. Decision Time', 
      value: '4h 22m', 
      icon: <Clock size={24} />,
    },
  ]

  const activity = [
    {
      id: '1',
      title: 'Audit: TNA #991 approved',
      description: 'Admin 882 reviewed legal deed for address #99281.',
      timestamp: '2 mins ago',
      status: 'success' as const,
    },
    {
      id: '2',
      title: 'Address Rejected: Region #A4',
      description: 'Owner (ID: 112) submitted an invalid registry reference.',
      timestamp: '1 hour ago',
      status: 'error' as const,
    },
    {
      id: '3',
      title: 'Policy Update: Autonomous Mode',
      description: 'AI issuance enabled for Riyadh residential addresses.',
      timestamp: '3 hours ago',
      status: 'pending' as const,
    },
  ]

  return (
    <AppShell 
      role="Gov" 
      header={<h1 className="text-xl font-bold">Government Administration Portal</h1>}
    >
      <DashboardLayout
        title="Command Center Overview"
        subtitle="High-level audit of system health and verification volume."
        stats={stats}
        activity={activity}
      />
    </AppShell>
  )
}
