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
    const { locale, isRTL } = useLocale();
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
            setUnbindError(result.error || 'An unknown error occurred.');
        }
    };

    if (!tna) return <div>TNA not found</div>;

    const sections = [
        {
            title: isRTL ? 'معلومات العنوان' : 'TNA Information',
            description: isRTL ? 'البيانات الأساسية لعنوانك الوطني المؤقت.' : 'Core identity data for your temporary national address.',
            items: [
                { 
                  label: isRTL ? 'كود TNA' : 'TNA Code', 
                  value: <span className="font-mono font-bold text-primary">{tna.tna_code}</span> 
                },
                { 
                  label: isRTL ? 'الحالة' : 'Status', 
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
                { label: isRTL ? 'تاريخ الإصدار' : 'Issued At', value: new Date(tna.issued_at).toLocaleDateString() },
                { label: isRTL ? 'تاريخ الانتهاء' : 'Expires At', value: new Date(tna.expires_at).toLocaleDateString() },
            ]
        },
        {
            title: isRTL ? 'العقار المرتبط' : 'Linked Property',
            description: isRTL ? 'تفاصيل العقار الذي تم ربط العنوان به.' : 'Details of the physical property bound to this TNA.',
            items: [
                { label: isRTL ? 'العنوان' : 'Address', value: mockProperties[0].full_address },
                { label: isRTL ? 'المدينة' : 'City', value: mockProperties[0].city },
                { label: isRTL ? 'رقم الوحدة' : 'Unit', value: mockSubAddresses[1].suffix_code },
            ]
        },
    ];

    const sidebar = (
        <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">Actions</h3>
              <div className="space-y-3">
                {hasActiveShipments ? (
                  <div className="p-4 bg-warning/5 border border-warning/10 rounded-2xl flex items-start gap-3">
                    <Warning size={20} className="text-warning shrink-0" weight="fill" />
                    <p className="text-xs text-warning-dark font-medium leading-relaxed">
                      Cannot unbind: Active shipments are currently in transit. Please wait for them to be delivered.
                    </p>
                  </div>
                ) : (
                  <Button 
                    className="w-full py-4 shadow-glow-primary"
                    onClick={handleUnbind}
                    isLoading={isUnbinding}
                    disabled={isUnbinding}
                  >
                    <IdentificationCard size={20} weight="bold" />
                    Unbind Address
                  </Button>
                )}
                <Button variant="outline" className="w-full py-4">
                  <DotsThree size={20} weight="bold" />
                  View History
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
                Address unbound successfully! Redirecting...
              </div>
            )}

            <div className="p-4 bg-info/5 rounded-2xl border border-info/10 space-y-2">
                <div className="flex items-center gap-2 text-info">
                  <Info size={20} weight="fill" />
                  <p className="text-xs font-bold uppercase tracking-wider">Note</p>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                    To unbind this address, ensure no shipments are currently in transit.
                </p>
            </div>
        </div>
    );

    useEffect(() => {
        if (unboundSuccess) {
            const timer = setTimeout(() => {
                router.push(`/${locale}/visitor/tnas`);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [unboundSuccess, router, locale]);

    return (
        <AppShell role="Visitor" header={isRTL ? 'إلغاء ربط TNA' : 'Unbind TNA Address'}>
            <DetailViewLayout
                title={`TNA: ${tna.tna_code}`}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/visitor/tnas`)}
            />
        </AppShell>
    );
}
