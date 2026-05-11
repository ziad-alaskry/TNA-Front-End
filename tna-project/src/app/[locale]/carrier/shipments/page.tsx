'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter, useParams } from 'next/navigation'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  MapPin,
  ArrowRight,
  Plus
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'
import { mockShipments } from '@/lib/mock/shipments.mock'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useTranslation } from 'react-i18next';

export default function CarrierShipmentsPage() {
    const router = useRouter();
    /* TODO: review isRTL usage */ /* TODO: review isRTL usage */ const {  locale, isRTL , t } = useLocale();
    const { data: shipments, isLoading } = useMock(mockShipments);

    const columns: DataTableColumn<any>[] = [
        {
            key: 'tracking_number',
            label: t('carrier.tracking_1'),
            width: '25%',
            render: (val) => <span className="font-mono font-bold text-neutral-900">{val}</span>
        },
        {
            key: 'tna_id',
            label: t('carrier.tna_destination_2'),
            width: '25%',
            render: (val) => <span className="font-mono font-bold text-primary">{val}</span>
        },
        {
            key: 'status',
            label: t('carrier.status_3'),
            width: '20%',
            render: (val) => (
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                    val === 'DELIVERED' ? "bg-success/10 text-success" : 
                    val === 'IN_TRANSIT' ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                )}>
                    {val}
                </span>
            )
        },
        {
            key: 'shipment_id',
            label: '',
            width: '30%',
            render: (id) => (
                <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3 text-[10px] border-neutral-200"
                      onClick={() => router.push(`/${locale}/carrier/shipments/${id}`)}
                    >
                      Update Status
                    </Button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Carrier" header={t('carrier.shipment_management_4')}>
            <DataTableLayout
                title="Active Shipments"
                columns={columns}
                data={shipments || []}
                isLoading={isLoading}
                actions={
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-neutral-200" onClick={() => router.push(`/${locale}/carrier/resolve`)}>
                      <MapPin size={20} weight="bold" />
                      {t('carrier.resolve_tna_5')}
                    </Button>
                    <Button className="shadow-glow-primary" onClick={() => router.push(`/${locale}/carrier/shipments/new`)}>
                      <Plus size={20} weight="bold" />
                      {t('carrier.new_shipment_6')}
                    </Button>
                  </div>
                }
            />
        </AppShell>
    );
}
