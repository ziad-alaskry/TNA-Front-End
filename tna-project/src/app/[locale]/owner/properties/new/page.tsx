'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormWizardLayout from '@/components/templates/FormWizardLayout';
import InputField from '@/components/ui/InputField';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale } from '@/i18n/LocaleProvider'

const propertySchema = z.object({
  // Step 1: Address fields
  building_number: z.string().min(1, 'Building number is required'),
  street: z.string().min(1, 'Street is required'),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  postal_code: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  // Step 2: Document upload
  title_deed_reference: z.string().min(1, 'Title deed reference is required'),
});

type PropertyInputs = z.infer<typeof propertySchema>;

export default function AddPropertyPage() {
  const router = useRouter();
  const { t, isRTL } = useLocale();
  const methods = useForm<PropertyInputs>({
    resolver: zodResolver(propertySchema),
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: '1', label: t('owner.property.registration'), description: t('owner.property.address_info') },
    { id: '2', label: t('owner.property.document_upload'), description: t('owner.property.title_deed_reference') },
    { id: '3', label: t('owner.property.review'), description: t('common.confirm') },
  ];

  const onSubmit: SubmitHandler<PropertyInputs> = (data) => {
    // TODO: Replace with actual API call
    // const { data: property } = await createProperty(data);
    // router.push(`/owner/properties/${property.na_id}`);
    alert(t('owner.property.property_registered'));
    router.push('/owner/properties');
  };

  const values = methods.getValues();

  return (
    <FormProvider {...methods}>
      <FormWizardLayout
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {currentStep === 0 && (
          <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <InputField label={t('owner.property.building_number')} {...methods.register('building_number')} />
            <InputField label={t('owner.property.street')} {...methods.register('street')} />
            <InputField label={t('owner.property.district')} {...methods.register('district')} />
            <InputField label={t('owner.property.city')} {...methods.register('city')} />
            <InputField label={t('owner.property.postal_code')} {...methods.register('postal_code')} />
            <InputField label={t('owner.property.latitude')} {...methods.register('latitude')} />
            <InputField label={t('owner.property.longitude')} {...methods.register('longitude')} />
          </div>
        )}
        {currentStep === 1 && (
          <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <InputField label={t('owner.property.title_deed_reference')} {...methods.register('title_deed_reference')} />
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <h3 className="text-lg font-bold text-neutral-900">{t('owner.property.review')}</h3>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span>{t('owner.property.building_number')}:</span>
                <span className="font-mono">{values.building_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('owner.property.street')}:</span>
                <span className="font-mono">{values.street}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('owner.property.district')}:</span>
                <span className="font-mono">{values.district}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t('owner.property.city')}:</span>
                <span className="font-mono">{values.city}</span>
              </div>
              {values.postal_code && (
                <div className="flex items-center justify-between">
                  <span>{t('owner.property.postal_code')}:</span>
                  <span className="font-mono">{values.postal_code}</span>
                </div>
              )}
              {values.latitude && (
                <div className="flex items-center justify-between">
                  <span>{t('owner.property.latitude')}:</span>
                  <span className="font-mono">{values.latitude}</span>
                </div>
              )}
              {values.longitude && (
                <div className="flex items-center justify-between">
                  <span>{t('owner.property.longitude')}:</span>
                  <span className="font-mono">{values.longitude}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>{t('owner.property.title_deed_reference')}:</span>
                <span className="font-mono">{values.title_deed_reference}</span>
              </div>
            </div>
          </div>
        )}
      </FormWizardLayout>
    </FormProvider>
  );
}