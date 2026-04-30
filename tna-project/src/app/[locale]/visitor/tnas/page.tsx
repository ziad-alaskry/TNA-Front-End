'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useBindingContext } from '@/context/BindingContext'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import Button from '@/components/ui/Button'
import { TNA } from '@/lib/types/tna'
import { Eye, Plus } from '@phosphor-icons/react'

export default function VisitorTnasPage() {
  const { visitorTnas } = useBindingContext();
  const router = useRouter();
  const { locale, t } = useLocale();

  const columns: DataTableColumn<TNA>[] = [
    { 
      key: 'tna_code', 
      label: t('visitor.tnas.code'), 
      width: '30%',
      render: (val) => <span className="font-mono font-bold text-primary">{val}</span>
    },
    { 
        key: 'status', 
        label: t('visitor.tnas.status'), 
        width: '20%',
        render: (val) => {
            const isSuccess = val === 'ACTIVE';
            return (
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isSuccess ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
                }`}>
                    {val === 'ACTIVE' ? t('common.statuses.ACTIVE') : t('common.statuses.PENDING')}
                </span>
            )
        }
    },
    { 
        key: 'issued_at', 
        label: t('visitor.tnas.link_date'), 
        width: '25%',
        render: (val) => <span className="text-xs text-neutral-500 font-medium">{val ? new Date(val).toLocaleDateString() : '---'}</span>
    },
    { 
      key: 'tna_id', 
      label: '', 
      width: '25%', 
      render: (id) => (
        <div className="flex justify-end">
            <Button 
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/${locale}/visitor/tnas/${id}`);
                }}
                size="sm"
                variant="outline"
                className="gap-2 h-9"
            >
                <Eye size={16} />
                {t('visitor.tnas.view_details')}
            </Button>
        </div>
      )
    },
  ]

  return (
    <AppShell role="Visitor" header={t('visitor.tnas.header')}>
      <DataTableLayout
        title={t('visitor.tnas.list_title')}
        columns={columns}
        data={visitorTnas}
        onRowClick={(row) => router.push(`/${locale}/visitor/tnas/${row.tna_id}`)}
        actions={
            <Button 
                onClick={() => router.push(`/${locale}/visitor/request`)}
                className="ui-gradient-primary text-white h-10 px-4 rounded-md font-bold flex items-center gap-2 border-none shadow-glow-primary hover:opacity-90 transition-opacity"
            >
                <Plus size={20} weight="bold" className="text-white" />
                طلب كود TNA جديد
            </Button>
        }
      />
    </AppShell>
  )
}
