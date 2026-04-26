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
    CheckCircle,
    Trash,
    Globe,
    UserCircle,
    MapPin
} from '@phosphor-icons/react'
import InputField from '@/components/ui/InputField'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useRouter, useParams } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface Condition {
    id: string;
    parameter: string;
    operator: string;
    value: string;
}

export default function GovPolicyPage() {
    const router = useRouter();
    const { locale } = useParams();

    const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [conditions, setConditions] = useState<Condition[]>([
        { id: 'c1', parameter: 'age', operator: '>=', value: '18' },
        { id: 'c2', parameter: 'nationality', operator: 'in', value: 'دول مجلس التعاون' },
        { id: 'c3', parameter: 'active_tnas', operator: '<', value: '3' }
    ]);

    const handleAddCondition = () => {
        const newCondition: Condition = {
            id: Math.random().toString(36).substr(2, 9),
            parameter: 'age',
            operator: '==',
            value: ''
        };
        setConditions([...conditions, newCondition]);
    };

    const removeCondition = (id: string) => {
        setConditions(conditions.filter(c => c.id !== id));
    };

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
                            <div className="h-[74px] hidden md:block" aria-hidden="true" /> {/* Spacer to align with Warning box in col 2 */}
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

                {/* Eligibility Rules / Conditions Editor */}
                <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                                <SlidersHorizontal size={20} weight="bold" />
                            </div>
                            <div>
                                <h4 className="font-bold text-neutral-900">محرك قواعد الأهلية</h4>
                                <p className="text-[10px] text-neutral-500">تحديد شروط استحقاق العناوين الوطنية المؤقتة</p>
                            </div>
                        </div>
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-2 h-9 border-primary/20 text-primary"
                            onClick={handleAddCondition}
                        >
                            <PlusCircle size={16} />
                            إضافة شرط
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {conditions.map((condition) => (
                            <div key={condition.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-white rounded border border-neutral-100 group animate-in fade-in slide-in-from-right-2 duration-300">
                                <div className="col-span-4">
                                    <Select 
                                        options={[
                                            { value: 'age', label: 'العمر' },
                                            { value: 'nationality', label: 'الجنسية' },
                                            { value: 'region', label: 'المنطقة الحالية' },
                                            { value: 'active_tnas', label: 'عدد العناوين النشطة' },
                                        ]}
                                        defaultValue={condition.parameter}
                                        className="h-9 text-xs"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Select 
                                        options={[
                                            { value: '>=', label: '>=' },
                                            { value: '<=', label: '<=' },
                                            { value: '==', label: '==' },
                                            { value: 'in', label: 'في قائمة' },
                                        ]}
                                        defaultValue={condition.operator}
                                        className="h-9 text-xs"
                                    />
                                </div>
                                <div className="col-span-5">
                                    <InputField 
                                        placeholder="القيمة" 
                                        defaultValue={condition.value}
                                        className="h-9 text-xs"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button 
                                        onClick={() => removeCondition(condition.id)}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10 transition-colors"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-primary/5 rounded border border-dashed border-primary/20">
                        <div className="flex gap-3 text-right">
                            <ShieldCheck size={20} className="text-primary" weight="fill" />
                            <p className="text-[10px] text-neutral-600 leading-relaxed">
                                <span className="font-bold block text-neutral-900 mb-1">التحقق من التداخل</span>
                                يتم تطبيق هذه القواعد بالتسلسل (AND logic). أي طلب لا يستوفي كافة الشروط المذكورة أعلاه سيتم تحويله للمراجعة اليدوية أو الرفض التلقائي بناءً على إعدادات المراجعة الآلية.
                            </p>
                        </div>
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
