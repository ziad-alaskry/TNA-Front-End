'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Package as PackageIcon, 
    Truck as TruckIcon, 
    Info as InfoIcon,
    MagnifyingGlass
} from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useLocale } from '@/i18n/LocaleProvider'

interface Shipment {
    id: string;
    tracking_number: string;
    carrier: string;
    status: 'IN_TRANSIT' | 'DELIVERED' | 'OUT_FOR_DELIVERY' | 'PENDING';
    tna_code: string;
    destination_key: 'malqa_riyadh' | 'narjis_riyadh';
    estimated_delivery: string;
}

const mockShipments: Shipment[] = [
    {
        id: '1',
        tracking_number: 'TRK-98234812',
        carrier: 'Smsa Express',
        status: 'IN_TRANSIT',
        tna_code: 'TNA-667722',
        destination_key: 'malqa_riyadh',
        estimated_delivery: '2025/11/20'
    },
    {
        id: '2',
        tracking_number: 'TRK-00293122',
        carrier: 'Aramex',
        status: 'DELIVERED',
        tna_code: 'TNA-102938',
        destination_key: 'narjis_riyadh',
        estimated_delivery: '2025/11/15'
    },
    {
        id: '3',
        tracking_number: 'TRK-55662211',
        carrier: 'Spl Online',
        status: 'OUT_FOR_DELIVERY',
        tna_code: 'TNA-667722',
        destination_key: 'malqa_riyadh',
        estimated_delivery: '2025/11/18'
    }
];

export default function VisitorShipmentsPage() {
    const router = useRouter();
    const { locale, t } = useLocale();
    const columns: DataTableColumn<Shipment>[] = [
        {
            key: 'tracking_number',
            label: t('visitor.shipments_page.columns.tracking_number'),
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
            label: t('visitor.shipments_page.columns.carrier'),
            render: (val) => <span className="font-medium">{val}</span>
        },
        {
            key: 'tna_code',
            label: t('visitor.shipments_page.columns.tna_code'),
            render: (val) => <span className="font-mono text-primary font-bold">{val}</span>
        },
        {
            key: 'status',
            label: t('visitor.shipments_page.columns.status'),
            render: (val) => {
                const configs: Record<Shipment['status'], { class: string }> = {
                    IN_TRANSIT: { class: 'bg-info-bg text-primary' },
                    DELIVERED: { class: 'bg-success-bg text-success' },
                    OUT_FOR_DELIVERY: { class: 'bg-warning-bg text-warning' },
                    PENDING: { class: 'bg-neutral-100 text-neutral-500' },
                };
                const config = configs[val as Shipment['status']];
                return <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${config.class}`}>{t(`visitor.shipments_page.statuses.${val}`)}</span>
            }
        },
        {
            key: 'estimated_delivery',
            label: t('visitor.shipments_page.columns.estimated_delivery'),
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold">{val}</span>
                    <span className="text-[10px] text-neutral-400">{t(`visitor.shipments_page.destinations.${row.destination_key}`)}</span>
                </div>
            )
        }
    ];

  return (
    <AppShell role="Visitor" header={t('visitor.shipments_page.header')}>
      <DataTableLayout
        title={t('visitor.shipments_page.title')}
        columns={columns}
        data={mockShipments}
        onRowClick={(row) => router.push(`/${locale}/visitor/shipments/${row.id}`)}
        actions={
            <Button 
                onClick={() => router.push(`/${locale}/visitor/shipments/new`)}
                className="ui-gradient-primary text-white h-10 px-4 rounded-md font-bold flex items-center gap-2 border-none shadow-glow-primary hover:opacity-90 transition-opacity"
            >
                <PackageIcon size={20} className="text-white" />
                {t('visitor.shipments_page.actions.new_shipment')}
            </Button>
        }
      >
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md border border-primary/10">
          <InfoIcon size={20} weight="fill" className="text-primary" />
          <p className="text-xs text-neutral-600">{t('visitor.shipments_page.notes.auto_update')}</p>
        </div>
      </DataTableLayout>
    </AppShell>
  );
}
