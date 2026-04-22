'use client'

import React from 'react'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useLocale } from '@/i18n/LocaleProvider'

interface PropertyRecord {
  na_id: string
  address: string
  verification_status: 'Verified' | 'Pending'
}

export default function OwnerPropertiesPage() {
  const { t } = useLocale()

  const columns: DataTableColumn<PropertyRecord>[] = [
    { 
      key: 'na_id', 
      label: t('owner.properties.tna_id'),
      render: (value: string) => (
        <span className="inline-flex items-center rounded-sm bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-600 tracking-wider">
          {value}
        </span>
      )
    },
    { key: 'address', label: t('owner.properties.address') },
    { 
      key: 'verification_status', 
      label: t('owner.properties.verification_status'),
      render: (value: string) => {
        const isVerified = value === 'Verified'
        const statusLabel = isVerified ? t('owner.properties.verified') : t('owner.properties.pending')
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isVerified 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {statusLabel}
          </span>
        )
      }
    }
  ]

  const sampleData: PropertyRecord[] = [
    { na_id: 'NA-8293-KSA', address: 'King Fahd Road, Sector 4, Riyadh', verification_status: 'Verified' },
    { na_id: 'NA-1029-KSA', address: 'Jabal Omar Development, Makkah', verification_status: 'Pending' },
    { na_id: 'NA-9942-KSA', address: 'Corniche Waterfront, Jeddah', verification_status: 'Verified' },
    { na_id: 'NA-4432-KSA', address: 'Prince Turki St, Al Khobar', verification_status: 'Verified' },
  ]

  return (
    <div className="font-rubik">
      <DataTableLayout
        title={t('owner.properties.title')}
        columns={columns}
        data={sampleData}
        onRowClick={(row) => console.log('Clicked property:', row.na_id)}
      />
    </div>
  )
}
