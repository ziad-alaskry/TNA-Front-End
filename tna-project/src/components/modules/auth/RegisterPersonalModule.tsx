'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User as UserIcon,
    IdentificationCard,
    Calendar,
    Phone,
    CaretLeft,
    CaretRight,
    CaretDown,
    Check,
    CheckSquare
} from '@phosphor-icons/react';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { useT } from '@/lib/hooks/useT';
import InputField from '@/components/ui/InputField';
import ProgressStepper from '@/components/ui/ProgressStepper';
import Select from '@/components/ui/Select';
import { cn } from '@/lib/utils/cn';

const schema = z.object({
    full_name: z.string().min(5, 'الاسم يجب أن يكون 5 أحرف على الأقل'),
    document_type: z.enum(['VISA', 'IQAMA', 'PASSPORT']),
    document_number: z.string().min(8, 'رقم الوثيقة غير صحيح'),
    date_of_birth: z.string().min(1, 'مطلوب'),
    mobile: z.string().regex(/^05\d{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام'),
    nationality: z.string().min(2, 'مطلوب'),
    personalDataConfirmed: z.boolean().refine(v => v === true, 'يجب الموافقة على صحة البيانات'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPersonalModule() {
    const router = useRouter();
    const { t } = useT();
    const { formData, updateFormData, setStep } = useRegistrationStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            full_name: formData.full_name || '',
            document_type: (formData as any).document_type || 'PASSPORT',
            document_number: (formData as any).document_number || '',
            date_of_birth: (formData as any).date_of_birth || '',
            mobile: formData.mobile || '',
            nationality: formData.nationality || 'SA',
            personalDataConfirmed: false,
        },
    });

    const selectedDocType = watch('document_type');
    const isConfirmed = watch('personalDataConfirmed');

    const onSubmit = (data: FormData) => {
        const { personalDataConfirmed, ...rest } = data;
        updateFormData(rest);
        setStep(3);
        router.push('/auth/register/account');
    };

    const docTypeLabels: Record<string, string> = {
        PASSPORT: 'جواز سفر',
        VISA: 'تأشيرة',
        IQAMA: 'إقامة',
    };

    return (
        <div className="min-h-screen bg-surface-100 flex flex-col" dir="rtl">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface-200 border-b border-neutral-100 h-16 flex items-center px-4 shadow-sm">
                <div className="w-10" />
                <div className="flex-1 flex justify-center">
                    <h1 className="text-heading font-bold text-neutral-900">البيانات الشخصية</h1>
                </div>
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors"
                >
                    <CaretLeft size={24} />
                </button>
            </header>

            <ProgressStepper currentStep={2} label="إكمال البيانات الأساسية" />

            <main className="flex-1 px-6 pt-8 pb-24 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <InputField
                        label="الاسم بالكامل (كما في الهوية)"
                        icon={UserIcon}
                        placeholder="أدخل اسمك الثلاثي"
                        error={errors.full_name?.message}
                        {...register('full_name')}
                    />

                    <div className="flex flex-col gap-5 sm:flex-row">
                        <div className="flex-1">
                            <Select
                                label="نوع الوثيقة"
                                options={[
                                    { value: 'PASSPORT', label: 'جواز سفر' },
                                    { value: 'IQAMA', label: 'إقامة' },
                                    { value: 'VISA', label: 'تأشيرة' },
                                ]}
                                {...register('document_type')}
                                error={errors.document_type?.message}
                            />
                        </div>
                        <div className="flex-[2]">
                            <InputField
                                label="رقم الوثيقة"
                                icon={IdentificationCard}
                                placeholder="أدخل رقم الهوية أو الجواز"
                                error={errors.document_number?.message}
                                {...register('document_number')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                            label="تاريخ الميلاد"
                            icon={Calendar}
                            type="date"
                            error={errors.date_of_birth?.message}
                            {...register('date_of_birth')}
                        />
                        <InputField
                            label="الجنسية"
                            placeholder="مثلاً: SA"
                            error={errors.nationality?.message}
                            {...register('nationality')}
                        />
                    </div>

                    <InputField
                        label="رقم الجوال"
                        icon={Phone}
                        placeholder="05XXXXXXXX"
                        type="tel"
                        error={errors.mobile?.message}
                        {...register('mobile')}
                    />

                    <div className="border-t border-neutral-100 my-2" />

                    <label className={cn(
                        "flex items-start gap-3 p-4 rounded-md border-2 transition-all cursor-pointer group",
                        isConfirmed ? "bg-success-bg border-success/30" : "bg-surface-200 border-neutral-200"
                    )}>
                        <div className="relative mt-1">
                            <input
                                type="checkbox"
                                className="sr-only"
                                {...register('personalDataConfirmed')}
                            />
                            <div className={cn(
                                "w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all",
                                isConfirmed ? "bg-success border-success" : "border-neutral-300 group-hover:border-success"
                            )}>
                                {isConfirmed && <Check size={16} weight="bold" className="text-white" />}
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm text-neutral-700 font-bold block mb-1">تأكيد صحة البيانات</span>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                أقر بأن جميع البيانات المدخلة أعلاه صحيحة وتخصني شخصياً، وأتحمل المسؤولية القانونية في حال ثبت خلاف ذلك.
                            </p>
                        </div>
                    </label>
                    {errors.personalDataConfirmed && (
                        <p className="text-xs text-error pr-1 font-medium">{errors.personalDataConfirmed.message}</p>
                    )}

                    <footer className="p-6">
                        <button
                            type="submit"
                            disabled={!isValid}
                            className="w-full h-btn-lg rounded-pill bg-btn-primary text-white font-bold flex items-center justify-center gap-2 shadow-btn transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>التالي</span>
                            <CaretRight size={20} className="rotate-180" />
                        </button>
                    </footer>
                </form>
            </main>
        </div>
    );
}
