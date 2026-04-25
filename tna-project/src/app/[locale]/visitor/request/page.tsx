'use client'

import React, { useState } from 'react';
import FormWizardLayout from '@/components/templates/FormWizardLayout';
import Select from '@/components/ui/Select';
import { 
    MapPin, 
    Calendar, 
    Wallet, 
    ArrowRight, 
    CheckCircle,
    Info
} from '@phosphor-icons/react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useBindingContext } from '@/context/BindingContext';

const visitorTnaSchema = z.object({
  selectedAddress: z.string().min(1, { message: 'يجب اختيار العقار المراد الربط به' }),
  selectedDuration: z.string().min(1, { message: 'يجب اختيار مدة الاشتراك' }),
  paymentConfirmed: z.boolean().refine((val) => val === true, { message: 'يجب تأكيد الدفع للمتابعة' }),
});

type VisitorTnaInputs = z.infer<typeof visitorTnaSchema>;

export default function RequestTnaPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { realEstateObjects } = useBindingContext();
  
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

  const durations = [
    { value: '1_month', label: 'شهر واحد (50 SAR)' },
    { value: '3_months', label: '3 أشهر (135 SAR)' },
    { value: '6_months', label: '6 أشهر (250 SAR)' },
    { value: '12_months', label: 'سنة كاملة (450 SAR)' },
  ];

  const steps = [
    {
      id: 'step1',
      label: 'اختيار العقار',
      title: 'حدد العقار',
      description: 'اختر العقار الذي ترغب في ربط عنوانك الوطني المؤقت به.',
      content: (
        <div className="space-y-6">
          <Select
            label="العقارات المتاحة"
            options={realEstateObjects.map(obj => ({ value: obj.id, label: obj.name }))}
            {...methods.register('selectedAddress')}
            error={errors.selectedAddress?.message}
          />
          <div className="p-4 bg-info-bg rounded-md flex gap-3 text-right">
            <Info size={24} className="text-primary shrink-0" weight="fill" />
            <p className="text-xs text-neutral-600 leading-relaxed">
              تظهر هنا العقارات الموثقة فقط والتي وافق ملاكها على قبول طلبات الربط.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step2',
      label: 'مدة الاشتراك',
      title: 'اختر المدة',
      description: 'حدد الفترة الزمنية التي ترغب في تفعيل العنوان خلالها.',
      content: (
        <div className="space-y-6">
          <Select
            label="مدة التفعيل"
            options={durations}
            {...methods.register('selectedDuration')}
            error={errors.selectedDuration?.message}
          />
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 border border-neutral-200 rounded-md bg-white">
                <p className="text-[10px] text-neutral-400 mb-1">الرصيد الحالي</p>
                <p className="font-bold text-neutral-900">250.00 SAR</p>
             </div>
             <div className="p-4 border border-neutral-200 rounded-md bg-white">
                <p className="text-[10px] text-neutral-400 mb-1">تكلفة الطلب</p>
                <p className="font-bold text-primary">50.00 SAR</p>
             </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step3',
      label: 'تأكيد الطلب',
      title: 'مراجعة وسداد',
      description: 'يرجى مراجعة تفاصيل الطلب قبل إتمام عملية السداد.',
      content: (
        <div className="space-y-6">
          <div className="bg-surface-200 border border-neutral-200 rounded-md divide-y divide-neutral-100 overflow-hidden">
            <div className="p-4 flex justify-between items-center">
                <span className="text-sm text-neutral-500 font-medium">العقار المختار</span>
                <span className="text-sm font-bold text-neutral-900">
                    {watch('selectedAddress') ? realEstateObjects.find(a => a.id === watch('selectedAddress'))?.name : 'لم يتم الاختيار'}
                </span>
            </div>
            <div className="p-4 flex justify-between items-center">
                <span className="text-sm text-neutral-500 font-medium">المدة المختارة</span>
                <span className="text-sm font-bold text-neutral-900">
                    {watch('selectedDuration') ? durations.find(d => d.value === watch('selectedDuration'))?.label : 'لم يتم الاختيار'}
                </span>
            </div>
            <div className="p-4 bg-neutral-50 flex justify-between items-center">
                <span className="text-sm font-bold text-neutral-900">إجمالي المبلغ</span>
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
                <span className="text-sm text-neutral-700 font-bold">أوافق على خصم الرسوم من المحفظة</span>
                <p className="text-xs text-neutral-400 mt-1">سيتم حسم المبلغ مباشرة وتفعيل العنوان بمجرد موافقة المالك.</p>
            </div>
          </label>
          {errors.paymentConfirmed && <p className="text-xs text-error font-medium">{errors.paymentConfirmed.message}</p>}
        </div>
      ),
    },
  ];

  const onSubmit: SubmitHandler<VisitorTnaInputs> = (data) => {
    console.log('Wizard Submitted:', data);
    router.push(`/${locale}/visitor/home`);
  };

  return (
    <FormProvider {...methods}>
      <AppShell role="Visitor" header="طلب عنوان وطني">
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
