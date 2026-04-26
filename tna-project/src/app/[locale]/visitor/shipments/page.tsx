'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Package as PackageIcon, 
    Truck as TruckIcon, 
    Calendar as CalendarIcon, 
    MapPin as MapPinIcon, 
    Info as InfoIcon 
} from '@phosphor-icons/react'

interface Shipment {
    id: string;
    tracking_number: string;
    carrier: string;
    status: 'IN_TRANSIT' | 'DELIVERED' | 'OUT_FOR_DELIVERY' | 'PENDING';
    tna_code: string;
    destination: string;
    estimated_delivery: string;
}

export default function VisitorShipmentsPage() {
    const { t } = useLocale();

    const mockShipments: Shipment[] = [
        {
            id: '1',
            tracking_number: 'TRK-98234812',
            carrier: 'Smsa Express',
            status: 'IN_TRANSIT',
            tna_code: 'TNA-667722',
            destination: t('visitor.shipments.mock_dest_1'),
            estimated_delivery: '2025/11/20'
        },
        {
            id: '2',
            tracking_number: 'TRK-00293122',
            carrier: 'Aramex',
            status: 'DELIVERED',
            tna_code: 'TNA-102938',
            destination: t('visitor.shipments.mock_dest_2'),
            estimated_delivery: '2025/11/15'
        },
        {
            id: '3',
            tracking_number: 'TRK-55662211',
            carrier: 'Spl Online',
            status: 'OUT_FOR_DELIVERY',
            tna_code: 'TNA-667722',
            destination: t('visitor.shipments.mock_dest_1'),
            estimated_delivery: '2025/11/18'
        }
    ];

    const columns: DataTableColumn<Shipment>[] = [
        {
            key: 'tracking_number',
            label: t('visitor.shipments.tracking_number'),
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <TruckIcon size={18} />
                    </div>
                    <span className="font-mono font-bold text-neutral-900">{val}</span>
                </div>
            )
        },
        {
            key: 'carrier',
            label: t('visitor.shipments.carrier'),
            render: (val) => <span className="font-medium">{val}</span>
        },
        {
            key: 'tna_code',
            label: t('visitor.shipments.tna_code'),
            render: (val) => <span className="font-mono text-primary font-bold">{val}</span>
        },
        {
            key: 'status',
            label: t('visitor.shipments.status'),
            render: (val) => {
                const configs: Record<Shipment['status'], { label: string; class: string }> = {
                    IN_TRANSIT: { label: t('visitor.shipments.status_in_transit'), class: 'bg-info-bg text-primary' },
                    DELIVERED: { label: t('visitor.shipments.status_delivered'), class: 'bg-success-bg text-success' },
                    OUT_FOR_DELIVERY: { label: t('visitor.shipments.status_out_for_delivery'), class: 'bg-warning-bg text-warning' },
                    PENDING: { label: t('visitor.shipments.status_pending'), class: 'bg-neutral-100 text-neutral-500' },
                };
                const config = configs[val as Shipment['status']];
                return <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${config.class}`}>{config.label}</span>
            }
        },
        {
            key: 'estimated_delivery',
            label: t('visitor.shipments.estimated_delivery'),
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold">{val}</span>
                    <span className="text-[10px] text-neutral-400">{row.destination}</span>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Visitor" header={t('visitor.shipments.header')}>
            <DataTableLayout
                title={t('visitor.shipments.title')}
                columns={columns}
                data={mockShipments}
                onRowClick={(row) => console.log('Viewing shipment:', row.id)}
            >
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md border border-primary/10">
                    <InfoIcon size={20} weight="fill" className="text-primary" />
                    <p className="text-xs text-neutral-600">{t('visitor.shipments.info')}</p>
                </div>
            </DataTableLayout>
        </AppShell>
    );
}
