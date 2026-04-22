'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, UserPlus } from 'lucide-react';

export default function LoginHeroModule() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-tna-gray-50 flex items-center justify-center p-6" dir="rtl">
            <div className="w-full max-w-sm flex flex-col items-center">
                {/* A. App branding block */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-3xl font-bold text-primary">العنوان الوطني المؤقت</h1>
                    <h2 className="text-xl font-semibold text-primary">Temporary National Address</h2>
                </div>

                {/* B. Button group */}
                <div className="w-full flex flex-col gap-3 mt-16 mx-auto">
                    {/* Button 1: Login */}
                    <button
                        onClick={() => router.push('/auth/login')}
                        dir="rtl"
                        className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full flex flex-row items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
                    >
                        <User size={20} />
                        <span>تسجيل الدخول</span>
                    </button>

                    {/* Button 2: Nafath SSO */}
                    <button
                        onClick={() => router.push('/auth/nafath')}
                        className="w-full h-14 bg-white border-2 border-primary text-primary rounded-full text-sm flex items-center justify-between px-6 shadow-sm hover:bg-tna-gray-50 transition-colors"
                    >
                        <div className="flex items-center">
                            <span className="text-center w-full font-medium">تسجيل الدخول من خلال النفاذ الوطني الموحد</span>
                        </div>
                        <div className="flex-shrink-0">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="28" height="28" rx="4" fill="#E8F5E9" />
                                <path d="M14 6L19 9V14C19 17.08 16.87 19.92 14 21C11.13 19.92 9 17.08 9 14V9L14 6Z" fill="#4CAF50" />
                                <path d="M12 14L13.5 15.5L16.5 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </button>

                    {/* Horizontal divider */}
                    <div className="border-t border-tna-gray-200 my-2" />

                    {/* Button 3: Register */}
                    <button
                        onClick={() => router.push('/auth/register/type')}
                        dir="rtl"
                        className="w-full h-14 bg-white border-2 border-primary text-primary rounded-full flex flex-row items-center justify-center gap-2 shadow-sm hover:bg-tna-gray-50 transition-colors"
                    >
                        <UserPlus size={20} />
                        <span>إنشاء حساب مستخدم جديد</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
