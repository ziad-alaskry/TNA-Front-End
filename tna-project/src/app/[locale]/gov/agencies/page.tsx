'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Users, 
    UserPlus, 
    ShieldCheck, 
    UserGear, 
    Trash, 
    ArrowRight,
    Buildings,
    PlusCircle,
    IdentificationCard,
    MapPin
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import InputField from '@/components/ui/InputField'
import Select from '@/components/ui/Select'
import { useLocale } from '@/i18n/LocaleProvider'

interface Agency {
    id: string;
    name: string;
    region: string;
    department: string;
    admin_user: string;
    staff_count: number;
}

interface GovStaff {
    id: string;
    name: string;
    agency_id: string;
    department: string;
    permissions: string[];
    last_active: string;
    status: 'ACTIVE' | 'INACTIVE';
}

const mockAgencies: Agency[] = [
    { id: 'AG-01', name: 'Communications Authority', region: 'Riyadh', department: 'Licensing', admin_user: 'Saad Al-Mansour', staff_count: 12 },
    { id: 'AG-02', name: 'Ministry of Municipal Affairs', region: 'Jeddah', department: 'Urban Planning', admin_user: 'Noura Al-Saeed', staff_count: 8 },
    { id: 'AG-03', name: 'Saudi Post (SPL)', region: 'Dammam', department: 'Logistics Operations', admin_user: 'Ibrahim Hassan', staff_count: 45 },
];

const mockStaff: GovStaff[] = [
    { id: 'STF-501', name: 'Mohammed Al-Qahtani', agency_id: 'AG-01', department: 'Address Management', permissions: ['VERIFY', 'AUDIT'], last_active: '10 min ago', status: 'ACTIVE' },
    { id: 'STF-442', name: 'Sara Al-Otaibi', agency_id: 'AG-02', department: 'Policies and Systems', permissions: ['MANAGE_POLICY', 'AUDIT'], last_active: 'Yesterday 05:00 PM', status: 'ACTIVE' },
    { id: 'STF-330', name: 'Khaled Al-Subaie', agency_id: 'AG-03', department: 'Technical Support', permissions: ['READ_ONLY'], last_active: '4 days ago', status: 'INACTIVE' },
];

