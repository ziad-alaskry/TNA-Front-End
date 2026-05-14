'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EnvelopeSimple, CaretLeft, CheckCircle, LockKey, DotsThree, CaretRight } from '@phosphor-icons/react';
import { useLocale } from '@/i18n/LocaleProvider';
import InputField from '@/components/ui/InputField';
import ProgressStepper from '@/components/ui/ProgressStepper';
import { useToast } from '@/components/ui/Toast';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

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
        success(t('auth.forgot_password.send_success'), 'نجاح');
    };

    const onVerifySubmit = async (data: VerifyFormData) => {
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));
        if (data.code === '123456') { // Mock verify code logic
            setStep(3);
        } else {
            error(t('auth.forgot_password.invalid_code'), 'خطأ');
        }
        setLoading(false);
    };

    const onResetSubmit = async (data: ResetFormData) => {
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
        success(t('auth.forgot_password.reset_success'), 'نجاح');
        router.push(`/${locale}/login`);
    };

    return (
        <div
            className="min-h-screen flex flex-col font-display items-center bg-surface-100"
            dir={t('common.dir') as any}
        >
            {/* Background pattern layer - hidden on mobile, reduced on tablet, full on desktop */}
            <div
                className="fixed inset-0 auth-bg-pattern pointer-events-none hidden sm:block opacity-30 lg:opacity-100"
                aria-hidden="true"
            />
            {/* Header */}
            <header className="w-full max-w-full sm:max-w-[520px] lg:max-w-[480px] h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => {
                        if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
                        else router.back();
                    }}
                    className="flex items-center justify-center w-10 h-10 hover:bg-gray-50 rounded-full transition-colors"
                >
                    <CaretLeft size={24} className={isRTL ? "rotate-180" : ""} />
                </button>
                <h1 className="text-[16px] font-semibold text-slate-900">{t('auth.forgot_password.title')}</h1>
                <LanguageSwitcher />
            </header>

            {/* STEP 1 */}
            {step === 1 && (
                <main className="w-full max-w-full sm:max-w-[520px] lg:max-w-[480px] flex-1 flex flex-col items-center px-4 sm:px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8 flex items-center justify-center">
                        <div className="relative w-20 h-20 bg-[#199bd7]/10 rounded-full flex items-center justify-center text-[#199bd7]">
                            <LockKey size={48} weight="fill" />
                            <div className="absolute -top-1 -right-1 bg-[#199bd7] text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center font-bold text-lg">؟</div>
                        </div>
                    </div>
                    
                    <div className="text-center mb-6">
                        <p className="text-[14px] text-gray-600">{t('auth.forgot_password.subtitle_step1')}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#199bd7]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                    </div>

                    <form onSubmit={form1.handleSubmit(onRequestSubmit)} className="w-full space-y-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                <EnvelopeSimple size={20} />
                            </div>
                            <input 
                                className={`w-full h-14 pr-12 pl-4 rounded-lg border ${form1.formState.errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-[#199bd7]/20 focus:border-[#199bd7]'} transition-all text-right outline-none`}
                                dir="rtl" 
                                placeholder={t('auth.forgot_password.email_placeholder')}
                                type="email"
                                {...form1.register('email')}
                            />
                            {form1.formState.errors.email && (
                                <p className="text-red-500 text-xs mt-1 text-right">{form1.formState.errors.email.message}</p>
                            )}
                        </div>
                        <button 
                            type="submit"
                            disabled={!form1.formState.isValid || loading}
                            className="w-full h-14 rounded-full text-white font-semibold text-lg shadow-lg shadow-[#199bd7]/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                            style={{ background: 'linear-gradient(270deg, #199bd7 0%, #312e81 100%)' }}
                        >
                            {loading ? <DotsThree size={32} className="animate-pulse" /> : <span>{t('auth.forgot_password.send_code')}</span>}
                        </button>
                    </form>
                </main>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <main className="flex-1 flex w-full max-w-full sm:max-w-[520px] lg:max-w-[480px] items-start pt-8 justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-50 p-8">
                        <div className="flex justify-center items-center gap-3 mb-10">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#199bd7] ring-4 ring-[#199bd7]/20"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                        </div>
                        <div className="text-center mb-8">
                            <h2 className="text-slate-900 text-lg font-bold mb-2">{t('auth.forgot_password.verify_title')}</h2>
                            <p className="text-slate-500 text-sm font-medium">{t('auth.forgot_password.verify_subtitle')}</p>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 text-center mb-4">
                                Mock Mode: Use code <code className="font-mono font-bold">123456</code>
                            </div>
                        )}
                        <form onSubmit={form2.handleSubmit(onVerifySubmit)} className="space-y-8">
                            <div className="flex flex-col gap-2">
                                <input 
                                    className="w-full h-14 text-center font-mono tracking-[1em] rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#199bd7]/20 focus:border-[#199bd7] transition-all outline-none text-xl font-bold"
                                    placeholder={t('auth.forgot_password.code_placeholder')}
                                    maxLength={6}
                                    type="text"
                                    {...form2.register('code')}
                                />
                                {form2.formState.errors.code && (
                                    <p className="text-red-500 text-xs text-center">{form2.formState.errors.code.message}</p>
                                )}
                            </div>
                            
                            <div className="space-y-6">
                                <div className="text-center">
                                    <p className="text-[12px] text-gray-400 font-medium">{t('auth.forgot_password.resend_timer', { time: '02:30' })}</p>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!form2.formState.isValid || loading}
                                    className="w-full h-[56px] text-white font-bold text-lg rounded-full shadow-lg shadow-[#199bd7]/30 hover:shadow-[#199bd7]/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                                    style={{ background: 'linear-gradient(to left, #199bd7, #0ea5e9)' }}
                                >
                                    {loading ? <DotsThree size={32} className="animate-pulse" /> : <span>{t('auth.forgot_password.confirm_code')}</span>}
                                </button>
                            </div>
                        </form>
                        <div className="mt-8 text-center">
                            <button type="button" className="text-[#199bd7] text-sm font-bold hover:underline">
                                {t('auth.forgot_password.resend_button')}
                            </button>
                        </div>
                    </div>
                </main>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <main className="flex-1 flex w-full max-w-full sm:max-w-[520px] lg:max-w-[480px] items-start pt-8 justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-50 p-8">
                        <div className="flex justify-center items-center gap-3 mb-10">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#199bd7] ring-4 ring-[#199bd7]/20"></div>
                        </div>
                        <div className="text-center mb-8">
                            <h2 className="text-slate-900 text-lg font-bold mb-2">{t('auth.forgot_password.reset_title')}</h2>
                            <p className="text-slate-500 text-sm font-medium">{t('auth.forgot_password.reset_subtitle')}</p>
                        </div>
                        <form onSubmit={form3.handleSubmit(onResetSubmit)} className="space-y-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                    <LockKey size={20} />
                                </div>
                                <input 
                                    className={`w-full h-14 pr-12 pl-4 rounded-lg border ${form3.formState.errors.password ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-[#199bd7]/20 focus:border-[#199bd7]'} transition-all text-right outline-none`}
                                    placeholder={t('auth.forgot_password.new_password_placeholder')}
                                    type="password"
                                    {...form3.register('password')}
                                />
                                {form3.formState.errors.password && (
                                    <p className="text-red-500 text-xs mt-1 text-right">{form3.formState.errors.password.message}</p>
                                )}
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                    <LockKey size={20} />
                                </div>
                                <input 
                                    className={`w-full h-14 pr-12 pl-4 rounded-lg border ${form3.formState.errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-[#199bd7]/20 focus:border-[#199bd7]'} transition-all text-right outline-none`}
                                    placeholder={t('auth.forgot_password.confirm_password_placeholder')}
                                    type="password"
                                    {...form3.register('confirmPassword')}
                                />
                                {form3.formState.errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1 text-right">{form3.formState.errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit"
                                    disabled={!form3.formState.isValid || loading}
                                    className="w-full h-[56px] text-white font-bold text-lg rounded-full shadow-lg shadow-[#199bd7]/30 hover:shadow-[#199bd7]/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                                    style={{ background: 'linear-gradient(to left, #199bd7, #0ea5e9)' }}
                                >
                                    {loading ? <DotsThree size={32} className="animate-pulse" /> : <span>{t('auth.forgot_password.save_login')}</span>}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            )}

            <footer className="w-full max-w-full sm:max-w-[520px] lg:max-w-[480px] p-8 text-center text-gray-400 text-xs mt-auto">
                <p>{t('common.copyright')}</p>
            </footer>
        </div>
    );
}
