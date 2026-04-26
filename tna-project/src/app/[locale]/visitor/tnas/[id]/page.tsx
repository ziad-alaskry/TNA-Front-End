'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { 
    Clock, 
    MapPin, 
    IdentificationCard, 
    Calendar, 
    Receipt,
    CheckCircle,
    Info
} from '@phosphor-icons/react'
import { useParams, useRouter } from 'next/navigation'
import { useBindingContext } from '@/context/BindingContext'
import { useLocale } from '@/i18n/LocaleProvider'

export default function VisitorTnaDetailPage() {
    const { id, locale } = useParams();
    const router = useRouter();
    const { t } = useLocale();
    const { visitorTnas, realEstateObjects } = useBindingContext();

    const tna = visitorTnas.find(t => t.tna_id === id);
    const mockTnaCode = tna?.tna_code || 'TNA-102938485';
    
    // Find linked property (mocking logic)
    const property = realEstateObjects[0]; 

    const sections = [
        {
            title: t('visitor.tna_detail.info_title'),
            description: t('visitor.tna_detail.info_desc'),
            items: [
                { label: t('visitor.tna_detail.code'), value: <span className="font-mono font-bold text-primary">{mockTnaCode}</span> },
                { label: t('visitor.tna_detail.status'), value: <span className="px-2 py-0.5 bg-success-bg text-success text-xs font-bold rounded">{t('common.statuses.ACTIVE')}</span> },
                { label: t('visitor.tna_detail.issue_date'), value: '2025/10/16' },
                { label: t('visitor.tna_detail.expiry_date'), value: '2026/10/15' },
            ]
        },
        {
            title: t('visitor.tna_detail.property_title'),
            description: t('visitor.tna_detail.property_desc'),
            items: [
                { label: t('visitor.tna_detail.property_name'), value: property?.name || t('visitor.tna_detail.property_name_mock') },
                { label: t('visitor.tna_detail.address'), value: t('visitor.tna_detail.address_mock') },
                { label: t('visitor.tna_detail.unit_no'), value: '101' },
                { label: t('visitor.tna_detail.property_type'), value: t('visitor.tna_detail.property_type_mock') },
            ]
        },
        {
            title: t('visitor.tna_detail.history_title'),
            description: t('visitor.tna_detail.history_desc'),
            items: [
                { 
                    label: t('visitor.tna_detail.issuance'), 
                    value: (
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">{t('visitor.tna_detail.fee_paid')}</span>
                            <span className="text-xs text-neutral-400">2025/10/16 - 10:30 AM</span>
                        </div>
                    )
                },
                { 
                    label: t('visitor.tna_detail.link_property'), 
                    value: (
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium">{t('visitor.tna_detail.owner_approved')}</span>
                            <span className="text-xs text-neutral-400">2025/10/16 - 11:15 AM</span>
                        </div>
                    )
                }
            ]
        }
    ];

    const sidebar = (
        <div className="space-y-6 text-right">
            <div>
                <h3 className="text-sm font-bold text-neutral-900 mb-2">{t('visitor.tna_detail.quick_actions')}</h3>
                <div className="grid gap-3">
                    <button className="w-full py-2 px-4 bg-primary text-white text-sm font-bold rounded-sm flex items-center justify-center gap-2 shadow-btn">
                        <IdentificationCard size={18} />
                        {t('visitor.tna_detail.view_card')}
                    </button>
                    <button className="w-full py-2 px-4 border border-neutral-300 text-neutral-600 text-sm font-bold rounded-sm flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors">
                        <Calendar size={18} />
                        {t('visitor.tna_detail.renew')}
                    </button>
                </div>
            </div>

            <div className="pt-6 border-t border-neutral-100">
                <div className="p-4 bg-info-bg rounded-md flex gap-3 text-right">
                    <Info size={24} className="text-primary shrink-0" weight="fill" />
                    <div>
                        <p className="text-xs font-bold text-primary mb-1">{t('visitor.tna_detail.hint')}</p>
                        <p className="text-xs text-neutral-600 leading-relaxed">{t('visitor.tna_detail.hint_desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AppShell role="Visitor" header={t('visitor.tna_detail.header')}>
            <DetailViewLayout
                title={t('visitor.tna_detail.title').replace('{code}', mockTnaCode)}
                breadcrumb={[t('common.roles.Visitor.overview'), t('visitor.tnas.header'), mockTnaCode]}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/visitor/tnas`)}
            />
        </AppShell>
    );
}
