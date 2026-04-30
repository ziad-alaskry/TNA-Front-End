'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Package, 
    IdentificationCard, 
    Clock, 
    MapPin,
    QrCode,
    Funnel,
    Stack,
    UserCircleGear,
    Info
} from '@phosphor-icons/react'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'

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

    const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
    const [isBulkDispatchModalOpen, setIsBulkDispatchModalOpen] = useState(false);
    const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
    
    const [drivers] = useState([
        { id: 'DRV-101', name: 'سلطان القحطاني', status: 'ACTIVE', role: 'سائق ثقيل' },
        { id: 'DRV-102', name: 'فهد السبيعي', status: 'ON_TRIP', role: 'سائق خفيف' },
        { id: 'DRV-103', name: 'محمد العلي', status: 'ACTIVE', role: 'مندوب توصيل' },
    ]);

    const toggleSelection = (shipmentId: string) => {
        setSelectedShipments(prev => 
            prev.includes(shipmentId) 
            ? prev.filter(id => id !== shipmentId) 
            : [...prev, shipmentId]
        );
    };

    const mockShipments: Shipment[] = [
        { id: 'SHP-9901', tracking_number: 'TRK-88127391', recipient: t('carrier.shipments.mock_recipient_1'), tna_code: 'TNA-667722', status: 'IN_TRANSIT', district: t('carrier.shipments.mock_district_1'), eta: t('carrier.shipments.mock_eta_1') },
        { id: 'SHP-9905', tracking_number: 'TRK-22319082', recipient: t('carrier.shipments.mock_recipient_2'), tna_code: 'TNA-102938', status: 'DELIVERED', district: t('carrier.shipments.mock_district_2'), eta: t('carrier.shipments.mock_eta_2') },
        { id: 'SHP-9912', tracking_number: 'TRK-55612300', recipient: t('carrier.shipments.mock_recipient_3'), tna_code: 'TNA-229911', status: 'DISPATCHED', district: t('carrier.shipments.mock_district_3'), eta: t('carrier.shipments.mock_eta_3') },
        { id: 'SHP-9920', tracking_number: 'TRK-00129381', recipient: t('carrier.shipments.mock_recipient_4'), tna_code: 'TNA-667722', status: 'DELAYED', district: t('carrier.shipments.mock_district_1'), eta: t('carrier.shipments.mock_eta_delayed') },
    ];

    const columns: DataTableColumn<Shipment>[] = [
        {
            key: 'id',
            label: '',
            render: (id) => (
                <input 
                    type="checkbox" 
                    checked={selectedShipments.includes(id)}
                    onChange={(e) => { e.stopPropagation(); toggleSelection(id); }}
                    className="w-4 h-4 rounded accent-primary"
                />
            )
        },
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
        }
    ];

    return (
        <AppShell role="Carrier" header={t('carrier.shipments.header')}>
            <DataTableLayout
                title={t('carrier.shipments.title')}
                columns={columns}
                data={mockShipments}
                onRowClick={(row) => console.log('Viewing shipment:', row.id)}
                actions={
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            className="h-11 px-6 font-bold flex items-center gap-2 border-neutral-200"
                            onClick={() => setIsBulkDispatchModalOpen(true)}
                        >
                            <Stack size={20} />
                            توزيع بالجملة
                        </Button>
                        <Button
                            variant="outline"
                            className="h-11 px-6 font-bold flex items-center gap-2 border-neutral-200"
                            onClick={() => setIsAssignDriverModalOpen(true)}
                            disabled={selectedShipments.length === 0}
                        >
                            <UserCircleGear size={20} />
                            تعيين سائق
                        </Button>
                        <Button 
                            className="ui-gradient-primary text-white h-11 px-6 font-bold flex items-center gap-2 border-none shadow-glow-primary"
                        >
                            <QrCode size={20} weight="bold" className="text-white" />
                            {t('carrier.shipments.scan_new')}
                        </Button>
                    </div>
                }
            >
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md border border-primary/10 mb-4">
                    <Info size={20} weight="fill" className="text-primary" />
                    <p className="text-xs text-neutral-600">يمكنك تحديد شحنات متعددة لتطبيق إجراءات جماعية.</p>
                </div>
            </DataTableLayout>

            {/* Bulk Dispatch Modal */}
            <Modal 
                isOpen={isBulkDispatchModalOpen} 
                onClose={() => setIsBulkDispatchModalOpen(false)}
                title="توزيع الشحنات بالجملة"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        سيتم تحديث حالة الشحنات المحددة إلى "تم التجهيز" (Dispatched).
                    </p>
                    <div className="flex gap-3">
                        <Button fullWidth variant="ghost" onClick={() => setIsBulkDispatchModalOpen(false)}>
                            إلغاء
                        </Button>
                        <Button 
                            fullWidth
                            className="ui-gradient-primary border-none shadow-glow-primary"
                            onClick={() => {
                                console.log("Bulk Dispatching shipments:", selectedShipments);
                                setIsBulkDispatchModalOpen(false);
                            }}
                        >
                            تأكيد التوزيع
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Assign Driver Modal */}
            <Modal 
                isOpen={isAssignDriverModalOpen} 
                onClose={() => setIsAssignDriverModalOpen(false)}
                title="تعيين سائق للشحنات المحددة"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        سيتم تعيين السائق المحدد لجميع الشحنات المحددة.
                    </p>
                    <Select 
                        label="السائق" 
                        options={drivers.map(driver => ({ value: driver.id, label: `${driver.name} (${driver.role})` }))} 
                    />
                    <div className="flex gap-3">
                        <Button fullWidth variant="ghost" onClick={() => setIsAssignDriverModalOpen(false)}>
                            إلغاء
                        </Button>
                        <Button 
                            fullWidth
                            className="ui-gradient-primary border-none shadow-glow-primary"
                            onClick={() => {
                                console.log("Assigning driver to shipments:", selectedShipments);
                                setIsAssignDriverModalOpen(false);
                            }}
                        >
                            تأكيد التعيين
                        </Button>
                    </div>
                </div>
            </Modal>
        </AppShell>
    );
}
