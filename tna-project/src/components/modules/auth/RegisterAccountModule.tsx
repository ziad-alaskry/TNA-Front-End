'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User as UserIcon,
    Mail as MailIcon,
    Lock as LockIcon,
    UserPlus as UserPlusIcon,
    ArrowRight,
    Check,
    Loader2
} from 'lucide-react';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useT } from '@/lib/hooks/useT';
import InputField from '@/components/ui/InputField';
import ProgressStepper from '@/components/ui/ProgressStepper';

const schema = z.object({
    username: z.string().min(3, 'يجب أن يكون 3 أحرف على الأقل').regex(/^[a-zA-Z0-9_]+$/, 'حروف وأرقام فقط'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    password: z.string().min(8, 'كلمة المرور 8 أحرف على الأقل'),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(v => v === true, 'يجب الموافقة على الشروط'),
}).refine(d => d.password === d.confirmPassword, {
    message: 'كلمة المرور غير متطابقة',
    path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterAccountModule() {
    const router = useRouter();
    const { t } = useT();
    const { accountCategory, userSubType, personalData, resetRegistration } = useRegistrationStore();
    const { setAuth } = useAuthStore();
    const [isPending, setIsPending] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false,
        },
    });

    const termsAccepted = watch('termsAccepted');

    const onSubmit = async (data: FormData) => {
        setIsPending(true);
        setApiError(null);

        // Simulate frontend-only registration flow
        setTimeout(() => {
            // Mock success based on user choice (e.g., visitor by default if not set)
            const resolvedUserType = userSubType || 'visitor';

            // Set mock auth data
            setAuth('mock-jwt-token', 'user-123', resolvedUserType);

            // Clear registration store
            resetRegistration();

            // Redirect to role-specific home
            router.push(`/${resolvedUserType}/home`);
            setIsPending(false);
        }, 1500);
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
            <ProgressStepper currentStep={3} label={t('auth.account_data')} />

            {/* 3. FORM */}
            <main className="flex-1 px-6 pt-6 pb-24">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <InputField
                        icon={UserIcon}
                        placeholder={t('auth.username')}
                        error={errors.username?.message}
                        {...register('username')}
                    />

                    <InputField
                        icon={MailIcon}
                        placeholder={t('auth.email')}
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <InputField
                        icon={LockIcon}
                        placeholder={t('auth.password')}
                        type="password"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <InputField
                        icon={LockIcon}
                        placeholder={t('auth.confirm_password')}
                        type="password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    <div className="border-t border-tna-gray-200 my-2" />

                    <label className="flex items-center gap-3 cursor-pointer group py-2">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                {...register('termsAccepted')}
                            />
                            <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${termsAccepted ? 'bg-primary border-primary' : 'border-tna-gray-400 group-hover:border-primary'}`}>
                                {termsAccepted && <Check size={16} className="text-white" strokeWidth={3} />}
                            </div>
                        </div>
                        <span className="text-sm text-tna-gray-600 font-medium select-none">
                            {t('auth.terms_and_conditions')}
                        </span>
                    </label>
                    {errors.termsAccepted && (
                        <p className="text-xs text-danger pr-1">{errors.termsAccepted.message}</p>
                    )}

                    {/* API Error Alert (Stub for future) */}
                    {apiError && (
                        <div className="bg-red-50 border border-danger rounded-xl p-4 text-danger text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                            <p className="flex-1 font-medium">{apiError}</p>
                        </div>
                    )}

                    {/* CTA */}
                    <footer className="fixed bottom-0 left-0 right-0 bg-transparent px-6 pb-8 pt-4 pointer-events-none">
                        <button
                            type="submit"
                            disabled={!isValid || isPending}
                            className={`w-full h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] pointer-events-auto ${(!isValid || isPending) ? 'opacity-50 cursor-not-allowed grayscale-[0.5]' : 'hover:opacity-90'}`}
                        >
                            {isPending ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <UserPlusIcon size={20} />
                                    <span>{t('auth.create_account')}</span>
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </main>
        </div>
    );
}
