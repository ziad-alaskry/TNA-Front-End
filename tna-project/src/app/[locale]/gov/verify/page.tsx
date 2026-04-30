'use client'

import React, { useState, Suspense } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
    ShieldCheck, 
    IdentificationCard, 
    MapPin, 
    FileText, 
    Clock, 
    CheckCircle, 
    XCircle,
    User,
    ArrowRight,
    CaretRight,
    Eye,
    ChatCircleDots,
    BoundingBox
} from '@phosphor-icons/react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useLocale } from '@/i18n/LocaleProvider'

function VerifyActionContent() {
    const router = useRouter();
    const { locale } = useParams();
    const { t, isRTL } = useLocale();
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || 'REQ-1002';

    const [decisionMode, setDecisionMode] = useState<'NONE' | 'APPROVE' | 'REJECT'>('NONE');
    const [reason, setReason] = useState('');

    const requestDetails = {
        visitor: {
            name: t('gov.queue.mock_name_1'),
            id_number: '1099228833',
            nationality: t('gov.verify.saudi'),
            document_source: 'National ID Gateway'
        },
        tna: {
            code: 'TNA-667722',
            type: 'RESIDENTIAL',
            request_date: '2025/11/15 10:00 AM'
        },
        eligibility: {
            is_new_registrant: true,
            has_previous_violations: false,
            credit_score_parity: 'OPTIMAL'
        }
    };

    return (
        <AppShell role="Gov" header={t('gov.verify.header').replace('{id}', id)}>
            <div className="flex flex-col xl:flex-row gap-8">
                {/* Left Panel: Request Details */}
                <div className="flex-1 space-y-6">
                    {/* Visitor Card */}
                    <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                                <User size={20} weight="fill" />
                            </div>
                            <h3 className="font-bold text-neutral-900 text-lg">{t('gov.verify.applicant_data')}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            {[
                                { label: t('gov.verify.full_name'), value: requestDetails.visitor.name },
                                { label: t('gov.verify.id_number'), value: requestDetails.visitor.id_number },
                                { label: t('gov.verify.nationality'), value: requestDetails.visitor.nationality },
                                { label: t('gov.verify.verification_source'), value: requestDetails.visitor.document_source },
                            ].map((item, i) => (
                                <div key={i}>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">{item.label}</p>
                                    <p className="text-sm font-bold text-neutral-800">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Eligibility Snapshot */}
                    <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
                                <ShieldCheck size={20} weight="fill" />
                            </div>
                            <h3 className="font-bold text-neutral-900 text-lg">{t('gov.verify.eligibility_indicators')}</h3>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: t('gov.verify.legal_violations'), value: t('gov.verify.clean'), status: 'success' },
                                { label: t('gov.verify.property_verification'), value: t('gov.verify.completed_successfully'), status: 'success' },
                                { label: t('gov.verify.biometric_match'), value: t('gov.verify.matched'), status: 'success' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-surface-100 rounded border border-neutral-100">
                                    <span className="text-xs font-bold text-neutral-700">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-success uppercase">{item.value}</span>
                                        <CheckCircle size={16} weight="fill" className="text-success" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attached Documents */}
                    <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                        <h3 className="font-bold text-neutral-900 mb-4">{t('gov.verify.attached_documents')}</h3>
                        <div className="flex gap-4">
                            {[1, 2].map(doc => (
                                <div key={doc} className="w-32 h-40 bg-neutral-100 rounded border border-neutral-200 flex flex-col items-center justify-center gap-2 cursor-pointer group hover:border-primary transition-all relative overflow-hidden">
                                    <FileText size={32} weight="thin" className="text-neutral-300 group-hover:text-primary" />
                                    <span className="text-[10px] font-bold text-neutral-400">{t('gov.verify.id_image')}</span>
                                    <div className="absolute opacity-0 group-hover:opacity-100 bg-primary h-8 w-full bottom-0 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                        {t('gov.verify.preview_document')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Actions */}
                <div className="w-full xl:w-[400px] space-y-6">
                    <div className="p-6 rounded-md bg-neutral-900 text-white shadow-xl">
                        <div className="mb-6">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{t('gov.verify.make_decision')}</p>
                            <h3 className="text-xl font-bold">{t('gov.verify.status_pending')}</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded border border-white/10">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <IdentificationCard size={18} weight="fill" />
                                    <span className="text-xs font-bold">{t('gov.verify.suggested_code')}</span>
                                </div>
                                <p className="text-2xl font-mono font-bold tracking-wider">{requestDetails.tna.code}</p>
                            </div>

                            <div className="space-y-2 pt-4">
                                {decisionMode === 'NONE' ? (
                                    <>
                                        <button 
                                            onClick={() => setDecisionMode('APPROVE')}
                                            className="w-full h-12 bg-success text-white font-bold rounded-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                        >
                                            <CheckCircle size={20} weight="bold" />
                                            {t('gov.verify.approve_request')}
                                        </button>
                                        <button 
                                            onClick={() => setDecisionMode('REJECT')}
                                            className="w-full h-12 bg-white/10 text-white font-bold rounded-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={20} weight="bold" />
                                            {t('gov.verify.reject_request')}
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                                {decisionMode === 'APPROVE' ? t('gov.verify.confirm_approve') : t('gov.verify.confirm_reject')}
                                            </span>
                                            <button onClick={() => setDecisionMode('NONE')} className="text-[10px] underline text-neutral-400">{t('gov.verify.cancel')}</button>
                                        </div>
                                        <div className="relative">
                                            <ChatCircleDots size={18} className="absolute right-3 top-3 text-white/30" />
                                            <textarea 
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                placeholder={t('gov.verify.admin_notes_placeholder')}
                                                className="w-full h-32 bg-white/5 border border-white/10 rounded-sm p-3 pr-10 text-xs text-white focus:border-primary outline-none resize-none"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => router.push(`/${locale}/gov/verification/queue`)}
                                            className={`w-full h-12 font-bold rounded-sm text-sm ${
                                                decisionMode === 'APPROVE' ? 'bg-success text-white' : 'bg-error text-white'
                                            }`}
                                        >
                                            {decisionMode === 'APPROVE' ? t('gov.verify.confirm_save') : t('gov.verify.send_final_rejection')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => router.push(`/${locale}/gov/verification/queue`)}
                        className="w-full h-12 flex items-center justify-between px-6 bg-surface-200 border border-neutral-200 rounded-md hover:bg-neutral-100 transition-colors"
                    >
                        <span className="text-xs font-bold text-neutral-500">{t('gov.verify.back_to_queue')}</span>
                        <CaretRight size={18} weight="bold" className={isRTL ? "" : "rotate-180"} />
                    </button>
                </div>
            </div>
        </AppShell>
    );
}

export default function VerifyActionPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading request details...</div>}>
            <VerifyActionContent />
        </Suspense>
    );
}
