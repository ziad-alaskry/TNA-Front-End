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
    ArrowRight, 
    CheckCircle,
    Info,
    WarningCircle,
    XCircle,
    ArrowLeft
} from '@phosphor-icons/react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useBindingContext } from '@/context/BindingContext';
import Link from 'next/link';

const visitorTnaSchema = z.object({
  selectedDuration: z.string().min(1, { message: 'يجب اختيار مدة الاشتراك' }),
  paymentConfirmed: z.boolean().refine((val) => val === true, { message: 'يجب تأكيد الدفع للمتابعة' }),
});

type VisitorTnaInputs = z.infer<typeof visitorTnaSchema>;

export default function RequestTnaPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { visitorTnas, addVisitorTna } = useBindingContext();
  
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
      selectedDuration: '',
      paymentConfirmed: false,
    },
  });

  const { handleSubmit, watch, formState: { errors } } = methods;

  const durations = [
    { value: '1_month', label: 'شهر واحد (50 SAR)' },
    { value: '3_months', label: '3 أشهر (135 SAR)' },
    { value: '6_months', label: '6 أشهر (250 SAR)' },
    { value: '12_months', label: 'سنة كاملة (450 SAR)' },
  ];

  const steps = [
    {
      id: 'step1',
      label: 'مدة الاشتراك',
      title: 'اختر المدة',
      description: 'حدد الفترة الزمنية التي ترغب في تفعيل الكود خلالها.',
      content: (
        <div className="space-y-6">
          <Select
            label="مدة التفعيل"
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
      id: 'step2',
      label: 'تأكيد الطلب',
      title: 'مراجعة وسداد',
      description: 'يرجى مراجعة تفاصيل الطلب قبل إتمام عملية السداد.',
      content: (
        <div className="space-y-6">
          <div className="bg-surface-200 border border-neutral-200 rounded-md divide-y divide-neutral-100 overflow-hidden">
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
                <p className="text-xs text-neutral-400 mt-1">سيتم حسم المبلغ مباشرة وإصدار كود TNA قيد المراجعة.</p>
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
