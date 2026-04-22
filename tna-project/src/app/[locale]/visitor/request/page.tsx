'use client'

import React, { useState } from 'react';
import FormWizardLayout from '@/components/templates/FormWizardLayout'; // Assuming FormWizardLayout is here
import Select from '@/components/ui/Select'; // Assuming Select component is available
import Button from '@/components/ui/Button'; // Assuming Button component is available
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Conceptual Data Model for visitor_tnas
const visitorTnaSchema = z.object({
  selectedAddress: z.string().min(1, { message: 'Address selection is required' }),
  selectedDuration: z.string().min(1, { message: 'Duration selection is required' }),
  paymentConfirmed: z.boolean().refine((val) => val === true, { message: 'Payment confirmation is required' }),
});

type VisitorTnaInputs = z.infer<typeof visitorTnaSchema>;

// Assume t() function for translation is available
const t = (key: string) => key; // Placeholder for translation

// Placeholder for fetching owner addresses - in a real app, this would come from an API or context
const ownerAddresses = [
  { id: 'addr1', name: '123 Main St, Building A, Unit 101' },
  { id: 'addr2', name: '456 Oak Ave, Building B, Unit 205' },
];

const durations = [
  { value: '1_month', label: '1 Month' },
  { value: '6_months', label: '6 Months' },
  { value: '1_year', label: '1 Year' },
];

export default function RequestTnaPage() {
  const methods = useForm<VisitorTnaInputs>({
    resolver: zodResolver(visitorTnaSchema),
    defaultValues: {
      selectedAddress: '',
      selectedDuration: '',
      paymentConfirmed: false,
    },
  });

  const { handleSubmit, watch, formState: { errors } } = methods;

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'step1',
      label: t('selectAddress'),
      title: t('selectAddress'),
      description: t('choosePropertyAddress'),
      content: (
        <Select
          label={t('address')}
          options={ownerAddresses.map(addr => ({ value: addr.id, label: addr.name }))}
          {...methods.register('selectedAddress')}
          error={errors.selectedAddress?.message}
          className="mb-4" // Basic margin for spacing
        />
      ),
    },
    {
      id: 'step2',
      label: t('selectDuration'),
      title: t('selectDuration'),
      description: t('chooseServiceDuration'),
      content: (
        <Select
          label={t('duration')}
          options={durations}
          {...methods.register('selectedDuration')}
          error={errors.selectedDuration?.message}
          className="mb-4"
        />
      ),
    },
    {
      id: 'step3',
      label: t('confirmPayment'),
      title: t('confirmPayment'),
      description: t('reviewAndConfirmPayment'),
      content: (
        <div>
          <p className="mb-4">{t('reviewDetails')}:</p>
          <p className="mb-2"><strong>{t('address')}:</strong> {watch('selectedAddress') ? ownerAddresses.find(addr => addr.id === watch('selectedAddress'))?.name : t('notSelected')}</p>
          <p className="mb-4"><strong>{t('duration')}:</strong> {watch('selectedDuration') ? durations.find(d => d.value === watch('selectedDuration'))?.label : t('notSelected')}</p>
          
          {/* Placeholder for payment integration */}
          <div className="mb-4 p-4 border border-cyan-300 bg-cyan-50 rounded-md">
            <p className="text-cyan-700 font-semibold">{t('paymentIntegrationPlaceholder')}</p>
            <p className="text-cyan-600 text-sm">{t('paymentDetailsWillBeDisplayedHere')}</p>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...methods.register('paymentConfirmed')}
              className="form-checkbox accent-cyan-500" // Apply cyan accent
            />
            <span className="text-gray-700">{t('iConfirmPayment')}</span>
          </label>
          {errors.paymentConfirmed && <p className="text-red-500 text-sm">{errors.paymentConfirmed.message}</p>}
        </div>
      ),
    },
  ];

  const onSubmit: SubmitHandler<VisitorTnaInputs> = (data) => {
    // Logic to create a record in visitor_tnas with status 'PENDING'
    console.log('Form Data Submitted:', data);
    // In a real app, this would involve an API call:
    // createVisitorTnaRecord({ ...data, status: 'PENDING' });
    alert('TNA request submitted successfully! Status: PENDING');
    // Navigate to a confirmation page or dashboard
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
  // Buttons and inputs are styled with cyan accents as requested.
  return (
    <FormProvider {...methods}>
      <FormWizardLayout
        steps={steps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={() => alert('Cancelled')}
        canProceed={true}
      >
        {steps[currentStep].content}
      </FormWizardLayout>
    </FormProvider>
  );
}
