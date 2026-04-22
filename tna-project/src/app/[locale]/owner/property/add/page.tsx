'use client'

import React, { useState } from 'react';
import FormWizardLayout from '@/components/templates/FormWizardLayout'; // Assuming FormWizardLayout is here
import Input from '@/components/ui/InputField'; // Assuming Input component is available
import Button from '@/components/ui/Button'; // Assuming Button component is available
import FileUpload from '@/components/ui/FileUpload'; // Placeholder for Deed Upload
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Conceptual Data Model for owner_national_addresses
const ownerNationalAddressSchema = z.object({
  buildingName: z.string().min(1, { message: 'Building Name is required' }),
  unitNumber: z.string().min(1, { message: 'Unit Number is required' }),
  ownerNationalId: z.string().min(1, { message: 'National ID is required' }),
  deedFile: z.any().optional(), // Placeholder for file upload
});

type OwnerNationalAddressInputs = z.infer<typeof ownerNationalAddressSchema>;

// Assume t() function for translation is available
const t = (key: string) => key; // Placeholder for translation

export default function AddPropertyPage() {
  const methods = useForm<OwnerNationalAddressInputs>({
    resolver: zodResolver(ownerNationalAddressSchema),
    defaultValues: {
      buildingName: '',
      unitNumber: '',
      ownerNationalId: '',
      deedFile: undefined,
    },
  });

  const { handleSubmit, watch, formState: { errors, isValid, isDirty } } = methods;

  const [currentStep, setCurrentStep] = useState(0);

  // Assume FormWizardLayout uses locale/direction for dynamic styling if needed.
  // Here, we apply fixed orange accents as requested.

  const steps = [
    {
      id: 'step1',
      label: t('propertyDetails'),
      title: t('propertyDetails'),
      description: t('enterBuildingAndOwnerInfo'),
      content: (
        <>
          <Input
            label={t('buildingName')}
            {...methods.register('buildingName')}
            error={errors.buildingName?.message}
            className="mb-4" // Basic margin for spacing
          />
          <Input
            label={t('unitNumber')}
            {...methods.register('unitNumber')}
            error={errors.unitNumber?.message}
            className="mb-4"
          />
          <Input
            label={t('ownerNationalId')}
            {...methods.register('ownerNationalId')}
            error={errors.ownerNationalId?.message}
            className="mb-4"
          />
        </>
      ),
    },
    {
      id: 'step2',
      label: t('deedUpload'),
      title: t('deedUpload'),
      description: t('uploadPropertyDeed'),
      content: (
        <>
          <FileUpload
            label={t('deedDocument')}
            {...methods.register('deedFile')}
            error={errors.deedFile?.message as string}
            // Placeholder for upload component, ensuring it supports file types and validation
          />
        </>
      ),
    },
  ];

  const onSubmit: SubmitHandler<OwnerNationalAddressInputs> = (data) => {
    console.log('Form Data Submitted:', data);
    // Logic to bind inputs to owner_national_addresses Data Model
    // In a real app, this would involve API calls to save data.
    alert('Property details submitted successfully!');
    // Navigate to next step or final page upon successful submission
  };

  const handleStepChange = (newStep: number) => {
    if (newStep > currentStep) {
      // Trying to go forward, perform validation
      const currentStepFields = steps[currentStep]?.content?.props?.children?.map((child: any) => child?.props?.name).filter(Boolean);
      
      if (currentStepFields && currentStepFields.length > 0) {
        methods.trigger(currentStepFields as any).then(isValidStep => {
          if (isValidStep) {
            setCurrentStep(newStep);
          }
        });
      } else {
        // If no fields to validate in this step (e.g., review step), just move forward
        setCurrentStep(newStep);
      }
    } else {
      // Going backward or staying
      setCurrentStep(newStep);
    }
  };

  // Ensure the FormWizardLayout handles directionality and uses logical properties for its internal elements.
  return (
    <FormProvider {...methods}>
      <FormWizardLayout
        steps={steps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={() => {
            // Placeholder cancel logic
            alert('Cancelled');
        }}
        canProceed={true}
      >
        {steps[currentStep].content}
      </FormWizardLayout>
    </FormProvider>
  );
}