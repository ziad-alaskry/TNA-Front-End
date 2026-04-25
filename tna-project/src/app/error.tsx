'use client';
import React from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import { WarningCircle, ArrowsClockwise } from '@phosphor-icons/react';
import Button from '@/components/ui/Button';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error-bg text-error shadow-sm">
                <WarningCircle size={40} weight="duotone" />
            </div>
            <h2 className="mb-2 text-heading font-bold text-neutral-900">
                حدث خطأ غير متوقع
            </h2>
            <p className="mb-8 max-w-md text-body text-neutral-500 leading-relaxed">
                {error.message || 'نعتذر، واجهنا مشكلة في تحميل هذه الصفحة. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني إذا استمرت المشكلة.'}
            </p>
            <div className="flex gap-4">
                <Button onClick={() => window.location.href = '/'} variant="outline">
                    العودة للرئيسية
                </Button>
                <Button onClick={() => reset()} variant="primary" className="gap-2">
                    <ArrowsClockwise size={20} />
                    إعادة المحاولة
                </Button>
            </div>
        </div>
    );
}
