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
    Info,
    Link as LinkIcon,
    ShieldCheck,
    DotsThree
} from '@phosphor-icons/react'
import { useParams, useRouter } from 'next/navigation'
import { mockTNAs } from '@/lib/mock/tnas.mock'
import { mockProperties, mockSubAddresses } from '@/lib/mock/properties.mock'
import { useLocale } from '@/i18n/LocaleProvider'
import { useMock } from '@/lib/hooks/useMock'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function VisitorTnaDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { locale, t, isRTL } = useLocale();

    const { data: tnas, isLoading } = useMock(mockTNAs);
    const tna = tnas?.find(t => t.tna_id === id);

    if (isLoading) return <div>{t('common.loading')}</div>;
    if (!tna) return <div>{t('tna.error.not_found')}</div>;

    const isUnlinked = tna.status === 'UNLINKED';

    const sections = [
        {
            title: t('visitor.tna_information_15'),
            description: t('visitor.core_identity_data_for_your_temporary_na_16'),
            items: [
                { 
                  label: t('visitor.tna_code_17'), 
                  value: <span className="font-mono font-bold text-primary">{tna.tna_code}</span> 
                },
                { 
                  label: t('visitor.status_18'), 
                  value: (
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest",
                      tna.status === 'ACTIVE' ? "bg-success/10 text-success" : 
                      tna.status === 'UNLINKED' ? "bg-warning/10 text-warning" : "bg-neutral-100 text-neutral-400"
                    )}>
                      {tna.status}
                    </span>
                  ) 
                },
                { label: t('visitor.issued_at_19'), value: new Date(tna.issued_at).toLocaleDateString() },
                { label: t('visitor.expires_at_20'), value: new Date(tna.expires_at).toLocaleDateString() },
            ]
        },
        !isUnlinked && {
            title: t('visitor.linked_property_21'),
            description: t('visitor.details_of_the_physical_property_bound_t_22'),
            items: [
                { label: t('visitor.address_23'), value: mockProperties[0].full_address },
                { label: t('visitor.city_24'), value: mockProperties[0].city },
                { label: t('visitor.unit_25'), value: mockSubAddresses[1].suffix_code },
            ]
        },
    ].filter(Boolean) as any[];

    const sidebar = (
        <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">{t('tna.detail.quick_actions')}</h3>
              <div className="space-y-3">
                {isUnlinked ? (
                  <Button 
                    className="w-full py-4 shadow-glow-primary gap-2"
                    onClick={() => router.push(`/${locale}/visitor/tnas/${id}/bind`)}
                  >
                    <LinkIcon size={20} weight="bold" />
                    {t('tna.detail.link_address')}
                  </Button>
                ) : (
                  <>
                    <Button className="w-full py-4 shadow-glow-primary gap-2">
                      <IdentificationCard size={20} weight="bold" />
                      {t('tna.detail.digital_card')}
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full py-4 gap-2"
                      onClick={() => {/* TODO: Implement unbind with conflict check */}}
                    >
                      <DotsThree size={20} weight="bold" />
                      {t('tna.detail.unbind')}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-info/5 rounded-2xl border border-info/10 space-y-2">
              <div className="flex items-center gap-2 text-info">
                <Info size={20} weight="fill" />
                <p className="text-xs font-bold uppercase tracking-wider">{t('common.note')}</p>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {isUnlinked 
                  ? t('tna.detail.unlinked_note')
                  : t('tna.detail.unbind_note')}
              </p>
            </div>
        </div>
    );

    return (
        <AppShell role="Visitor">
            <DetailViewLayout
                title={`TNA: ${tna.tna_code}`}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/visitor/tnas`)}
            />
        </AppShell>
    );
}
