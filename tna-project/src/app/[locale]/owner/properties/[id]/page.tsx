'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { 
    Buildings, 
    MapPin, 
    CheckCircle, 
    PlusCircle,
    Info,
    Door,
    IdentificationCard,
    Link as LinkIcon
} from '@phosphor-icons/react'
import { useParams, useRouter } from 'next/navigation'
import { mockProperties, mockSubAddresses } from '@/lib/mock/properties.mock'
import { mockBindings } from '@/lib/mock/bindings.mock'
import { useLocale } from '@/i18n/LocaleProvider'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'

export default function PropertyDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { locale, isRTL } = useLocale();

    const { data: properties, isLoading: propLoading } = useMock(mockProperties);
    const { data: subAddresses, isLoading: unitsLoading } = useMock(mockSubAddresses);

    const property = properties?.find(p => p.na_id === id);
    const units = subAddresses?.filter(s => s.na_id === id) || [];

    if (propLoading || unitsLoading) return <div className="p-12 text-center">Loading property details...</div>;
    if (!property) return <div className="p-12 text-center text-error">Property not found</div>;

    const sections = [
        {
            title: isRTL ? 'معلومات العقار' : 'Property Information',
            description: isRTL ? 'البيانات الأساسية المسجلة في العنوان الوطني.' : 'Core data registered with the National Address.',
            items: [
                { label: isRTL ? 'العنوان الكامل' : 'Full Address', value: property.full_address },
                { label: isRTL ? 'المدينة' : 'City', value: property.city },
                { label: isRTL ? 'الحي' : 'District', value: property.district },
                { label: isRTL ? 'رقم المبنى' : 'Building No', value: property.building_number },
                { label: isRTL ? 'صك الملكية' : 'Title Deed', value: <span className="font-mono text-xs">{property.title_deed_reference}</span> },
                {
                    label: isRTL ? 'إثبات الملكية' : 'Ownership Proof',
                    value: (
                        <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                            property.ownership_proof_status === 'VERIFIED' ? "bg-success/10 text-success" :
                            property.ownership_proof_status === 'PENDING' ? "bg-warning/10 text-warning" :
                            "bg-neutral-100 text-neutral-400"
                        )}>
                            {property.ownership_proof_status}
                        </span>
                    ),
                },
                { label: isRTL ? 'شهادة العنوان الوطني' : 'NA Certificate', value: property.na_certificate_url ?? 'Not available' },
            ]
        }
    ];

    const columns: DataTableColumn<any>[] = [
        {
            key: 'label',
            label: isRTL ? 'الوحدة' : 'Unit Label',
            width: '40%',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <Door size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{val}</span>
                        <span className="text-[10px] font-mono text-neutral-400">{row.sub_address_id}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'suffix_code',
            label: isRTL ? 'الكود' : 'Suffix',
            width: '20%',
            render: (val) => <span className="font-mono font-bold text-primary">{val}</span>
        },
        {
            key: 'is_available',
            label: isRTL ? 'الحالة' : 'Status',
            width: '20%',
            render: (val) => (
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                    val ? "bg-success/10 text-success" : "bg-neutral-100 text-neutral-400"
                )}>
                    {val ? 'Available' : 'Occupied'}
                </span>
            )
        },
        {
            key: 'sub_address_id',
            label: '',
            width: '20%',
            render: (id) => (
                <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="h-8 text-[10px] border-neutral-200">
                        Edit Unit
                    </Button>
                </div>
            )
        }
    ];

    const sidebar = (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Management</h3>
                <div className="space-y-3">
                    <Button className="w-full py-4 shadow-glow-primary">
                        <PlusCircle size={20} weight="bold" />
                        Add Sub-unit
                    </Button>
                    <Button variant="outline" className="w-full py-4 border-neutral-200">
                        <CheckCircle size={20} weight="bold" />
                        Verify Ownership
                    </Button>
                </div>
            </div>

            <div className="p-4 bg-info/5 rounded-2xl border border-info/10 space-y-2">
                <div className="flex items-center gap-2 text-info">
                  <Info size={20} weight="fill" />
                  <p className="text-xs font-bold uppercase tracking-wider">Property Tips</p>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                    Verified properties attract 3x more binding requests. Ensure your sub-units have clear labels for visitors.
                </p>
            </div>
        </div>
    );

    return (
        <AppShell role="Owner" header={isRTL ? 'تفاصيل العقار' : 'Property Details'}>
            <DetailViewLayout
                title={property.full_address}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/owner/properties`)}
            />
            
            {property.ownership_proof_status === 'VERIFIED' && (
                <div className="mt-12 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-neutral-900 tracking-tight">Manage Units</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Total: {units.length}</span>
                        </div>
                    </div>
                    <DataTableLayout 
                        columns={columns}
                        data={units}
                        isLoading={false}
                        title="Property Units"
                    />
                </div>
            )}
        </AppShell>
    );
}
