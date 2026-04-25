'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
    Gear, 
    ShieldCheck, 
    CurrencyCircleDollar, 
    Clock, 
    WarningCircle,
    ArrowRight,
    ToggleLeft,
    ToggleRight,
    CaretRight,
    PlusCircle,
    SlidersHorizontal,
    CheckCircle
} from '@phosphor-icons/react'
import InputField from '@/components/ui/InputField'
import { useRouter, useParams } from 'next/navigation'

export default function GovPolicyPage() {
    const router = useRouter();
    const { locale } = useParams();

    const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <AppShell role="Gov" header="إعدادات السياسات والحوكمة">
            <div className="max-w-4xl space-y-8">
                {/* Automation Toggle Header */}
                <div className={`p-6 rounded-md border transition-all flex items-center justify-between ${
                    isAutomationEnabled ? 'border-primary bg-primary/5' : 'border-neutral-200 bg-surface-200'
                }`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isAutomationEnabled ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-400'
                        }`}>
                            <Gear size={24} weight="fill" className={isAutomationEnabled ? 'animate-spin-slow' : ''} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900">المراجعة الآلية الذكية</h3>
                            <p className="text-xs text-neutral-500">عند تفعيلها، سيقوم النظام بالبت في الطلبات السكنية المطابقة للمعايير تلقائياً.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsAutomationEnabled(!isAutomationEnabled)}
                        className={`w-16 h-8 rounded-pill relative transition-colors ${
                            isAutomationEnabled ? 'bg-primary' : 'bg-neutral-300'
                        }`}
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            isAutomationEnabled ? 'right-9' : 'right-1'
                        }`} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Fee Configuration */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-neutral-900 flex items-center gap-2">
                            <CurrencyCircleDollar size={20} className="text-primary" weight="fill" />
                            هيكلة الرسوم السيادية
                        </h4>
                        <div className="space-y-4">
                            <InputField label="رسوم إصدار TNA سكني (SAR)" defaultValue="١٠٠.٠٠" />
                            <InputField label="رسوم إصدار TNA تجاري (SAR)" defaultValue="٥٠٠.٠٠" />
                            <InputField label="نسبة المنصة من رسوم الربط (٪)" defaultValue="١٥" />
                        </div>
                    </div>

                    {/* Expiry & Lifecycle */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-neutral-900 flex items-center gap-2">
                            <Clock size={20} className="text-primary" weight="fill" />
                            دورة حياة العنوان
                        </h4>
                        <div className="space-y-4">
                            <InputField label="مدة صلاحية العنوان الافتراضية (أيام)" defaultValue="١٨٠" />
                            <InputField label="فترة السماح قبل الإلغاء (أيام)" defaultValue="٧" />
                            <div className="p-4 bg-warning-bg border border-warning/10 rounded-md">
                                <p className="text-[10px] text-warning font-bold flex items-center gap-2">
                                    <WarningCircle size={14} weight="fill" />
                                    تنبيه أمني
                                </p>
                                <p className="text-[10px] text-neutral-600 mt-1 leading-relaxed">
                                    تغيير هذه القيم سيؤثر على جميع العناوين الجديدة المصدرة من هذه اللحظة.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Eligibility Rules */}
                <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-neutral-900 flex items-center gap-2">
                            <SlidersHorizontal size={20} className="text-primary" weight="fill" />
                            قواعد الأهلية المتقدمة
                        </h4>
                        <button className="text-[10px] font-bold text-primary flex items-center gap-1">
                            <PlusCircle size={16} />
                            إضافة قاعدة جديدة
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[
                            'يجب أن يكون العمر فوق ١٨ عاماً للطلبات الفردية',
                            'يجب توفر هوية وطنية سارية المفعول وموثقة عبر النفاذ',
                            'يمنع إصدار أكثر من عنوان TNA لنفس رقم الهوية في آن واحد'
                        ].map((rule, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white rounded border border-neutral-100">
                                <span className="text-xs font-semibold text-neutral-700">{rule}</span>
                                <button className="text-[10px] font-bold text-error">حذف</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Footer */}
                <div className="pt-8 border-t border-neutral-200 flex justify-end gap-3">
                    <button 
                        onClick={() => router.back()}
                        className="h-12 px-8 rounded-sm text-sm font-bold text-neutral-500 hover:bg-neutral-100 transition-colors"
                    >
                        تجاهل التغييرات
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-12 px-12 rounded-pill bg-neutral-900 text-white text-sm font-bold shadow-btn hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>جاري الحفظ...</>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                حفظ ومزامنة السياسات
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AppShell>
    );
}
