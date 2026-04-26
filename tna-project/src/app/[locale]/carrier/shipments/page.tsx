'use client'

    const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
    const [isBulkDispatchModalOpen, setIsBulkDispatchModalOpen] = useState(false);
    const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
    const [drivers, setDrivers] = useState([
        { id: 'DRV-101', name: 'سلطان القحطاني', status: 'ACTIVE' },
        { id: 'DRV-102', name: 'فهد السبيعي', status: 'ON_TRIP' },
        { id: 'DRV-103', name: 'محمد العلي', status: 'ACTIVE' },
    ]);

    const toggleSelection = (shipmentId: string) => {
        setSelectedShipments(prev => 
            prev.includes(shipmentId) 
            ? prev.filter(id => id !== shipmentId) 
            : [...prev, shipmentId]
        );
    };

    const columns: DataTableColumn<Shipment>[] = [
        {
            key: 'id', // Use ID for selection logic
            label: '',
            render: (id, row) => (
                <input 
                    type="checkbox" 
                    checked={selectedShipments.includes(id)}
                    onChange={() => toggleSelection(id)}
                    className="w-4 h-4 rounded accent-primary"
                />
            )
        },
...
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
                            مسح طرد جديد
                        </Button>
                    </div>
                }
            >
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md border border-primary/10">
                    <Info size={20} weight="fill" className="text-primary" />
                    <p className="text-xs text-neutral-600">يمكنك تحديد شحنات متعددة لتطبيق إجراءات جماعية.</p>
                </div>
            </DataTableLayout>
        </div>

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
                    <Button variant="ghost" className="flex-1" onClick={() => setIsBulkDispatchModalOpen(false)}>
                        إلغاء
                    </Button>
                    <Button 
                        className="flex-1 ui-gradient-primary border-none shadow-glow-primary"
                        onClick={() => {
                            console.log("Bulk Dispatching shipments:", selectedShipments);
                            setIsBulkDispatchModalOpen(false);
                            // TODO: Implement bulk dispatch logic
                        }}
                    >
                        تأكيد التوزيع
                    </button>
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
                    <Button variant="ghost" className="flex-1" onClick={() => setIsAssignDriverModalOpen(false)}>
                        إلغاء
                    </Button>
                    <Button 
                        className="flex-1 ui-gradient-primary border-none shadow-glow-primary"
                        onClick={() => {
                            console.log("Assigning driver to shipments:", selectedShipments);
                            setIsAssignDriverModalOpen(false);
                            // TODO: Implement driver assignment logic
                        }}
                    >
                        تأكيد التعيين
                    </button>
                </div>
            </div>
        </Modal>
    </AppShell>
);
