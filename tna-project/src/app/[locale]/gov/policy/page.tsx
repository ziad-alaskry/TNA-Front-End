'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
    Gear, 
    ShieldCheck, 
    CurrencyCircleDollar, 
    Bell, 
    Info, 
    CheckCircle,
    ArrowLeft,
    IdentificationCard,
    Lock
} from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function GovPolicyPage() {
    const router = useRouter();
    const { isRTL } = useLocale();
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const settings = [
        {
            group: isRTL ? 'سياسات الإصدار' : 'Issuance Policies',
            items: [
                { id: 'issuance_mode', label: isRTL ? 'وضع الإصدار' : 'Issuance Mode', description: isRTL ? 'MODERATED للمراجعة اليدوية أو AUTONOMOUS للإصدار الفوري.' : 'MODERATED for manual review or AUTONOMOUS for instant issuance.', type: 'select', options: ['MODERATED', 'AUTONOMOUS'], default: 'MODERATED' },
                { id: 'max_active_tnas_per_visitor', label: isRTL ? 'الحد الأقصى لكل زائر' : 'Max Active TNAs Per Visitor', description: isRTL ? 'عدد TNAs النشطة المسموح بها لكل زائر.' : 'Maximum active TNAs allowed per visitor.', type: 'number', default: 3 },
                { id: 'tna_validity_days', label: isRTL ? 'صلاحية TNA (بالأيام)' : 'TNA Validity (Days)', description: isRTL ? 'عدد الأيام التي يكون فيها TNA صالحًا.' : 'Number of days a TNA remains valid.', type: 'number', default: 365 },
                { id: 'minimum_rental_period_days', label: isRTL ? 'الحد الأدنى لفترة الإيجار' : 'Minimum Rental Period (Days)', description: isRTL ? 'الحد الأدنى لمدة الإيجار.' : 'Minimum rental duration allowed.', type: 'number', default: 1 },
            ]
        },
        {
            group: isRTL ? 'المعايير الاقتصادية' : 'Economic Parameters',
            items: [
                { id: 'platform_fee_percentage', label: isRTL ? 'عمولة المنصة (%)' : 'Platform Fee (%)', description: isRTL ? 'النسبة المئوية التي تأخذها المنصة من أرباح المالك.' : 'Percentage taken from owner earnings.', type: 'number', default: 15 },
                { id: 'binding_fee', label: isRTL ? 'رسوم الربط (SAR)' : 'Binding Fee (SAR)', description: isRTL ? 'الرسوم الثابتة لربط TNA بعنوان.' : 'Flat fee for linking a TNA to a property.', type: 'number', default: 50 },
            ]
        },
        {
            group: isRTL ? 'قواعد الأهلية' : 'Eligibility Rules',
            items: [
                { id: 'auto_approve_if_visa_valid', label: isRTL ? 'الموافقة التلقائية إذا كان التأشيرة صالحة' : 'Auto-Approve If Visa Valid', description: isRTL ? 'الموافقة التلقائية للزوار ذوي تأشيرة سارية.' : 'Auto-approve visitors with valid visa.', type: 'toggle', default: true },
                { id: 'auto_approve_if_iqama_valid', label: isRTL ? 'الموافقة التلقائية إذا كان الإقامة صالحة' : 'Auto-Approve If Iqama Valid', description: isRTL ? 'الموافقة التلقائية للزوار ذوي إقامة سارية.' : 'Auto-approve visitors with valid iqama.', type: 'toggle', default: true },
            ]
        }
    ];

return (
        <AppShell role="Gov" header={isRTL ? 'إعدادات السياسة' : 'Global Policy Control'}>
            <div className="max-w-4xl space-y-8 pb-12">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{isRTL ? 'إعدادات النظام' : 'System Configuration'}</h2>
                        <p className="text-sm text-neutral-500">{isRTL ? 'تعديل القواعد العالمية ومعايير الاقتصاد لمنصة TNA.' : 'Modify global rules and economic parameters for the TNA platform.'}</p>
                    </div>
                    <Button 
                        onClick={handleSave} 
                        isLoading={isSaving}
                        className={cn("px-8 shadow-glow-primary", saved && "bg-success hover:bg-success")}
                    >
                        {saved ? <CheckCircle size={20} weight="bold" /> : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
                    </Button>
                </div>

                <div className="space-y-6">
                    {settings.map((group, i) => (
                        <section key={i} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-surface-200 border-b border-neutral-100">
                                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{group.group}</h3>
                            </div>
                            <div className="divide-y divide-neutral-100">
                                {group.items.map((item) => (
                                    <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-neutral-900">{item.label}</p>
                                            <p className="text-xs text-neutral-500 leading-relaxed max-w-md">{item.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {item.type === 'toggle' && (
                                                <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                                    <span className="pointer-events-none block h-5 w-5 translate-x-5 rounded-full bg-white shadow-lg ring-0 transition-transform" />
                                                </button>
                                            )}
                                            {item.type === 'number' && (
                                                <input 
                                                    type="number" 
                                                    defaultValue={item.default as any} 
                                                    className="w-24 h-10 px-4 bg-surface-200 rounded-xl border border-neutral-100 text-sm font-black text-neutral-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                />
                                            )}
                                            {item.type === 'select' && (
                                                <select className="h-10 px-4 bg-surface-200 rounded-xl border border-neutral-100 text-sm font-bold text-neutral-900 outline-none">
                                                    {((item as any).options as string[]).map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="p-6 bg-warning/5 rounded-3xl border border-warning/10 flex items-start gap-4">
                    <Info size={24} className="text-warning shrink-0" weight="fill" />
                    <div className="space-y-1">
                        <p className="text-xs font-black text-warning-dark uppercase tracking-widest">{isRTL ? 'ملاحظة مهمة' : 'Cautionary Note'}</p>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                            {isRTL ? 'سيسري التغييرات على المعايير الاقتصادية (الرسوم والعمولات) على المعاملات الجديدة فورًا. ستستمر الروابط الحالية بالسياسة السابقة حتى انتهاء صلاحيتها.' : 'Changes to economic parameters (fees and commissions) will take effect immediately for new transactions. Existing bindings will honor the previous policy until expiration.'}
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
