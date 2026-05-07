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
            group: 'Issuance Policies',
            items: [
                { id: 'auto_approve', label: 'Global Auto-Approval', description: 'Automatically issue TNAs for GCC citizens.', type: 'toggle', default: true },
                { id: 'kyc_level', label: 'KYC Strictness', description: 'Required identification level for international visitors.', type: 'select', options: ['Basic', 'Enhanced', 'Strict'], default: 'Enhanced' },
            ]
        },
        {
            group: 'Economic Parameters',
            items: [
                { id: 'binding_fee', label: 'TNA Binding Fee (SAR)', description: 'Flat fee for linking a TNA to a physical property.', type: 'number', default: 50 },
                { id: 'platform_commission', label: 'Platform Commission (%)', description: 'Percentage taken from owner earnings.', type: 'number', default: 15 },
            ]
        }
    ];

    return (
        <AppShell role="Gov" header={isRTL ? 'إعدادات السياسة' : 'Global Policy Control'}>
            <div className="max-w-4xl space-y-8 pb-12">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">System Configuration</h2>
                        <p className="text-sm text-neutral-500">Modify global rules and economic parameters for the TNA platform.</p>
                    </div>
                    <Button 
                        onClick={handleSave} 
                        isLoading={isSaving}
                        className={cn("px-8 shadow-glow-primary", saved && "bg-success hover:bg-success")}
                    >
                        {saved ? <CheckCircle size={20} weight="bold" /> : 'Save Changes'}
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
                        <p className="text-xs font-black text-warning-dark uppercase tracking-widest">Cautionary Note</p>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                            Changes to economic parameters (fees and commissions) will take effect immediately for new transactions. Existing bindings will honor the previous policy until expiration.
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
