'use client'

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FormWizardLayout from '@/components/templates/FormWizardLayout'; // Corrected import path
import { useTNAContext } from '@/context/TNAContext'; // Import TNAContext
import Button from '@/components/ui/Button';

const t = (key: string) => key; // Placeholder for translation

function CheckoutPageFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-surface-100">
            <div
                className="h-12 w-12 animate-spin rounded-full border-4 border-[#00B4C9]/25 border-t-[#00B4C9]"
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
    const { addVisitorTna } = useTNAContext();

    const fee = 140; // Number for issuance_fee

    const handleConfirm = () => {
        if (na_id) {
            addVisitorTna({
                visitorName: 'John Doe', // Mocked name
                na_id: na_id,
                status: 'PENDING_OWNER_APPROVAL',
                issuance_fee: fee,
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
                <Button onClick={handleConfirm} className="w-full bg-cyan-600 text-white">
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
