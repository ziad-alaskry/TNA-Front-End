'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'

interface VerificationRequest {
  request_id: string
  visitor_id: string
  created_at: string
  type: 'TNA Issuance' | 'Address Verification'
  urgency: 'high' | 'normal'
}

export default function GovVerificationQueuePage() {
  const columns: DataTableColumn<VerificationRequest>[] = [
    { key: 'request_id', label: 'Request ID', width: '20%' },
    { key: 'visitor_id', label: 'Subject (ID)', width: '20%' },
    { key: 'type', label: 'Type', width: '25%' },
    { key: 'created_at', label: 'Submission Date', width: '25%' },
    { key: 'urgency', label: 'Urgency', width: '10%', render: (val) => (
      <span className={`px-2 py-1 rounded-sm text-xs capitalize ${
        val === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {val}
      </span>
    )},
  ]

  const data: VerificationRequest[] = [
    { request_id: 'REQ-101', visitor_id: 'V-8822', created_at: '2026-04-13 10:30', type: 'TNA Issuance', urgency: 'high' },
    { request_id: 'REQ-102', visitor_id: 'O-1192', created_at: '2026-04-13 09:15', type: 'Address Verification', urgency: 'normal' },
    { request_id: 'REQ-103', visitor_id: 'V-4421', created_at: '2026-04-12 18:45', type: 'TNA Issuance', urgency: 'normal' },
  ]

  return (
    <AppShell role="Gov" header={<h1 className="text-xl font-bold">Verification Inbox</h1>}>
      <DataTableLayout
        title="Active Review Queue"
        columns={columns}
        data={data}
      >
        <div className="flex gap-2">
          <button className="bg-primitive-navy text-white px-4 py-2 rounded-sm text-sm">
            Export Audit Log
          </button>
        </div>
      </DataTableLayout>
    </AppShell>
  )
}
