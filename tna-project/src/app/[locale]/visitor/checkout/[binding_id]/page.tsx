'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { useLocale } from '@/i18n/LocaleProvider';
import {
  Receipt,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  Wallet,
  ArrowLeft,
  ArrowsDownUp
} from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { useToast } from '@/components/ui/Toast';
import type { RentContract } from '@/lib/types/rentals';

// Mock for rent_contracts (will be replaced by API call in Phase 2)
const mockRentContracts: Record<string, RentContract> = {
  'BIND-001': {
    rent_contract_id: 'RC-001',
    binding_id: 'BIND-001',
    tna_id: 'TNA-001',
    sub_address_id: 'SUB-001',
    gross_amount: 500.00,
    platform_fee_percentage: 10,
    platform_fee_amount: 50.00,
    authority_share_percentage: 5,
    authority_share_amount: 25.00,
    net_owner_amount: 425.00,
    rental_period_type: 'MONTHLY',
    rental_duration: 3,
    start_at: '2026-06-01',
    end_at: '2026-08-31',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  'BIND-002': {
    rent_contract_id: 'RC-002',
    binding_id: 'BIND-002',
    tna_id: 'TNA-002',
    sub_address_id: 'SUB-002',
    gross_amount: 1200.00,
    platform_fee_percentage: 10,
    platform_fee_amount: 120.00,
    authority_share_percentage: 5,
    authority_share_amount: 60.00,
    net_owner_amount: 1020.00,
    rental_period_type: 'YEARLY',
    rental_duration: 1,
    start_at: '2026-06-01',
    end_at: '2027-05-31',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
};

type BindingId = string;

export default function CheckoutPage() {
  const { binding_id } = useParams() as { binding_id: BindingId };
  const router = useRouter();
  const { locale, t } = useLocale();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<RentContract | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Simulate API fetch for rent_contracts by binding_id
    const fetchContract = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = mockRentContracts[binding_id as keyof typeof mockRentContracts] as RentContract | undefined;
        if (!data) {
          setError(t('checkout.error.binding_not_found') || 'Binding not found');
        } else {
          setContract(data);
        }
      } catch (err) {
        setError(t('common.error_network') || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [binding_id, t]);

  const handlePay = async () => {
    setPaymentProcessing(true);
    try {
      // Simulate payment gateway flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      toast.success(t('checkout.success.payment_confirmed') || 'Payment confirmed! Your TNA is now active.');

      // Redirect after delay
      setTimeout(() => {
        router.push(`/${locale}/visitor/tnas/${binding_id}`);
      }, 3000);
    } catch (err) {
      setPaymentProcessing(false);
      toast.error(t('checkout.error.payment_failed') || 'Payment failed. Please try again.');
    }
  };

  // Render states
  if (loading) {
    return (
      <RoleGuard requiredRole="Visitor">
        <AppShell role="Visitor" header={t('checkout.title') || 'Checkout'}>
          <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
            <SkeletonCard className="h-48" />
            <SkeletonCard className="h-64" />
          </div>
        </AppShell>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard requiredRole="Visitor">
        <AppShell role="Visitor" header={t('checkout.title') || 'Checkout'}>
          <div className="max-w-2xl mx-auto py-12">
            <ErrorAlert message={error} />
          </div>
        </AppShell>
      </RoleGuard>
    );
  }

  if (paymentSuccess) {
    return (
      <RoleGuard requiredRole="Visitor">
        <AppShell role="Visitor" header={t('checkout.title') || 'Checkout'}>
        <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="mx-auto w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success animate-bounce">
            <CheckCircle size={64} weight="fill" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-neutral-900 uppercase">{t('checkout.success.title') || 'Payment Success!'}</h2>
            <p className="text-neutral-500">{t('checkout.success.message') || 'Your binding is now active.'}</p>
          </div>
          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
            <p className="text-sm text-neutral-600">{t('checkout.success.redirect') || 'Redirecting to your TNA details...'}</p>
          </div>
        </div>
        </AppShell>
      </RoleGuard>
    );
  }

  if (!contract) {
    return null; // Should not happen
  }

  // Build display strings using t() where applicable
  const periodLabel = t(`rental_period.${contract.rental_period_type.toLowerCase()}`) || contract.rental_period_type;
  const durationText = contract.rental_period_type === 'DAILY'
    ? `${contract.rental_duration} ${t('units.days')}`
    : contract.rental_period_type === 'MONTHLY'
      ? `${contract.rental_duration} ${t('units.months')}`
      : `${contract.rental_duration} ${t('units.years')}`;

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header={t('checkout.title') || 'Checkout'}>
        <div className="max-w-4xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Receipt className="text-primary" />
                  {t('checkout.contract_title') || 'Contract Summary'}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Rental Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('checkout.period_type') || 'Period Type'}</p>
                    <p className="text-sm font-bold text-neutral-900">{periodLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('checkout.duration') || 'Duration'}</p>
                    <p className="text-sm font-bold text-neutral-900">{durationText}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('checkout.start_date') || 'Start Date'}</p>
                    <p className="text-sm font-bold text-neutral-900">{contract.start_at}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t('checkout.end_date') || 'End Date'}</p>
                    <p className="text-sm font-bold text-neutral-900">{contract.end_at}</p>
                  </div>
                </div>

                <div className="h-px bg-neutral-100" />

                {/* Financial Breakdown Table */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-4">{t('checkout.financial_breakdown') || 'Financial Breakdown'}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">{t('checkout.gross_amount') || 'Gross Amount'}</span>
                      <span className="font-medium">SAR {contract.gross_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">{t('checkout.platform_fee') || 'Platform Fee'} ({contract.platform_fee_percentage}%)</span>
                      <span className="font-medium text-error">- SAR {contract.platform_fee_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">{t('checkout.authority_share') || 'Authority Fee'} ({contract.authority_share_percentage}%)</span>
                      <span className="font-medium text-error">- SAR {contract.authority_share_amount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-neutral-100 my-2" />
                    <div className="flex justify-between text-lg font-black text-primary">
                      <span>{t('checkout.total_payable') || 'Total Payable'}</span>
                      <span>SAR {contract.gross_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-500 pt-1">
                      <span>{t('checkout.owner_net') || 'Owner Receives'}</span>
                      <span className="font-semibold text-success">+ SAR {contract.net_owner_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
              <ShieldCheck size={32} className="text-primary" weight="fill" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary">{t('checkout.secure_checkout') || 'Secure Checkout'}</p>
                <p className="text-xs text-primary/70">
                  {t('checkout.escrow_notice') || 'Payment is held securely until the binding is approved and activated.'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 space-y-6 sticky top-24">
              <h3 className="font-bold text-neutral-900">{t('checkout.payment_method') || 'Payment Method'}</h3>

              <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
                <div className="flex items-center gap-3 mb-2">
                  <Wallet size={20} className="text-primary" weight="fill" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t('checkout.wallet_balance') || 'Wallet Balance'}</span>
                </div>
                <p className="text-2xl font-black text-neutral-900">SAR {contract.gross_amount.toFixed(2)}</p>
                <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold tracking-widest">{t('checkout.available') || 'Available'}</p>
              </div>

               <Button
                 className="w-full py-6 text-lg shadow-glow-primary"
                 disabled={paymentProcessing}
                 isLoading={paymentProcessing}
                 onClick={handlePay}
               >
                 Pay SAR {contract.gross_amount.toFixed(2)}
               </Button>

              <p className="text-[10px] text-center text-neutral-400 px-4">
                {t('checkout.terms_notice') || 'By clicking Pay, you agree to our Terms of Service and Refund Policy.'}
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  );
}
