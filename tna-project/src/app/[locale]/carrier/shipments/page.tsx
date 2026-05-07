'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import { cn } from '@/lib/utils/cn'
import { 
    Package, 
    Truck, 
    UserCircleGear, 
    Stack, 
    QrCode, 
    Info, 
    Clock, 
    MapPin,
    CheckCircle
} from '@phosphor-icons/react'
import { useParams } from 'next/navigation'

interface Shipment {
    id: string;
    tracking_number: string;
    destination: string;
    status: 'PENDING' | 'DISPATCHED' | 'DELIVERED';
    carrier: string;
    last_update: string;
}

const mockShipments: Shipment[] = [
    { id: 'SHP-001', tracking_number: 'TRK-98827712', destination: 'الدوحة، شارع الخليج', status: 'PENDING', carrier: 'FastTrack Logistics', last_update: 'منذ ساعتين' },
    { id: 'SHP-002', tracking_number: 'TRK-10229381', destination: 'الريان، حي الروضة', status: 'DISPATCHED', carrier: 'Qatar Post', last_update: 'منذ 5 ساعات' },
    { id: 'SHP-003', tracking_number: 'TRK-55612300', destination: 'الوكرة، مجمع الملاحة', status: 'PENDING', carrier: 'Aramex', last_update: 'منذ يوم' },
];

export default function CarrierShipmentsPage() {
    const { locale } = useParams();
    const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
    const [isBulkDispatchModalOpen, setIsBulkDispatchModalOpen] = useState(false);
    const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
    
    const drivers = [
        { id: 'DRV-101', name: 'سلطان القحطاني', status: 'ACTIVE', role: 'Driver' },
        { id: 'DRV-102', name: 'فهد السبيعي', status: 'ON_TRIP', role: 'Driver' },
        { id: 'DRV-103', name: 'محمد العلي', status: 'ACTIVE', role: 'Senior Driver' },
    ];

    const toggleSelection = (shipmentId: string) => {
        setSelectedShipments(prev => 
            prev.includes(shipmentId) 
            ? prev.filter(id => id !== shipmentId) 
            : [...prev, shipmentId]
        );
    };

    const columns: DataTableColumn<Shipment>[] = [
        {
            key: 'id',
            label: '',
            render: (id) => (
                <input 
                    type="checkbox" 
                    checked={selectedShipments.includes(id)}
                    onChange={() => toggleSelection(id)}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
            )
        },
        {
            key: 'tracking_number',
            label: 'رقم التتبع',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <Package size={18} className="text-text-placeholder" />
                    <span className="text-sm font-bold text-text-primary font-mono">{val}</span>
                </div>
            )
        },
        {
            key: 'destination',
            label: 'الوجهة',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-xs text-text-secondary font-medium">{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'الحالة',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider",
                        val === 'PENDING' ? 'bg-warning-light text-warning' : 'bg-success-light text-success'
                    )}>
                        {val === 'PENDING' ? 'قيد الانتظار' : 'تم التجهيز'}
                    </span>
                </div>
            )
        },
        {
            key: 'last_update',
            label: 'آخر تحديث',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-text-placeholder" />
                    <span className="text-[10px] text-text-placeholder">{val}</span>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Carrier">
            <DataTableLayout
                title="إدارة شحنات الأسطول"
                data={mockShipments}
                columns={columns}
                actions={
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            className="h-11 px-6 font-bold flex items-center gap-2"
                            onClick={() => setIsBulkDispatchModalOpen(true)}
                            disabled={selectedShipments.length === 0}
                        >
                            <Stack size={20} />
                            توزيع بالجملة
                        </Button>
                        <Button
                            variant="outline"
                            className="h-11 px-6 font-bold flex items-center gap-2"
                            onClick={() => setIsAssignDriverModalOpen(true)}
                            disabled={selectedShipments.length === 0}
                        >
                            <UserCircleGear size={20} />
                            تعيين سائق
                        </Button>
                        <Button 
                            variant="primary"
                            className="h-11 px-6 font-bold flex items-center gap-2"
                        >
                            <QrCode size={20} weight="bold" />
                            مسح طرد جديد
                        </Button>
                    </div>
                }
            >
                {selectedShipments.length > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md border border-primary/10 animate-in fade-in slide-in-from-top-1">
                        <Info size={20} weight="fill" className="text-primary" />
                        <p className="text-xs text-text-secondary font-medium">تم تحديد {selectedShipments.length} شحنات لتطبيق إجراءات جماعية.</p>
                    </div>
                )}
            </DataTableLayout>

            {/* Bulk Dispatch Modal */}
            <Modal 
                isOpen={isBulkDispatchModalOpen} 
                onClose={() => setIsBulkDispatchModalOpen(false)}
                title="توزيع الشحنات بالجملة"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsBulkDispatchModalOpen(false)}>
                            إلغاء
                        </Button>
                        <Button 
                            variant="primary"
                            onClick={() => {
                                console.log("Bulk Dispatching shipments:", selectedShipments);
                                setIsBulkDispatchModalOpen(false);
                            }}
                        >
                            تأكيد التوزيع
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-text-secondary leading-relaxed">
                        هل أنت متأكد من رغبتك في تحديث حالة <span className="font-bold text-text-primary">{selectedShipments.length}</span> شحنة إلى "تم التجهيز" (Dispatched)؟
                    </p>
                </div>
            </Modal>

            {/* Assign Driver Modal */}
            <Modal 
                isOpen={isAssignDriverModalOpen} 
                onClose={() => setIsAssignDriverModalOpen(false)}
                title="تعيين سائق للشحنات المحددة"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsAssignDriverModalOpen(false)}>
                            إلغاء
                        </Button>
                        <Button 
                            variant="primary"
                            onClick={() => {
                                console.log("Assigning driver to shipments:", selectedShipments);
                                setIsAssignDriverModalOpen(false);
                            }}
                        >
                            تأكيد التعيين
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-text-secondary">
                        سيتم تعيين السائق المختار لجميع الشحنات المحددة ({selectedShipments.length}).
                    </p>
                    <Select 
                        label="السائق المتاح" 
                        options={drivers.map(driver => ({ value: driver.id, label: `${driver.name} (${driver.role})` }))}
                    />
                </div>
            </Modal>
        </AppShell>
    );
}
