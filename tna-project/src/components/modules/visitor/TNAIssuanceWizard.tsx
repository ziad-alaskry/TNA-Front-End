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
        {/* Step 1: Identity Confirmation */}
        {step === 1 && (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <UserIcon className="text-primary" />
                Identity Confirmation
              </h2>
              <p className="text-neutral-500">Please confirm your personal data as registered in the national registry.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Full Name</p>
                <p className="font-bold text-neutral-900">{user?.full_name || 'Abdullah Al-Ghamdi'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Document Number</p>
                <p className="font-bold text-neutral-900">{user?.doc_number || '1098237465'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Nationality</p>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-neutral-400" />
                  <p className="font-bold text-neutral-900">Saudi Arabia</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Birth Date</p>
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
                I confirm that all personal data shown above is correct and matches my official identification.
              </span>
            </label>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setStep(2)}
                disabled={!confirmed}
                className="px-8"
              >
                Next Step
                <ArrowRight className={cn("ml-2", isRTL && "rotate-180")} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Policy Acknowledgment */}
        {step === 2 && (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <FileText className="text-primary" />
                Policy Acknowledgment
              </h2>
              <p className="text-neutral-500">Review the TNA issuance policy and terms of service.</p>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={24} weight="fill" />
                </div>
                <div>
                  <p className="font-bold text-primary">Issuance Mode: {issuancePolicyConfig.issuance_mode}</p>
                  <p className="text-xs text-primary/70">
                    {issuancePolicyConfig.issuance_mode === 'AUTONOMOUS' 
                      ? 'Your TNA will be issued immediately upon submission.' 
                      : 'Your request requires administrative review before issuance.'}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-neutral-600 list-disc list-inside ps-2">
                <li>TNAs are valid for a maximum of 12 months.</li>
                <li>Maximum active TNAs allowed: {issuancePolicyConfig.max_active_tnas_per_visitor}.</li>
                <li>Users are responsible for ensuring binding requests are valid.</li>
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
                I agree to the TNA Terms and Conditions and understand the operational policies.
              </span>
            </label>

            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className={cn("mr-2", isRTL && "rotate-180")} />
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                isLoading={status === 'PENDING'}
                disabled={!agreed}
                className="px-8"
              >
                Submit Request
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
                  <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">Approved!</h2>
                  <p className="text-neutral-500">Your Temporary National Address has been issued successfully.</p>
                </div>

                <div className="p-8 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/30 relative group">
                  <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2 opacity-60">Your TNA Code</p>
                  <p className="text-5xl font-black text-primary font-mono tracking-tighter">
                    {newTnaCode}
                  </p>
                  <div className="absolute -top-3 -right-3 px-3 py-1 bg-success text-white text-[10px] font-bold rounded-full shadow-lg">
                    ACTIVE
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button 
                    className="w-full sm:w-auto px-10 py-6 text-lg shadow-glow-primary"
                    onClick={() => router.push(`/${locale}/visitor/tnas/1/bind`)}
                  >
                    Bind This TNA
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto px-10 py-6 text-lg"
                    onClick={() => router.push(`/${locale}/visitor/home`)}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                  <Clock size={48} weight="fill" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">Pending Review</h2>
                  <p className="text-neutral-500">Your request has been routed for manual administrative review.</p>
                </div>

                <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 max-w-sm mx-auto">
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Due to high demand or system policies, your request will be reviewed within <span className="font-bold text-neutral-900">24 hours</span>. You will receive a notification once approved.
                  </p>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="outline"
                    className="px-10 py-4"
                    onClick={() => router.push(`/${locale}/visitor/home`)}
                  >
                    Return to Dashboard
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
