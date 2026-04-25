'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useBindingContext } from '@/context/BindingContext'
import { useRouter, useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { TNA } from '@/lib/types/tna'
import { Eye } from '@phosphor-icons/react'

export default function VisitorTnasPage() {
  const { visitorTnas } = useBindingContext();
  const router = useRouter();
  const { locale } = useParams();

  const columns: DataTableColumn<TNA>[] = [
    { 
      key: 'tna_code', 
      label: 'كود العنوان', 
      width: '30%',
      render: (val) => <span className="font-mono font-bold text-primary">{val}</span>
    },
    { 
        key: 'status', 
        label: 'الحالة', 
        width: '20%',
        render: (val) => {
            const isSuccess = val === 'ACTIVE';
            return (
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isSuccess ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
                }`}>
                    {val === 'ACTIVE' ? 'نشط' : 'قيد المراجعة'}
                </span>
            )
        }
    },
    { 
        key: 'issued_at', 
        label: 'تاريخ الربط', 
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
                عرض التفاصيل
            </Button>
        </div>
      )
    },
  ]

  return (
    <AppShell role="Visitor" header="عناويني الوطنية">
      <DataTableLayout
        title="قائمة العناوين المرتبطة"
        columns={columns}
        data={visitorTnas}
        onRowClick={(row) => router.push(`/${locale}/visitor/tnas/${row.tna_id}`)}
      />
    </AppShell>
  )
}
