'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useBindingContext } from '@/context/BindingContext'
import { useRouter, useParams } from 'next/navigation'
import { 
    House, 
    PlusCircle, 
    CheckCircle, 
    ArrowRight
} from '@phosphor-icons/react'
import { Property } from '@/lib/types'
import { cn } from '@/lib/utils/cn'
import { useLocale } from '@/i18n/LocaleProvider'

export default function OwnerPropertiesPage() {
    const { realEstateObjects, toggleAutoAccept } = useBindingContext();
    const router = useRouter();
    const { locale } = useParams();
    const { t } = useLocale();

    const columns: DataTableColumn<Property>[] = [
        {
            key: 'name',
            label: t('owner.properties.property_name'),
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <House size={20} weight="duotone" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{val}</span>
                        <span className="text-[10px] text-neutral-400">ID: {row.id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'building_number',
            label: t('owner.properties.location'),
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-neutral-700">{t('owner.properties.building_number_val').replace('{val}', String(val))}</span>
                    <span className="text-[10px] text-neutral-500">{t('owner.properties.sector_val').replace('{sector}', String(row.sector_id || '01'))}</span>
                </div>
            )
        },
        {
            key: 'is_verified',
            label: t('owner.properties.verification_status'),
            render: (val) => {
                const isVerified = val === true || val === 'VERIFIED';
                return (
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isVerified ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
                        }`}>
                            {isVerified ? t('owner.properties.verified') : t('owner.properties.pending')}
                        </span>
                        {isVerified && <CheckCircle size={14} weight="fill" className="text-success" />}
                    </div>
                )
            }
        },
        {
            key: 'auto_accept',
            label: 'القبول التلقائي',
            render: (val, row) => (
                <button 
                    onClick={(e) => { e.stopPropagation(); toggleAutoAccept(row.id); }}
                    className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        val ? "bg-primary" : "bg-neutral-200"
                    )}
                >
                    <span className={cn(
                        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                        val ? "translate-x-4" : "translate-x-1"
                    )} />
                </button>
            )
        },
        {
            key: 'id',
            label: t('owner.properties.bindings'),
            render: () => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900">{t('owner.properties.active_bindings_mock')}</span>
                    <span className="text-[9px] text-neutral-400">{t('owner.properties.available_bindings_mock')}</span>
                </div>
            )
        },
        {
            key: 'id',
            label: '',
            render: (id) => (
                <div className="flex justify-end">
                    <button 
                        onClick={() => router.push(`/${locale}/owner/property/detail?id=${id}`)}
                        className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400 transition-colors"
                    >
                        <ArrowRight size={18} className="rotate-180" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Owner" header={t('owner.properties.header')}>
            <DataTableLayout
                title={t('owner.properties.title')}
                columns={columns}
                data={realEstateObjects}
                onRowClick={(row) => router.push(`/${locale}/owner/property/detail?id=${row.id}`)}
                actions={
                    <button 
                        onClick={() => router.push(`/${locale}/owner/property/add`)}
                        className="h-11 px-6 rounded-md ui-gradient-primary text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-glow-primary border-none"
                    >
                        <PlusCircle size={20} weight="bold" />
                        {t('owner.properties.register_new')}
                    </button>
                }
            />
        </AppShell>
    );
}
