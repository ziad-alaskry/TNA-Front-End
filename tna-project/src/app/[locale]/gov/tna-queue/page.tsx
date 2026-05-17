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

export default function GovTNAQueuePage() {
    const router = useRouter();
    const {  locale, isRTL , t } = useLocale();
    const { data: queue, isLoading } = useMock(mockGovQueue);

    const pendingRequests = queue?.filter(q => q.status === 'PENDING_REVIEW') || [];
    const getRequestText = (id: string, field: 'visitor_name' | 'nationality', fallback: string) => {
        const key = `gov.mock.tna_requests.${id}.${field}`;
        const translated = t(key);
        return translated === key ? fallback : translated;
    };

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
                        <span className="font-bold text-neutral-900 line-clamp-1">{getRequestText(row.request_id, 'visitor_name', val)}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{getRequestText(row.request_id, 'nationality', row.nationality)}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'nationality',
            label: t('gov.nationality_18'),
            width: '20%',
            render: (val, row) => (
                <span className="text-xs font-medium text-neutral-600">{getRequestText(row.request_id, 'nationality', val)}</span>
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
                    <span className="text-xs font-medium">{new Date(val).toLocaleDateString(locale)}</span>
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
                        className="h-9 px-4 border-neutral-200 gap-2"
                    >
                        {t('gov.review_23')}
                        <ArrowRight size={16} className={cn(isRTL && "rotate-180")} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov">
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
