'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowRight, Unlink, LinkIcon } from 'lucide-react';
import BottomNav from '@/components/shell/BottomNav';

export default function UnlinkAddressModule() {
    const router = useRouter();
    const [selectedTna, setSelectedTna] = useState('TNA-EMAA5083');

    return (
        <div className="min-h-screen bg-surface-100 flex flex-col pb-24" dir="rtl">
            {/* Header */}
            <header className="bg-surface-200 px-4 h-16 flex items-center shadow-card sticky top-0 z-40">
                <div className="w-10 h-10 flex items-center justify-center">
                    {/* Logo/Target icon on the RIGHT in RTL */}
                    <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-error"></div>
                    </div>
                </div>
                <h1 className="text-heading font-bold text-neutral-900 flex-1 text-center truncate px-2">
                    تقديم طلب فك إرتباط العنوان المؤقت
                </h1>
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-neutral-900"
                >
                    <ArrowRight size={24} className="rtl:-scale-x-100" />
                </button>
            </header>

            <main className="flex-1 p-6">
                <h2 className="text-neutral-600 text-sm font-medium mb-4 text-center px-4">
                    إختر العنوان المؤقت الخاص بك (الذي سيتم فك ارتباطه)
                </h2>

                {/* Selection Card */}
                <div className="bg-surface-200 rounded-md p-6 shadow-card border border-neutral-100 flex flex-col gap-6">
                    {/* TNA Selector */}
                    <div className="space-y-2">
                        <label className="text-neutral-600 text-sm block">العنوان الوطني المؤقت</label>
                        <div className="relative group">
                            <select
                                value={selectedTna}
                                onChange={(e) => setSelectedTna(e.target.value)}
                                className="h-14 w-full appearance-none rounded-md border border-neutral-200 bg-neutral-50 ps-4 pe-4 font-mono text-lg font-bold tracking-[0.04em] text-primary transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="TNA-EMAA5083">TNA-EMAA5083</option>
                                <option value="TNA-EMAA5084">TNA-EMAA5084</option>
                            </select>
                            <div className="pointer-events-none absolute top-1/2 start-4 -translate-y-1/2 text-neutral-600">
                                <ChevronDown size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Linked Address (Display Only) */}
                    <div className="space-y-2">
                        <label className="text-neutral-600 text-sm block">العنوان الوطني الفعلي المرتبط</label>
                        <div className="w-full h-14 bg-neutral-900 text-white rounded-md px-4 flex items-center justify-between shadow-modal">
                            <LinkIcon size={20} className="opacity-80 rotate-[-45deg]" />
                            <span className="font-mono text-lg font-bold tracking-[0.04em]">RDEC8736</span>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 space-y-4">
                    <button
                        className="flex h-14 w-full items-center justify-center gap-3 rounded-pill bg-btn-primary text-white shadow-btn transition-all hover:opacity-95 active:scale-[0.98]"
                    >
                        <span className="text-lg font-bold">تقديم طلب فك الإرتباط</span>
                        <Unlink size={24} className="rotate-0" />
                    </button>

                    <p className="text-neutral-400 text-xs text-center leading-relaxed max-w-[280px] mx-auto">
                        عند التأكيد ستتم الموافقة على شروط فك إرتباط العنوان الوطني المؤقت
                    </p>
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
