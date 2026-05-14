'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    User,
    Envelope,
    Lock,
    UserPlus,
    CaretLeft,
    Check,
    CircleNotch
} from '@phosphor-icons/react';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useLocale } from '@/i18n/LocaleProvider';
import InputField from '@/components/ui/InputField';
import ProgressStepper from '@/components/ui/ProgressStepper';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function RegisterAccountModule() {
    const router = useRouter();
    const { t, isRTL, locale } = useLocale();
    const { formData, resetRegistration } = useRegistrationStore();
    const { setAuth } = useAuthStore();
    const [isPending, setIsPending] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const schema = useMemo(() => z.object({
        username: z.string().min(3, t('auth.register.account.validation.username_min')).regex(/^[a-zA-Z0-9_]+$/, t('auth.register.account.validation.username_format')),
        email: z.string().email(t('auth.register.account.validation.email_invalid')),
        password: z.string().min(8, t('auth.register.account.validation.password_min')),
        confirmPassword: z.string(),
        termsAccepted: z.boolean().refine(v => v === true, t('auth.register.account.validation.terms_required')),
    }).refine(d => d.password === d.confirmPassword, {
        message: t('auth.register.account.validation.password_mismatch'),
        path: ['confirmPassword'],
    }), [t]);

    type FormData = z.infer<typeof schema>;

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

        setTimeout(() => {
            const role = (formData.role || 'VISITOR').toLowerCase();
            resetRegistration();
            router.push(`/${role}/home`);
            setIsPending(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-surface-100 flex flex-col" dir={t('common.dir') as any}>
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-neutral-100 h-16 flex items-center px-4 shadow-sm backdrop-blur-md bg-white/80">
                <LanguageSwitcher />
                <div className="flex-1 flex justify-center">
                    <h1 className="text-heading font-bold text-neutral-900">{t('auth.register.account.steps.account_label')}</h1>
                </div>
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors"
                >
                    <CaretLeft size={24} />
                </button>
            </header>

            <ProgressStepper currentStep={3} label={t('auth.register.account.steps.account_label')} />

            <main className="flex-1 px-4 sm:px-6 pt-8 pb-32 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <InputField
                        label={t('auth.register.account.labels.username')}
                        icon={User}
                        placeholder={t('auth.register.account.placeholders.username')}
                        error={errors.username?.message}
                        {...register('username')}
                    />

                    <InputField
                        label={t('auth.register.account.labels.email')}
                        icon={Envelope}
                        placeholder={t('auth.register.account.placeholders.email')}
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <InputField
                        label={t('auth.register.account.labels.password')}
                        icon={Lock}
                        placeholder={t('auth.register.account.placeholders.password')}
                        type="password"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <InputField
                        label={t('auth.register.account.labels.confirm_password')}
                        icon={Lock}
                        placeholder={t('auth.register.account.placeholders.confirm_password')}
                        type="password"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    <div className="border-t border-neutral-100 my-2" />

                    <label className="flex items-start gap-3 cursor-pointer group py-2">
                        <div className="relative mt-0.5">
                            <input
                                type="checkbox"
                                className="sr-only"
                                {...register('termsAccepted')}
                            />
                            <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${termsAccepted ? 'bg-primary border-primary' : 'border-neutral-300 group-hover:border-primary'}`}>
                                {termsAccepted && <Check size={16} weight="bold" className="text-white" />}
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm text-neutral-700 font-medium">
                                {t('auth.register.account.terms')}
                            </span>
                        </div>
                    </label>
                    {errors.termsAccepted && (
                        <p className="text-xs text-error pr-1 font-medium">{errors.termsAccepted.message}</p>
                    )}

                    {apiError && (
                        <div className="bg-error-bg border border-error/20 rounded-md p-4 text-error text-sm flex items-center gap-3">
                            <p className="flex-1 font-medium">{apiError}</p>
                        </div>
                    )}

                    <footer className="fixed bottom-0 left-0 right-0 p-6 bg-surface-100/80 backdrop-blur-md">
                        <button
                            type="submit"
                            disabled={!isValid || isPending}
                            className="w-full h-[56px] rounded-full text-white font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            style={{ background: 'linear-gradient(to left, #0CBBDB, #1A73C1)' }}
                        >
                            {isPending ? (
                                <CircleNotch size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <UserPlus size={20} weight="bold" />
                                    <span>{t('auth.register.account.create_account')}</span>
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </main>
        </div>
    );
}
