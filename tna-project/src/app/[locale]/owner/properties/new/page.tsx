'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormWizardLayout from '@/components/templates/FormWizardLayout';
import InputField from '@/components/ui/InputField';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const t = (key: string) => key;

const propertySchema = z.object({
  na_id: z.string().min(1, 'NA ID is required'),
  title_deed_reference: z.string().min(1, 'Title deed reference is required'),
  subAddress: z.string().min(1, 'At least one sub-address is required'),
});

type PropertyInputs = z.infer<typeof propertySchema>;

export default function AddPropertyPage() {
  const router = useRouter();
  const methods = useForm<PropertyInputs>({
    resolver: zodResolver(propertySchema),
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: '1', label: t('propertyRegistration'), description: t('basicInfo') },
    { id: '2', label: t('subAddressCreation'), description: t('addDetails') },
  ];

  const onSubmit: SubmitHandler<PropertyInputs> = (data) => {
    alert(t('propertyRegistered'));
    router.push('/owner/properties');
  };

  return (
    <FormProvider {...methods}>
      <FormWizardLayout
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSubmit={methods.handleSubmit(onSubmit)}
        submitButtonProps={{ className: 'bg-[linear-gradient(135deg,#02488D,#00B4C9)] text-white' }}
      >
        {currentStep === 0 && (
          <div className="space-y-4" dir="rtl">
            <InputField label={t('naId')} {...methods.register('na_id')} />
            <InputField label={t('titleDeedReference')} {...methods.register('title_deed_reference')} />
          </div>
        )}
        {currentStep === 1 && (
          <div className="space-y-4" dir="rtl">
            <InputField label={t('subAddress')} {...methods.register('subAddress')} />
          </div>
        )}
      </FormWizardLayout>
    </FormProvider>
  );
}
