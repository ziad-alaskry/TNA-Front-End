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
    { id: 'AG-01', name: 'هيئة الاتصالات', region: 'الرياض', department: 'التراخيص', admin_user: 'سعد المنصور', staff_count: 12 },
    { id: 'AG-02', name: 'وزارة الشؤون البلدية', region: 'جدة', department: 'تخطيط المدن', admin_user: 'نورة السعيد', staff_count: 8 },
    { id: 'AG-03', name: 'البريد السعودي (SPL)', region: 'الدمام', department: 'العمليات اللوجستية', admin_user: 'إبراهيم حسن', staff_count: 45 },
];

const mockStaff: GovStaff[] = [
    { id: 'STF-501', name: 'محمد القحطاني', agency_id: 'AG-01', department: 'إدارة العناوين', permissions: ['VERIFY', 'AUDIT'], last_active: 'منذ ١٠ دقائق', status: 'ACTIVE' },
    { id: 'STF-442', name: 'سارة العتيبي', agency_id: 'AG-02', department: 'السياسات والأنظمة', permissions: ['MANAGE_POLICY', 'AUDIT'], last_active: 'أمس ٠٥:٠٠ م', status: 'ACTIVE' },
    { id: 'STF-330', name: 'خالد السبيعي', agency_id: 'AG-03', department: 'الدعم الفني', permissions: ['READ_ONLY'], last_active: 'منذ ٤ أيام', status: 'INACTIVE' },
];

export default function GovAgenciesPage() {
    const [activeTab, setActiveTab] = useState<'AGENCIES' | 'PERSONNEL'>('AGENCIES');
    const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

    const agencyColumns: DataTableColumn<Agency>[] = [
        {
            key: 'name',
            label: 'الجهة الحكومية',
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
            label: 'المنطقة',
            render: (val) => (
                <div className="flex items-center gap-1 text-xs text-neutral-600">
                    <MapPin size={14} />
                    {val}
                </div>
            )
        },
        {
            key: 'department',
            label: 'الإدارة المختصة',
            render: (val) => <span className="text-xs font-semibold text-neutral-700">{val}</span>
        },
        {
            key: 'admin_user',
            label: 'مدير النظام',
            render: (val) => <span className="text-xs font-medium text-neutral-500">{val}</span>
        },
        {
            key: 'staff_count',
            label: 'عدد الموظفين',
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
            label: 'الموظف / المسؤول',
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
            label: 'القسم',
            render: (val) => <span className="text-xs font-semibold text-neutral-700">{val}</span>
        },
        {
            key: 'permissions',
            label: 'الصلاحيات',
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
            label: 'الحالة',
            render: (val) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    val === 'ACTIVE' ? 'bg-success-bg text-success' : 'bg-neutral-200 text-neutral-500'
                }`}>
                    {val === 'ACTIVE' ? 'نشط' : 'معطل'}
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
        <AppShell role="Gov" header="إدارة الجهات والموظفين">
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
                        الجهات الحكومية
                        {activeTab === 'AGENCIES' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('PERSONNEL')}
                        className={cn(
                            "pb-4 text-sm font-bold transition-all relative",
                            activeTab === 'PERSONNEL' ? "text-primary" : "text-neutral-400 hover:text-neutral-600"
                        )}
                    >
                        الموظفين والمسؤولين
                        {activeTab === 'PERSONNEL' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                </div>

                {activeTab === 'AGENCIES' ? (
                    <DataTableLayout
                        title="قائمة الهيئات والوزارات"
                        columns={agencyColumns}
                        data={mockAgencies}
                        actions={
                            <Button 
                                onClick={() => setIsAgencyModalOpen(true)}
                                className="ui-gradient-primary text-white h-11 px-6 font-bold flex items-center gap-2 border-none shadow-glow-primary"
                            >
                                <PlusCircle size={20} weight="bold" className="text-white" />
                                إضافة جهة جديدة
                            </Button>
                        }
                    />
                ) : (
                    <DataTableLayout
                        title="إدارة الكوادر البشرية"
                        columns={staffColumns}
                        data={mockStaff}
                        actions={
                            <Button 
                                onClick={() => setIsStaffModalOpen(true)}
                                className="ui-gradient-primary text-white h-11 px-6 font-bold flex items-center gap-2 border-none shadow-glow-primary"
                            >
                                <UserPlus size={20} weight="bold" className="text-white" />
                                إضافة موظف
                            </Button>
                        }
                    />
                )}
            </div>

            {/* Add Agency Modal */}
            <Modal 
                isOpen={isAgencyModalOpen} 
                onClose={() => setIsAgencyModalOpen(false)}
                title="إضافة جهة حكومية جديدة"
            >
                <div className="space-y-4">
                    <InputField label="اسم الجهة" placeholder="مثلاً: وزارة السياحة" />
                    <div className="grid grid-cols-2 gap-4">
                        <Select 
                            label="المنطقة" 
                            options={[{value:'riyadh', label:'الرياض'}, {value:'jeddah', label:'جدة'}]} 
                        />
                        <InputField label="القسم المسؤول" placeholder="مثلاً: قسم التدقيق" />
                    </div>
                    <InputField label="مدير النظام المرشح" placeholder="الاسم الكامل" />
                    <div className="pt-4 flex gap-3">
                        <Button fullWidth onClick={() => setIsAgencyModalOpen(false)}>حفظ البيانات</Button>
                        <Button fullWidth variant="ghost" onClick={() => setIsAgencyModalOpen(false)}>إلغاء</Button>
                    </div>
                </div>
            </Modal>

            {/* Add Staff Modal */}
            <Modal 
                isOpen={isStaffModalOpen} 
                onClose={() => setIsStaffModalOpen(false)}
                title="إضافة موظف جديد للمنظومة"
            >
                <div className="space-y-4">
                    <InputField label="اسم الموظف" placeholder="الاسم الرباعي" />
                    <Select 
                        label="الجهة التابع لها" 
                        options={mockAgencies.map(a => ({ value: a.id, label: a.name }))} 
                    />
                    <InputField label="البريد الإلكتروني الحكومي" placeholder="name@agency.gov.sa" />
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-neutral-900">الصلاحيات</p>
                        <div className="flex flex-wrap gap-2">
                            {['مراجعة الطلبات', 'إدارة السياسات', 'سجل التدقيق', 'الدعم الفني'].map(p => (
                                <button key={p} className="px-3 py-1.5 border border-neutral-200 rounded-sm text-[10px] font-bold hover:border-primary hover:text-primary transition-all">
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button fullWidth onClick={() => setIsStaffModalOpen(false)}>إصدار التصريح</Button>
                        <Button fullWidth variant="ghost" onClick={() => setIsStaffModalOpen(false)}>تراجع</Button>
                    </div>
                </div>
            </Modal>
        </AppShell>
    );
}
