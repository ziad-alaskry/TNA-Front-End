'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DetailViewLayout } from '@/components/templates/DetailViewLayout';
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
    DotsThree,
    XCircle,
    Warning,
    ArrowLeft
} from '@phosphor-icons/react';
import { useParams, useRouter } from 'next/navigation';
import { mockShipments } from '@/lib/mock/shipments.mock';
import { mockTNAs } from '@/lib/mock/tnas.mock';
import { mockSubAddresses, mockProperties } from '@/lib/mock/properties.mock';
import { useLocale } from '@/i18n/LocaleProvider';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { useBindingContext } from '@/context/BindingContext';

export default function VisitorTnaUnbindPage() {
    const { id } = useParams();
    const router = useRouter();
    const {  locale, isRTL , t } = useLocale();
    const { terminateBinding, visitorTnas } = useBindingContext();

    const tna = visitorTnas?.find(t => t.tna_id === id);
    const shipments = mockShipments.filter(s => s.tna_id === id);
    const hasActiveShipments = shipments.some(s => s.status === 'IN_TRANSIT');

    const [isUnbinding, setIsUnbinding] = useState(false);
    const [unbindError, setUnbindError] = useState<string | null>(null);
    const [unboundSuccess, setUnboundSuccess] = useState(false);

    const handleUnbind = async () => {
        setIsUnbinding(true);
        setUnbindError(null);
        const result = await terminateBinding(id as string);
        setIsUnbinding(false);
        if (result.success) {
            setUnboundSuccess(true);
        } else {
            setUnbindError(result.error || t('common.error_unknown'));
        }
    };

    useEffect(() => {
        if (unboundSuccess) {
            const timer = setTimeout(() => {
                router.push(`/${locale}/visitor/tnas`);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [unboundSuccess, router, locale]);

    if (!tna) return <div>{t('tna.error.not_found')}</div>;

    const sections = [
        {
            title: t('visitor.tna_information_27'),
            description: t('visitor.core_identity_data_for_your_temporary_na_28'),
            items: [
                { 
                  label: t('visitor.tna_code_29'), 
                  value: <span className="font-mono font-bold text-primary">{tna.tna_code}</span> 
                },
                { 
                  label: t('visitor.status_30'), 
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
                { label: t('visitor.issued_at_31'), value: new Date(tna.issued_at).toLocaleDateString() },
                { label: t('visitor.expires_at_32'), value: new Date(tna.expires_at).toLocaleDateString() },
            ]
        },
        {
            title: t('visitor.linked_property_33'),
            description: t('visitor.details_of_the_physical_property_bound_t_34'),
            items: [
                { label: t('visitor.address_35'), value: mockProperties[0].full_address },
                { label: t('visitor.city_36'), value: mockProperties[0].city },
                { label: t('visitor.unit_37'), value: mockSubAddresses[1].suffix_code },
            ]
        },
    ];

    const sidebar = (
        <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">{t('actions')}</h3>
              <div className="space-y-3">
                {hasActiveShipments ? (
                  <div className="p-4 bg-warning/5 border border-warning/10 rounded-2xl flex items-start gap-3">
                    <Warning size={20} className="text-warning shrink-0" weight="fill" />
                    <p className="text-xs text-warning-dark font-medium leading-relaxed">
                      {t('tna.detail.cannot_unbind_active_shipments')}
                    </p>
                  </div>
                ) : (
                  <Button 
                    className="w-full py-4 shadow-glow-primary gap-2"
                    onClick={handleUnbind}
                    isLoading={isUnbinding}
                    disabled={isUnbinding}
                  >
                    <IdentificationCard size={20} weight="bold" />
                    {t('tna.detail.unbind')}
                  </Button>
                )}
                <Button variant="outline" className="w-full py-4 gap-2">
                  <DotsThree size={20} weight="bold" />
                  {t('tna.detail.view_history')}
                </Button>
              </div>
            </div>
            
            {unbindError && (
              <div className="p-4 bg-error/5 border border-error/10 rounded-2xl text-center text-error text-xs font-medium">
                {unbindError}
              </div>
            )}
            {unboundSuccess && (
              <div className="p-4 bg-success/5 border border-success/10 rounded-2xl text-center text-success text-xs font-medium">
                {t('tna.detail.unbind_success')}
              </div>
            )}

            <div className="p-4 bg-info/5 rounded-2xl border border-info/10 space-y-2">
                <div className="flex items-center gap-2 text-info">
                  <Info size={20} weight="fill" />
                  <p className="text-xs font-bold uppercase tracking-wider">{t('common.note')}</p>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                    {t('tna.detail.unbind_note')}
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
