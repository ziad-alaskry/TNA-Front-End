'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import FormWizardLayout from '@/components/templates/FormWizardLayout'
import InputField from '@/components/ui/InputField'
import Select from '@/components/ui/Select'
import { 
    User, 
    IdentificationCard, 
    Phone, 
    Buildings, 
    Trash, 
    CheckCircle, 
    Info, 
    Key,
    ShieldCheck
} from '@phosphor-icons/react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useParams } from 'next/navigation'

const staffSchema = z.object({
  full_name: z.string().min(3, 'الاسم يجب أن يحتوي على ٣ أحرف على الأقل'),
  role: z.enum(['DRIVER', 'DISPATCHER', 'MANAGER']),
  mobile: z.string().regex(/^05\d{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام'),
  license_number: z.string().optional(), // Optional for non-drivers
  agency_type: z.string().optional(), // Placeholder for future agency type if needed
  personalDataConfirmed: z.boolean().refine(v => v === true, 'يجب الموافقة على صحة البيانات'),
});

type StaffInputs = z.infer<typeof staffSchema>;

export default function AddStaffPage() {
  const router = useRouter();
  const { locale } = useParams();
  
  const methods = useForm<StaffInputs>({
    resolver: zodResolver(staffSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      role: 'DRIVER',
      mobile: '',
      license_number: '',
      personalDataConfirmed: false,
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const { handleSubmit, watch, formState: { errors } } = methods;
  const selectedRole = watch('role');
  const isConfirmed = watch('personalDataConfirmed');

  const steps = [
    {
      id: 'step1',
      label: 'بيانات الموظف',
      title: 'تفاصيل الموظف',
      description: 'أدخل معلومات الموظف أو السائق الذي ستضيفه إلى فريق عملك.',
      content: (
        <div className="space-y-6">
          <InputField
            label="الاسم الكامل"
            icon={User}
            placeholder="اسم الموظف"
            error={errors.full_name?.message}
            {...methods.register('full_name')}
          />
          <Select
            label="الدور الوظيفي"
            options={[
              { value: 'DRIVER', label: 'سائق / مندوب' },
              { value: 'DISPATCHER', label: 'موزع عمليات' },
              { value: 'MANAGER', label: 'مدير عمليات' },
            ]}
            {...methods.register('role')}
            error={errors.role?.message}
          />
          <InputField
            label="رقم الجوال"
            icon={Phone}
            placeholder="05XXXXXXXX"
            type="tel"
            error={errors.mobile?.message}
            {...methods.register('mobile')}
          />
          {selectedRole === 'DRIVER' && (
            <InputField
              label="رقم رخصة القيادة"
              icon={IdentificationCard}
              placeholder="XXXXXXXXXX"
              error={errors.license_number?.message}
              {...methods.register('license_number')}
            />
          )}
        </div>
      ),
    },
    {
      id: 'step2',
      label: 'تأكيد البيانات',
      title: 'مراجعة وتأكيد',
      description: 'تأكد من صحة المعلومات المدخلة قبل إرسالها.',
      content: (
        <div className="space-y-6">
          <div className="bg-surface-200 border border-neutral-200 rounded-md divide-y divide-neutral-100 overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-neutral-500">الاسم</span>
              <span className="text-sm font-bold text-neutral-900">{watch('full_name')}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-neutral-500">الدور الوظيفي</span>
              <span className="text-sm font-bold text-neutral-900">
                {/* Map role value to label */}
                {
                  (() => {
                    switch(watch('role')) {
                      case 'DRIVER': return 'سائق / مندوب';
                      case 'DISPATCHER': return 'موزع عمليات';
                      case 'MANAGER': return 'مدير عمليات';
                      default: return '';
                    }
                  })()
                }
              </span>
            </div>
            {watch('role') === 'DRIVER' && (
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm text-neutral-500">رقم الرخصة</span>
                <span className="text-sm font-bold text-neutral-900">{watch('license_number') || 'غير متوفر'}</span>
              </div>
            )}
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-neutral-500">رقم الجوال</span>
              <span className="text-sm font-bold text-neutral-900">{watch('mobile')}</span>
            </div>
            <div className="p-4 bg-neutral-50 flex justify-between items-center">
              <span className="text-sm font-bold text-neutral-900">تأكيد صحة البيانات</span>
              <span className="text-lg font-bold text-primary">مؤكد</span>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-md border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors">
            <div className="relative mt-1">
                <input
                    type="checkbox"
                    className="sr-only"
                    {...methods.register('personalDataConfirmed')}
                />
                <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${
                    isConfirmed ? 'bg-primary border-primary' : 'border-neutral-300'
                }`}>
                    {isConfirmed && <CheckCircle size={16} weight="bold" className="text-white" />}
                </div>
            </div>
            <div className="flex-1">
                <span className="text-sm text-neutral-700 font-bold">أقر بصحة البيانات المقدمة</span>
                <p className="text-xs text-neutral-400 mt-1">جميع المعلومات المدخلة صحيحة ودقيقة.</p>
            </div>
          </label>
          {errors.personalDataConfirmed && <p className="text-xs text-error font-medium">{errors.personalDataConfirmed.message}</p>}
        </div>
      ),
    },
  ];

  const onSubmit: SubmitHandler<StaffInputs> = (data) => {
    console.log('Adding Staff:', data);
    // TODO: Implement API call to add staff
    router.push(`/${locale}/carrier/staff`); // Redirect back to staff list
  };

  return (
    <FormProvider {...methods}>
      <AppShell role="Carrier" header="إضافة موظف جديد">
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
