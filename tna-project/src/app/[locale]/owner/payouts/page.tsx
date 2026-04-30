'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { 
    Bank, 
    CheckCircle, 
    Clock, 
    ArrowUpRight, 
    Receipt, 
    DownloadSimple,
    ArrowRight
} from '@phosphor-icons/react'
import { useLocale } from '@/i18n/LocaleProvider'

interface PayoutRecord {
    id: string;
    amount: number;
    method: string;
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    date: string;
    reference: string;
}

export default function OwnerPayoutsPage() {
    const { t } = useLocale();

    const mockPayouts: PayoutRecord[] = [
        { id: 'PAY-8821', amount: 4500.00, method: t('owner.payouts.mock_method_1'), status: 'COMPLETED', date: '2025/11/01', reference: 'TRN-990218' },
        { id: 'PAY-8750', amount: 1200.00, method: t('owner.payouts.mock_method_2'), status: 'COMPLETED', date: '2025/10/15', reference: 'TRN-990112' },
        { id: 'PAY-8601', amount: 840.00, method: t('owner.payouts.mock_method_3'), status: 'COMPLETED', date: '2025/10/01', reference: 'TRN-989234' },
    ];

    const columns: DataTableColumn<PayoutRecord>[] = [
        {
            key: 'id',
            label: t('owner.payouts.transaction_id'),
            render: (val) => <span className="font-mono font-bold text-neutral-900">{val}</span>
        },
        {
            key: 'amount',
            label: t('owner.payouts.amount'),
            render: (val) => <span className="font-bold text-neutral-900">{val.toFixed(2)} SAR</span>
        },
        {
            key: 'method',
            label: t('owner.payouts.transfer_method'),
            render: (val) => (
                <div className="flex items-center gap-2">
                    <Bank size={16} className="text-neutral-400" />
                    <span className="text-xs text-neutral-600">{val}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: t('common.status'),
            render: (val) => (
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        val === 'COMPLETED' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
                    }`}>
                        {val === 'COMPLETED' ? t('owner.payouts.completed') : t('owner.payouts.processing')}
                    </span>
                    {val === 'COMPLETED' && <CheckCircle size={14} weight="fill" className="text-success" />}
                </div>
            )
        },
        {
            key: 'date',
            label: t('owner.payouts.transfer_date'),
            render: (val) => <span className="text-xs text-neutral-500">{val}</span>
        },
        {
            key: 'id',
            label: '',
            render: () => (
                <div className="flex justify-end gap-2">
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-primary transition-colors flex items-center gap-2 text-xs font-bold">
                        <DownloadSimple size={18} />
                        {t('owner.payouts.receipt')}
                    </button>
                    <button className="p-2 rounded-sm hover:bg-neutral-100 text-neutral-400">
                        <ArrowRight size={18} className="rotate-180" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <AppShell role="Owner" header={t('owner.payouts.header')}>
            <DataTableLayout
                title={t('owner.payouts.title')}
                columns={columns}
                data={mockPayouts}
            >
                <div className="flex items-center gap-3 p-4 bg-neutral-900 text-white rounded-md shadow-lg">
                    <Receipt size={24} weight="fill" className="text-primary" />
                    <div>
                        <p className="text-xs font-bold">{t('owner.payouts.payout_summary')}</p>
                        <p className="text-[10px] opacity-70">{t('owner.payouts.payout_summary_desc')}</p>
                    </div>
                </div>
            </DataTableLayout>
        </AppShell>
    );
}
