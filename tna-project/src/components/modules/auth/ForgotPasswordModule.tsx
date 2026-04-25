'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EnvelopeSimple, CaretLeft, CheckCircle, LockKey, DotsThree } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import InputField from '@/components/ui/InputField';
import ProgressStepper from '@/components/ui/ProgressStepper';
import MirrorIcon from '@/components/shared/MirrorIcon';
import { useToast } from '@/components/ui/Toast';

// -- Schema for Step 1 --
const requestSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صحيح'),
});
type RequestFormData = z.infer<typeof requestSchema>;

// -- Schema for Step 2 --
const verifySchema = z.object({
    code: z.string().length(6, 'رمز التحقق يجب أن يتكون من 6 أرقام'),
});
type VerifyFormData = z.infer<typeof verifySchema>;

// -- Schema for Step 3 --
const resetSchema = z.object({
    password: z.string().min(8, 'كلمة المرور يجب أن لا تقل عن 8 أحرف'),
    confirmPassword: z.string().min(8, 'مطلوب'),
}).refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'كلمات المرور غير متطابقة',
});
type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPasswordModule() {
    const router = useRouter();
    const { t, isRTL, locale } = useLocale();
    const { success, error } = useToast();
    
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);
    const [savedEmail, setSavedEmail] = useState('');

    // Form 1
    const form1 = useForm<RequestFormData>({
        resolver: zodResolver(requestSchema),
        mode: 'onChange',
    });

    // Form 2
    const form2 = useForm<VerifyFormData>({
        resolver: zodResolver(verifySchema),
        mode: 'onChange',
    });

    // Form 3
    const form3 = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
        mode: 'onChange',
    });

    const onRequestSubmit = async (data: RequestFormData) => {
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));
        setSavedEmail(data.email);
        setStep(2);
        setLoading(false);
        success('تم إرسال رمز التحقق إلى بريدك الإلكتروني', 'نجاح');
    };

    const onVerifySubmit = async (data: VerifyFormData) => {
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));
        if (data.code === '123456') { // Mock verify code logic
            setStep(3);
        } else {
            error('رمز التحقق غير صحيح', 'خطأ');
        }
        setLoading(false);
    };

    const onResetSubmit = async (data: ResetFormData) => {
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
        success('تم إعادة تعيين كلمة المرور بنجاح!', 'نجاح');
        router.push(`/${locale}/auth/login`);
    };

    return (
        <div className="min-h-screen bg-surface-100 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface-200 border-b border-neutral-100 h-16 flex items-center px-4 shadow-sm">
                <div className="flex-1 flex items-center justify-between max-w-lg mx-auto w-full">
                    <button
                        onClick={() => {
                            if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
                            else router.back();
                        }}
                        className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all"
                    >
                        <MirrorIcon reverse>
                            <CaretLeft size={24} weight="bold" />
                        </MirrorIcon>
                    </button>
                    <h1 className="text-base font-bold text-neutral-900">{t('auth.forgot_password.title')}</h1>
                    <div className="w-10" />
                </div>
            </header>

            <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
                <div className="pt-8 px-6 pb-4">
                    <h2 className="text-heading font-bold text-neutral-900 mb-2">
                        {step === 1 && 'نسيت كلمة المرور؟'}
                        {step === 2 && 'التحقق من الرمز'}
                        {step === 3 && 'تعيين كلمة مرور جديدة'}
                    </h2>
                    <p className="text-body text-neutral-500 font-medium leading-relaxed">
                        {step === 1 && 'أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور لتتمكن من العودة لحسابك.'}
                        {step === 2 && `قمنا بإرسال رمز مكون من 6 أرقام إلى ${savedEmail}. (لغرض التجربة استخدم 123456)`}
                        {step === 3 && 'أدخل كلمة المرور الجديدة لتأمين حسابك. تأكد من تطابق كلمتي المرور.'}
                    </p>
                </div>

                <div className="px-6 pb-6">
                     <ProgressStepper currentStep={step} label="" />
                </div>

                <main className="flex-1 px-6 pb-32">
                    {/* STEP 1 */}
                    {step === 1 && (
                        <form onSubmit={form1.handleSubmit(onRequestSubmit)} className="space-y-6">
                            <InputField
                                label="البريد الإلكتروني"
                                icon={EnvelopeSimple}
                                type="email"
                                placeholder="name@example.com"
                                error={form1.formState.errors.email?.message}
                                {...form1.register('email')}
                            />
                            <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-surface-100 via-surface-100/95 to-transparent pt-10 md:static md:p-0 md:bg-none">
                                <button
                                    type="submit"
                                    disabled={!form1.formState.isValid || loading}
                                    className="w-full h-btn-lg rounded-pill bg-btn-primary text-white font-bold flex items-center justify-center gap-2 shadow-btn transition-all hover:opacity-95 disabled:opacity-50"
                                >
                                    {loading ? <DotsThree size={32} className="animate-pulse" /> : <span>إرسال الرمز</span>}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <form onSubmit={form2.handleSubmit(onVerifySubmit)} className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <InputField
                                label="رمز التحقق"
                                placeholder="000000"
                                maxLength={6}
                                type="text"
                                className="text-center font-mono text-heading tracking-[0.5em]"
                                error={form2.formState.errors.code?.message}
                                {...form2.register('code')}
                            />
                            <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-surface-100 via-surface-100/95 to-transparent pt-10 md:static md:p-0 md:bg-none">
                                <button
                                    type="submit"
                                    disabled={!form2.formState.isValid || loading}
                                    className="w-full h-btn-lg rounded-pill bg-btn-primary text-white font-bold flex items-center justify-center gap-2 shadow-btn transition-all hover:opacity-95 disabled:opacity-50"
                                >
                                     {loading ? <DotsThree size={32} className="animate-pulse" /> : <span>تحقق</span>}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <form onSubmit={form3.handleSubmit(onResetSubmit)} className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <InputField
                                label="كلمة المرور الجديدة"
                                icon={LockKey}
                                type="password"
                                placeholder="••••••••"
                                error={form3.formState.errors.password?.message}
                                {...form3.register('password')}
                            />
                            <InputField
                                label="تأكيد كلمة المرور"
                                icon={CheckCircle}
                                type="password"
                                placeholder="••••••••"
                                error={form3.formState.errors.confirmPassword?.message}
                                {...form3.register('confirmPassword')}
                            />
                            <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-gradient-to-t from-surface-100 via-surface-100/95 to-transparent pt-10 md:static md:p-0 md:bg-none">
                                <button
                                    type="submit"
                                    disabled={!form3.formState.isValid || loading}
                                    className="w-full h-btn-lg rounded-pill bg-btn-primary text-white font-bold flex items-center justify-center gap-2 shadow-btn transition-all hover:opacity-95 disabled:opacity-50"
                                >
                                    {loading ? <DotsThree size={32} className="animate-pulse" /> : <span>حفظ وتسجيل الدخول</span>}
                                </button>
                            </div>
                        </form>
                    )}
                </main>
            </div>
        </div>
    );
}
