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
import { useLocale } from '@/i18n/LocaleProvider'

interface Vehicle {
    id: string;
    plate_number: string;
    model: string;
    driver_name: string;
    status: 'AVAILABLE' | 'ON_TRIP' | 'MAINTENANCE';
    last_service: string;
}

export default function CarrierFleetPage() {
    const router = useRouter();
    const { locale } = useParams();
    const { t } = useLocale();

    const mockFleet: Vehicle[] = [
        { id: 'TRK-101', plate_number: t('carrier.fleet.mock_plate_1'), model: t('carrier.fleet.mock_model_1'), driver_name: t('carrier.fleet.mock_driver_1'), status: 'AVAILABLE', last_service: '2025/10/12' },
        { id: 'TRK-205', plate_number: t('carrier.fleet.mock_plate_2'), model: t('carrier.fleet.mock_model_2'), driver_name: t('carrier.fleet.mock_driver_2'), status: 'ON_TRIP', last_service: '2025/11/01' },
        { id: 'TRK-011', plate_number: t('carrier.fleet.mock_plate_3'), model: t('carrier.fleet.mock_model_3'), driver_name: t('carrier.fleet.mock_driver_3'), status: 'MAINTENANCE', last_service: '2025/08/20' },
        { id: 'TRK-442', plate_number: t('carrier.fleet.mock_plate_4'), model: t('carrier.fleet.mock_model_4'), driver_name: t('carrier.fleet.mock_driver_4'), status: 'AVAILABLE', last_service: '2025/11/10' },
    ];

    const columns: DataTableColumn<Vehicle>[] = [
        {
            key: 'plate_number',
            label: t('carrier.fleet.vehicle_data'),
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
            label: t('carrier.fleet.assigned_driver'),
            render: (val) => (
                <div className="flex items-center gap-2">
                    <SteeringWheel size={18} className="text-neutral-400" />
                    <span className="text-sm font-semibold text-neutral-700">{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: t('carrier.fleet.operational_status'),
            render: (val) => {
                const configs: Record<Vehicle['status'], { label: string; class: string; icon: React.ReactNode }> = {
                    AVAILABLE: { label: t('carrier.fleet.status_available'), class: 'bg-success-bg text-success', icon: <CheckCircle size={14} /> },
                    ON_TRIP: { label: t('carrier.fleet.status_on_trip'), class: 'bg-info-bg text-primary', icon: <Truck size={14} /> },
                    MAINTENANCE: { label: t('carrier.fleet.status_maintenance'), class: 'bg-error-bg text-error', icon: <Gear size={14} /> },
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
            label: t('carrier.fleet.last_service'),
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
        <AppShell role="Carrier" header={t('carrier.fleet.header')}>
            <DataTableLayout
                title={t('carrier.fleet.title')}
                columns={columns}
                data={mockFleet}
                onRowClick={(row) => console.log('Viewing vehicle details:', row.id)}
            >
                <button 
                    className="h-11 px-6 rounded-sm bg-primary text-white font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-btn"
                >
                    <PlusCircle size={20} weight="bold" />
                    {t('carrier.fleet.add_vehicle')}
                </button>
            </DataTableLayout>
        </AppShell>
    );
}
