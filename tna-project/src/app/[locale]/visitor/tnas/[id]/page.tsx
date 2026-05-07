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
    const { locale, isRTL } = useLocale();

    const { data: tnas, isLoading } = useMock(mockTNAs);
    const tna = tnas?.find(t => t.tna_id === id);

    if (isLoading) return <div>Loading...</div>;
    if (!tna) return <div>TNA not found</div>;

    const isUnlinked = tna.status === 'UNLINKED';

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
        !isUnlinked && {
            title: isRTL ? 'العقار المرتبط' : 'Linked Property',
            description: isRTL ? 'تفاصيل العقار الذي تم ربط العنوان به.' : 'Details of the physical property bound to this TNA.',
            items: [
                { label: isRTL ? 'العنوان' : 'Address', value: mockProperties[0].full_address },
                { label: isRTL ? 'المدينة' : 'City', value: mockProperties[0].city },
                { label: isRTL ? 'رقم الوحدة' : 'Unit', value: mockSubAddresses[1].suffix_code },
            ]
        },
    ].filter(Boolean) as any[];

    const sidebar = (
        <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {isUnlinked ? (
                  <Button 
                    className="w-full py-4 shadow-glow-primary"
                    onClick={() => router.push(`/${locale}/visitor/tnas/${id}/bind`)}
                  >
                    <LinkIcon size={20} weight="bold" />
                    Bind to Address
                  </Button>
                ) : (
                  <Button className="w-full py-4 shadow-glow-primary">
                    <IdentificationCard size={20} weight="bold" />
                    Digital Card
                  </Button>
                )}
                <Button variant="outline" className="w-full py-4">
                  <DotsThree size={20} weight="bold" />
                  View History
                </Button>
              </div>
            </div>

            <div className="p-4 bg-info/5 rounded-2xl border border-info/10 space-y-2">
                <div className="flex items-center gap-2 text-info">
                  <Info size={20} weight="fill" />
                  <p className="text-xs font-bold uppercase tracking-wider">Note</p>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {isUnlinked 
                    ? "This TNA is issued but not yet bound to a physical address. You must bind it to start receiving shipments."
                    : "To unbind this address, ensure no shipments are currently in transit."}
                </p>
            </div>
        </div>
    );

    return (
        <AppShell role="Visitor" header={isRTL ? 'تفاصيل TNA' : 'TNA Details'}>
            <DetailViewLayout
                title={`TNA: ${tna.tna_code}`}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/visitor/tnas`)}
            />
        </AppShell>
    );
}
