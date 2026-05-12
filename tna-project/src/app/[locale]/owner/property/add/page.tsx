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

const propertySchema = z.object({
  name: z.string().min(3, { message: 'اسم العقار يجب أن يحتوي على ٣ أحراف على الأقل' }),
  city: z.string().min(1, { message: 'يجب اختيار المدينة' }),
  district: z.string().min(1, { message: 'يجب اختيار الحي' }),
  registry_ref: z.string().min(5, { message: 'رقم السجل العقاري غير صحيح' }),
  building_number: z.string().min(4, { message: 'رقم المبنى يجب أن يتكون من ٤ أرقام' }),
  has_docs: z.boolean().refine(val => val === true, { message: 'يجب إرفاق المستندات للمتابعة' })
});

type PropertyInputs = z.infer<typeof propertySchema>;

export default function AddPropertyPage() {
  const router = useRouter();
  const { locale } = useParams();
  
  const methods = useForm<PropertyInputs>({
    resolver: zodResolver(propertySchema),
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
      label: 'موقع العقار',
      title: 'حدد موقع العقار',
      description: 'أدخل تفاصيل العنوان الجغرافي للعقار المراد تسجيله.',
      content: (
        <div className="space-y-6">
          <InputField
            label="اسم العقار (للتوضيح)"
            placeholder="مثال: فيلا الياسمين، عمارة النرجس"
            {...methods.register('name')}
            error={methods.formState.errors.name?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
                label="المدينة"
                options={[{ value: 'الرياض', label: 'الرياض' }, { value: 'جدة', label: 'جدة' }]}
                {...methods.register('city')}
            />
            <InputField
                label="الحي"
                placeholder="اسم الحي"
                {...methods.register('district')}
                error={methods.formState.errors.district?.message}
            />
          </div>
          <InputField
            label="رقم المبنى (٤ أرقام)"
            placeholder="XXXX"
            {...methods.register('building_number')}
            error={methods.formState.errors.building_number?.message}
          />
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-md flex gap-3">
             <MapPin size={24} className="text-primary shrink-0" weight="fill" />
             <p className="text-xs text-neutral-600 leading-relaxed">
                يتم التحقق من صحة العنوان عبر الربط مع الهيئة العامة للعقار. يرجى التأكد من دقة المعلومات.
             </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step2',
      label: 'بيانات السجل',
      title: 'تفاصيل الصك',
      description: 'أدخل معلومات الملكية والسجل العقاري المعتمدة.',
      content: (
        <div className="space-y-6">
          <InputField
            label="رقم صك الملكية / السجل"
            placeholder="أدخل الرقم المسجل في منصة إيجار أو الصك"
            {...methods.register('registry_ref')}
            error={methods.formState.errors.registry_ref?.message}
          />
          <div className="space-y-3">
            <p className="text-sm font-bold text-neutral-900">نوع العقار</p>
            <div className="grid grid-cols-2 gap-3">
                {['سكني', 'تجاري', 'مختلط', 'أخرى'].map(type => (
                    <button key={type} type="button" className="p-4 border border-neutral-200 rounded-md text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all">
                        {type}
                    </button>
                ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step3',
      label: 'المستندات',
      title: 'رفع الوثائق',
      description: 'يرجى إرفاق نسخة ضوئية من صك الملكية أو ما يثبت الحق في التصرف بالعقار.',
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
                    <p className="text-sm font-bold text-neutral-900">اضغط لرفع الملفات أو اسحبها هنا</p>
                    <p className="text-[10px] text-neutral-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
            </div>
            
            {methods.watch('has_docs') && (
                <div className="p-3 bg-success-bg border border-success/20 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-success" weight="fill" />
                        <span className="text-xs font-bold text-neutral-700">Property_Deed_Copy.pdf</span>
                    </div>
                    <button type="button" onClick={() => methods.setValue('has_docs', false)} className="text-[10px] font-bold text-error">حذف</button>
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
      <AppShell role="Owner" header="تسجيل عقار">
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