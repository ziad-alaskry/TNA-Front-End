'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { issuancePolicyConfig } from '@/lib/mock/gov.mock';
import { useLocale } from '@/i18n/LocaleProvider';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  FileText,
  IdentificationCard,
  User as UserIcon,
  Globe
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';

export default function TNAIssuanceWizard() {
  const router = useRouter();
  const { locale, t, isRTL } = useLocale();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'REVIEW'>('IDLE');
  const [newTnaCode, setNewTnaCode] = useState('');

  const handleSubmit = async () => {
    setStatus('PENDING');
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 70% auto-approve, 30% pending review
    const isAutoApproved = Math.random() > 0.3;
    
    if (isAutoApproved) {
      const randomCode = `TNA-${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
      setNewTnaCode(randomCode);
      setStatus('SUCCESS');
    } else {
      setStatus('REVIEW');
    }
    setStep(3);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      {/* Stepper Header */}
      <div className="flex items-center justify-between px-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-200 -z-10 -translate-y-1/2" />
        {[1, 2, 3].map((s) => (
          <div 
            key={s}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white",
              step === s ? "border-primary text-primary shadow-glow-primary scale-110" : 
              step > s ? "border-success bg-success text-white" : "border-neutral-200 text-neutral-400"
            )}
          >
            {step > s ? <Check weight="bold" /> : s}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Step 1 */}
        {step === 1 && (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <UserIcon className="text-primary" />
                {t('tna.new.identity_confirmation')}
              </h2>
              <p className="text-neutral-500">{t('tna.new.identity_confirmation_desc')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('auth.register.personal.labels.full_name')}</p>
                <p className="font-bold text-neutral-900">{user?.full_name || t('tna.new.mock.full_name')}</p>
              </div>
               <div className="space-y-1">
                 <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('auth.register.personal.labels.document_number')}</p>
                 <p className="font-bold text-neutral-900">{user?.document_number || '1098237465'}</p>
               </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('auth.register.personal.labels.nationality')}</p>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-neutral-400" />
                  <p className="font-bold text-neutral-900">{t('tna.new.mock.nationality')}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('auth.register.personal.labels.dob')}</p>
                <p className="font-bold text-neutral-900">1992-05-14</p>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary/50 transition-colors cursor-pointer group">
              <input 
                type="checkbox" 
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                {t('tna.new.identity_confirm')}
              </span>
            </label>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setStep(2)}
                disabled={!confirmed}
                className="px-8 gap-2"
              >
                {t('common.next')}
                <ArrowRight className={cn(isRTL && "rotate-180")} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <FileText className="text-primary" />
                {t('tna.new.policy_acknowledgment')}
              </h2>
              <p className="text-neutral-500">{t('tna.new.policy_acknowledgment_desc')}</p>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={24} weight="fill" />
                </div>
                <div>
                  <p className="font-bold text-primary">{t('tna.new.issuance_mode')}: {t(`gov.policy.options.${issuancePolicyConfig.issuance_mode}`)}</p>
                  <p className="text-xs text-primary/70">
                    {issuancePolicyConfig.issuance_mode === 'AUTONOMOUS' 
                      ? t('tna.new.autonomous') 
                      : t('tna.new.moderated')}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-neutral-600 list-disc list-inside ps-2">
                <li>{t('tna.new.validity_rule')}</li>
                <li>{t('tna.new.max_active')}: {issuancePolicyConfig.max_active_tnas_per_visitor}.</li>
                <li>{t('tna.new.binding_responsibility')}</li>
              </ul>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 hover:border-primary/50 transition-colors cursor-pointer group">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                {t('tna.new.terms_agreement')}
              </span>
            </label>

            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
                className="gap-2"
              >
                <ArrowLeft className={cn(isRTL && "rotate-180")} />
                {t('common.back')}
              </Button>
              <Button 
                onClick={handleSubmit}
                isLoading={status === 'PENDING'}
                disabled={!agreed}
                className="px-8"
              >
                {t('tna.new.submit_request')}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div className="p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
            {status === 'SUCCESS' ? (
              <>
                <div className="mx-auto w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success animate-bounce">
                  <Check size={48} weight="bold" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">{t('tna.new.approved')}</h2>
                  <p className="text-neutral-500">{t('tna.new.issued_success')}</p>
                </div>

                <div className="p-8 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/30 relative group">
                  <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 opacity-60">{t('tna.new.your_tna_code')}</p>
                  <p className="text-5xl font-black text-primary font-mono tracking-tighter">
                    {newTnaCode}
                  </p>
                  <div className="absolute -top-3 -right-3 px-3 py-1 bg-success text-white text-[10px] font-bold rounded-full shadow-lg">
                    {t('tna.new.active')}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button 
                    className="w-full sm:w-auto px-10 py-6 text-lg shadow-glow-primary gap-2"
                    onClick={() => router.push(`/${locale}/visitor/tnas`)}
                  >
                    {t('tna.new.go_to_tnas')}
                    <ArrowRight size={20} className={cn(isRTL && "rotate-180")} />
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto px-10 py-6 text-lg"
                    onClick={() => router.push(`/${locale}/visitor/home`)}
                  >
                    {t('tna.new.return_dashboard')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                  <Clock size={48} weight="fill" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">{t('tna.new.pending_review')}</h2>
                  <p className="text-neutral-500">{t('tna.new.manual_review')}</p>
                </div>

                <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 max-w-sm mx-auto">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {t('tna.new.review_note')}
                  </p>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="outline"
                    className="px-10 py-4"
                    onClick={() => router.push(`/${locale}/visitor/home`)}
                  >
                    {t('tna.new.return_dashboard')}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
