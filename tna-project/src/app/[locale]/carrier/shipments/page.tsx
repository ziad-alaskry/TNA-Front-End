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
import { useLocale } from '@/i18n/LocaleProvider'

interface Shipment {
    id: string;
    tracking_number: string;
    recipient: string;
    tna_code: string;
    status: 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED';
    district: string;
    eta: string;
}

export default function CarrierShipmentsPage() {
    const router = useRouter();
    const { locale } = useParams();
    const { t } = useLocale();

    const mockShipments: Shipment[] = [
        { id: 'SHP-9901', tracking_number: 'TRK-88127391', recipient: t('carrier.shipments.mock_recipient_1'), tna_code: 'TNA-667722', status: 'IN_TRANSIT', district: t('carrier.shipments.mock_district_1'), eta: t('carrier.shipments.mock_eta_1') },
        { id: 'SHP-9905', tracking_number: 'TRK-22319082', recipient: t('carrier.shipments.mock_recipient_2'), tna_code: 'TNA-102938', status: 'DELIVERED', district: t('carrier.shipments.mock_district_2'), eta: t('carrier.shipments.mock_eta_2') },
        { id: 'SHP-9912', tracking_number: 'TRK-55612300', recipient: t('carrier.shipments.mock_recipient_3'), tna_code: 'TNA-229911', status: 'DISPATCHED', district: t('carrier.shipments.mock_district_3'), eta: t('carrier.shipments.mock_eta_3') },
        { id: 'SHP-9920', tracking_number: 'TRK-00129381', recipient: t('carrier.shipments.mock_recipient_4'), tna_code: 'TNA-667722', status: 'DELAYED', district: t('carrier.shipments.mock_district_1'), eta: t('carrier.shipments.mock_eta_delayed') },
    ];

    const columns: DataTableColumn<Shipment>[] = [
        {
            key: 'tracking_number',
            label: t('carrier.shipments.tracking_number'),
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
            label: t('carrier.shipments.tna_address'),
            render: (val) => (
                <div className="flex items-center gap-2">
                    <IdentificationCard size={18} className="text-primary" weight="bold" />
                    <span className="text-sm font-bold text-primary font-mono">{val}</span>
                </div>
            )
        },
        {
            key: 'district',
            label: t('carrier.shipments.target_district'),
            render: (val) => (
                <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-700">{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: t('carrier.shipments.status'),
            render: (val) => {
                const configs: Record<Shipment['status'], { label: string; class: string }> = {
                    DISPATCHED: { label: t('carrier.shipments.status_dispatched'), class: 'bg-neutral-100 text-neutral-600' },
                    IN_TRANSIT: { label: t('carrier.shipments.status_in_transit'), class: 'bg-info-bg text-primary' },
                    DELIVERED: { label: t('carrier.shipments.status_delivered'), class: 'bg-success-bg text-success' },
                    DELAYED: { label: t('carrier.shipments.status_delayed'), class: 'bg-error-bg text-error' },
                };
                const config = configs[val as Shipment['status']];
                return <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest ${config.class}`}>{config.label}</span>
            }
        },
        {
            key: 'eta',
            label: t('carrier.shipments.eta'),
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
        <AppShell role="Carrier" header={t('carrier.shipments.header')}>
            <DataTableLayout
                title={t('carrier.shipments.title')}
                columns={columns}
                data={mockShipments}
                onRowClick={(row) => console.log('Viewing shipment:', row.id)}
            >
                <div className="flex gap-2">
                    <button className="h-11 px-6 rounded-sm border border-neutral-200 bg-surface-200 font-bold text-xs flex items-center gap-2 hover:bg-neutral-100 transition-colors">
                        <Funnel size={18} />
                        {t('carrier.shipments.advanced_filter')}
                    </button>
                    <button className="h-11 px-6 rounded-sm bg-neutral-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-black transition-all shadow-btn">
                        <QrCode size={20} weight="bold" />
                        {t('carrier.shipments.scan_new')}
                    </button>
                </div>
            </DataTableLayout>
        </AppShell>
    );
}
