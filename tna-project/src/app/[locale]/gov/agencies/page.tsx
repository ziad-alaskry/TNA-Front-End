'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Users, 
    UserPlus, 
    ShieldCheck, 
    UserGear, 
    Trash, 
    ArrowRight,
    DotsThreeVertical,
    IdentificationCard
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'

interface GovStaff {
    id: string;
    name: string;
    department: string;
    permissions: string[];
    last_active: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export default function GovAgenciesPage() {
    const { t } = useLocale();

    const mockStaff: GovStaff[] = [
        { id: 'STF-501', name: t('gov.agencies.mock_name_1'), department: t('gov.agencies.mock_dept_1'), permissions: ['VERIFY', 'AUDIT'], last_active: t('gov.agencies.mock_time_1'), status: 'ACTIVE' },
        { id: 'STF-442', name: t('gov.agencies.mock_name_2'), department: t('gov.agencies.mock_dept_2'), permissions: ['MANAGE_POLICY', 'AUDIT'], last_active: t('gov.agencies.mock_time_2'), status: 'ACTIVE' },
        { id: 'STF-330', name: t('gov.agencies.mock_name_3'), department: t('gov.agencies.mock_dept_3'), permissions: ['READ_ONLY'], last_active: t('gov.agencies.mock_time_3'), status: 'INACTIVE' },
    ];
    const columns: DataTableColumn<GovStaff>[] = [
        {
            key: 'name',
            label: t('gov.agencies.staff_member'),
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <UserGear size={20} weight="fill" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{val}</span>
                        <span className="text-[10px] text-neutral-400">ID: {row.id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'department',
            label: t('gov.agencies.department'),
            render: (val) => <span className="text-xs font-semibold text-neutral-700">{val}</span>
        },
        {
            key: 'permissions',
            label: t('gov.agencies.granted_permissions'),
            render: (val) => (
                <div className="flex flex-wrap gap-1">
                    {(val as string[]).map((p, i) => (
                        <span key={i} className={`px-1.5 py-0.5 bg-primary/5 text-primary text-[8px] font-bold rounded border border-primary/10 tracking-widest`}>{p}</span>
                    ))}
                </div>
            )
        },
        {
            key: 'status',
            label: t('gov.agencies.account_status'),
            render: (val) => (
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        val === 'ACTIVE' ? 'bg-success-bg text-success' : 'bg-neutral-200 text-neutral-500'
                    }`}>
                        {val === 'ACTIVE' ? t('gov.agencies.active') : t('gov.agencies.inactive')}
                    </span>
                    {val === 'ACTIVE' && <ShieldCheck size={14} weight="fill" className="text-success" />}
                </div>
            )
        },
        {
            key: 'last_active',
            label: t('gov.agencies.last_active'),
            render: (val) => <span className="text-xs text-neutral-500">{val}</span>
        },
        {
            key: 'id',
            label: '',
            render: () => (
                <div className="flex justify-end gap-1">
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                        <UserGear size={18} />
                    </button>
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                        <ArrowRight size={18} className="rotate-180" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov" header={t('gov.agencies.header')}>
            <DataTableLayout
                title={t('gov.agencies.title')}
                columns={columns}
                data={mockStaff}
            >
                <button className="h-11 px-6 rounded-sm bg-primary text-white font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-btn">
                    <UserPlus size={20} weight="bold" />
                    {t('gov.agencies.add_admin')}
                </button>
            </DataTableLayout>
        </AppShell>
    );
}
