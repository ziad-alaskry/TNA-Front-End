'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormWizardLayout from '@/components/templates/FormWizardLayout';
import InputField from '@/components/ui/InputField';
import Select from '@/components/ui/Select';
import { 
    Buildings, 
    IdentificationCard, 
    Phone, 
    Globe, 
    Key,
    CheckCircle,
    CaretLeft,
    WarningCircle
} from '@phosphor-icons/react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils/cn';

const companyRegistrationSchema = z.object({
  company_name: z.string().min(3, 'اسم الشركة يجب أن يحتوي على ٣ أحرف على الأقل'),
  company_type: z.enum(['LOGISTICS', 'DELIVERY', 'OTHER']),
  license_number: z.string().min(5, 'رقم الترخيص يجب أن يحتوي على ٥ أحرف على الأقل'),
  mobile: z.string().regex(/^05\d{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  api_key: z.string().optional(), // Optional for now, might be generated later
  webhook_url: z.string().url({ message: 'رابط ويب هوك غير صالح' }).optional(),
  api_data_confirmed: z.boolean().refine(v => v === true, 'يجب الموافقة على صحة البيانات'),
});

type CompanyRegistrationInputs = z.infer<typeof companyRegistrationSchema>;

export default function LogisticsCompanyRegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<CompanyRegistrationInputs>({
    resolver: zodResolver(companyRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      company_name: '',
      company_type: 'LOGISTICS',
      license_number: '',
      mobile: '',
      email: '',
      api_key: '',
      webhook_url: '',
      api_data_confirmed: false,
    }
  });

  const { handleSubmit, watch, formState: { errors } } = methods;
  const companyType = watch('company_type');
  const isConfirmed = watch('api_data_confirmed');

  const steps = [
    {
      id: 'step1',
      label: 'بيانات الشركة',
      title: 'معلومات الشركة',
      description: 'أدخل التفاصيل الأساسية لشركتكم اللوجستية.',
      content: (
        <div className="space-y-6">
          <InputField
            label="اسم الشركة الرسمي"
            icon={Buildings}
            placeholder="اسم الشركة"
            {...methods.register('company_name')}
            error={errors.company_name?.message}
          />
          <Select
            label="نوع الشركة"
            options={[
              { value: 'LOGISTICS', label: 'شركة خدمات لوجستية' },
              { value: 'DELIVERY', label: 'شركة شحن وتوصيل' },
              { value: 'OTHER', label: 'أخرى' },
            ]}
            {...methods.register('company_type')}
            error={errors.company_type?.message}
          />
          <InputField
            label="رقم السجل التجاري / الترخيص"
            icon={IdentificationCard}
            placeholder="XXXXXX"
            {...methods.register('license_number')}
            error={errors.license_number?.message}
          />
          <InputField
            label="رقم الجوال الرئيسي"
            icon={Phone}
            placeholder="05XXXXXXXX"
            type="tel"
            error={errors.mobile?.message}
            {...methods.register('mobile')}
          />
          <InputField
            label="البريد الإلكتروني الرسمي"
            icon={Globe}
            placeholder="contact@yourcompany.com"
            type="email"
            error={errors.email?.message}
            {...methods.register('email')}
          />
        </div>
      ),
    },
    {
      id: 'step2',
      label: 'إعدادات الربط',
      title: 'إعدادات API والويب هوك',
      description: 'قم بتوفير مفاتيح API وربط الويب هوك لتفعيل التكامل.',
      content: (
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-label font-bold text-neutral-700 ps-1">مفتاح API السري (Live Secret Key)</label>
            <div className="relative group">
              <InputField 
                type="password"
                readOnly
                value="**********" // Masked for security
                placeholder="سيتم توليده أو إدخاله"
                className="font-mono text-xs"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button className="p-2 text-neutral-400 hover:text-primary transition-colors">
                  <Copy size={18} />
                </button>
                <button className="p-2 text-neutral-400 hover:text-primary transition-colors">
                  <ArrowsClockwise size={18} />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 ps-1">
              يجب أن يبقى مفتاح API السري سرياً. لا تشاركه مع أي طرف غير موثوق.
            </p>
          </div>
          <InputField
            label="رابط ويب هوك (Webhook URL)"
            icon={Webhook}
            placeholder="https://api.yourcompany.com/tna-updates"
            error={errors.webhook_url?.message}
            {...methods.register('webhook_url')}
          />
          <div className="p-4 bg-warning-bg border border-warning/10 rounded-md">
            <p className="text-[10px] text-warning font-bold flex items-center gap-2">
              <WarningCircle size={14} weight="fill" />
              تأمين الاتصال
            </p>
            <p className="text-[10px] text-neutral-600 mt-1 leading-relaxed">
              يجب أن يكون رابط الويب هوك مشفراً (HTTPS) لاستقبال التحديثات بشكل آمن.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step3',
      label: 'تأكيد وتسجيل',
      title: 'مراجعة وتأكيد',
      description: 'تأكد من جميع التفاصيل قبل إتمام تسجيل شركتكم.',
      content: (
        <div className="space-y-6">
          <div className="bg-surface-200 border border-neutral-200 rounded-md divide-y divide-neutral-100 overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-neutral-500">اسم الشركة</span>
              <span className="text-sm font-bold text-neutral-900">{watch('company_name')}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-neutral-500">نوع الشركة</span>
              <span className="text-sm font-bold text-neutral-900">
                {watch('company_type') === 'LOGISTICS' ? 'شركة خدمات لوجستية' : watch('company_type')}
              </span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-neutral-500">رقم الترخيص</span>
              <span className="text-sm font-bold text-neutral-900">{watch('license_number')}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-neutral-500">رقم الجوال</span>
              <span className="text-sm font-bold text-neutral-900">{watch('mobile')}</span>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-neutral-500">البريد الإلكتروني</span>
              <span className="text-sm font-bold text-neutral-900">{watch('email')}</span>
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
                    {...methods.register('api_data_confirmed')}
                />
                <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${
                    isConfirmed ? 'bg-primary border-primary' : 'border-neutral-300'
                }`}>
                    {isConfirmed && <CheckCircle size={16} weight="bold" className="text-white" />}
                </div>
            </div>
            <div className="flex-1">
                <span className="text-sm text-neutral-700 font-bold">أقر بصحة بيانات الشركة</span>
                <p className="text-xs text-neutral-400 mt-1">جميع المعلومات المدخلة صحيحة ودقيقة.</p>
            </div>
          </label>
          {errors.api_data_confirmed && <p className="text-xs text-error font-medium">{errors.api_data_confirmed.message}</p>}
        </div>
      ),
    },
  ];

  const onSubmit: SubmitHandler<CompanyRegistrationInputs> = (data) => {
    console.log('Registering Company:', data);
    // TODO: Implement API call to register company
    router.push('/carrier/home'); // Redirect to carrier dashboard
  };

  return (
    <AppShell role="Carrier" header="تسجيل شركة خدمات لوجستية">
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
  );
}
