'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Truck, 
    SteeringWheel, 
    CheckCircle, 
    WarningCircle, 
    PlusCircle,
    Gear,
    DotsThreeVertical,
    ArrowRight
} from '@phosphor-icons/react'
import { useRouter, useParams } from 'next/navigation'

interface Vehicle {
    id: string;
    plate_number: string;
    model: string;
    driver_name: string;
    status: 'AVAILABLE' | 'ON_TRIP' | 'MAINTENANCE';
    last_service: string;
}

const mockFleet: Vehicle[] = [
    { id: 'TRK-101', plate_number: 'أ ب ج ١٢٣٤', model: 'Hino 300 Series', driver_name: 'محمد علي', status: 'AVAILABLE', last_service: '2025/10/12' },
    { id: 'TRK-205', plate_number: 'د هـ و ٥٦٧٨', model: 'ISUZU NPR', driver_name: 'إبراهيم حسن', status: 'ON_TRIP', last_service: '2025/11/01' },
    { id: 'TRK-011', plate_number: 'س ك م ٩٩٠١', model: 'Mitsubishi Fuso', driver_name: 'خالد صالح', status: 'MAINTENANCE', last_service: '2025/08/20' },
    { id: 'TRK-442', plate_number: 'ر ط ل ٢٢٣٣', model: 'Mercedes-Benz Actros', driver_name: 'فهد السبيعي', status: 'AVAILABLE', last_service: '2025/11/10' },
];

export default function CarrierFleetPage() {
    const router = useRouter();
    const { locale } = useParams();

    const columns: DataTableColumn<Vehicle>[] = [
        {
            key: 'plate_number',
            label: 'بيانات المركبة',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-neutral-100 flex flex-col items-center justify-center border border-neutral-200">
                        <span className="text-[8px] font-bold text-neutral-400 leading-none">KSA</span>
                        <span className="text-xs font-bold text-neutral-900 leading-none mt-0.5">{val}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-900">{row.model}</span>
                        <span className="text-[10px] text-neutral-400">ID: {row.id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'driver_name',
            label: 'السائق المعين',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <SteeringWheel size={18} className="text-neutral-400" />
                    <span className="text-sm font-semibold text-neutral-700">{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'الحالة التشغيلية',
            render: (val) => {
                const configs: Record<Vehicle['status'], { label: string; class: string; icon: React.ReactNode }> = {
                    AVAILABLE: { label: 'جاهز للعمل', class: 'bg-success-bg text-success', icon: <CheckCircle size={14} /> },
                    ON_TRIP: { label: 'في مهمة', class: 'bg-info-bg text-primary', icon: <Truck size={14} /> },
                    MAINTENANCE: { label: 'تحت الصيانة', class: 'bg-error-bg text-error', icon: <Gear size={14} /> },
                };
                const config = configs[val as Vehicle['status']];
                return (
                    <div className={`flex items-center gap-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${config.class}`}>
                        {config.icon}
                        {config.label}
                    </div>
                )
            }
        },
        {
            key: 'last_service',
            label: 'آخر صيانة',
            render: (val) => <span className="text-xs text-neutral-500">{val}</span>
        },
        {
            key: 'id',
            label: '',
            render: () => (
                <div className="flex justify-end">
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400 transition-colors">
                        <ArrowRight size={18} className="rotate-180" />
                    </button>
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400 transition-colors">
                        <DotsThreeVertical size={20} weight="bold" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Carrier" header="إدارة الأسطول">
            <DataTableLayout
                title="قائمة مركبات النقل"
                columns={columns}
                data={mockFleet}
                onRowClick={(row) => console.log('Viewing vehicle details:', row.id)}
            >
                <button 
                    className="h-11 px-6 rounded-sm bg-primary text-white font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-btn"
                >
                    <PlusCircle size={20} weight="bold" />
                    إضافة مركبة للأسطول
                </button>
            </DataTableLayout>
        </AppShell>
    );
}
