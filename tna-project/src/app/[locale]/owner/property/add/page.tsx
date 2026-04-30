'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import FormWizardLayout from '@/components/templates/FormWizardLayout'
import InputField from '@/components/ui/InputField'
import Select from '@/components/ui/Select'
import { 
    MapPin, 
    IdentificationCard, 
    FileArrowUp, 
    CheckCircle,
    Info,
    CloudArrowUp,
    Buildings
} from '@phosphor-icons/react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'

const getPropertySchema = (t: any) => z.object({
  name: z.string().min(3, { message: t('owner.add_property.err_name') }),
  city: z.string().min(1, { message: t('owner.add_property.err_city') }),
  district: z.string().min(1, { message: t('owner.add_property.err_district') }),
  registry_ref: z.string().min(5, { message: t('owner.add_property.err_registry') }),
  building_number: z.string().min(4, { message: t('owner.add_property.err_building') }),
  has_docs: z.boolean().refine(val => val === true, { message: t('owner.add_property.err_docs') })
});

type PropertyInputs = {
  name: string;
  city: string;
  district: string;
  registry_ref: string;
  building_number: string;
  has_docs: boolean;
};

export default function AddPropertyPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { t } = useLocale();
  
  const methods = useForm<PropertyInputs>({
    resolver: zodResolver(getPropertySchema(t)),
    defaultValues: {
        name: '',
        city: 'الرياض',
        district: '',
        registry_ref: '',
        building_number: '',
        has_docs: false
    }
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'step1',
      label: t('owner.add_property.step1_label'),
      title: t('owner.add_property.step1_title'),
      description: t('owner.add_property.step1_desc'),
      content: (
        <div className="space-y-6">
          <InputField
            label={t('owner.add_property.name_label')}
            placeholder={t('owner.add_property.name_placeholder')}
            {...methods.register('name')}
            error={methods.formState.errors.name?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
                label={t('owner.add_property.city_label')}
                options={[{ value: 'الرياض', label: t('common.routes.search') === 'البحث' ? 'الرياض' : 'Riyadh' }, { value: 'جدة', label: t('common.routes.search') === 'البحث' ? 'جدة' : 'Jeddah' }]}
                {...methods.register('city')}
            />
            <InputField
                label={t('owner.add_property.district_label')}
                placeholder={t('owner.add_property.district_placeholder')}
                {...methods.register('district')}
                error={methods.formState.errors.district?.message}
            />
          </div>
          <InputField
            label={t('owner.add_property.building_label')}
            placeholder="XXXX"
            {...methods.register('building_number')}
            error={methods.formState.errors.building_number?.message}
          />
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-md flex gap-3">
             <MapPin size={24} className="text-primary shrink-0" weight="fill" />
             <p className="text-xs text-neutral-600 leading-relaxed">
                {t('owner.add_property.address_verification_note')}
             </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step2',
      label: t('owner.add_property.step2_label'),
      title: t('owner.add_property.step2_title'),
      description: t('owner.add_property.step2_desc'),
      content: (
        <div className="space-y-6">
          <InputField
            label={t('owner.add_property.registry_label')}
            placeholder={t('owner.add_property.registry_placeholder')}
            {...methods.register('registry_ref')}
            error={methods.formState.errors.registry_ref?.message}
          />
          <div className="space-y-3">
            <p className="text-sm font-bold text-neutral-900">{t('owner.add_property.property_type')}</p>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { id: 'residential', label: t('owner.add_property.type_residential') },
                    { id: 'commercial', label: t('owner.add_property.type_commercial') },
                    { id: 'mixed', label: t('owner.add_property.type_mixed') },
                    { id: 'other', label: t('owner.add_property.type_other') }
                ].map(type => (
                    <button key={type.id} type="button" className="p-4 border border-neutral-200 rounded-md text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all">
                        {type.label}
                    </button>
                ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step3',
      label: t('owner.add_property.step3_label'),
      title: t('owner.add_property.step3_title'),
      description: t('owner.add_property.step3_desc'),
      content: (
        <div className="space-y-6">
            <div 
                onClick={() => methods.setValue('has_docs', true)}
                className={`p-10 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                    methods.watch('has_docs') ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-primary/50'
                }`}
            >
                <CloudArrowUp size={48} weight="thin" className={methods.watch('has_docs') ? 'text-primary' : 'text-neutral-300'} />
                <div className="text-center">
                    <p className="text-sm font-bold text-neutral-900">{t('owner.add_property.upload_click')}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
            </div>
            
            {methods.watch('has_docs') && (
                <div className="p-3 bg-success-bg border border-success/20 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-success" weight="fill" />
                        <span className="text-xs font-bold text-neutral-700">Property_Deed_Copy.pdf</span>
                    </div>
                    <button type="button" onClick={() => methods.setValue('has_docs', false)} className="text-[10px] font-bold text-error">{t('common.delete')}</button>
                </div>
            )}
            
            {methods.formState.errors.has_docs && <p className="text-xs text-error font-medium">{methods.formState.errors.has_docs.message}</p>}
        </div>
      ),
    },
  ];

  const onSubmit: SubmitHandler<PropertyInputs> = (data) => {
    console.log('Adding Property:', data);
    // Simulate API call
    router.push(`/${locale}/owner/properties`);
  };

  return (
    <FormProvider {...methods}>
      <AppShell role="Owner" header={t('owner.add_property.header')}>
        <FormWizardLayout
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSubmit={methods.handleSubmit(onSubmit)}
            onCancel={() => router.back()}
            canProceed={true}
        >
            {steps[currentStep].content}
        </FormWizardLayout>
      </AppShell>
    </FormProvider>
  );
}