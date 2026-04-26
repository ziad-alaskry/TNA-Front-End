'use client'

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormWizardLayout from '@/components/templates/FormWizardLayout';
import { useBindingContext } from '@/context/BindingContext';
import Button from '@/components/ui/Button';
import { useLocale } from '@/i18n/LocaleProvider';

function CheckoutPageFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-100">
            <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-brand-cyan/25 border-t-brand-cyan"
                aria-label="Loading checkout"
                role="status"
            />
        </div>
    );
}

function VisitorCheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const na_id = searchParams.get('na_id');
    const { addVisitorTna } = useBindingContext();
    const { t, locale } = useLocale();

    const fee = 140; // Number for issuance_fee

    const handleConfirm = () => {
        if (na_id) {
            addVisitorTna({
                tna_code: `TNA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                status: 'UNLINKED',
            });
        }
        
        alert(t('visitor.checkout.paymentSuccessful'));
        router.push(`/${locale}/visitor/home`);
    };

    const steps = [
        { id: 'summary', label: t('visitor.checkout.paymentSummary') },
        { id: 'confirm', label: t('visitor.checkout.confirmPayment') }
    ];

    return (
        <FormWizardLayout
            steps={steps}
            currentStep={1}
            onSubmit={handleConfirm}
            onCancel={() => router.back()}
        >
            <div className="space-y-4">
                <h2 className="text-lg font-bold">{t('visitor.checkout.checkoutSummary')}</h2>
                <div className="p-4 border rounded-lg">
                    <p>{t('visitor.checkout.addressId')}: {na_id}</p>
                    <p>{t('visitor.checkout.fee')}: {fee}</p>
                </div>
                <p className="text-sm text-gray-500">{t('visitor.checkout.paymentGatewayMock')}</p>
                <Button onClick={handleConfirm} className="w-full bg-btn-primary text-white font-bold">
                    {t('visitor.checkout.confirm')}
                </Button>
            </div>
        </FormWizardLayout>
    );
}

export default function VisitorCheckoutPage() {
    return (
        <Suspense fallback={<CheckoutPageFallback />}>
            <VisitorCheckoutContent />
        </Suspense>
    );
}
