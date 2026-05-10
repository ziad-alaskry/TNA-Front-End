'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { 
    ShieldCheck, 
    User, 
    IdentificationCard, 
    Globe,
    CheckCircle,
    XCircle,
    Files,
    Info,
    Calendar,
    ArrowLeft,
    Handshake,
    MapPin,
    FileText,
} from '@phosphor-icons/react'
import { useParams, useRouter } from 'next/navigation'
import { useMock } from '@/lib/hooks/useMock'
import { mockGovQueue } from '@/lib/mock/gov.mock'
import { useLocale } from '@/i18n/LocaleProvider'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

export default function GovTNAReviewDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { locale, isRTL } = useLocale();

    const { data: queue, isLoading } = useMock(mockGovQueue);
    const request = queue?.find(q => q.request_id === id);

    const [isProcessing, setIsProcessing] = useState(false);
    const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    if (isLoading) return <div className="p-12 text-center">{isRTL ? 'جاري تحميل تفاصيل الطلب...' : 'Loading request details...'}</div>;
    if (!request) return <div className="p-12 text-center text-error">{isRTL ? 'الطلب غير موجود' : 'Request not found'}</div>;

    const handleDecision = async (type: 'APPROVED' | 'REJECTED') => {
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 1500));
      setDecision(type);
      setIsProcessing(false);
    };

    const sections = [
        {
            title: isRTL ? 'بيانات مقدم الطلب' : 'Applicant Identity',
            description: isRTL ? 'المعلومات الشخصية ووثائق الهوية.' : 'Personal details and identification documents.',
            items: [
                { label: isRTL ? 'الأسم الكامل' : 'Full Name', value: request.visitor_name },
                { label: isRTL ? 'الجنسية' : 'Nationality', value: request.nationality },
                { label: isRTL ? 'رقم الهوية/الجواز' : 'ID/Passport Number', value: <span className="font-mono text-xs">{request.visitor_id_number}</span> },
                { label: isRTL ? 'تاريخ التقديم' : 'Submission Date', value: new Date(request.submitted_at).toLocaleString() },
                { label: isRTL ? 'وضع المراجعة' : 'Review Mode', value: request.mode === 'MODERATED' ? (isRTL ? 'مُراقَب' : 'MODERATED') : (isRTL ? 'أوتوماتيكي' : 'AUTONOMOUS') },
            ]
        },
        {
          title: isRTL ? 'لقطة أهلية الطلب' : 'Eligibility Snapshot',
          description: isRTL ? 'المؤشرات التلقائية لتحديد الأهلية.' : 'Automatic eligibility indicators.',
          items: [
              { label: isRTL ? 'حالة KYC' : 'KYC Status', value: <span className="text-success font-bold">{isRTL ? 'تم التحقق' : 'VERIFIED'}</span> },
              { label: isRTL ? 'نوع الوثيقة' : 'Document Source', value: 'National Digital Identity (IAM)' },
          ]
      }
    ];

    const sidebar = (
        <div className="space-y-6">
            {!decision ? (
              <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xl space-y-4">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{isRTL ? 'مصفوفة القرار' : 'Decision Matrix'}</h3>
                  <div className="space-y-3">
                      <Button 
                          className="w-full py-4 shadow-glow-primary"
                          onClick={() => handleDecision('APPROVED')}
                          isLoading={isProcessing}
                      >
                          <CheckCircle size={20} weight="bold" />
                          {isRTL ? 'الموافقة على الإصدار' : 'Approve Issuance'}
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
                    <h3 className="font-black text-xl uppercase tracking-tight">{isRTL ? `تم ${decision === 'APPROVED' ? 'الموافقة' : 'الرفض'}` : `Request ${decision}`}</h3>
                    <p className="text-xs font-medium opacity-70">{isRTL ? 'تم تحديث النظام وإرسال إشعار للزائر.' : 'The system has been updated and a notification sent to the visitor.'}</p>
                  </div>
                  <Button variant="outline" className="w-full border-neutral-200 text-neutral-900" onClick={() => router.push(`/${locale}/gov/tna-queue`)}>
                    {isRTL ? 'العودة للطابور' : 'Back to Queue'}
                  </Button>
              </div>
            )}

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <IdentificationCard size={20} weight="fill" />
                  <p className="text-xs font-bold uppercase tracking-wider">{isRTL ? 'التحقق من KYC' : 'KYC Verification'}</p>
                </div>
                <p className="text-[10px] text-neutral-600 leading-relaxed font-medium">
                    {isRTL ? 'تم التحقق من هذا المستخدم من خلال نظام الهوية الوطنية الرقمي (IAM). أهلية العنوان هي الخطوة اليدوية الوحيدة المطلوبة.' : 'This user has been verified against the National Digital Identity (IAM) system. Address eligibility is the only manual step required.'}
                </p>
            </div>
        </div>
    );

    return (
        <AppShell role="Gov" header={isRTL ? 'مراجعة طلب إصدار TNA' : 'Review TNA Issuance Request'}>
            <DetailViewLayout
                title={`${isRTL ? 'طلب' : 'Request'} #${request.request_id.slice(0, 8)}...`}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/gov/tna-queue`)}
            />
            
            <div className="mt-12 p-8 bg-surface-200 rounded-3xl border border-neutral-200 space-y-6">
                <div className="flex items-center gap-3">
                  <Files size={24} className="text-neutral-400" />
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight">{isRTL ? 'المستندات الداعمة' : 'Supporting Documents'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                        <IdentificationCard size={20} />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">{isRTL ? 'نسخة الهوية الرقمية (IAM)' : 'Digital ID Copy (IAM)'}</span>
                    </div>
                    <span className="text-[10px] font-black text-success uppercase">{isRTL ? 'تم التحقق' : 'VERIFIED'}</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                        <Globe size={20} />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">{isRTL ? 'سجل دخول الجواز' : 'Passport Entry Record'}</span>
                    </div>
                    <span className="text-[10px] font-black text-success uppercase">{isRTL ? 'تم التحقق' : 'VERIFIED'}</span>
                  </div>
                </div>
            </div>
        </AppShell>
    );
}