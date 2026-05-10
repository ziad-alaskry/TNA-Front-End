'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter } from 'next/navigation'
import { 
    MapPin,
    ShieldCheck,
    ArrowRight,
    User,
    Calendar,
    Clock,
    CheckCircle,
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockSubAddressQueue } from '@/lib/mock/gov.mock'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'

export default function GovAddressQueuePage() {
    const router = useRouter();
    const { locale, isRTL } = useLocale();
    const { data: queue, isLoading } = useMock(mockSubAddressQueue);

    const columns: DataTableColumn<any>[] = [
        {
            key: 'owner_name',
            label: isRTL ? 'المالك' : 'Owner',
            width: '25%',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <User size={20} weight="duotone" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900 line-clamp-1">{val}</span>
                        <span className="text-[10px] text-neutral-400">{row.owner_type === 'INDIVIDUAL' ? (isRTL ? 'فردي' : 'Individual') : (isRTL ? 'شركة' : 'Business')}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'full_address',
            label: isRTL ? 'العنوان الكامل' : 'Full Address',
            width: '35%',
            render: (val) => (
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <MapPin size={14} className="shrink-0" />
                    <span className="line-clamp-1">{val}</span>
                </div>
            )
        },
        {
            key: 'suffix_code',
            label: isRTL ? 'اللاحقة' : 'Suffix',
            width: '10%',
            render: (val, row) => (
                <span className="font-mono font-bold text-primary">{val} - {row.label}</span>
            )
        },
        {
            key: 'submitted_at',
            label: isRTL ? 'تاريخ التقديم' : 'Submitted At',
            width: '15%',
            render: (val) => (
                <div className="flex items-center gap-2 text-neutral-500">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">{new Date(val).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            key: 'sub_address_id',
            label: '',
            width: '15%',
            render: (id) => (
                <div className="flex justify-end">
                    <Button 
                        onClick={() => router.push(`/${locale}/gov/address-queue/${id}`)}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 border-neutral-200"
                    >
                        {isRTL ? 'مراجعة' : 'Review'}
                        <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov" header={isRTL ? 'طابور التحقق من العناوين' : 'Sub-Address Verification Queue'}>
            <DataTableLayout
                title={isRTL ? 'طلبات التحقق المعلّقة' : 'Pending Verification Requests'}
                columns={columns}
                data={queue || []}
                isLoading={isLoading}
                onRowClick={(row) => router.push(`/${locale}/gov/address-queue/${row.sub_address_id}`)}
            />
        </AppShell>
    );
}