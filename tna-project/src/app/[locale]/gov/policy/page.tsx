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
    const {  isRTL , t } = useLocale();
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
            group: t('gov.issuance_policies_62'),
            items: [
                { id: 'issuance_mode', label: t('gov.issuance_mode_63'), description: t('gov.moderated_for_manual_review_or_autonomou_64'), type: 'select', options: ['MODERATED', 'AUTONOMOUS'], default: 'MODERATED' },
                { id: 'max_active_tnas_per_visitor', label: t('gov.max_active_tnas_per_visitor_65'), description: t('gov.maximum_active_tnas_allowed_per_visitor_66'), type: 'number', default: 3 },
                { id: 'tna_validity_days', label: t('gov.tna_validity_days_67'), description: t('gov.number_of_days_a_tna_remains_valid_68'), type: 'number', default: 365 },
                { id: 'minimum_rental_period_days', label: t('gov.minimum_rental_period_days_69'), description: t('gov.minimum_rental_duration_allowed_70'), type: 'number', default: 1 },
            ]
        },
        {
            group: t('gov.economic_parameters_71'),
            items: [
                { id: 'platform_fee_percentage', label: t('gov.platform_fee_72'), description: t('gov.percentage_taken_from_owner_earnings_73'), type: 'number', default: 15 },
                { id: 'binding_fee', label: t('gov.binding_fee_sar_74'), description: t('gov.flat_fee_for_linking_a_tna_to_a_property_75'), type: 'number', default: 50 },
            ]
        },
        {
            group: t('gov.eligibility_rules_76'),
            items: [
                { id: 'auto_approve_if_visa_valid', label: t('gov.autoapprove_if_visa_valid_77'), description: t('gov.autoapprove_visitors_with_valid_visa_78'), type: 'toggle', default: true },
                { id: 'auto_approve_if_iqama_valid', label: t('gov.autoapprove_if_iqama_valid_79'), description: t('gov.autoapprove_visitors_with_valid_iqama_80'), type: 'toggle', default: true },
            ]
        }
    ];

return (
        <AppShell role="Gov">
            <div className="max-w-4xl space-y-8 pb-12">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{t('gov.system_configuration_82')}</h2>
                        <p className="text-sm text-neutral-500">{t('gov.modify_global_rules_and_economic_paramet_83')}</p>
                    </div>
                    <Button 
                        onClick={handleSave} 
                        isLoading={isSaving}
                        className={cn("px-8 shadow-glow-primary", saved && "bg-success hover:bg-success")}
                    >
                        {saved ? <CheckCircle size={20} weight="bold" /> : (t('gov.save_changes_84'))}
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
                                                    {((item as any).options as string[]).map(o => (
                                                        <option key={o} value={o}>{t(`gov.policy.options.${o}`)}</option>
                                                    ))}
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
                        <p className="text-xs font-black text-warning-dark uppercase tracking-widest">{t('gov.cautionary_note_85')}</p>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                            {t('gov.changes_to_economic_parameters_fees_and__86')}
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
