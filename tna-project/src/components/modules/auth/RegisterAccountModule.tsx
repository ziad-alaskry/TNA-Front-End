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
    CaretLeft,
    Check,
    Loader2
} from '@phosphor-icons/react';
import { useRegistrationStore } from '@/lib/store/useRegistrationStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
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
    const { formData, resetRegistration } = useRegistrationStore();
    const { login } = useAuthStore(); // Assuming login exists in useAuthStore for setting state
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

        // Simulate registration flow
        setTimeout(() => {
            const role = (formData.user_role || 'VISITOR').toLowerCase();

            // Set mock auth data
            // Note: useAuthStore might need update if it doesn't have login()
            // For now, we simulate success and move on
            
            resetRegistration();
            router.push(`/${role}/home`);
            setIsPending(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-surface-100 flex flex-col" dir="rtl">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface-200 border-b border-neutral-100 h-16 flex items-center px-4 shadow-sm">
                <div className="w-10" />
                <div className="flex-1 flex justify-center">
                    <h1 className="text-heading font-bold text-neutral-900">إنشاء الحساب</h1>
                </div>
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-neutral-900 hover:bg-neutral-50 rounded-full transition-colors"
                >
                    <CaretLeft size={24} />
                </button>
            </header>

            <ProgressStepper currentStep={3} label="بيانات الدخول" />

            <main className="flex-1 px-6 pt-8 pb-32 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <InputField
                        label="اسم المستخدم"
                        icon={UserIcon}
                        placeholder="أدخل اسم المستخدم بالإنجليزية"
                        error={errors.username?.message}
                        {...register('username')}
                    />

                    <InputField
                        label="البريد الإلكتروني"
                        icon={MailIcon}
                        placeholder="example@domain.com"
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <InputField
                        label="كلمة المرور"
                        icon={LockIcon}
                        placeholder="أدخل كلمة مرور قوية"
                        type="password"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <InputField
                        label="تأكيد كلمة المرور"
                        icon={LockIcon}
                        placeholder="أعد كتابة كلمة المرور"
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
                                أوافق على شروط الاستخدام وسياسة الخصوصية الخاصة بالعنوان الوطني المؤقت.
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
                            className="w-full h-btn-lg rounded-pill bg-btn-primary text-white font-bold flex items-center justify-center gap-2 shadow-btn transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <UserPlusIcon size={20} weight="bold" />
                                    <span>إنشاء الحساب</span>
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </main>
        </div>
    );
}
