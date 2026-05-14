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
import { useTranslation } from 'react-i18next';

export default function GovAddressVerificationDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const {  locale, isRTL , t } = useLocale();

    const details = mockSubAddressDetails[id as keyof typeof mockSubAddressDetails];
    const isLoading = false;

    const [isProcessing, setIsProcessing] = useState(false);
    const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | null>(null);
    const [verificationNotes, setVerificationNotes] = useState('');

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
            title: t('gov.owner_information_128'),
            items: [
                { label: t('gov.name_129'), value: details.owner.name },
                { label: t('gov.owner_type_130'), value: details.owner.owner_type === 'INDIVIDUAL' ? (t('gov.individual_131')) : (t('gov.business_132')) },
                { label: t('gov.national_id_133'), value: <span className="font-mono text-xs">{details.owner.national_id}</span> },
                { label: t('gov.verification_status_134'), value: details.owner.is_verified ? <span className="text-success font-bold">{t('gov.verified_135')}</span> : <span className="text-warning font-bold">{t('gov.pending_136')}</span> },
            ]
        },
        {
            title: t('gov.national_address_137'),
            description: t('gov.parent_national_address_linked_to_subadd_138'),
            items: [
                { label: t('gov.full_address_139'), value: details.national_address.full_address },
                { label: t('gov.ownership_proof_status_140'), value: details.national_address.ownership_proof_status === 'VERIFIED' ? <span className="text-success font-bold">{t('gov.verified_135')}</span> : <span className="text-warning font-bold">{t('gov.pending_136')}</span> },
                { label: t('gov.title_deed_reference_143'), value: <span className="font-mono text-xs">{details.national_address.title_deed_reference}</span> },
            ]
        },
        {
            title: t('gov.subaddress_144'),
            description: t('gov.details_of_the_subaddress_to_be_verified_145'),
            items: [
                { label: t('gov.suffix_code_146'), value: <span className="font-mono font-bold text-primary">{details.sub_address.suffix_code}</span> },
                { label: t('gov.label_147'), value: details.sub_address.label },
                { label: t('gov.description_148'), value: details.sub_address.description },
            ]
        }
    ];

    const sidebar = (
        <div className="space-y-6">
            {!decision ? (
              <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-xl space-y-4">
                  <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">{t('gov.verification_action_149')}</h3>
                  <div className="space-y-3">
                      <Button 
                          className="w-full py-4 shadow-glow-primary"
                          onClick={() => handleDecision('APPROVED')}
                          isLoading={isProcessing}
                      >
                          <CheckCircle size={20} weight="bold" />
                          {t('gov.verify_address_150')}
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
                    <h3 className="font-black text-xl uppercase tracking-tight">{t(decision === 'APPROVED' ? 'gov.address_verified' : 'gov.address_rejected')}</h3>
                    <p className="text-xs font-medium opacity-70">{t('gov.the_subaddress_verification_status_has_b_152')}</p>
                  </div>
                  <Button variant="outline" className="w-full border-neutral-200 text-neutral-900" onClick={() => router.push(`/${locale}/gov/address-queue`)}>
                    {t('gov.back_to_queue_153')}
                  </Button>
              </div>
            )}

            <div className="p-4 bg-warning/5 rounded-2xl border border-warning/10 space-y-2">
                <div className="flex items-center gap-2 text-warning">
                  <ShieldCheck size={20} weight="fill" />
                  <p className="text-xs font-bold uppercase tracking-wider">{t('gov.security_note_154')}</p>
                </div>
                <p className="text-[10px] text-neutral-600 leading-relaxed font-medium">
                    {t('gov.verify_that_the_subaddress_matches_the_p_155')}
                </p>
            </div>
        </div>
    );

    return (
        <AppShell role="Gov">
            <DetailViewLayout
                title={`${t('gov.subaddress_157')} ${details.sub_address.suffix_code}`}
                mainContent={sections}
                sidebar={sidebar}
                onBack={() => router.push(`/${locale}/gov/address-queue`)}
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
                      <span className="text-xs font-bold text-neutral-700">{t('gov.title_deed_159')}: {details.national_address.title_deed_reference}</span>
                    </div>
                    <span className="text-[10px] font-black text-success uppercase">{t('gov.available_160')}</span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-neutral-100 flex items-center justify-between group hover:border-primary/30 cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                        <Buildings size={20} />
                      </div>
                      <span className="text-xs font-bold text-neutral-700">{t('gov.na_certificate_161')}</span>
                    </div>
                    <span className="text-[10px] font-black text-success uppercase">{t('gov.available_160')}</span>
                  </div>
                </div>
            </div>
        </AppShell>
    );
}