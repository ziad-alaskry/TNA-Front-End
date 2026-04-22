'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowRight, CheckSquare } from 'lucide-react';
import { useRegistrationStore, AccountCategory, UserSubType } from '@/lib/store/useRegistrationStore';

export default function RegisterTypeModule() {
    const router = useRouter();
    const { setRegistrationData, accountCategory: savedCategory, userSubType: savedSubType } = useRegistrationStore();

    const [accountCategory, setAccountCategory] = useState<AccountCategory>(savedCategory);
    const [userSubType, setUserSubType] = useState<UserSubType>(savedSubType);

    const handleNext = () => {
        if (userSubType) {
            setRegistrationData({ accountCategory, userSubType });
            router.push('/auth/register/personal');
        }
    };

    const handleCategorySelect = (category: AccountCategory) => {
        setAccountCategory(category);
        setUserSubType(null); // Reset sub-type when switching categories
    };

    return (
        <div className="min-h-screen bg-tna-gray-50 flex flex-col" dir="rtl">
            {/* 1. TOP HEADER (white bg, sticky) */}
            <header className="sticky top-0 z-50 bg-white border-b border-tna-gray-100 h-16 flex items-center px-4">
                <div className="w-10" /> {/* balance space */}
                <div className="flex-1 flex justify-center">
                    <h1 className="text-lg font-bold text-tna-gray-900">إنشاء حساب جديد</h1>
                </div>
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-tna-gray-900 hover:bg-tna-gray-50 rounded-full transition-colors"
                >
                    <ArrowRight size={24} className="rtl:-scale-x-100" />
                </button>
            </header>

            {/* 2. PROGRESS STEPPER */}
            <div className="bg-white px-6 pb-6 pt-2">
                <p className="text-center text-sm font-semibold mb-6 text-tna-gray-600" dir="rtl">تحديد نوع الحساب</p>
                <div className="relative flex items-center justify-between max-w-xs mx-auto px-4" dir="rtl">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-tna-gray-200 -translate-y-1/2 z-0" />

                    {/* Step 3 (Rightmost in RTL, Current active) */}
                    <div className="relative z-10 w-4 h-4 rounded-full bg-primary border-2 border-primary" />

                    {/* Step 2 (Middle, dot 2) */}
                    <div className="relative z-10 w-4 h-4 rounded-full bg-white border-2 border-tna-gray-400" />

                    {/* Step 1 (Leftmost in RTL, dot 1) */}
                    <div className="relative z-10 w-4 h-4 rounded-full bg-white border-2 border-tna-gray-400" />
                </div>
            </div>

            {/* 3. SELECTION AREA */}
            <main className="flex-1 px-6 pt-6 space-y-4">
                {/* A. Individuals Section */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-tna-gray-100">
                    <button
                        onClick={() => handleCategorySelect('individual')}
                        className="w-full p-5 flex items-center justify-start gap-4 hover:bg-tna-gray-50 transition-colors"
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${accountCategory === 'individual' ? 'border-primary' : 'border-tna-gray-300'}`}>
                            {accountCategory === 'individual' && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                        <span className="text-lg font-bold text-tna-gray-900">الأفراد</span>
                    </button>

                    {/* Sub-options for Individuals */}
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${accountCategory === 'individual' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-5 pb-5 space-y-3 bg-tna-gray-50/50">
                            <button
                                onClick={() => setUserSubType('visitor')}
                                className="w-full flex items-center justify-start gap-3 p-3 rounded-xl hover:bg-tna-gray-100 transition-colors group"
                            >
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${userSubType === 'visitor' ? 'bg-orange-400' : 'bg-orange-100 group-hover:bg-orange-200'}`}>
                                    {userSubType === 'visitor' && <div className="w-2 h-2 bg-white rounded-sm" />}
                                </div>
                                <span className="text-sm text-tna-gray-600 font-medium">مستخدم - زائر أو سائح</span>
                            </button>

                            <button
                                onClick={() => setUserSubType('owner')}
                                className="w-full flex items-center justify-start gap-3 p-3 rounded-xl hover:bg-tna-gray-100 transition-colors group"
                            >
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${userSubType === 'owner' ? 'bg-primary border-primary' : 'border-tna-gray-300 group-hover:border-tna-gray-400'}`}>
                                    {userSubType === 'owner' && <CheckSquare size={14} className="text-white" />}
                                </div>
                                <span className="text-sm text-tna-gray-600 font-medium">مستخدم - مالك لعنوان وطني</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* B. Divider */}
                <div className="border-t border-tna-gray-200 my-1 mx-2" />

                {/* C. Business Section */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-tna-gray-100">
                    <button
                        onClick={() => handleCategorySelect('business')}
                        className="w-full p-5 flex items-center justify-start gap-4 hover:bg-tna-gray-50 transition-colors"
                    >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${accountCategory === 'business' ? 'border-primary' : 'border-tna-gray-300'}`}>
                            {accountCategory === 'business' && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                        <span className="text-lg font-bold text-tna-gray-900">الأعمال</span>
                    </button>

                    {/* Sub-options for Business */}
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${accountCategory === 'business' ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-5 pb-5 space-y-3 bg-tna-gray-50/50">
                            <button
                                onClick={() => setUserSubType('logistics')}
                                className="w-full flex items-center justify-start gap-3 p-3 rounded-xl hover:bg-tna-gray-100 transition-colors group"
                            >
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${userSubType === 'logistics' ? 'bg-orange-400' : 'bg-orange-100 group-hover:bg-orange-200'}`}>
                                    {userSubType === 'logistics' && <div className="w-2 h-2 bg-white rounded-sm" />}
                                </div>
                                <span className="text-sm text-tna-gray-600 font-medium">الجهات اللوجستية</span>
                            </button>

                            <button
                                onClick={() => setUserSubType('gov')}
                                className="w-full flex items-center justify-start gap-3 p-3 rounded-xl hover:bg-tna-gray-100 transition-colors group"
                            >
                                <div className={`w-5 h-5 rounded-md border-2 border-tna-gray-300 group-hover:border-tna-gray-400 flex items-center justify-center transition-colors ${userSubType === 'gov' ? 'bg-primary border-primary' : ''}`}>
                                    {userSubType === 'gov' && <CheckSquare size={14} className="text-white" />}
                                </div>
                                <span className="text-sm text-tna-gray-600 font-medium">الجهات الحكومية</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. BOTTOM CTA */}
            <footer className="sticky bottom-0 bg-transparent px-6 pb-8 pt-4">
                <button
                    onClick={handleNext}
                    disabled={!userSubType}
                    className={`w-full h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${!userSubType ? 'opacity-50 cursor-not-allowed grayscale-[0.5]' : 'hover:opacity-90'}`}
                >
                    <ChevronRight size={20} className="rotate-0" />
                    <span>التالي</span>
                </button>
            </footer>
        </div>
    );
}
