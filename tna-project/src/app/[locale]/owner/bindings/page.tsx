'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter } from 'next/navigation'
import { 
    Link as LinkIcon, 
    CheckCircle, 
    XCircle, 
    Clock,
    User,
    Calendar
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockBindings } from '@/lib/mock/bindings.mock'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useTranslation } from 'react-i18next';

const t = (key: string, params?: Record<string, string>): string => {
    const translations: Record<string, string> = {
        'approve': 'Approve',
        'reject': 'Reject',
        'terminate': 'Terminate',
        'viewDetails': 'View Details',
        'all': 'All',
        'pending': 'Pending',
        'active': 'Active',
        'completed': 'Completed',
        'terminated': 'Terminated',
        'noBindings': 'No bindings found',
        'noBindingsDescription': 'You have no binding requests at the moment.',
        'noBindingsWithFilter': 'No {{status}} bindings found',
        'noBindingsWithFilterDescription': 'There are no bindings with {{status}} status.',
        'addProperty': 'Add Property'
    };
    
    let translation = translations[key] || key;
    
    if (params) {
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{{${param}}}`, params[param]);
        });
    }
    
    return translation;
};

export default function OwnerBindingsPage() {
    const router = useRouter();
    /* TODO: review isRTL usage */ /* TODO: review isRTL usage */ /* TODO: review isRTL usage */ const {  locale, isRTL , t } = useLocale();
    const [filter, setFilter] = useState<'all' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED'>('all');
    const { data: bindings, isLoading } = useMock(mockBindings);

    const filteredBindings = filter === 'all' 
        ? bindings 
        : bindings?.filter(b => b.status === filter) || [];

    const columns: DataTableColumn<any>[] = [
        {
            key: 'tna_code',
            label: t('owner.tna_code_47'),
            width: '20%',
            render: (val) => <span className="font-mono font-bold text-primary">{val}</span>
        },
        {
            key: 'sub_address_label',
            label: t('owner.unit_48'),
            width: '20%',
            render: (val) => <span className="font-bold text-neutral-900">{val}</span>
        },
        {
            key: 'period',
            label: t('owner.period_49'),
            width: '20%',
            render: (row) => {
                const start = new Date(row.start_at);
                const end = new Date(row.end_at);
                const formattedStart = start.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
                const formattedEnd = end.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
                return `${formattedStart} - ${formattedEnd}`;
            }
        },
        {
            key: 'net_owner_amount',
            label: t('owner.net_owner_amount_50'),
            width: '15%',
            render: (val) => <span className="font-bold text-neutral-900">{val} SAR</span>
        },
        {
            key: 'status',
            label: t('owner.status_51'),
            width: '15%',
            render: (val) => (
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                    val === 'ACTIVE' ? "bg-success/10 text-success" : 
                    val === 'PENDING' ? "bg-warning/10 text-warning" :
                    val === 'COMPLETED' ? "bg-info/10 text-info" :
                    val === 'TERMINATED' ? "bg-error/10 text-error" :
                    val === 'CANCELLED' ? "bg-neutral-100 text-neutral-500" :
                    "bg-neutral-100 text-neutral-400"
                )}>
                    {val}
                </span>
            )
        },
        {
            key: 'actions',
            label: t('owner.actions_52'),
            width: '15%',
            render: (id, row) => (
                <div className="flex gap-2 justify-end">
                    {row.status === 'PENDING' ? (
                        <>
                            <Button 
                                size="sm" 
                                className="h-8 px-3 text-[10px] bg-success/10 text-success hover:bg-success/20"
                                onClick={() => {
                                    console.log('Approve binding:', id);
                                }}
                            >
                                {t('approve')}
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-3 text-[10px] border-neutral-200"
                                onClick={() => {
                                    console.log('Reject binding:', id);
                                }}
                            >
                                {t('reject')}
                            </Button>
                        </>
                    ) : row.status === 'ACTIVE' ? (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-3 text-[10px] border-error/20 text-error hover:bg-error/10"
                            onClick={() => {
                                console.log('Terminate binding:', id);
                            }}
                        >
                            {t('terminate')}
                        </Button>
                    ) : (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3 text-[10px] border-neutral-200"
                            onClick={() => {
                                router.push(`/[locale]/owner/bindings/${id}`);
                            }}
                        >
                            {t('viewDetails')}
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <AppShell role="Owner" header={t('owner.linking_requests_53')}>
            <div className="mt-6 flex flex-wrap gap-3">
                {[ 'all', 'PENDING', 'ACTIVE', 'COMPLETED', 'TERMINATED' ].map((status) => (
                    <Button
                        key={status}
                        className={`px-4 py-2 text-sm ${filter === status ? 
                            'bg-primary/10 text-primary border-primary' : 
                            'bg-neutral-50 text-neutral-600 border-neutral-200'}`}
                        onClick={() => setFilter(status as any)}
                    >
                        {status === 'all' ? t('all') : 
                         status === 'PENDING' ? t('pending') :
                         status === 'ACTIVE' ? t('active') :
                         status === 'COMPLETED' ? t('completed') :
                         t('terminated')}
                    </Button>
                ))}
            </div>
            
            <DataTableLayout
                title="Property Bindings"
                columns={columns}
                data={filteredBindings || []}
                isLoading={isLoading}
                emptyState={{
                    title: filter === 'all' ? t('noBindings') : t('noBindingsWithFilter', { status: filter }),
                    description: filter === 'all' 
                        ? t('noBindingsDescription') 
                        : t('noBindingsWithFilterDescription', { status: filter }),
                    cta: filter === 'all' ? t('addProperty') : undefined,
                    onCtaClick: filter === 'all' ? () => router.push('/[locale]/owner/properties/new') : undefined
                }}
            />
        </AppShell>
    );
}