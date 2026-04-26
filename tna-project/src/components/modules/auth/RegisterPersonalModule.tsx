'use client';

import React from 'react';
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
    Check,
    Buildings
} from '@phosphor-icons/react';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { useLocale } from '@/i18n/LocaleProvider';
import InputField from '@/components/ui/InputField';
import ProgressStepper from '@/components/ui/ProgressStepper';
import Select from '@/components/ui/Select';
import MirrorIcon from '@/components/shared/MirrorIcon';
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
    const { t, isRTL, locale } = useLocale();
    const { formData, updateFormData, setStep } = useRegistrationStore();
    const isEntity = formData.is_entity;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<any>({
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
            // B2B
            license_number: (formData as any).license_number || '',
            agency_type: (formData as any).agency_type || 'HOTEL',
        },
    });

    const isConfirmed = watch('personalDataConfirmed');

    const onSubmit = (data: FormData) => {
        const { personalDataConfirmed, ...rest } = data;
        updateFormData(rest);
        setStep(3);
        router.push(`/${locale}/auth/register/account`);
    };

    return (
        <div className="min-h-screen bg-surface-100 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* 1. STICKY HEADER */}
            <header className="sticky top-0 z-50 bg-surface-200 border-b border-neutral-100 h-16 flex items-center px-4 shadow-sm">
                <div className="flex-1 flex items-center justify-between max-w-lg mx-auto w-full">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all"
                        aria-label="Back"
                    >
                        <MirrorIcon reverse>
                            <CaretLeft size={24} weight="bold" />
                        </MirrorIcon>
                    </button>
                    
                    <h1 className="text-base font-bold text-neutral-900">{t('auth.register.steps.personal')}</h1>
                    
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>
            </header>

            <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
                <ProgressStepper currentStep={2} label={t('auth.register.steps.personal_label')} />

                <main className="flex-1 px-6 pt-8 pb-32">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {isEntity && (
                            <div className="p-5 bg-primary/5 border border-primary/20 rounded-md mb-8 space-y-5">
                                <div className="flex items-center gap-2 text-primary">
                                    <Buildings size={20} weight="fill" />
                                    <p className="text-xs font-bold uppercase tracking-wider">بيانات المنشأة (B2B)</p>
                                </div>
                                <Select 
                                    label="نوع المنشأة"
                                    options={[
                                        { value: 'HOTEL', label: 'فندق / شقق مفروشة' },
                                        { value: 'TOURISM', label: 'وكالة سياحة وسفر' },
                                        { value: 'OTHER', label: 'أخرى' },
                                    ]}
                                    {...register('agency_type')}
                                />
                                <InputField 
                                    label="رقم السجل التجاري / الترخيص"
                                    placeholder="700XXXXXXXX"
                                    {...register('license_number')}
                                />
                            </div>
                        )}

                        <InputField
                            label={isEntity ? "اسم المنشأة الرسمي" : t('auth.register.labels.full_name')}
                            icon={isEntity ? Buildings : UserIcon}
                            placeholder={isEntity ? "مثلاً: فندق الرياض ان" : t('auth.register.placeholders.full_name')}
                            error={errors.full_name?.message}
                            {...register('full_name')}
                        />

                        <div className="flex flex-col gap-5 sm:flex-row">
                            <div className="flex-1">
                                <Select
                                    label={t('auth.register.labels.document_type')}
                                    options={[
                                        { value: 'PASSPORT', label: t('auth.register.document_types.passport') },
                                        { value: 'IQAMA', label: t('auth.register.document_types.iqama') },
                                        { value: 'VISA', label: t('auth.register.document_types.visa') },
                                    ]}
                                    {...register('document_type')}
                                    error={errors.document_type?.message}
                                />
                            </div>
                            <div className="flex-[2]">
                                <InputField
                                    label={t('auth.register.labels.document_number')}
                                    icon={IdentificationCard}
                                    placeholder={t('auth.register.placeholders.document_number')}
                                    error={errors.document_number?.message}
                                    {...register('document_number')}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField
                                label={t('auth.register.labels.dob')}
                                icon={Calendar}
                                type="date"
                                error={errors.date_of_birth?.message}
                                {...register('date_of_birth')}
                            />
                            <InputField
                                label={t('auth.register.labels.nationality')}
                                placeholder="SA"
                                error={errors.nationality?.message}
                                {...register('nationality')}
                            />
                        </div>

                        <InputField
                            label={t('auth.register.labels.mobile')}
                            icon={Phone}
                            placeholder="05XXXXXXXX"
                            type="tel"
                            error={errors.mobile?.message}
                            {...register('mobile')}
                        />

                        <div className="pt-2">
                            <label className={cn(
                                "flex items-start gap-4 p-5 rounded-md border-2 transition-all cursor-pointer group",
                                isConfirmed 
                                    ? "bg-success/5 border-success/30 ring-1 ring-success/10" 
                                    : "bg-surface-200 border-neutral-200 hover:border-neutral-300"
                            )}>
                                <div className="shrink-0 mt-1">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        {...register('personalDataConfirmed')}
                                    />
                                    <div className={cn(
                                        "w-6 h-6 border-2 rounded-sm flex items-center justify-center transition-all",
                                        isConfirmed ? "bg-success border-success" : "border-neutral-300 bg-white group-hover:border-success"
                                    )}>
                                        {isConfirmed && <Check size={16} weight="bold" className="text-white" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className="text-label font-bold text-neutral-900 block mb-1">
                                        {t('auth.register.labels.confirm_data')}
                                    </span>
                                    <p className="text-caption text-neutral-500 leading-relaxed font-medium">
                                        {t('auth.register.descriptions.confirm_data_desc')}
                                    </p>
                                </div>
                            </label>
                            {errors.personalDataConfirmed && (
                                <p className="text-caption text-error px-1 mt-1 font-medium italic">
                                    {errors.personalDataConfirmed.message}
                                </p>
                            )}
                        </div>

                        {/* Floating Footer for Mobile / Static for Desktop */}
                        <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-surface-100 via-surface-100/95 to-transparent pt-10 md:static md:p-0 md:bg-none">
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="w-full max-w-lg mx-auto h-btn-lg rounded-pill bg-btn-primary text-white font-bold flex items-center justify-center gap-2 shadow-btn transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:grayscale-[0.5]"
                            >
                                <span className="text-sm">{t('common.next')}</span>
                                <MirrorIcon>
                                    <CaretLeft size={20} weight="bold" className="rotate-180" />
                                </MirrorIcon>
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}
