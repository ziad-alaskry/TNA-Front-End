'use client'

import React, { useState, useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter, useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { TNA } from '@/lib/types/tna'
import { Eye, Plus, Funnel } from '@phosphor-icons/react'
import { mockTNAs } from '@/lib/mock/tnas.mock'
import { useMock } from '@/lib/hooks/useMock'
import { useLocale } from '@/i18n/LocaleProvider'

export default function VisitorTnasPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { t, isRTL } = useLocale();

  const { data: tnas, isLoading } = useMock(mockTNAs);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTnas = useMemo(() => {
    if (!tnas) return []
    if (statusFilter === 'ALL') return tnas
    return tnas.filter(tna => tna.status === statusFilter)
  }, [tnas, statusFilter]);

  const columns: DataTableColumn<TNA>[] = [
    { 
      key: 'tna_code', 
      label: isRTL ? 'كود TNA' : 'TNA Code', 
      width: '30%',
      render: (val) => <span className="font-mono font-bold text-primary">{val}</span>
    },
    { 
        key: 'status', 
        label: isRTL ? 'الحالة' : 'Status', 
        width: '20%',
        render: (val) => {
            const isSuccess = val === 'ACTIVE';
            return (
                <span className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                  isSuccess ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                )}>
                    {val}
                </span>
            )
        }
    },
    { 
        key: 'issued_at', 
        label: isRTL ? 'تاريخ الإصدار' : 'Issued At', 
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
                {isRTL ? 'عرض التفاصيل' : 'View Details'}
            </Button>
        </div>
      )
    },
  ]

  const filterOptions = [
    { value: 'ALL', label: isRTL ? 'الكل' : 'All' },
    { value: 'ACTIVE', label: isRTL ? 'نشط' : 'Active' },
    { value: 'UNLINKED', label: isRTL ? 'غير مرتبط' : 'Unlinked' },
    { value: 'EXPIRED', label: isRTL ? 'منتهي' : 'Expired' },
  ]

  return (
    <AppShell role="Visitor" header={isRTL ? 'عناويني الوطنية' : 'My TNAs'}>
      <div className="space-y-6">
        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <Funnel size={20} className="text-neutral-400" />
          <div className="flex gap-2">
            {filterOptions.map(opt => (
              <Button
                key={opt.value}
                size="sm"
                variant={statusFilter === opt.value ? "primary" : "outline"}
                onClick={() => setStatusFilter(opt.value)}
                className="px-4"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <DataTableLayout
          title={isRTL ? 'قائمة رموز TNA' : 'List of TNA Codes'}
          columns={columns}
          data={filteredTnas || []}
          isLoading={isLoading}
          onRowClick={(row) => router.push(`/${locale}/visitor/tnas/${row.tna_id}`)}
          actions={
              <Button 
                  onClick={() => router.push(`/${locale}/visitor/tna/new`)}
                  className="shadow-glow-primary"
              >
                  <Plus size={20} weight="bold" />
                  {isRTL ? 'طلب TNA جديد' : 'Request New TNA'}
              </Button>
          }
          emptyState={{
            title: isRTL ? 'لا يوجد رموز TNA' : 'No TNA Codes Found',
            description: isRTL ? 'ابدأ بطلب أول عنوان وطني مؤقت لك الآن.' : 'Start by requesting your first temporary national address.',
            cta: isRTL ? 'طلب TNA جديد' : 'Request New TNA',
            onCtaClick: () => router.push(`/${locale}/visitor/tna/new`)
          }}
        />
      </div>
    </AppShell>
  )
}

// Utility to merge classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
