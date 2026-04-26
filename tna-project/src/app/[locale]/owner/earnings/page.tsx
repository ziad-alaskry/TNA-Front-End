'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
    Wallet, 
    TrendUp, 
    ArrowDownLeft, 
    ArrowUpRight, 
    Bank,
    Receipt,
    Clock,
    ChartLineUp
} from '@phosphor-icons/react'
import { useBindingContext } from '@/context/BindingContext'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'

interface IncomeRecord {
    id: string;
    source: string;
    property: string;
    amount: number;
    date: string;
    status: 'COMPLETED' | 'PENDING';
}

export default function OwnerEarningsPage() {
    const { ownerAccount } = useBindingContext();
    const router = useRouter();
    const { locale } = useParams();
    const { t } = useLocale();

    const mockIncome: IncomeRecord[] = [
        { id: 'INC-1020', source: t('owner.earnings.mock_source_1'), property: t('owner.earnings.mock_prop_1'), amount: 135.00, date: '2025/11/15 10:00 AM', status: 'COMPLETED' },
        { id: 'INC-1015', source: t('owner.earnings.mock_source_2'), property: t('owner.earnings.mock_prop_2'), amount: 50.00, date: '2025/11/14 02:30 PM', status: 'COMPLETED' },
        { id: 'INC-0994', source: t('owner.earnings.mock_source_3'), property: t('owner.earnings.mock_prop_3'), amount: 250.00, date: '2025/11/10 09:15 AM', status: 'COMPLETED' },
    ];

    const columns: DataTableColumn<IncomeRecord>[] = [
        {
            key: 'source',
            label: t('owner.earnings.income_source'),
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success-bg text-success flex items-center justify-center">
                        <ArrowDownLeft size={16} weight="bold" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{val}</span>
                        <span className="text-[10px] text-neutral-500">{row.property}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'date',
            label: t('owner.earnings.date'),
            render: (val) => <span className="text-xs text-neutral-500">{val}</span>
        },
        {
            key: 'amount',
            label: t('owner.earnings.amount'),
            render: (val) => <span className="font-bold text-neutral-900">+{val.toFixed(2)} SAR</span>
        },
        {
            key: 'status',
            label: t('common.status'),
            render: (val) => <span className="text-[10px] font-bold text-success uppercase tracking-widest">{val === 'COMPLETED' ? t('owner.earnings.completed') : t('owner.earnings.pending')}</span>
        }
    ];

    return (
        <AppShell role="Owner" header={t('owner.earnings.header')}>
            <div className="space-y-8">
                {/* Balance & Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 p-8 rounded-md bg-btn-primary text-white shadow-btn relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                        <div className="relative z-10">
                            <p className="text-sm font-medium opacity-80 mb-1">{t('owner.earnings.withdrawable_balance')}</p>
                            <h2 className="text-4xl font-bold">{ownerAccount.current_balance.toFixed(2)} SAR</h2>
                        </div>
                        <div className="relative z-10 flex gap-4 pt-6">
                            <button className="h-10 px-6 rounded-pill bg-white text-primary font-bold text-xs flex items-center gap-2 hover:bg-neutral-50 transition-colors">
                                <ArrowUpRight size={16} weight="bold" />
                                {t('owner.earnings.request_transfer')}
                            </button>
                            <button 
                                onClick={() => router.push(`/${locale}/owner/payouts`)}
                                className="h-10 px-6 rounded-pill bg-white/20 text-white font-bold text-xs backdrop-blur-md hover:bg-white/30 transition-colors"
                            >
                                {t('owner.earnings.transfer_history')}
                            </button>
                        </div>
                        <Wallet size={120} weight="duotone" className="absolute -bottom-6 -left-6 text-white/10 -rotate-12" />
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendUp size={20} className="text-success" />
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('owner.earnings.total_earnings')}</span>
                            </div>
                            <h4 className="text-2xl font-bold text-neutral-900">{ownerAccount.total_earned.toFixed(2)} SAR</h4>
                            <p className="text-[10px] text-success mt-1 font-bold">{t('owner.earnings.earnings_increase')}</p>
                        </div>
                        <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                            <div className="flex items-center gap-3 mb-2">
                                <Receipt size={20} className="text-primary" />
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('owner.earnings.previous_payouts')}</span>
                            </div>
                            <h4 className="text-2xl font-bold text-neutral-900">{ownerAccount.total_paid_out.toFixed(2)} SAR</h4>
                            <p className="text-[10px] text-neutral-400 mt-1">{t('owner.earnings.last_payout')}</p>
                        </div>
                    </div>
                </div>

                {/* Revenue Overview Placeholder */}
                <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                            <ChartLineUp size={20} className="text-primary" weight="fill" />
                            {t('owner.earnings.revenue_overview')}
                        </h3>
                        <div className="flex gap-2">
                            {[{ k: 'day', l: t('owner.earnings.day') }, { k: 'week', l: t('owner.earnings.week') }, { k: 'month', l: t('owner.earnings.month') }, { k: 'year', l: t('owner.earnings.year') }].map(v => (
                                <button key={v.k} className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${v.k === 'week' ? 'bg-primary text-white' : 'text-neutral-400 hover:text-neutral-600'}`}>{v.l}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-48 w-full bg-surface-100 rounded border border-neutral-100 border-dashed flex items-center justify-center overflow-hidden relative">
                         <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary/5 to-transparent shadow-inner" />
                         <p className="text-xs text-neutral-400 font-medium z-10 px-4 py-2 bg-white/50 backdrop-blur-md rounded-pill border border-neutral-200">{t('owner.earnings.chart_placeholder')}</p>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <DataTableLayout
                    title={t('owner.earnings.recent_transactions')}
                    columns={columns}
                    data={mockIncome}
                />
            </div>
        </AppShell>
    );
}
