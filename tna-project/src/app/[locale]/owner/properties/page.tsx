'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter, useParams } from 'next/navigation'
import { 
    Buildings, 
    MapPin, 
    PlusCircle, 
    CheckCircle, 
    ArrowRight,
    Info,
    MagnifyingGlass
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockProperties } from '@/lib/mock/properties.mock'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function OwnerPropertiesPage() {
    const router = useRouter();
    const { locale } = useParams();
    const { t, isRTL } = useLocale();

    const { data: properties, isLoading } = useMock(mockProperties);

    const columns: DataTableColumn<any>[] = [
        {
            key: 'full_address',
            label: isRTL ? 'العقار' : 'Property',
            width: '40%',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Buildings size={24} weight="duotone" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900 line-clamp-1">{val}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">ID: {row.na_id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'city',
            label: isRTL ? 'المدينة' : 'Location',
            width: '20%',
            render: (val, row) => (
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-700">{val}</span>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">{row.district}</span>
                </div>
            )
        },
        {
            key: 'ownership_proof_status',
            label: isRTL ? 'حالة التوثيق' : 'Status',
            width: '20%',
            render: (val) => {
                const isVerified = val === 'VERIFIED';
                return (
                    <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                          isVerified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        )}>
                            {val}
                        </span>
                    </div>
                )
            }
        },
        {
            key: 'na_id',
            label: '',
            width: '20%',
            render: (id) => (
                <div className="flex justify-end">
                    <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/${locale}/owner/properties/${id}`);
                        }}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 gap-2 border-neutral-200"
                    >
                        {isRTL ? 'التفاصيل' : 'Details'}
                        <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Owner" header={isRTL ? 'إدارة العقارات' : 'Property Management'}>
            <DataTableLayout
                title={isRTL ? 'قائمة العقارات' : 'Property Portfolio'}
                columns={columns}
                data={properties || []}
                isLoading={isLoading}
                onRowClick={(row) => router.push(`/${locale}/owner/properties/${row.na_id}`)}
                actions={
                    <Button 
                        onClick={() => router.push(`/${locale}/owner/properties/new`)}
                        className="shadow-glow-primary px-6"
                    >
                        <PlusCircle size={20} weight="bold" />
                        {isRTL ? 'إضافة عقار' : 'Add Property'}
                    </Button>
                }
                emptyState={{
                  title: 'No Properties Found',
                  description: 'Start by listing your first property to receive binding requests.',
                  cta: 'Register Property',
                  onCtaClick: () => router.push(`/${locale}/owner/properties/new`)
                }}
            />
        </AppShell>
    );
}
