'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter } from 'next/navigation'
import { 
    ShieldCheck, 
    ArrowRight,
    User,
    Calendar,
    Globe,
    CheckCircle,
    XCircle,
    Clock,
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockGovQueue } from '@/lib/mock/gov.mock'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useTranslation } from 'react-i18next';

export default function GovTNAQueuePage() {
    const router = useRouter();
    /* TODO: review isRTL usage */ /* TODO: review isRTL usage */ const {  locale, isRTL , t } = useLocale();
    const { data: queue, isLoading } = useMock(mockGovQueue);

    const pendingRequests = queue?.filter(q => q.status === 'PENDING_REVIEW') || [];

    const columns: DataTableColumn<any>[] = [
        {
            key: 'visitor_name',
            label: t('gov.applicant_17'),
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
            key: 'nationality',
            label: t('gov.nationality_18'),
            width: '20%',
            render: (val) => (
                <span className="text-xs font-medium text-neutral-600">{val}</span>
            )
        },
        {
            key: 'mode',
            label: t('gov.mode_19'),
            width: '15%',
            render: (val) => (
                <span className={cn(
                    "px-2 py-1 text-[10px] font-black rounded uppercase border",
                    val === 'MODERATED' ? "bg-warning/10 text-warning border-warning/10" : "bg-primary/10 text-primary border-primary/10"
                )}>
                    {val === 'MODERATED' ? (t('gov.moderated_20')) : (t('gov.autonomous_21'))}
                </span>
            )
        },
        {
            key: 'submitted_at',
            label: t('gov.submitted_at_22'),
            width: '20%',
            render: (val) => (
                <div className="flex items-center gap-2 text-neutral-500">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">{new Date(val).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            key: 'request_id',
            label: '',
            width: '15%',
            render: (id) => (
                <div className="flex justify-end">
                    <Button 
                        onClick={() => router.push(`/${locale}/gov/tna-queue/${id}`)}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 border-neutral-200"
                    >
                        {t('gov.review_23')}
                        <ArrowRight size={16} className={isRTL ? "rotate-180" : ""} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov" header={t('gov.tna_issuance_queue_24')}>
            <DataTableLayout
                title={t('gov.pending_tna_requests_25')}
                columns={columns}
                data={pendingRequests}
                isLoading={isLoading}
                onRowClick={(row) => router.push(`/${locale}/gov/tna-queue/${row.request_id}`)}
            />
        </AppShell>
    );
}