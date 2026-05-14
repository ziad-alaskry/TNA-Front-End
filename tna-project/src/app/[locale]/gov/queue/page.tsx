'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter, useParams } from 'next/navigation'
import { 
    ShieldCheck, 
    ArrowRight,
    IdentificationCard,
    User,
    Calendar,
    Globe
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockGovQueue } from '@/lib/mock/gov.mock'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useTranslation } from 'react-i18next';

export default function GovQueuePage() {
    const router = useRouter();
    const {  locale, isRTL , t } = useLocale();
    const { data: queue, isLoading } = useMock(mockGovQueue);

    const columns: DataTableColumn<any>[] = [
        {
            key: 'visitor_name',
            label: t('gov.applicant_26'),
            width: '30%',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <User size={20} weight="duotone" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900 line-clamp-1">{val}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{row.nationality}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'mode',
            label: t('gov.policy_mode_27'),
            width: '20%',
            render: (val) => (
                <span className="px-2 py-1 bg-primary/5 text-primary text-[10px] font-black rounded uppercase border border-primary/10">
                    {val}
                </span>
            )
        },
        {
            key: 'submitted_at',
            label: t('gov.submitted_at_28'),
            width: '20%',
            render: (val) => (
                <div className="flex items-center gap-2 text-neutral-500">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">{new Date(val).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: t('gov.status_29'),
            width: '15%',
            render: (val) => (
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                    val === 'PENDING_REVIEW' ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                )}>
                    {val.replace('_', ' ')}
                </span>
            )
        },
        {
            key: 'request_id',
            label: '',
            width: '15%',
            render: (id) => (
                <div className="flex justify-end">
                    <Button 
                        onClick={() => router.push(`/${locale}/gov/queue/${id}`)}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 border-neutral-200"
                    >
                        {t('gov.review_30')}
                        <ArrowRight size={16} className={cn(isRTL && "rotate-180")} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov">
            <DataTableLayout
                title="Pending TNA Requests"
                columns={columns}
                data={queue || []}
                isLoading={isLoading}
                onRowClick={(row) => router.push(`/${locale}/gov/queue/${row.request_id}`)}
            />
        </AppShell>
    );
}
