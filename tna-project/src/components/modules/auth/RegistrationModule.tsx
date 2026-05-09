'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/i18n/LocaleProvider';
import { UserRole } from '@/lib/types/auth';

export default function RegistrationModule() {
    const router = useRouter();
    const { locale } = useLocale();
    const [formData, setFormData] = useState({
        userRole: '' as UserRole | '',
        fullName: '',
        email: '',
        mobile: '',
        documentType: 'الهوية الوطنية',
        documentNumber: '',
        password: '',
        confirmPassword: '',
        agreeData: false,
        agreeTerms: false
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock registration logic
        console.log('Registering with:', formData);
        router.push(`/${locale}/`);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-sans" dir="rtl">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between shadow-sm">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_forward</span>
                </button>
                <h1 className="text-slate-900 dark:text-slate-100 text-lg font-bold flex-1 text-center">إنشاء حساب جديد</h1>
                <div className="w-10"></div>
            </header>

            <main className="relative bg-stripes pb-12 animate-in slide-in-from-bottom duration-500">
                {/* Form Card */}
                <div className="mx-4 mt-6 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* User Role Selection */}
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">نوع المستخدم</label>
                            <div className="relative group">
                                <select 
                                    className="w-full h-14 pr-4 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    value={formData.userRole}
                                    onChange={(e) => handleInputChange('userRole', e.target.value as UserRole)}
                                    required
                                >
                                    <option disabled value="">اختر نوع المستخدم</option>
                                    <option value="VISITOR">زائر</option>
                                    <option value="OWNER">مالك</option>
                                    <option value="CARRIER_STAFF">ناقل</option>
                                    <option value="GOV_USER">جهة حكومية</option>
                                </select>
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180">expand_more</span>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">الأسم الثلاثي الرسمي</label>
                            <div className="relative group">
                                <input 
                                    className="w-full h-14 pr-12 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                    placeholder="أدخل اسمك الكامل" 
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">person</span>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">البريد الإلكتروني</label>
                            <div className="relative group">
                                <input 
                                    className="w-full h-14 pr-12 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                    placeholder="example@mail.com" 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                            </div>
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">رقم الجوال</label>
                            <div className="relative group">
                                <input 
                                    className="w-full h-14 pr-12 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-left outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                    dir="ltr" 
                                    placeholder="05xxxxxxxx" 
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">call</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Document Type */}
                            <div>
                                <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">نوع الوثيقة الرسمية</label>
                                <div className="relative group">
                                    <select 
                                        className="w-full h-14 pr-4 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 appearance-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                        value={formData.documentType}
                                        onChange={(e) => handleInputChange('documentType', e.target.value)}
                                    >
                                        <option>الهوية الوطنية</option>
                                        <option>هوية مقيم</option>
                                        <option>سجل تجاري</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform">expand_more</span>
                                </div>
                            </div>
                            {/* Document Number */}
                            <div>
                                <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">رقم الوثيقة الرسمية</label>
                                <input 
                                    className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                                    placeholder="رقم الوثيقة" 
                                    type="text"
                                    value={formData.documentNumber}
                                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">كلمة المرور</label>
                            <div className="relative group">
                                <input 
                                    className="w-full h-14 pr-12 pl-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                    placeholder="••••••••" 
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-primary transition-colors">visibility</span>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2">تأكيد كلمة المرور</label>
                            <div className="relative group">
                                <input 
                                    className="w-full h-14 pr-12 pl-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                    placeholder="••••••••" 
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    required
                                />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock_reset</span>
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-3 pt-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-1 relative">
                                    <input 
                                        className="peer w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all" 
                                        type="checkbox"
                                        checked={formData.agreeData}
                                        onChange={(e) => handleInputChange('agreeData', e.target.checked)}
                                        required
                                    />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                    أقر بأن جميع البيانات الشخصية المدخلة صحيحة وتحت مسؤوليتي الشخصية.
                                </span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-1">
                                    <input 
                                        className="peer w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all" 
                                        type="checkbox"
                                        checked={formData.agreeTerms}
                                        onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                                        required
                                    />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                    أوافق على <Link href="#" className="text-primary font-bold hover:underline transition-all">شروط وأحكام</Link> العنوان الوطني المؤقت (TNA).
                                </span>
                            </label>
                        </div>

                        {/* CTA Button */}
                        <button 
                            className="bg-blue-gradient-golden w-full h-14 mt-6 text-white font-bold text-lg rounded-full shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale" 
                            type="submit"
                        >
                            <span>إنشاء حساب مستخدم جديد</span>
                            <span className="material-symbols-outlined">person_add</span>
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center px-6">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        لديك حساب بالفعل؟
                        <Link href={`/${locale}/`} className="text-primary font-bold mr-1 hover:underline transition-all">تسجيل الدخول</Link>
                    </p>
                </div>

                {/* Platform Info Decoration */}
                <div className="mt-12 flex justify-center items-center opacity-20 px-8 grayscale pointer-events-none">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary rounded-xl mb-2 flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-white text-2xl">lan</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">TNA Platform</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
