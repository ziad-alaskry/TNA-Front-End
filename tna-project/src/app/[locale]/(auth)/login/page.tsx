'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/i18n/LocaleProvider';

export default function LoginPage() {
    const [role, setRole] = useState('owner');
    const router = useRouter();
    const { locale } = useLocale();

    const roles = [
        { id: 'owner', label: 'مالك', icon: 'home' },
        { id: 'carrier', label: 'ناقل', icon: 'local_shipping' },
        { id: 'gov', label: 'جهة حكومية', icon: 'account_balance' },
        { id: 'visitor', label: 'زائر', icon: 'person_outline' },
    ];

    const currentRoleLabel = roles.find(r => r.id === role)?.label || '';

    const handleLogin = () => {
        // Mock authentication success and redirect based on role
        router.push(`/${locale}/${role}/home`);
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 font-sans bg-surface-100"
            style={{
                backgroundImage: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%, transparent 50%, #f8fafc 50%, #f8fafc 75%, transparent 75%, transparent)',
                backgroundSize: '20px 20px'
            }}
            dir="rtl"
        >
            <div className="w-full max-w-[480px] bg-surface-200 rounded-md shadow-modal border border-neutral-100 overflow-hidden relative z-10 transition-all duration-300 transform scale-100">
                {/* Top Section */}
                <div className="pt-10 pb-6 px-6 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-4xl">location_on</span>
                        </div>
                    </div>
                    <h1 className="text-display font-bold leading-tight tracking-tight mb-1 bg-btn-primary bg-clip-text text-transparent">
                        العنوان الوطني المؤقت
                    </h1>
                    <p className="text-sm font-semibold opacity-90 bg-btn-primary bg-clip-text text-transparent">
                        Temporary National Address
                    </p>
                </div>

                {/* Role-based selection */}
                <div className="px-6 mb-6">
                    <div className="bg-neutral-50 p-1 flex gap-1 rounded-md border border-neutral-100 shadow-inner">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRole(r.id)}
                                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-sm transition-all duration-200 text-xs font-semibold gap-1 ${
                                    role === r.id
                                        ? 'bg-white text-brand-cyan shadow-card ring-1 ring-neutral-200/50 scale-[1.02]'
                                        : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100/80'
                                }`}
                            >
                                <span className={`material-symbols-outlined transition-all duration-200 ${role === r.id ? 'text-brand-cyan text-[20px] font-bold' : 'text-neutral-400 text-[18px]'}`}>
                                    {r.icon}
                                </span>
                                <span>{r.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div className="px-6 pb-10 flex flex-col gap-4 animate-in fade-in slide-in- duration-500">
                    {/* Input 1: Username */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-neutral-700 pr-1">اسم المستخدم أو البريد الإلكتروني</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-brand-cyan transition-colors">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                            <input 
                                className="w-full h-input pr-12 pl-4 rounded-sm border border-neutral-200 outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400" 
                                placeholder="أدخل اسم المستخدم" 
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Input 2: Password */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-neutral-700 pr-1">كلمة المرور</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-brand-cyan transition-colors">
                                <span className="material-symbols-outlined">lock</span>
                            </div>
                            <input 
                                className="w-full h-input pr-12 pl-12 rounded-sm border border-neutral-200 outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400" 
                                placeholder="أدخل كلمة المرور" 
                                type="password"
                            />
                            <button className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors">
                                <span className="material-symbols-outlined">visibility</span>
                            </button>
                        </div>
                        <div className="flex justify-start">
                            <Link href={`/${locale}/auth/forgot-password`} className="text-xs font-semibold text-primary hover:underline transition-colors">
                                نسيت كلمة المرور؟
                            </Link>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="mt-4 flex flex-col gap-4">
                        {/* Primary CTA */}
                        <button 
                            onClick={handleLogin}
                            className="w-full h-btn-lg rounded-pill bg-btn-primary text-white font-bold text-base shadow-btn hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-200"
                        >
                            <span className="material-symbols-outlined">login</span>
                            <span>تسجيل الدخول كـ {currentRoleLabel}</span>
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-neutral-200"></div>
                            <span className="flex-shrink mx-4 text-neutral-400 text-xs font-medium">أو عبر الهوية الوطنية</span>
                            <div className="flex-grow border-t border-neutral-200"></div>
                        </div>

                        {/* Nafath SSO */}
                        <button className="w-full h-btn-md rounded-pill border-2 border-primary bg-white text-primary font-bold text-base flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all duration-300 group">
                            <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-[16px] group-hover:animate-pulse">verified_user</span>
                            </div>
                            <span>تسجيل الدخول عبر نفاذ</span>
                        </button>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-6 text-center pt-5 border-t border-neutral-100">
                        <p className="text-sm text-neutral-500 font-medium">
                            ليس لديك حساب كـ {currentRoleLabel}؟ 
                            <Link href={`/${locale}/register/type`} className="text-primary font-bold hover:underline mx-1 transition-colors">
                                إنشاء حساب جديد
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative background overlay elements */}
            <div className="fixed bottom-0 left-0 p-8 opacity-5 pointer-events-none w-48 h-48 sm:w-64 sm:h-64 mt-auto">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#00B4C9" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.2C90.8,-33.3,96.8,-17.7,96.4,-2.2C96,13.3,89.1,28.6,80.1,42.5C71.2,56.4,60.1,68.9,46.7,78.2C33.3,87.5,17.7,93.6,1.4,91.2C-14.8,88.8,-30.6,77.9,-43.3,67.7C-56,57.5,-65.7,48.1,-73.4,36.5C-81,24.9,-86.6,11.1,-86,-2.3C-85.3,-15.8,-78.4,-28.9,-70,-40.4C-61.6,-51.9,-51.6,-61.8,-40.1,-70.3C-28.6,-78.8,-15.8,-86,-0.1,-85.9C15.6,-85.8,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>

            <div className="fixed top-0 right-0 p-8 opacity-5 pointer-events-none w-32 h-32 sm:w-48 sm:h-48">
                 <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#02488D" d="M51.5,-73C65,-61.6,73.1,-43.3,79.5,-24.5C85.9,-5.7,90.6,13.6,83.9,29C77.2,44.4,59.1,55.9,41.9,64.2C24.7,72.5,8.4,77.6,-8.7,79.1C-25.8,80.6,-43.7,78.4,-57.8,69C-71.9,59.6,-82.1,43,-86.7,25.3C-91.3,7.6,-90.3,-11.2,-83.1,-27.2C-75.9,-43.2,-62.5,-56.4,-48.1,-67C-33.7,-77.6,-18.3,-85.6,0.3,-86.1C18.9,-86.6,38,-79.4,51.5,-73Z" transform="translate(100 100)" />
                </svg>
            </div>
        </div>
    );
    }