export default function GovAgenciesPage() {
    const { t } = useLocale();
    const [activeTab, setActiveTab] = useState<'AGENCIES' | 'PERSONNEL'>('AGENCIES');
    const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

    const agencyColumns: DataTableColumn<Agency>[] = [
        {
            key: 'name',
            label: t('gov.agencies.table.headers.name'),
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary/5 flex items-center justify-center text-primary">
                        <Buildings size={20} weight="fill" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{val}</span>
                        <span className="text-[10px] text-neutral-400">ID: {row.id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'region',
            label: t('gov.agencies.table.headers.region'),
            render: (val) => (
                <div className="flex items-center gap-1 text-xs text-neutral-600">
                    <MapPin size={14} />
                    {val}
                </div>
            )
        },
        {
            key: 'department',
            label: t('gov.agencies.table.headers.department'),
            render: (val) => <span className="text-xs font-semibold text-neutral-700">{val}</span>
        },
        {
            key: 'admin_user',
            label: t('gov.agencies.table.headers.admin_user'),
            render: (val) => <span className="text-xs font-medium text-neutral-500">{val}</span>
        },
        {
            key: 'staff_count',
            label: t('gov.agencies.table.headers.staff_count'),
            render: (val) => <span className="font-mono text-sm font-bold text-primary">{val}</span>
        },
        {
            key: 'id',
            label: '',
            render: (id) => (
                <div className="flex justify-end">
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                        <ArrowRight size={18} className="rotate-180" />
                    </button>
                </div>
            )
        }
    ];

    const staffColumns: DataTableColumn<GovStaff>[] = [
        {
            key: 'name',
            label: t('gov.staff.table.headers.name'),
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <UserGear size={20} weight="fill" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{val}</span>
                        <span className="text-[10px] text-neutral-400">{mockAgencies.find(a => a.id === row.agency_id)?.name}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'department',
            label: t('gov.staff.table.headers.department'),
            render: (val) => <span className="text-xs font-semibold text-neutral-700">{val}</span>
        },
        {
            key: 'permissions',
            label: t('gov.staff.table.headers.permissions'),
            render: (val) => (
                <div className="flex flex-wrap gap-1">
                    {(val as string[]).map((p, i) => (
                        <span key={i} className={`px-1.5 py-0.5 bg-primary/5 text-primary text-[8px] font-bold rounded border border-primary/10 tracking-widest`}>
                            {t(`gov.staff.table.permissions.${p}`)}
                        </span>
                    ))}
                </div>
            )
        },
        {
            key: 'status',
            label: t('gov.staff.table.headers.status'),
            render: (val) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    val === 'ACTIVE' ? 'bg-success-bg text-success' : 'bg-neutral-200 text-neutral-500'
                }`}>
                    {t(`common.statuses.${val}`)}
                </span>
            )
        },
        {
            key: 'id',
            label: '',
            render: () => (
                <div className="flex justify-end gap-1">
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                        <UserGear size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Gov">
            <div className="space-y-6">
                {/* Custom Tabs */}
                <div className="flex border-b border-neutral-200 gap-8">
                    <button 
                        onClick={() => setActiveTab('AGENCIES')}
                        className={cn(
                            "pb-4 text-sm font-bold transition-all relative",
                            activeTab === 'AGENCIES' ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
                        )}
                    >
                        {t('gov.agencies.tab')}
                        {activeTab === 'AGENCIES' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('PERSONNEL')}
                        className={cn(
                            "pb-4 text-sm font-bold transition-all relative",
                            activeTab === 'PERSONNEL' ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
                        )}
                    >
                        {t('gov.staff.tab')}
                        {activeTab === 'PERSONNEL' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                </div>

                {activeTab === 'AGENCIES' ? (
                    <DataTableLayout
                        title={t('gov.agencies.title')}
                        columns={agencyColumns}
                        data={mockAgencies}
                        actions={
                            <Button 
                                onClick={() => setIsAgencyModalOpen(true)}
                                className="ui-gradient-primary text-white h-11 px-6 font-bold flex items-center gap-2 border-none shadow-glow-primary"
                            >
                                <PlusCircle size={20} weight="bold" className="text-white" />
                                {t('gov.agencies.add_new')}
                            </Button>
                        }
                    />
                ) : (
                    <DataTableLayout
                        title={t('gov.staff.title')}
                        columns={staffColumns}
                        data={mockStaff}
                        actions={
                            <Button 
                                onClick={() => setIsStaffModalOpen(true)}
                                className="ui-gradient-primary text-white h-11 px-6 font-bold flex items-center gap-2 border-none shadow-glow-primary"
                            >
                                <UserPlus size={20} weight="bold" className="text-white" />
                                {t('gov.staff.add_new')}
                            </Button>
                        }
                    />
                )}
            </div>

            {/* Add Agency Modal */}
            <Modal 
                isOpen={isAgencyModalOpen} 
                onClose={() => setIsAgencyModalOpen(false)}
                title={t('gov.agencies.modal.title')}
            >
                <div className="space-y-4">
                    <InputField label={t('gov.agencies.modal.fields.name')} placeholder={t('gov.agencies.modal.fields.name_placeholder')} />
                    <div className="grid grid-cols-2 gap-4">
                        <Select 
                            label={t('gov.agencies.modal.fields.region')} 
                            options={[
                                {value:'riyadh', label: t('gov.agencies.modal.fields.regions.riyadh')}, 
                                {value:'jeddah', label: t('gov.agencies.modal.fields.regions.jeddah')}
                            ]} 
                        />
                        <InputField label={t('gov.agencies.modal.fields.department')} placeholder={t('gov.agencies.modal.fields.department_placeholder')} />
                    </div>
                    <InputField label={t('gov.agencies.modal.fields.admin_user')} placeholder={t('gov.agencies.modal.fields.admin_user_placeholder')} />
                    <div className="pt-4 flex gap-3">
                        <Button fullWidth onClick={() => setIsAgencyModalOpen(false)}>{t('common.save')}</Button>
                        <Button fullWidth variant="ghost" onClick={() => setIsAgencyModalOpen(false)}>{t('common.cancel')}</Button>
                    </div>
                </div>
            </Modal>

            {/* Add Staff Modal */}
            <Modal 
                isOpen={isStaffModalOpen} 
                onClose={() => setIsStaffModalOpen(false)}
                title={t('gov.staff.modal.title')}
            >
                <div className="space-y-4">
                    <InputField label={t('gov.staff.modal.fields.name')} placeholder={t('gov.staff.modal.fields.name_placeholder')} />
                    <Select 
                        label={t('gov.staff.modal.fields.agency')} 
                        options={mockAgencies.map(a => ({ value: a.id, label: a.name }))} 
                    />
                    <InputField label={t('gov.staff.modal.fields.email')} placeholder={t('gov.staff.modal.fields.email_placeholder')} />
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-neutral-900">{t('gov.staff.modal.fields.permissions')}</p>
                        <div className="flex flex-wrap gap-2">
                            {[t('gov.staff.table.permissions.VERIFY'), t('gov.staff.table.permissions.MANAGE_POLICY'), t('gov.staff.table.permissions.AUDIT'), t('gov.staff.table.permissions.READ_ONLY')].map(p => (
                                <button key={p} className="px-3 py-1.5 border border-neutral-200 rounded-sm text-[10px] font-bold hover:border-primary hover:text-primary transition-all">
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button fullWidth onClick={() => setIsStaffModalOpen(false)}>{t('common.save')}</Button>
                        <Button fullWidth variant="ghost" onClick={() => setIsStaffModalOpen(false)}>{t('common.cancel')}</Button>
                    </div>
                </div>
            </Modal>
        </AppShell>
    );
}
