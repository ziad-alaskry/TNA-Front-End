'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useTNAContext } from '@/context/TNAContext'

const t = (key: string) => key;

export default function VisitorShipmentsPage() {
  // Assuming shipments are also in context or need to be fetched/derived
  const { tnaData } = useTNAContext(); // Placeholder, might need a separate shipments context

  const columns: DataTableColumn<any>[] = [
    { key: 'tracking_number', label: t('trackingNumber'), width: '25%' },
    { key: 'tna_code', label: t('destinationTna'), width: '25%' },
    { key: 'status', label: t('status'), width: '25%', render: (val) => (
      <span className={`px-2 py-1 rounded-sm text-xs capitalize ${
        val === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {val}
      </span>
    )},
    { key: 'expected_at', label: t('expectedDelivery'), width: '25%' },
  ]

  // Mock shipments data
  const shipments = [
    { tracking_number: 'TN-99281-S', tna_code: 'TNA-8819', status: 'delivered', expected_at: '2026-04-13' }
  ]

  return (
    <AppShell role="Visitor" header={<h1 className="text-xl font-bold">{t('myShipments')}</h1>}>
      <DataTableLayout
        title={t('myShipments')}
        columns={columns}
        data={shipments}
      />
    </AppShell>
  )
}
