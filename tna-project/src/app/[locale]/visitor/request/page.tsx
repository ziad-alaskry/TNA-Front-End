'use client'

import React, { useState, useEffect } from 'react';
import FormWizardLayout from '@/components/templates/FormWizardLayout';
import { AppShell } from '@/components/layout/AppShell';
import Select from '@/components/ui/Select';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';
import { 
    MapPin, 
    Calendar, 
    Wallet, 
    CheckCircle,
    Info,
    WarningCircle,
    XCircle
} from '@phosphor-icons/react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useBindingContext } from '@/context/BindingContext';
import { useLocale } from '@/i18n/LocaleProvider';

const getVisitorTnaSchema = (t: any) => z.object({
  selectedAddress: z.string().min(1, { message: t('visitor.request.error_address_required') }),
  selectedDuration: z.string().min(1, { message: t('visitor.request.error_duration_required') }),
  paymentConfirmed: z.boolean().refine((val) => val === true, { message: t('visitor.request.error_payment_required') }),
});

type VisitorTnaInputs = z.infer<ReturnType<typeof getVisitorTnaSchema>>;

export default function RequestTnaPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { visitorTnas, addVisitorTna, realEstateObjects } = useBindingContext();
  const { t } = useLocale();
  
  const visitorTnaSchema = getVisitorTnaSchema(t);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedTna, setGeneratedTna] = useState('');
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  useEffect(() => {
    // Basic eligibility check: Max 3 active/pending TNAs
    const activeTnas = visitorTnas.filter(t => t.status === 'ACTIVE' || t.status === 'PENDING');
    setIsEligible(activeTnas.length < 3);
  }, [visitorTnas]);

  const methods = useForm<VisitorTnaInputs>({
    resolver: zodResolver(visitorTnaSchema),
    defaultValues: {
      selectedAddress: '',
      selectedDuration: '',
      paymentConfirmed: false,
    },
  });

  const { handleSubmit, watch, formState: { errors } } = methods;

  const durations = [
    { value: '1_month', label: t('visitor.request.duration_1m') },
    { value: '3_months', label: t('visitor.request.duration_3m') },
    { value: '6_months', label: t('visitor.request.duration_6m') },
    { value: '12_months', label: t('visitor.request.duration_12m') },
  ];

  const steps = [
    {
      id: 'step1',
      label: t('visitor.request.step1_label'),
      title: t('visitor.request.step1_title'),
      description: t('visitor.request.step1_desc'),
      content: (
        <div className="space-y-6">
          <Select
            label={t('visitor.request.available_properties')}
            options={realEstateObjects.map(obj => ({ value: obj.id, label: obj.name }))}
            {...methods.register('selectedAddress')}
            error={errors.selectedAddress?.message}
          />
          <div className="p-4 bg-info-bg rounded-md flex gap-3 text-right">
            <Info size={24} className="text-primary shrink-0" weight="fill" />
            <p className="text-xs text-neutral-600 leading-relaxed">
              {t('visitor.request.available_properties_info')}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step2',
      label: t('visitor.request.step2_label'),
      title: t('visitor.request.step2_title'),
      description: t('visitor.request.step2_desc'),
      content: (
        <div className="space-y-6">
          <Select
            label={t('visitor.request.activation_duration')}
            options={durations}
            {...methods.register('selectedDuration')}
            error={errors.selectedDuration?.message}
          />
          <div className="p-4 bg-info-bg rounded-md flex gap-3 text-right">
            <Info size={24} className="text-primary shrink-0" weight="fill" />
            <p className="text-xs text-neutral-600 leading-relaxed">
              بمجرد إصدار الكود، ستحتاج لموافقة الجهات الحكومية قبل أن تتمكن من ربطه بأي عنوان.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 border border-neutral-200 rounded-md bg-white">
                <p className="text-[10px] text-neutral-400 mb-1">{t('visitor.request.current_balance')}</p>
                <p className="font-bold text-neutral-900">250.00 SAR</p>
             </div>
             <div className="p-4 border border-neutral-200 rounded-md bg-white">
                <p className="text-[10px] text-neutral-400 mb-1">{t('visitor.request.request_cost')}</p>
                <p className="font-bold text-primary">50.00 SAR</p>
             </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step3',
      label: t('visitor.request.step3_label'),
      title: t('visitor.request.step3_title'),
      description: t('visitor.request.step3_desc'),
      content: (
        <div className="space-y-6">
          <div className="bg-surface-200 border border-neutral-200 rounded-md divide-y divide-neutral-100 overflow-hidden">
            <div className="p-4 flex justify-between items-center">
                <span className="text-sm text-neutral-500 font-medium">{t('visitor.request.chosen_property')}</span>
                <span className="text-sm font-bold text-neutral-900">
                    {watch('selectedAddress') ? realEstateObjects.find(a => a.id === watch('selectedAddress'))?.name : t('visitor.request.not_selected')}
                </span>
            </div>
            <div className="p-4 flex justify-between items-center">
                <span className="text-sm text-neutral-500 font-medium">{t('visitor.request.chosen_duration')}</span>
                <span className="text-sm font-bold text-neutral-900">
                    {watch('selectedDuration') ? durations.find(d => d.value === watch('selectedDuration'))?.label : t('visitor.request.not_selected')}
                </span>
            </div>
            <div className="p-4 bg-neutral-50 flex justify-between items-center">
                <span className="text-sm font-bold text-neutral-900">{t('visitor.request.total_amount')}</span>
                <span className="text-lg font-bold text-primary">50.00 SAR</span>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-md border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors">
            <div className="relative mt-1">
                <input
                    type="checkbox"
                    className="sr-only"
                    {...methods.register('paymentConfirmed')}
                />
                <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${watch('paymentConfirmed') ? 'bg-primary border-primary' : 'border-neutral-300'}`}>
                    {watch('paymentConfirmed') && <CheckCircle size={16} weight="bold" className="text-white" />}
                </div>
            </div>
            <div className="flex-1">
                <span className="text-sm text-neutral-700 font-bold">{t('visitor.request.agree_deduct')}</span>
                <p className="text-xs text-neutral-400 mt-1">{t('visitor.request.deduct_info')}</p>
            </div>
          </label>
          {errors.paymentConfirmed && <p className="text-xs text-error font-medium">{errors.paymentConfirmed.message}</p>}
        </div>
      ),
    },
  ];

  const onSubmit: SubmitHandler<VisitorTnaInputs> = (data) => {
    const tnaCode = `TNA-${Math.floor(100000 + Math.random() * 900000)}`;
    addVisitorTna({
      tna_code: tnaCode,
      status: 'PENDING',
      visitor_id: 'visitor-01', // Mocked
    });
    setGeneratedTna(tnaCode);
    setIsSubmitted(true);
  };

  if (isEligible === false) {
    return (
      <AppShell role="Visitor" header="طلب عنوان وطني">
        <div className="max-w-2xl mx-auto py-12">
            <EmptyState
                title="لقد تجاوزت الحد المسموح"
                description="عذراً، لا يمكنك طلب أكثر من 3 عناوين وطنية مؤقتة نشطة في نفس الوقت. يرجى إلغاء أحد العناوين الحالية لتتمكن من طلب عنوان جديد."
                actionLabel="العودة للرئيسية"
                onAction={() => router.push(`/${locale}/visitor/home`)}
            />
        </div>
      </AppShell>
    );
  }

  if (isSubmitted) {
    return (
        <AppShell role="Visitor" header="طلب عنوان وطني">
            <div className="max-w-xl mx-auto py-12 px-4">
                <div className="bg-white border border-neutral-200 rounded-lg shadow-card p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-success-bg rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={48} weight="fill" className="text-success" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">تم تقديم الطلب بنجاح!</h2>
                        <p className="text-neutral-500 mt-2">طلبك الآن قيد المراجعة من قبل مالك العقار.</p>
                    </div>
                    
                    <div className="p-6 bg-neutral-50 rounded-md border border-dashed border-neutral-300">
                        <p className="text-xs text-neutral-400 mb-2 uppercase tracking-wider font-bold">كود العنوان المتوقع</p>
                        <p className="text-3xl font-mono font-extrabold text-primary">{generatedTna}</p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button 
                            className="w-full h-12 rounded-md font-bold ui-gradient-primary text-white border-none shadow-glow-primary"
                            onClick={() => router.push(`/${locale}/visitor/tnas`)}
                        >
                            متابعة حالة العناوين
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full h-12 rounded-md font-bold border-neutral-200 text-neutral-600"
                            onClick={() => router.push(`/${locale}/visitor/home`)}
                        >
                            العودة للرئيسية
                        </Button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
  }

  return (
    <FormProvider {...methods}>
      <AppShell role="Visitor" header={t('visitor.request.header')}>
        <FormWizardLayout
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => router.back()}
            canProceed={true}
        >
            {steps[currentStep].content}
        </FormWizardLayout>
      </AppShell>
    </FormProvider>
  );
}
