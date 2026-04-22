'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'

interface Shipment {
  shipment_id: string
  tracking_number: string
  status: 'dispatched' | 'at_hub' | 'delivered' | 'failed'
  actual_delivery: string
  tna_code: string
}

export default function CarrierShipmentsPage() {
  const columns: DataTableColumn<Shipment>[] = [
    { key: 'tracking_number', label: 'Tracking #', width: '25%' },
    {
      key: 'tna_code',
      label: 'TNA Destination',
      width: '20%',
      render: (val) => <span className="font-mono tracking-[0.04em]">{val}</span>,
    },
    { key: 'status', label: 'Status', width: '25%', render: (val) => (
      <span className={`px-2 py-1 rounded-sm text-xs capitalize ${
        val === 'delivered' ? 'bg-green-100 text-green-700' : 
        val === 'dispatched' ? 'bg-blue-100 text-blue-700' : 
        val === 'at_hub' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
      }`}>
        {val.replace('_', ' ')}
      </span>
    )},
    { key: 'actual_delivery', label: 'Last Update', width: '30%' },
  ]

  const data: Shipment[] = [
    { shipment_id: 'S1', tracking_number: 'TN-99281-S', status: 'dispatched', actual_delivery: '2026-04-13 14:00', tna_code: 'TNA-8819' },
    { shipment_id: 'S2', tracking_number: 'TN-11204-X', status: 'at_hub', actual_delivery: '2026-04-13 09:30', tna_code: 'TNA-0012' },
    { shipment_id: 'S3', tracking_number: 'TN-55291-C', status: 'delivered', actual_delivery: '2026-04-12 18:45', tna_code: 'TNA-7721' },
  ]

  return (
    <AppShell role="Carrier" header={<h1 className="text-xl font-bold">Logistics Operations</h1>}>
      <DataTableLayout
        title="Master Logistics List"
        columns={columns}
        data={data}
      />
    </AppShell>
  )
}
