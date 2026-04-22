'use client'

import React from 'react'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import Button from '@/components/ui/Button'
import { useTNAContext } from '@/context/TNAContext'
import { useLocale } from '@/i18n/LocaleProvider'

export default function OwnerBindingsPage() {
  const { t } = useLocale()
  const { visitorTnas, acceptBindingRequest } = useTNAContext()

  const pendingRequests = visitorTnas.filter(item => item.status === 'PENDING_OWNER_APPROVAL')

  const handleAccept = (id: string) => {
    acceptBindingRequest(id)
    alert(t('owner.bindings.success_message'))
  }

  const columns: DataTableColumn<any>[] = [
    { key: 'visitorName', label: t('owner.bindings.visitor_name'), width: '40%' },
    { key: 'status', label: t('owner.bindings.status'), width: '30%' },
    { 
      key: 'id', 
      label: t('owner.bindings.actions'), 
      width: '30%',
      render: (id: string) => (
        <div className="flex gap-2">
            <Button 
                onClick={() => handleAccept(id)}
                className="bg-[linear-gradient(135deg,#02488D,#00B4C9)] text-white px-4 py-2 rounded-md shadow-sm"
            >
                {t('owner.bindings.accept')}
            </Button>
            <Button variant="outline" className="text-gray-600 px-4 py-2 rounded-md shadow-sm">{t('owner.bindings.reject')}</Button>
        </div>
      )
    },
  ]

  return (
    <div className="font-rubik">
      <DataTableLayout
        title={t('owner.bindings.title')}
        columns={columns}
        data={pendingRequests}
      />
    </div>
  )
}
