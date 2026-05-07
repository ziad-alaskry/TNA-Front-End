'use client'

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormWizardLayout from '@/components/templates/FormWizardLayout'; // Corrected import path
import { useBindingContext } from '@/context/BindingContext'; // Import BindingContext
import Button from '@/components/ui/Button';

const t = (key: string) => key; // Placeholder for translation

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

    const fee = 140; // Number for issuance_fee

    const handleConfirm = () => {
        if (na_id) {
            addVisitorTna({
                tna_code: `TNA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                status: 'UNLINKED',
            });
        }
        
        alert(t('paymentSuccessful'));
        router.push('/visitor/home');
    };

    const steps = [
        { id: 'summary', label: t('paymentSummary') },
        { id: 'confirm', label: t('confirmPayment') }
    ];

    return (
        <FormWizardLayout
            steps={steps}
            currentStep={1}
            onSubmit={handleConfirm}
            onCancel={() => router.back()}
        >
            <div className="space-y-4">
                <h2 className="text-lg font-bold">{t('checkoutSummary')}</h2>
                <div className="p-4 border rounded-lg">
                    <p>{t('addressId')}: {na_id}</p>
                    <p>{t('fee')}: {fee}</p>
                </div>
                <p className="text-sm text-gray-500">{t('paymentGatewayMock')}</p>
                <Button onClick={handleConfirm} className="w-full bg-btn-primary text-white font-bold">
                    {t('confirm')}
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
