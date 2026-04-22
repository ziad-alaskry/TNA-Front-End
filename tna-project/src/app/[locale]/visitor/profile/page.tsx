'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { UserCheck, Shield, FileText } from 'lucide-react'

export default function VisitorProfilePage() {
  const mainContent = [
    {
      title: 'Identity Information',
      description: 'Ref: visitors documentation',
      items: [
        { label: 'Full Name', value: 'Ziad Alaskry' }, // visitors.full_name
        { label: 'Nationality', value: 'Saudi Arabian' }, // visitors.nationality
        { label: 'Document Number', value: '1099XXXX44' }, // visitors.document_number
        { label: 'Verification Status', value: <span className="text-green-600 font-bold">Verified</span> },
      ]
    },
    {
      title: 'Contact Details',
      items: [
        { label: 'Mobile Number', value: '+966 5X XXX XXXX' },
        { label: 'Email Address', value: 'ziad.a@tna.gov.sa' },
      ]
    }
  ]

  const sidebar = (
    <div className="space-y-6">
      <div className="text-center pb-6 border-b border-neutral-100">
        <div className="w-20 h-20 bg-primitive-cyan-mid/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCheck size={40} className="text-primitive-cyan-mid" />
        </div>
        <h3 className="font-bold text-neutral-900">Ziad Alaskry</h3>
        <p className="text-sm text-neutral-600">Visitor (Resident)</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <Shield size={18} className="text-neutral-400" />
          <span className="text-neutral-700">Digital Identity Verified</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FileText size={18} className="text-neutral-400" />
          <span className="text-neutral-700">6 Active TNA Records</span>
        </div>
      </div>

      <button className="w-full bg-primitive-cyan-mid text-white py-2 rounded-sm text-sm font-bold mt-4">
        Edit Metadata
      </button>
    </div>
  )

  return (
    <AppShell 
      role="Visitor" 
      header={<h1 className="text-xl font-bold">Identity Management</h1>}
    >
      <DetailViewLayout
        title="Visitor Profile"
        breadcrumb={['Settings', 'Profile']}
        mainContent={mainContent}
        sidebar={sidebar}
      />
    </AppShell>
  )
}
