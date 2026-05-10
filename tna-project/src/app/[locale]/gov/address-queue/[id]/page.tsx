'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { 
    ShieldCheck,
    User,
    IdentificationCard,
    MapPin,
    CheckCircle,
    XCircle,
    Files,
    Calendar,
    ArrowLeft,
    Buildings,
} from '@phosphor-icons/react'
import { useParams, useRouter } from 'next/navigation'
import { useMock } from '@/lib/hooks/useMock'
import { mockSubAddressDetails } from '@/lib/mock/gov.mock'
import { useLocale } from '@/i18n/LocaleProvider'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function GovAddressVerificationDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { locale, isRTL } = useLocale();

    const details = mockSubAddressDetails[id as keyof typeof mockSubAddressDetails];
    const isLoading = false;

    const [isProcessing, setIsProcessing] = useState(false);
    const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | null>(null);
    const [verificationNotes, setVerificationNotes] = useState('');

    if (isLoading) return <div className="p-12 text-center">{isRTL ? 'جاري تحميل تفاصيل الطلب...' : 'Loading request details...'}</div>;
    if (!details) return <div className="p-12 text-center text-error">{isRTL ? 'الطلب غير موجود' : 'Request not found'}</div>;

    const handleDecision = async (type: 'APPROVED' | 'REJECTED') => {
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 1500));
      setDecision(type);
      setIsProcessing(false);
    };

    const sections = [
        {
            title: isRTL ? 'معلومات المالك' : 'Owner Information',
            items: [
                { label: isRTL ? 'الاسم' : 'Name', value: details.owner.name },
                { label: isRTL ? 'نوع المالك' : 'Owner Type', value: details.owner.owner_type === 'INDIVIDUAL' ? (isRTL ? 'فردي' : 'Individual') : (isRTL ? 'شركة' : 'Business') },
                { label: isRTL ? 'رقم الهوية' : 'National ID', value: <span className="font-mono text-xs">{details.owner.national_id}</span> },
                { label: isRTL ? 'حالة التحقق' : 'Verification Status', value: details.owner.is_verified ? <span className="text-success font-bold">{isRTL ? 'تم التحقق' : 'VERIFIED'}</span> : <span className="text-warning font-bold">{isRTL ? 'قيد المراجعة' : 'PENDING'}</span> },
            ]
        },
        {
            title: isRTL ? 'العنوان الوطني' : 'National Address',
            description: isRTL ? 'العنوان الرئيسي المرتبط بالعنوان الفرعي.' : 'Parent national address linked to sub-address.',
            items: [
                { label: isRTL ? 'العنوان الكامل' : 'Full Address', value: details.national_address.full_address },
                { label: isRTL ? 'حالة إثبات الملكية' : 'Ownership Proof Status', value: details.national_address.ownership_proof_status === 'VERIFIED' ? <span className="text-success font-bold">{isRTL ? 'تم التحقق' : 'VERIFIED'}</span> : <span className="text-warning font-bold">{isRTL ? 'قيد المراجعة' : 'PENDING'}</span> },
                { label: isRTL ? 'مرجع سند الملكية' : 'Title Deed Reference', value: <span className="font-mono text-xs">{details.national_address.title_deed_reference}</span> },
            ]
        },
        {
            title: isRTL ? 'العنوان الفرعي' : 'Sub-Address',
            description: isRTL ? 'تفاصيل العنوان الفرعي المراد التحقق منه.' : 'Details of the sub-address to be verified.',
            items: [
                { label: isRTL ? 'اللاحقة' : 'Suffix Code', value: <span className="font-mono font-bold text-primary">{details.sub_address.suffix_code}</span> },
                { label: isRTL ? 'التصنيف' : 'Label', value: details.sub_address.label },
                { label: isRTL ? 'الوصف' : 'Description', value: details.sub_address.description },
            ]
        }
    ];

    const sidebar = (
        <div className="space-y-6">
            {!decision ? (
              <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xl space-y-4">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{isRTL ? 'إجراء التحقق' : 'Verification Action'}</h3>
                  <div className="space-y-3">
                      <Button 
                          className="w-full py-4 shadow-glow-primary"
                          onClick={() => handleDecision('APPROVED')}
                          isLoading={isProcessing}
                      >
                          <CheckCircle size={20} weight="bold" />
                          {isRTL ? 'تأكيد التحقق' : 'Verify Address'}
                      </Button>
                      <Button 
                          variant="outline" 
                          className="w-full py-4 border-error/20 text-error hover:bg-error/5"
                          onClick={() => handleDecision('REJECTED')}
                          isLoading={isProcessing}
                      >
                          <XCircle size={20} weight="bold" />
                          {isRTL ? 'رفض الطلب' : 'Reject Request'}
                      </Button>
                  </div>
              </div>
            ) : (
              <div className={cn(
                "p-8 rounded-3xl border text-center space-y-4 animate-in zoom-in-95 duration-500",
                decision === 'APPROVED' ? "bg-success/5 border-success/20 text-success" : "bg-error/5 border-error/20 text-error"
              )}>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
                      {decision === 'APPROVED' ? <CheckCircle size={40} weight="fill" /> : <XCircle size={40} weight="fill" />}
                  </div>
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-tight">{isRTL ? (decision === 'APPROVED' ? 'تم التحقق' : 'تم الرفض') : `Request ${decision}`}</h3>
                    <p className="text-xs font-medium opacity-70">{isRTL ? 'تم تحديث حالة العنوان الفرعي.' : 'The sub-address verification status has been updated.'}</p>
                  </div>
                  <Button variant="outline" className="w-full border-neutral-200 text-neutral-900" onClick={() => router.push(`/${locale}/gov/address-queue`)}>
                    {isRTL ? 'العودة للطابور' : 'Back to Queue'}
                  </Button>
              </div>
            )}

            <div className="p-4 bg-warning/5 rounded-2xl border border-warning/10 space-y-2">
                <div className="flex items-center gap-2 text-warning">
                  <ShieldCheck size={20} weight="fill" />
                  <p className="text-xs font-bold uppercase tracking-wider">{isRTL ? 'ملاحظة أمنية' : 'Security Note'}</p>
                </div>
                <p className="text-[10px] text-neutral-600 leading-relaxed font-medium">
                    {isRTL ? 'يجب التحقق من مطابقة العنوان الفرعي بالوثائق المقدمة قبل الموافقة.' : 'Verify that the sub-address matches the provided documents before approval.'}
                </p>
            </div>
        </div>
    );

    return (
        <AppShell role="Gov" header={isRTL ? 'مراجعة طلب التحقق من العنوان الفرعي' : 'Sub-Address Verification Review'}>
            <DetailViewLayout
                title={`${isRTL ? 'عنوان فرعي' : 'Sub-Address'} ${details.sub_address.suffix_code}`}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/gov/address-queue`)}
            />
            
            <div className="mt-12 p-8 bg-surface-200 rounded-3xl border border-neutral-200 space-y-6">
                <div className="flex items-center gap-3">
                  <Files size={24} className="text-neutral-400" />
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight">{isRTL ? 'الوثائق المرفقة' : 'Supporting Documents'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                        <IdentificationCard size={20} />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">{isRTL ? 'سند الملكية' : 'Title Deed'}: {details.national_address.title_deed_reference}</span>
                    </div>
                    <span className="text-[10px] font-black text-success uppercase">{isRTL ? 'متوفي' : 'AVAILABLE'}</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                        <Buildings size={20} />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">{isRTL ? 'شهادة العنوان الوطني' : 'NA Certificate'}</span>
                    </div>
                    <span className="text-[10px] font-black text-success uppercase">{isRTL ? 'متوفي' : 'AVAILABLE'}</span>
                  </div>
                </div>
            </div>
        </AppShell>
    );
}