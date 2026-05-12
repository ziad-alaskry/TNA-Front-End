'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { useLocale } from '@/i18n/LocaleProvider';
import { bindingsApi } from '@/lib/api/bindings';
import { rentalsApi } from '@/lib/api/rentals';
import { financialsApi } from '@/lib/api/financials';
import { useWallet } from '@/lib/hooks/useWallet';
import { useBindingContext } from '@/context/BindingContext';
import Button from '@/components/ui/Button';
import ErrorAlert from '@/components/ui/ErrorAlert';
import Modal from '@/components/ui/Modal';
import InputField from '@/components/ui/InputField';
import {
  CreditCard,
  Wallet,
  CheckCircle,
  WarningCircle,
  ArrowRight,
  ShieldCheck,
  Receipt,
  CaretRight,
  X,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils/cn';
import type { Binding, RentContract } from '@/lib/types';

// Luhn algorithm for credit card validation
function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '');
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

// Format card number with spaces
function formatCardNumber(value: string): string {
  const digits = value.replace(/\s/g, '').replace(/\D/g, '');
  return digits.replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
}

// Format expiry date MM/YY
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
}

// Validate expiry date is in the future
function isValidExpiry(expiry: string): boolean {
  const parts = expiry.split('/');
  if (parts.length !== 2) return false;
  const month = parseInt(parts[0], 10);
  const year = parseInt(parts[1], 10) + 2000;
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiryDate = new Date(year, month, 0);
  return expiryDate > now;
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const { locale } = params as { locale: string; binding_id: string };
  const bindingId = params.binding_id as string;
  const { t, isRTL } = useLocale();
  const { balance, updateBalance } = useWallet();
  const { processPayment, activateBinding } = useBindingContext();

  const [binding, setBinding] = useState<Binding | null>(null);
  const [rentContract, setRentContract] = useState<RentContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'stc'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardErrors, setCardErrors] = useState<{cardNumber?: string; expiry?: string; cvv?: string; name?: string}>({});
  
  // Fetch binding and rent contract on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bindingRes, contract] = await Promise.all([
          bindingsApi.getBindingById(bindingId),
          rentalsApi.getContractByBinding(bindingId),
        ]);
        setBinding(bindingRes.data);
        setRentContract(contract);
      } catch (err: any) {
        setError(err.message || 'Failed to load checkout details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bindingId]);

  const total = rentContract?.gross_amount || 0;
  const deficit = Math.max(0, total - balance);
  const isInsufficient = balance < total;

  const handleTopUp = async () => {
    // Validate card fields if credit card is selected
    if (paymentMethod === 'card') {
      const errors: {cardNumber?: string; expiry?: string; cvv?: string; name?: string} = {};
      
      if (!luhnCheck(cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = t('payment.invalid_card') || 'Invalid card number';
      } else if (cardNumber.replace(/\s/g, '').length !== 16) {
        errors.cardNumber = t('payment.invalid_card_length') || 'Card number must be 16 digits';
      }
      
      if (!isValidExpiry(cardExpiry)) {
        errors.expiry = t('payment.invalid_expiry') || 'Card expired or invalid date';
      }
      
      if (cardCvv.length < 3) {
        errors.cvv = t('payment.invalid_cvv') || 'CVV must be at least 3 digits';
      }
      
      if (!cardName.trim()) {
        errors.name = t('payment.name_required') || 'Cardholder name is required';
      }
      
      if (Object.keys(errors).length > 0) {
        setCardErrors(errors);
        return;
      }
    }
    
    setPaymentStatus('PROCESSING');
    // Mock top-up delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const amount = parseFloat(topUpAmount);
    if (!isNaN(amount) && amount > 0) {
      updateBalance(amount);
      setPaymentStatus('SUCCESS');
      setTimeout(() => {
        setPaymentStatus('IDLE');
        setIsTopUpOpen(false);
      }, 1500);
    }
  };

  const handlePay = async () => {
    if (isInsufficient) {
      setIsTopUpOpen(true);
      return;
    }
    setPaymentStatus('PROCESSING');
    try {
      // 1. Create order
      const order = await financialsApi.createOrder(bindingId);
      // 2. Pay order using wallet
      await financialsApi.payOrder(order.order_id, 'wallet');
      // 3. Deduct from visitor wallet
      updateBalance(-total);
      // 4. Record payment transaction and credit owner (mock)
      await processPayment(bindingId, total);
      // 5. Activate binding and TNA
      await activateBinding(bindingId);
      // 6. Success state
      setPaymentStatus('SUCCESS');
      setTimeout(() => {
        router.push(`/${locale}/visitor/tnas/${binding?.tna_id}`);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
      setPaymentStatus('IDLE');
    }
  };

  if (loading) {
    return (
      <RoleGuard requiredRole="Visitor">
        <AppShell role="Visitor" header={t('checkout.title') || 'Checkout'}>
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-neutral-500">{t('common.loading') || 'Loading...'}</p>
          </div>
        </AppShell>
      </RoleGuard>
    );
  }

  if (error || !binding || !rentContract) {
    return (
      <RoleGuard requiredRole="Visitor">
        <AppShell role="Visitor" header={t('checkout.title') || 'Checkout'}>
          <div className="max-w-md mx-auto py-12">
            <ErrorAlert message={error || 'Checkout data not available'} />
          </div>
        </AppShell>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header={t('checkout.title') || 'Checkout'}>
        <div className="max-w-4xl mx-auto py-4 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Receipt className="text-primary" />
                  {t('checkout.order_summary') || 'Order Summary'}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-neutral-900">
                      {t('checkout.binding_request') || 'TNA Binding Request'}
                    </p>
                    <p className="text-xs text-neutral-500">Binding ID: {binding.binding_id}</p>
                    <p className="text-xs text-neutral-500">TNA: {binding.tna_code}</p>
                  </div>
                  <p className="font-bold text-neutral-900">
                    SAR {total.toFixed(2)}
                  </p>
                </div>

                <div className="h-px bg-neutral-100" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">{t('checkout.gross_amount') || 'Gross Amount'}</span>
                    <span className="font-medium">SAR {rentContract.gross_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">
                      {t('checkout.platform_fee') || 'Platform Fee'} ({rentContract.platform_fee_percentage}%)
                    </span>
                    <span className="font-medium text-error">- SAR {rentContract.platform_fee_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">
                      {t('checkout.authority_share') || 'Authority Fee'} ({rentContract.authority_share_percentage}%)
                    </span>
                    <span className="font-medium text-error">- SAR {rentContract.authority_share_amount.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-neutral-100 my-2" />
                  <div className="flex justify-between text-lg font-black text-primary">
                    <span>{t('checkout.total_payable') || 'Total Payable'}</span>
                    <span>SAR {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-500 pt-1">
                    <span>{t('checkout.owner_net') || 'Owner Receives'}</span>
                    <span className="font-semibold text-success">+ SAR {rentContract.net_owner_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
              <ShieldCheck size={32} className="text-primary" weight="fill" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary">
                  {t('checkout.secure_checkout') || 'Secure Checkout'}
                </p>
                <p className="text-xs text-primary/70">
                  {t('checkout.escrow_notice') || 'Your payment is processed securely. Funds are held in escrow until the binding is confirmed by the property owner.'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 space-y-6 sticky top-24">
              <h3 className="font-bold text-neutral-900">
                {t('checkout.payment_method') || 'Payment Method'}
              </h3>

              <div className={cn(
                "p-4 rounded-xl border-2 transition-all",
                isInsufficient ? "border-warning/30 bg-warning/5" : "border-primary bg-primary/5"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wallet size={20} className={isInsufficient ? "text-warning" : "text-primary"} weight="fill" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      {t('checkout.wallet_balance') || 'Digital Wallet'}
                    </span>
                  </div>
                  {isInsufficient && (
                    <span className="px-2 py-0.5 bg-warning text-white text-[10px] font-bold rounded-full">
                      {t('checkout.insufficient') || 'INSUFFICIENT'}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-neutral-900">
                  SAR {balance.toFixed(2)}
                </p>
                <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold tracking-widest">
                  {t('checkout.available_balance') || 'Available Balance'}
                </p>
              </div>

              {isInsufficient && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 text-warning">
                    <WarningCircle size={16} className="mt-0.5 shrink-0" />
                    <p className="text-xs font-medium">
                      {t('checkout.insufficient_funds') || `You need an additional SAR ${deficit.toFixed(2)} to complete this transaction.`}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-warning text-warning hover:bg-warning/10"
                    onClick={() => setIsTopUpOpen(true)}
                  >
                    {t('checkout.top_up') || 'Top Up Wallet'}
                  </Button>
                </div>
              )}

              <Button
                className="w-full py-6 text-lg shadow-glow-primary"
                disabled={isInsufficient || paymentStatus === 'PROCESSING'}
                isLoading={paymentStatus === 'PROCESSING'}
                onClick={handlePay}
              >
                {paymentStatus === 'PROCESSING'
                  ? t('checkout.processing') || 'Processing...'
                  : t('checkout.pay_amount', { amount: total.toFixed(2) }) || `Pay SAR ${total.toFixed(2)}`}
              </Button>

              <p className="text-[10px] text-center text-neutral-400 px-4">
                {t('checkout.terms_notice') || 'By clicking Pay, you agree to our Terms of Service and Refund Policy.'}
              </p>
            </div>
          </div>
        </div>

        {/* Top Up Modal */}
        <Modal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} title={t('checkout.top_up_title') || 'Top Up Digital Wallet'}>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                {t('checkout.top_up_amount') || 'Amount to Add (SAR)'}
              </label>
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
              <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                {t('payment.method') || 'Payment Method'}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'card', label: t('payment.credit_card') || 'Credit Card', enabled: true },
                  { id: 'apple', label: t('payment.apple_pay') || 'Apple Pay', enabled: false },
                  { id: 'stc', label: t('payment.stc_pay') || 'STC Pay', enabled: false },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => m.enabled && setPaymentMethod(m.id as any)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all text-start",
                      paymentMethod === m.id
                        ? "border-primary bg-primary/5"
                        : "border-neutral-200 hover:border-primary/30",
                      !m.enabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={!m.enabled}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        paymentMethod === m.id ? "bg-primary/10 text-primary" : "bg-neutral-100 text-neutral-500"
                      )}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-700 block">{m.label}</span>
                        {!m.enabled && (
                          <span className="text-[10px] text-neutral-400">{t('payment.coming_soon') || 'Coming Soon'}</span>
                        )}
                      </div>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      paymentMethod === m.id ? "border-primary" : "border-neutral-300"
                    )}>
                      {paymentMethod === m.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-bold text-neutral-900">
                  {t('payment.card_details') || 'Card Details'}
                </h4>
                
                <div>
                  <InputField
                    label={t('payment.card_number') || 'Card Number'}
                    placeholder="4111 1111 1111 1111"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(formatCardNumber(e.target.value));
                      if (cardErrors.cardNumber) setCardErrors({...cardErrors, cardNumber: undefined});
                    }}
                    error={cardErrors.cardNumber}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <InputField
                      label={t('payment.expiry') || 'Expiry'}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        setCardExpiry(formatExpiry(e.target.value));
                        if (cardErrors.expiry) setCardErrors({...cardErrors, expiry: undefined});
                      }}
                      error={cardErrors.expiry}
                    />
                  </div>
                  <div>
                    <InputField
                      label={t('payment.cvv') || 'CVV'}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                        if (cardErrors.cvv) setCardErrors({...cardErrors, cvv: undefined});
                      }}
                      error={cardErrors.cvv}
                    />
                  </div>
                </div>

                <div>
                  <InputField
                    label={t('payment.cardholder_name') || 'Cardholder Name'}
                    placeholder="Ahmed Ali"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      if (cardErrors.name) setCardErrors({...cardErrors, name: undefined});
                    }}
                    error={cardErrors.name}
                  />
                </div>
              </div>
            )}

            <Button className="w-full py-4 shadow-glow-primary" onClick={handleTopUp} isLoading={paymentStatus === 'PROCESSING'}>
              {paymentMethod === 'card'
                ? t('checkout.complete_top_up') || 'Complete Top Up'
                : t('payment.coming_soon_action') || 'Coming Soon'}
            </Button>
          </div>
        </Modal>

        {/* Payment Success Message */}
        {paymentStatus === 'SUCCESS' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="mx-auto w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success animate-bounce">
                <CheckCircle size={64} weight="fill" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-neutral-900 uppercase">
                  {t('checkout.payment_success') || 'Payment Successful!'}
                </h2>
                <p className="text-neutral-500">
                  {t('checkout.payment_success_message') || 'Your binding request has been submitted and is awaiting owner approval.'}
                </p>
              </div>
              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
                <p className="text-sm text-neutral-600">
                  {t('checkout.redirect_message') || 'Redirecting to your TNA details in 3 seconds...'}
                </p>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </RoleGuard>
  );
}
