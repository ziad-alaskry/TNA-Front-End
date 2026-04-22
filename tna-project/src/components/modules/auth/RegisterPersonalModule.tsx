'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User as UserIcon,
    CreditCard as CreditCardIcon,
    Calendar as CalendarIcon,
    Phone as PhoneIcon,
    ArrowRight,
    ChevronRight,
    ChevronDown,
    Check
} from 'lucide-react';
import { useRegistrationStore, PersonalData } from '@/lib/store/useRegistrationStore';
import { useT } from '@/lib/hooks/useT';
import InputField from '@/components/ui/InputField';
import ProgressStepper from '@/components/ui/ProgressStepper';

const schema = z.object({
    fullName: z.string().min(5, 'الاسم يجب أن يكون 5 أحرف على الأقل'),
    docType: z.enum(['passport', 'national_id', 'iqama']),
    docNumber: z.string().min(8, 'رقم الوثيقة غير صحيح'),
    dateOfBirth: z.string().min(1, 'مطلوب'),
    mobile: z.string().regex(/^05\d{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05'),
    personalDataConfirmed: z.boolean().refine(v => v === true, 'يجب الموافقة'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPersonalModule() {
    const router = useRouter();
    const { t } = useT();
    const { setRegistrationData, personalData: savedData } = useRegistrationStore();
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
            fullName: savedData?.fullName || '',
            docType: savedData?.docType || 'passport',
            docNumber: savedData?.docNumber || '',
            dateOfBirth: savedData?.dateOfBirth || '',
            mobile: savedData?.mobile || '',
            personalDataConfirmed: false,
        },
    });

    const selectedDocType = watch('docType');
    const isConfirmed = watch('personalDataConfirmed');

    const onSubmit = (data: FormData) => {
        const { personalDataConfirmed, ...rest } = data;
        setRegistrationData({ personalData: rest as PersonalData });
        router.push('/auth/register/account');
    };

    const docTypeLabels: Record<string, string> = {
        passport: t('auth.passport'),
        national_id: t('auth.national_id'),
        iqama: t('auth.iqama'),
    };

    return (
        <div className="min-h-screen bg-tna-gray-50 flex flex-col" dir="rtl">
            {/* 1. HEADER */}
            <header className="sticky top-0 z-50 bg-white border-b border-tna-gray-100 h-16 flex items-center px-4">
                <div className="w-10" />
                <div className="flex-1 flex justify-center">
                    <h1 className="text-lg font-bold text-tna-gray-900">{t('auth.title')}</h1>
                </div>
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-tna-gray-900 hover:bg-tna-gray-50 rounded-full transition-colors"
                >
                    <ArrowRight size={24} className="rtl:-scale-x-100" />
                </button>
            </header>

            {/* 2. PROGRESS STEPPER */}
            <ProgressStepper currentStep={2} label={t('auth.personal_data')} />

            {/* 3. FORM */}
            <main className="flex-1 px-6 pt-6 pb-24">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* A. fullName */}
                    <InputField
                        icon={UserIcon}
                        placeholder={t('auth.full_name')}
                        error={errors.fullName?.message}
                        {...register('fullName')}
                    />

                    {/* B. Two-column row */}
                    <div className="flex flex-row gap-3">
                        {/* RIGHT col: Document number */}
                        <div className="flex-1">
                            <InputField
                                icon={CreditCardIcon}
                                placeholder={t('auth.doc_number')}
                                error={errors.docNumber?.message}
                                {...register('docNumber')}
                            />
                        </div>

                        {/* LEFT col: Document type dropdown */}
                        <div className="relative w-36">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full h-14 bg-tna-gray-900 text-white rounded-full px-4 text-sm font-bold flex items-center justify-between transition-all active:scale-95 shadow-lg"
                            >
                                <ChevronDown size={18} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                <span>{docTypeLabels[selectedDocType]}</span>
                            </button>

                            {/* Inline Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute top-16 left-0 right-0 bg-white border border-tna-gray-200 rounded-2xl shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-2">
                                    {(['passport', 'national_id', 'iqama'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                setValue('docType', type, { shouldValidate: true });
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-3 text-start text-sm hover:bg-tna-gray-50 transition-colors flex items-center justify-between ${selectedDocType === type ? 'text-primary bg-primary/5' : 'text-tna-gray-700'}`}
                                        >
                                            {selectedDocType === type && <Check size={16} />}
                                            <span className="flex-1">{docTypeLabels[type]}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* C. dateOfBirth */}
                    <InputField
                        icon={CalendarIcon}
                        placeholder={t('auth.dob')}
                        type="date"
                        error={errors.dateOfBirth?.message}
                        {...register('dateOfBirth')}
                    />

                    {/* D. mobile */}
                    <InputField
                        icon={PhoneIcon}
                        placeholder={t('auth.mobile')}
                        type="tel"
                        error={errors.mobile?.message}
                        {...register('mobile')}
                    />

                    {/* E. Divider */}
                    <div className="border-t border-tna-gray-200 my-2" />

                    {/* F. Checkbox row */}
                    <label className="flex items-center gap-3 cursor-pointer group py-2">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                {...register('personalDataConfirmed')}
                            />
                            <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${isConfirmed ? 'bg-primary border-primary' : 'border-tna-gray-400 group-hover:border-primary'}`}>
                                {isConfirmed && <Check size={16} className="text-white" strokeWidth={3} />}
                            </div>
                        </div>
                        <span className="text-sm text-tna-gray-600 font-medium select-none">
                            {t('auth.confirm_checkbox')}
                        </span>
                    </label>
                    {errors.personalDataConfirmed && (
                        <p className="text-xs text-danger pr-1">{errors.personalDataConfirmed.message}</p>
                    )}

                    {/* CTA */}
                    <footer className="fixed bottom-0 left-0 right-0 bg-transparent px-6 pb-8 pt-4 pointer-events-none">
                        <button
                            type="submit"
                            disabled={!isValid}
                            className={`w-full h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] pointer-events-auto ${!isValid ? 'opacity-50 cursor-not-allowed grayscale-[0.5]' : 'hover:opacity-90'}`}
                        >
                            <ChevronRight size={20} className="rotate-0" />
                            <span>{t('common.next')}</span>
                        </button>
                    </footer>
                </form>
            </main>
        </div>
    );
}
