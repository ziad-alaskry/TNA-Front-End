'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import Modal from '@/components/ui/Modal'
import { PlusCircle, CheckCircle, Info, Door } from '@phosphor-icons/react'
import { useParams, useRouter } from 'next/navigation'
import { mockProperties, mockSubAddresses } from '@/lib/mock/properties.mock'
import { useLocale } from '@/i18n/LocaleProvider'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useTranslation } from 'react-i18next'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { subAddressesApi } from '@/lib/api/subAddresses'
import InputField from '@/components/ui/InputField'
import Textarea from '@/components/ui/Textarea'

export default function PropertyDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const {  locale, isRTL , t } = useLocale();

    const { data: properties, isLoading: propLoading } = useMock(mockProperties);
    const { data: subAddresses, isLoading: unitsLoading } = useMock(mockSubAddresses);

    const property = properties?.find(p => p.na_id === id);
    const units = subAddresses?.filter(s => s.na_id === id) || [];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const subUnitSchema = z.object({
      suffix_code: z.string().length(4, 'Must be exactly 4 characters'),
      description: z.string().optional().or(z.literal('')),
    });

    type SubUnitInputs = z.infer<typeof subUnitSchema>;

    const methods = useForm<SubUnitInputs>({
      resolver: zodResolver(subUnitSchema),
    });

    const onSubmit: SubmitHandler<SubUnitInputs> = async (data) => {
      const isDuplicate = units.some(
        (u: any) => u.suffix_code.toUpperCase() === data.suffix_code.toUpperCase()
      );

      if (isDuplicate) {
        methods.setError('suffix_code', {
          type: 'validate',
          message: 'Suffix code already exists for this property',
        });
        return;
      }

      try {
        await subAddressesApi.createSubAddress(na_id, {
          suffix_code: data.suffix_code,
          description: data.description,
          is_verified: false,
          is_available: true,
        });
        methods.reset();
        setIsModalOpen(false);
        window.location.reload();
      } catch (err) {
        console.error('Failed to create sub-unit:', err);
      }
    };

    if (propLoading || unitsLoading) return <div className="p-12 text-center">Loading property details...</div>;
    if (!property) return <div className="p-12 text-center text-error">Property not found</div>;

    const sections = [
        {
            title: t('owner.property_information_20'),
            description: t('owner.core_data_registered_with_the_national_a_21'),
            items: [
                { label: t('owner.full_address_22'), value: property.full_address },
                { label: t('owner.city_23'), value: property.city },
                { label: t('owner.district_24'), value: property.district },
                { label: t('owner.building_no_25'), value: property.building_number },
                { label: t('owner.title_deed_26'), value: <span className="font-mono text-xs">{property.title_deed_reference}</span> },
                {
                    label: t('owner.ownership_proof_27'),
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
                { label: t('owner.na_certificate_28'), value: property.na_certificate_url ?? 'Not available' },
            ]
        }
    ];

    const columns: DataTableColumn<any>[] = [
        {
            key: 'label',
            label: t('owner.unit_label_29'),
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
            label: t('owner.suffix_30'),
            width: '20%',
            render: (val) => <span className="font-mono font-bold text-primary">{val}</span>
        },
        {
            key: 'is_available',
            label: t('owner.status_31'),
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
                    <Button className="w-full py-4 shadow-glow-primary gap-2" onClick={() => setIsModalOpen(true)}>
                        <PlusCircle size={20} weight="bold" />
                        Add Sub-unit
                    </Button>
                    <Button variant="outline" className="w-full py-4 border-neutral-200 gap-2">
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
        <AppShell role="Owner">
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Sub-unit">
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                        <InputField
                            label="Sub-unit code"
                            helperText="4 characters identifying the unit (e.g. R101)"
                            maxLength={4}
                            {...methods.register('suffix_code')}
                        />
                        <Textarea
                            label="Description"
                            helperText="Optional (Room, Apartment, Suite...) "
                            {...methods.register('description')}
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="w-48">
                                Create Unit
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </Modal>
        </AppShell>
    );
}
