'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockBindings } from '@/lib/mock/bindings.mock'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function OwnerBindingsPage() {
    const router = useRouter();
    const { locale, t } = useLocale();
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
            render: (val, row) => {
                const labelKey = `owner.bindings_page.units.${row.sub_address_id}`;
                const translated = t(labelKey);
                return <span className="font-bold text-neutral-900">{translated === labelKey ? val : translated}</span>;
            }
        },
        {
            key: 'binding_id',
            label: t('owner.period_49'),
            width: '20%',
            render: (_, row) => {
                if (!row || !row.start_at || !row.end_at) return null;
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
            render: (val) => <span className="font-bold text-neutral-900">{val} {t('common.currency')}</span>
        },
        {
            key: 'status',
            label: t('owner.status_51'),
            width: '15%',
            render: (val) => (
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black tracking-widest",
                    val === 'ACTIVE' ? "bg-success/10 text-success" : 
                    val === 'PENDING' ? "bg-warning/10 text-warning" :
                    val === 'COMPLETED' ? "bg-info/10 text-info" :
                    val === 'TERMINATED' ? "bg-error/10 text-error" :
                    val === 'CANCELLED' ? "bg-neutral-100 text-neutral-500" :
                    "bg-neutral-100 text-neutral-400"
                )}>
                    {t(`owner.bindings_page.statuses.${val}`)}
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
                                className="h-8 px-4 text-[10px]"
                                onClick={() => {
                                    console.log('Approve binding:', id);
                            }}
                        >
                            {t('owner.bindings_page.actions.approve')}
                        </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 px-4 text-[10px] border-neutral-200"
                                onClick={() => {
                                    console.log('Reject binding:', id);
                            }}
                        >
                            {t('owner.bindings_page.actions.reject')}
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
                            {t('owner.bindings_page.actions.terminate')}
                        </Button>
                    ) : (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-3 text-[10px] border-neutral-200"
                            onClick={() => {
                                router.push(`/${locale}/owner/bindings/${id}`);
                            }}
                        >
                            {t('owner.bindings_page.actions.view_details')}
                        </Button>
                    )}
                </div>
            )
        }
    ];

    const filterLabel = (status: typeof filter) => (
        status === 'all' ? t('owner.bindings_page.filters.all') : t(`owner.bindings_page.statuses.${status}`)
    );

    return (
        <AppShell role="Owner" header={t('owner.bindings_page.header')}>
            <div className="mt-6 flex flex-wrap gap-3">
                {[ 'all', 'PENDING', 'ACTIVE', 'COMPLETED', 'TERMINATED' ].map((status) => (
                    <Button
                        key={status}
                        className={`px-4 py-2 text-sm ${filter === status ? 
                            'bg-primary/10 text-primary border-primary' : 
                            'bg-neutral-50 text-neutral-600 border-neutral-200'}`}
                        onClick={() => setFilter(status as any)}
                    >
                        {filterLabel(status as typeof filter)}
                    </Button>
                ))}
            </div>
            
            <DataTableLayout
                title={t('owner.bindings_page.title')}
                columns={columns}
                data={filteredBindings || []}
                isLoading={isLoading}
                emptyState={{
                    title: filter === 'all'
                        ? t('owner.bindings_page.empty.no_bindings')
                        : t('owner.bindings_page.empty.no_bindings_with_filter', { status: filterLabel(filter) }),
                    description: filter === 'all' 
                        ? t('owner.bindings_page.empty.no_bindings_description')
                        : t('owner.bindings_page.empty.no_bindings_with_filter_description', { status: filterLabel(filter) }),
                    cta: filter === 'all' ? t('owner.bindings_page.empty.add_property') : undefined,
                    onCtaClick: filter === 'all' ? () => router.push(`/${locale}/owner/properties/new`) : undefined
                }}
            />
        </AppShell>
    );
}
