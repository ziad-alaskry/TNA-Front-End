'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockBalances } from '@/lib/mock/financials.mock';
import { useLocale } from '@/i18n/LocaleProvider';
import { 
  CreditCard, 
  Wallet, 
  CheckCircle, 
  WarningCircle, 
  ArrowRight,
  ShieldCheck,
  Receipt,
  X,
  CaretRight
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import Modal from '@/components/ui/Modal';

export default function CheckoutModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, isRTL } = useLocale();
  
  const [balance, setBalance] = useState(mockBalances['user-visitor-1']);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  
  const total = parseFloat(searchParams.get('total') || '0');
  const tnaId = searchParams.get('tna');
  const variantId = searchParams.get('variant');
  const type = searchParams.get('type');

  const deficit = Math.max(0, total - balance);
  const isInsufficient = balance < total;

  useEffect(() => {
    if (deficit > 0) {
      setTopUpAmount(deficit.toString());
    }
  }, [deficit]);

  const handleTopUp = async () => {
    // Mock top up
    await new Promise(resolve => setTimeout(resolve, 1500));
    setBalance(prev => prev + parseFloat(topUpAmount));
    setIsTopUpOpen(false);
  };

  const handlePay = async () => {
    setPaymentStatus('PROCESSING');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentStatus('SUCCESS');
    
    // Redirect after success
    setTimeout(() => {
      router.push(`/${locale}/visitor/tnas/${tnaId}`);
    }, 3000);
  };

  if (paymentStatus === 'SUCCESS') {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="mx-auto w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success animate-bounce">
          <CheckCircle size={64} weight="fill" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-neutral-900 uppercase">Payment Success!</h2>
          <p className="text-neutral-500">Your binding request has been submitted and is awaiting owner approval.</p>
        </div>
        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
          <p className="text-sm text-neutral-600">Redirecting to your TNA details in 3 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Order Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Receipt className="text-primary" />
              Order Summary
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-neutral-900">
                  {type === 'binding' ? 'TNA Binding Request' : 'TNA Issuance'}
                </p>
                <p className="text-xs text-neutral-500">TNA ID: {tnaId}</p>
                {variantId && <p className="text-xs text-neutral-500">Unit ID: {variantId}</p>}
              </div>
              <p className="font-bold text-neutral-900">SAR {total.toFixed(2)}</p>
            </div>

            <div className="h-px bg-neutral-100" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-medium">SAR {(total - 50).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Service Fee</span>
                <span className="font-medium">SAR 50.00</span>
              </div>
              <div className="flex justify-between text-lg font-black text-primary pt-2">
                <span>Total Amount</span>
                <span>SAR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
          <ShieldCheck size={32} className="text-primary" weight="fill" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-primary">Secure Checkout</p>
            <p className="text-xs text-primary/70">Your payment is processed securely. Funds are held in escrow until the binding is confirmed by the property owner.</p>
          </div>
        </div>
      </div>

      {/* Payment Action */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 space-y-6 sticky top-24">
          <h3 className="font-bold text-neutral-900">Payment Method</h3>
          
          <div className={cn(
            "p-4 rounded-xl border-2 transition-all",
            isInsufficient ? "border-warning/30 bg-warning/5" : "border-primary bg-primary/5"
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet size={20} className={isInsufficient ? "text-warning" : "text-primary"} weight="fill" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Digital Wallet</span>
              </div>
              {isInsufficient && (
                <span className="px-2 py-0.5 bg-warning text-white text-[10px] font-bold rounded-full">
                  INSUFFICIENT
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-neutral-900">SAR {balance.toFixed(2)}</p>
            <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold tracking-widest">Available Balance</p>
          </div>

          {isInsufficient && (
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-warning">
                <WarningCircle size={16} className="mt-0.5 shrink-0" />
                <p className="text-xs font-medium">You need an additional SAR {deficit.toFixed(2)} to complete this transaction.</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-warning text-warning hover:bg-warning/10"
                onClick={() => setIsTopUpOpen(true)}
              >
                Top Up Wallet
              </Button>
            </div>
          )}

          <Button 
            className="w-full py-6 text-lg shadow-glow-primary"
            disabled={isInsufficient || paymentStatus === 'PROCESSING'}
            isLoading={paymentStatus === 'PROCESSING'}
            onClick={handlePay}
          >
            Pay SAR {total.toFixed(2)}
          </Button>

          <p className="text-[10px] text-center text-neutral-400 px-4">
            By clicking Pay, you agree to our Terms of Service and Refund Policy.
          </p>
        </div>
      </div>

      {/* Top Up Modal */}
      <Modal 
        isOpen={isTopUpOpen} 
        onClose={() => setIsTopUpOpen(false)}
        title="Top Up Digital Wallet"
      >
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">Amount to Add (SAR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-400">SAR</span>
              <input 
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full pl-14 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-2xl font-black outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Select Payment Method</p>
            <div className="grid grid-cols-1 gap-2">
              {['Credit Card', 'Apple Pay', 'STC Pay'].map((m) => (
                <div 
                  key={m}
                  className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-primary/50 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <CreditCard size={24} />
                    </div>
                    <span className="font-bold text-neutral-700">{m}</span>
                  </div>
                  <CaretRight size={18} className="text-neutral-300 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="w-full py-4 shadow-glow-primary"
            onClick={handleTopUp}
          >
            Complete Top Up
          </Button>
        </div>
      </Modal>
    </div>
  );
}
