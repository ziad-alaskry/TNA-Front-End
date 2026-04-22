'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useTNAContext } from '@/context/TNAContext'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

const t = (key: string) => key;

export default function VisitorTnasPage() {
  const { tnaData } = useTNAContext();
  const router = useRouter();

  const columns: DataTableColumn<any>[] = [
    { 
      key: 'tna_code', 
      label: t('tnaCode'), 
      width: '25%',
      render: (val) => <span className="font-mono">{val}</span> // JetBrains Mono requirement
    },
    { key: 'status', label: t('status'), width: '25%' },
    { key: 'created_at', label: t('createdAt'), width: '25%' },
    { 
      key: 'tna_id', 
      label: t('actions'), 
      width: '25%', 
      render: (id) => (
        <Button 
          onClick={() => router.push(`/visitor/tna/detail?id=${id}`)}
          className="bg-[linear-gradient(135deg,#02488D,#00B4C9)] text-white px-4 py-2" // Navy-to-Cyan gradient
        >
          {t('viewDetail')}
        </Button>
      )
    },
  ]

  return (
    <AppShell role="Visitor" header={<h1 className="text-xl font-bold">{t('myTnaCodes')}</h1>}>
      <DataTableLayout
        title={t('myTnaCodes')}
        columns={columns}
        data={tnaData}
      />
    </AppShell>
  )
}
