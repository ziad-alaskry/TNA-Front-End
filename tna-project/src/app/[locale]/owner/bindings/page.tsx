'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    User, 
    Building,
    ArrowRight,
    Handshake,
    IdentificationCard
} from '@phosphor-icons/react'
import { useBindingContext } from '@/context/BindingContext'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'

interface BindingRequest {
    id: string;
    visitor_name: string;
    property_name: string;
    start_date: string;
    duration: string;
    fee: number;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED';
}

export default function OwnerBindingsPage() {
    const { acceptBindingRequest } = useBindingContext();
    const router = useRouter();
    const { locale } = useParams();
    const { t } = useLocale();

    const mockRequests: BindingRequest[] = [
        {
            id: 'BND-771',
            visitor_name: t('owner.bindings.mock_visitor_1'),
            property_name: t('owner.bindings.mock_property_1'),
            start_date: '2025/11/20',
            duration: t('owner.bindings.mock_duration_1'),
            fee: 135.00,
            status: 'PENDING'
        },
        {
            id: 'BND-650',
            visitor_name: t('owner.bindings.mock_visitor_2'),
            property_name: t('owner.bindings.mock_property_2'),
            start_date: '2025/11/15',
            duration: t('owner.bindings.mock_duration_2'),
            fee: 50.00,
            status: 'ACTIVE'
        }
    ];

    const columns: DataTableColumn<BindingRequest>[] = [
        {
            key: 'visitor_name',
            label: t('owner.bindings.visitor_beneficiary'),
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={18} weight="bold" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{val}</span>
                        <span className="text-[10px] text-neutral-400">{row.id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'property_name',
            label: t('owner.bindings.target_property'),
            render: (val) => (
                <div className="flex items-center gap-2">
                    <Building size={16} className="text-neutral-400" />
                    <span className="text-sm font-semibold text-neutral-700">{val}</span>
                </div>
            )
        },
        {
            key: 'fee',
            label: t('owner.bindings.expected_fees'),
            render: (val) => <span className="font-bold text-primary">{val.toFixed(2)} SAR</span>
        },
        {
            key: 'status',
            label: t('common.status'),
            render: (val) => {
                const configs: Record<BindingRequest['status'], { label: string; class: string; icon: React.ReactNode }> = {
                    PENDING: { label: t('owner.bindings.status_pending'), class: 'bg-warning-bg text-warning', icon: <Clock size={14} /> },
                    ACTIVE: { label: t('owner.bindings.status_active'), class: 'bg-success-bg text-success', icon: <CheckCircle size={14} /> },
                    REJECTED: { label: t('owner.bindings.status_rejected'), class: 'bg-error-bg text-error', icon: <XCircle size={14} /> },
                };
                const config = configs[val as BindingRequest['status']];
                return (
                    <div className={`flex items-center gap-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${config.class}`}>
                        {config.icon}
                        {config.label}
                    </div>
                )
            }
        },
        {
            key: 'id',
            label: t('owner.bindings.actions'),
            render: (id, row) => (
                <div className="flex gap-2">
                    {row.status === 'PENDING' ? (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); acceptBindingRequest(id, row.fee); }}
                                className="h-8 px-4 bg-success text-white text-[10px] font-bold rounded-sm hover:opacity-90 transition-opacity"
                            >
                                {t('owner.bindings.accept')}
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); console.log('Rejected', id); }}
                                className="h-8 px-4 bg-neutral-100 text-neutral-600 text-[10px] font-bold rounded-sm hover:bg-neutral-200 transition-colors"
                            >
                                {t('owner.bindings.reject')}
                            </button>
                        </>
                    ) : (
                        <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                            <ArrowRight size={18} className="rotate-180" />
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <AppShell role="Owner" header={t('owner.bindings.header')}>
            <DataTableLayout
                title={t('owner.bindings.title')}
                columns={columns}
                data={mockRequests}
                onRowClick={(row) => console.log('Viewing binding details:', row.id)}
            >
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-md border border-primary/10">
                    <Handshake size={24} weight="fill" className="text-primary" />
                    <div>
                        <p className="text-xs font-bold text-neutral-900">{t('owner.bindings.auto_bind_policy')}</p>
                        <p className="text-[10px] text-neutral-500">{t('owner.bindings.auto_bind_policy_desc')}</p>
                    </div>
                </div>
            </DataTableLayout>
        </AppShell>
    );
}
