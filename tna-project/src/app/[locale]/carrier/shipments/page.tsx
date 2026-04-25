'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Package, 
    IdentificationCard, 
    Clock, 
    CheckCircle, 
    MapPin,
    MagnifyingGlass,
    ArrowRight,
    QrCode,
    Funnel
} from '@phosphor-icons/react'
import { useRouter, useParams } from 'next/navigation'

interface Shipment {
    id: string;
    tracking_number: string;
    recipient: string;
    tna_code: string;
    status: 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED';
    district: string;
    eta: string;
}

const mockShipments: Shipment[] = [
    { id: 'SHP-9901', tracking_number: 'TRK-88127391', recipient: 'سالم الدوسري', tna_code: 'TNA-667722', status: 'IN_TRANSIT', district: 'الملقا', eta: 'اليوم ٦ م' },
    { id: 'SHP-9905', tracking_number: 'TRK-22319082', recipient: 'هند محمد', tna_code: 'TNA-102938', status: 'DELIVERED', district: 'النرجس', eta: 'أمس ٤ م' },
    { id: 'SHP-9912', tracking_number: 'TRK-55612300', recipient: 'عبدالله الرشيد', tna_code: 'TNA-229911', status: 'DISPATCHED', district: 'الياسمين', eta: 'غداً ١٠ ص' },
    { id: 'SHP-9920', tracking_number: 'TRK-00129381', recipient: 'فهد المطيري', tna_code: 'TNA-667722', status: 'DELAYED', district: 'الملقا', eta: 'معلق' },
];

export default function CarrierShipmentsPage() {
    const router = useRouter();
    const { locale } = useParams();

    const columns: DataTableColumn<Shipment>[] = [
        {
            key: 'tracking_number',
            label: 'رقم التتبع',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                        <Package size={20} weight="fill" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-neutral-900 font-mono tracking-wider">{val}</span>
                        <span className="text-[10px] text-neutral-500">{row.recipient}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'tna_code',
            label: 'عنوان TNA',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <IdentificationCard size={18} className="text-primary" weight="bold" />
                    <span className="text-sm font-bold text-primary font-mono">{val}</span>
                </div>
            )
        },
        {
            key: 'district',
            label: 'الحي المستهدف',
            render: (val) => (
                <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-700">{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'الحالة',
            render: (val) => {
                const configs: Record<Shipment['status'], { label: string; class: string }> = {
                    DISPATCHED: { label: 'تم التجهيز', class: 'bg-neutral-100 text-neutral-600' },
                    IN_TRANSIT: { label: 'في الطريق', class: 'bg-info-bg text-primary' },
                    DELIVERED: { label: 'تم التوصيل', class: 'bg-success-bg text-success' },
                    DELAYED: { label: 'متأخرة', class: 'bg-error-bg text-error' },
                };
                const config = configs[val as Shipment['status']];
                return <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest ${config.class}`}>{config.label}</span>
            }
        },
        {
            key: 'eta',
            label: 'الموعد المتوقع',
            render: (val) => (
                <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-neutral-400" />
                    <span className="text-xs text-neutral-600 font-bold">{val}</span>
                </div>
            )
        },
        {
            key: 'id',
            label: '',
            render: () => (
                <div className="flex justify-end gap-1">
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                        <QrCode size={18} />
                    </button>
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                        <ArrowRight size={18} className="rotate-180" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Carrier" header="إدارة الشحنات">
            <DataTableLayout
                title="سجل الشحنات والطرود"
                columns={columns}
                data={mockShipments}
                onRowClick={(row) => console.log('Viewing shipment:', row.id)}
            >
                <div className="flex gap-2">
                    <button className="h-11 px-6 rounded-sm border border-neutral-200 bg-surface-200 font-bold text-xs flex items-center gap-2 hover:bg-neutral-100 transition-colors">
                        <Funnel size={18} />
                        تصفية متقدمة
                    </button>
                    <button className="h-11 px-6 rounded-sm bg-neutral-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-black transition-all shadow-btn">
                        <QrCode size={20} weight="bold" />
                        مسح طرد جديد
                    </button>
                </div>
            </DataTableLayout>
        </AppShell>
    );
}
