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
import { mockGovQueue, mockTNARequestDetails } from '@/lib/mock/gov.mock'
import { useLocale } from '@/i18n/LocaleProvider'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useTranslation } from 'react-i18next';

export default function GovTNARequestDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const {  locale, isRTL , t } = useLocale();

    const details = mockTNARequestDetails[id as keyof typeof mockTNARequestDetails];
    const isLoading = false;

    const [isProcessing, setIsProcessing] = useState(false);
    const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');

    if (isLoading) return <div className="p-12 text-center">{t('gov.loading_request_details_126')}</div>;
    if (!details) return <div className="p-12 text-center text-error">{t('gov.request_not_found_127')}</div>;

    const handleDecision = async (type: 'APPROVED' | 'REJECTED') => {
      setIsProcessing(true);
      await new Promise(r => setTimeout(r, 1500));
      setDecision(type);
      setIsProcessing(false);
    };

    const sections = [
        {
            title: t('gov.visitor_information_162'),
            items: [
                { label: t('gov.name_129'), value: details.visitor.name },
                { label: t('gov.nationality_163'), value: details.visitor.nationality },
                { label: t('gov.national_id_133'), value: <span className="font-mono text-xs">{details.visitor.national_id}</span> },
                { label: t('gov.visa_status_164'), value: details.visitor.visa_status },
            ]
        },
        {
            title: t('gov.eligibility_snapshot_165'),
            description: t('gov.visitor_eligibility_assessment_166'),
            items: [
                { label: t('gov.visa_valid_167'), value: details.eligibility.visa_valid ? <span className="text-success font-bold">{t('gov.yes_168')}</span> : <span className="text-error font-bold">{t('gov.no_169')}</span> },
                { label: t('gov.iqama_valid_170'), value: details.eligibility.iqama_valid ? <span className="text-success font-bold">{t('gov.yes_168')}</span> : <span className="text-error font-bold">{t('gov.no_169')}</span> },
                { label: t('gov.max_tnas_reached_171'), value: details.eligibility.max_tnas_reached ? <span className="text-error font-bold">{t('gov.yes_168')}</span> : <span className="text-success font-bold">{t('gov.no_169')}</span> },
                { label: t('gov.risk_score_172'), value: details.eligibility.risk_score },
            ]
        },
        {
            title: t('gov.supporting_documents_158'),
            description: t('gov.documents_submitted_by_visitor_173'),
            items: [
                { label: t('gov.passport_entry_174'), value: details.documents.find((d: any) => d.type === 'passport_entry')?.status || 'NOT_UPLOADED' },
                { label: t('gov.id_copy_175'), value: details.documents.find((d: any) => d.type === 'id_copy')?.status || 'NOT_UPLOADED' },
                { label: t('gov.residence_permit_176'), value: details.documents.find((d: any) => d.type === 'residence_permit')?.status || 'NOT_UPLOADED' },
            ]
        }
    ];

    const sidebar = (
        <div className="space-y-6">
            {!decision ? (
              <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xl space-y-4">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{t('gov.review_action_177')}</h3>
                  <div className="space-y-3">
                      <Button 
                          className="w-full py-4 shadow-glow-primary"
                          onClick={() => handleDecision('APPROVED')}
                          isLoading={isProcessing}
                      >
                          <CheckCircle size={20} weight="bold" />
                          {t('gov.approve_request_178')}
                      </Button>
                      <Button 
                          variant="outline" 
                          className="w-full py-4 border-error/20 text-error hover:bg-error/5"
                          onClick={() => handleDecision('REJECTED')}
                          isLoading={isProcessing}
                      >
                          <XCircle size={20} weight="bold" />
                          {t('gov.reject_request_151')}
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
                    <h3 className="font-black text-xl uppercase tracking-tight">{t(decision === 'APPROVED' ? 'gov.request_approved' : 'gov.request_rejected')}</h3>
                    <p className="text-xs font-medium opacity-70">{t('gov.the_tna_request_status_has_been_updated_179')}</p>
                  </div>
                  <Button variant="outline" className="w-full border-neutral-200 text-neutral-900" onClick={() => router.push(`/${locale}/gov/tna-queue`)}>
                    {t('gov.back_to_queue_180')}
                  </Button>
              </div>
            )}

            <div className="p-4 bg-warning/5 rounded-2xl border border-warning/10 space-y-2">
                <div className="flex items-center gap-2 text-warning">
                  <ShieldCheck size={20} weight="fill" />
                  <p className="text-xs font-bold uppercase tracking-wider">{t('gov.security_note_154')}</p>
                </div>
                <p className="text-[10px] text-neutral-600 leading-relaxed font-medium">
                    {t('gov.verify_visitor_details_before_approving_181')}
                </p>
            </div>
        </div>
    );

    return (
        <AppShell role="Gov">
            <DetailViewLayout
                title={`${t('gov.tna_request_183')} ${details.request_id}`}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/gov/tna-queue`)}
            />
            
            <div className="mt-12 p-8 bg-surface-200 rounded-3xl border border-neutral-200 space-y-6">
                <div className="flex items-center gap-3">
                  <Files size={24} className="text-neutral-400" />
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight">{t('gov.supporting_documents_158')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                        <IdentificationCard size={20} />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">{t('gov.document_type_184')}: {t('gov.passport_entry_174')}</span>
                    </div>
                    <span className={cn("text-[10px] font-black uppercase", details.documents.find((d: any) => d.type === 'passport_entry')?.status === 'UPLOADED' ? 'text-success' : 'text-error')}>
                        {details.documents.find((d: any) => d.type === 'passport_entry')?.status === 'UPLOADED' ? t('gov.available_160') : t('gov.missing_185')}
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                        <IdentificationCard size={20} />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">{t('gov.document_type_184')}: {t('gov.id_copy_175')}</span>
                    </div>
                    <span className={cn("text-[10px] font-black uppercase", details.documents.find((d: any) => d.type === 'id_copy')?.status === 'UPLOADED' ? 'text-success' : 'text-error')}>
                        {details.documents.find((d: any) => d.type === 'id_copy')?.status === 'UPLOADED' ? t('gov.available_160') : t('gov.missing_185')}
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                        <MapPin size={20} />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">{t('gov.document_type_184')}: {t('gov.residence_permit_176')}</span>
                    </div>
                    <span className={cn("text-[10px] font-black uppercase", details.documents.find((d: any) => d.type === 'residence_permit')?.status === 'UPLOADED' ? 'text-success' : 'text-error')}>
                        {details.documents.find((d: any) => d.type === 'residence_permit')?.status === 'UPLOADED' ? t('gov.available_160') : t('gov.missing_185')}
                    </span>
                  </div>
                </div>
            </div>
        </AppShell>
    );
}