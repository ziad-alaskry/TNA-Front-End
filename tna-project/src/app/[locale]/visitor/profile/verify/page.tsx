'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/i18n/LocaleProvider';
import { useKYCStore } from '@/lib/store/useKYCStore';
import {
  IdentificationCard,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Camera,
  ShieldCheck,
  ArrowRight
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';
import EmptyState from '@/components/ui/EmptyState';
import { KYCDocType, KYCStatus, KYCDocument } from '@/lib/types/kyc';

const DOCUMENT_TYPES: { type: KYCDocType; labelKey: string; icon: any; descriptionKey: string }[] = [
  { type: 'NATIONAL_ID', labelKey: 'kyc.document.national_id', icon: IdentificationCard, descriptionKey: 'kyc.document.national_id_desc' },
  { type: 'PASSPORT', labelKey: 'kyc.document.passport', icon: ShieldCheck, descriptionKey: 'kyc.document.passport_desc' },
  { type: 'RESIDENCE_PERMIT', labelKey: 'kyc.document.residence_permit', icon: FileText, descriptionKey: 'kyc.document.residence_permit_desc' },
  { type: 'DRIVER_LICENSE', labelKey: 'kyc.document.driver_license', icon: Camera, descriptionKey: 'kyc.document.driver_license_desc' },
];

export default function VisitorVerifyPage() {
  const router = useRouter();
  const { t, locale, isRTL } = useLocale();
  const { verifications, fetchVerifications, updateVerification } = useKYCStore();
  const [uploading, setUploading] = useState<{[key: string]: boolean}>({});
  const [selectedDoc, setSelectedDoc] = useState<KYCDocType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentVerification = verifications[0];

  React.useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const getStatusColor = (status: KYCStatus) => {
    switch (status) {
      case 'APPROVED': return 'text-success bg-success-bg';
      case 'PENDING': return 'text-pending bg-pending-bg';
      case 'REJECTED': return 'text-error bg-error-bg';
      case 'EXPIRED': return 'text-warning bg-warning-bg';
      default: return 'text-neutral-400 bg-neutral-100';
    }
  };

  const getStatusIcon = (status: KYCStatus) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle size={20} className="text-success" />;
      case 'PENDING': return <Clock size={20} className="text-pending" />;
      case 'REJECTED': return <XCircle size={20} className="text-error" />;
      default: return <Clock size={20} className="text-neutral-400" />;
    }
  };

  const getStatusLabel = (status: KYCStatus) => {
    const key = `kyc.status.${status.toLowerCase()}`;
    return t(key) || status;
  };

  const handleFileUpload = async (docType: KYCDocType, file: File, isBack?: boolean) => {
    const key = `${docType}_${isBack ? 'back' : 'front'}`;
    setUploading(prev => ({ ...prev, [key]: true }));
    
    await new Promise(r => setTimeout(r, 1500));
    
    setUploading(prev => ({ ...prev, [key]: false }));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSubmitForReview = async () => {
    await updateVerification('kyc-001', { status: 'PENDING' });
  };

  const renderDocumentUpload = (doc: { type: KYCDocType; labelKey: string; icon: any; descriptionKey: string }) => {
    const existingDoc = currentVerification?.documents.find(d => d.document_type === doc.type);
    const key = `${doc.type}_front`;
    
    return (
      <div key={doc.type} className="border border-neutral-200 bg-surface-200 rounded-md p-4 hover:border-primary/30 transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary shadow-card flex-shrink-0">
            <doc.icon size={24} weight="bold" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-subheading font-bold text-neutral-900">{t(doc.labelKey)}</h4>
            <p className="text-caption text-neutral-500 mt-1">{t(doc.descriptionKey)}</p>
          </div>
          {existingDoc && (
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-success-bg text-success">
              <CheckCircle size={12} />
              {t('common.uploaded')}
            </span>
          )}
        </div>
        
        <div className="mt-4">
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-md cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors group">
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload size={24} className="text-neutral-300 group-hover:text-primary transition-colors" />
              <span className="text-caption text-neutral-400 group-hover:text-primary transition-colors">
                {t('kyc.upload_hint')}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(doc.type, file, false);
              }}
            />
          </label>
          {uploading[key] && (
            <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              {t('common.uploading')}...
            </div>
          )}
          {existingDoc && (
            <p className="mt-2 text-[11px] text-neutral-400 font-medium">
              {t('kyc.uploaded_at')}: {new Date(existingDoc.created_at).toLocaleDateString(locale)}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-100 pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-50 bg-surface-200 border-b border-neutral-100 py-3 px-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 -m-2">
          <ArrowRight size={24} className={isRTL ? 'rotate-180' : ''} />
        </button>
        <h1 className="text-base font-bold text-neutral-900">{t('kyc.verification_title')}</h1>
        <div className="w-10" />
      </header>

      <div className="p-4 space-y-4">
        {currentVerification && (
          <div className="rounded-md border p-4 bg-surface-200 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon(currentVerification.overall_status)}
              <span className={`text-[11px] font-bold uppercase tracking-wider ${getStatusColor(currentVerification.overall_status)} px-2 py-1 rounded`}>
                {getStatusLabel(currentVerification.overall_status)}
              </span>
            </div>
            <p className="text-caption text-neutral-500 mb-3">{t('kyc.verification_description')}</p>
            {currentVerification.verification_score !== undefined && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${currentVerification.verification_score}%` }} />
                </div>
                <span className="text-xs font-bold text-neutral-600">{currentVerification.verification_score}%</span>
              </div>
            )}
            {currentVerification.notes && (
              <p className="text-[11px] text-neutral-400 mt-2 italic">{currentVerification.notes}</p>
            )}
          </div>
        )}

        {showSuccess && (
          <div className="fixed top-20 left-4 right-4 z-50 flex items-center gap-2 bg-success text-white px-4 py-3 rounded-md shadow-lg">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">{t('kyc.upload_success')}</span>
          </div>
        )}

        <div className="rounded-md border border-neutral-200 bg-surface-200 shadow-card overflow-hidden">
          <div className="border-b border-neutral-100 bg-neutral-50/50 p-4">
            <div className="flex items-center gap-2">
              <IdentificationCard size={20} className="text-primary" />
              <h2 className="text-subheading font-bold text-neutral-900">{t('kyc.required_documents')}</h2>
            </div>
            <p className="text-caption text-neutral-500 mt-1 text-sm">{t('kyc.documents_description')}</p>
          </div>
          <div className="p-4 space-y-3">
            {DOCUMENT_TYPES.map(doc => renderDocumentUpload(doc))}
          </div>
        </div>

        <button
          onClick={handleSubmitForReview}
          className="w-full h-14 rounded-pill bg-btn-primary text-white font-bold shadow-btn active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck size={20} weight="fill" />
          <span>{t('kyc.submit_for_verification')}</span>
        </button>

        <div className="rounded-md border border-neutral-200 bg-surface-200 p-4">
          <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">{t('kyc.process_info_title')}</h3>
          <ul className="space-y-2 text-[11px] text-neutral-500">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              {t('kyc.process_info_1')}
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              {t('kyc.process_info_2')}
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              {t('kyc.process_info_3')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
