'use client';
import React from 'react';
import { useLocale } from '@/i18n/LocaleProvider';
import { WarningCircle, ArrowsClockwise } from '@phosphor-icons/react';
import Button from '@/components/ui/Button';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center animate-in fade-in duration-standard">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-error-light text-error shadow-inner">
                <WarningCircle size={48} weight="fill" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-text-primary">
                حدث خطأ غير متوقع
            </h2>
            <p className="mb-10 max-w-md text-base text-text-secondary leading-relaxed">
                {error.message || 'نعتذر، واجهنا مشكلة في تحميل هذه الصفحة. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني إذا استمرت المشكلة.'}
            </p>
            <div className="flex gap-4">
                <Button onClick={() => window.location.href = '/'} variant="outline" size="lg">
                    العودة للرئيسية
                </Button>
                <Button onClick={() => reset()} variant="primary" size="lg" className="gap-2">
                    <ArrowsClockwise size={20} weight="bold" />
                    إعادة المحاولة
                </Button>
            </div>
        </div>
    );
}
