'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { 
    Wallet, 
    TrendUp, 
    ArrowDownLeft, 
    ArrowUpRight, 
    Receipt,
    ChartLineUp
} from '@phosphor-icons/react'
import { useBindingContext } from '@/context/BindingContext'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'
import { useRouter } from 'next/navigation'
import WithdrawalWizard from '@/components/modules/owner/WithdrawalWizard'
import { useLocale } from '@/i18n/LocaleProvider'

interface IncomeRecord {
    id: string;
    source_key: 'binding_sq' | 'binding_mk' | 'binding_nt';
    property_key: 'malqa_villa_12' | 'narjis_building';
    amount: number;
    date: string;
    status: 'COMPLETED' | 'PENDING';
}

const mockIncome: IncomeRecord[] = [
    { id: 'INC-1020', source_key: 'binding_sq', property_key: 'malqa_villa_12', amount: 135.00, date: '2025/11/15 10:00 AM', status: 'COMPLETED' },
    { id: 'INC-1015', source_key: 'binding_mk', property_key: 'narjis_building', amount: 50.00, date: '2025/11/14 02:30 PM', status: 'COMPLETED' },
    { id: 'INC-0994', source_key: 'binding_nt', property_key: 'malqa_villa_12', amount: 250.00, date: '2025/11/10 09:15 AM', status: 'COMPLETED' },
];

export default function OwnerEarningsPage() {
    const { ownerAccount } = useBindingContext();
    const router = useRouter();
    const { locale, t } = useLocale();

    const [isWithdrawalOpen, setIsWithdrawalOpen] = React.useState(false);

    const columns: DataTableColumn<IncomeRecord>[] = [
        {
            key: 'source_key',
            label: t('owner.earnings_page.columns.source'),
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success-bg text-success flex items-center justify-center">
                        <ArrowDownLeft size={16} weight="bold" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{t(`owner.earnings_page.sources.${row.source_key}`)}</span>
                        <span className="text-[10px] text-neutral-500">{t(`owner.earnings_page.properties.${row.property_key}`)}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'date',
            label: t('owner.earnings_page.columns.date'),
            render: (val) => <span className="text-xs text-neutral-500">{new Date(val).toLocaleString(locale)}</span>
        },
        {
            key: 'amount',
            label: t('owner.earnings_page.columns.amount'),
            render: (val) => <span className="font-bold text-neutral-900">+{val.toFixed(2)} {t('common.currency')}</span>
        },
        {
            key: 'status',
            label: t('owner.earnings_page.columns.status'),
            render: (val) => <span className="text-[10px] font-bold text-success tracking-widest">{t(`owner.earnings_page.statuses.${val}`)}</span>
        }
    ];

    return (
        <AppShell role="Owner" header={t('owner.earnings_page.header')}>
            <div className="space-y-8">
                {/* Balance & Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 p-8 rounded-md bg-primary-dark text-white shadow-card relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                        <div className="relative z-10">
                            <p className="text-sm font-medium mb-1">{t('owner.earnings_page.withdrawable_balance')}</p>
                            <h2 className="text-4xl font-bold">{ownerAccount.current_balance.toFixed(2)} {t('common.currency')}</h2>
                        </div>
                        <div className="relative z-10 flex gap-4 pt-6">
                            <button 
                                onClick={() => setIsWithdrawalOpen(true)}
                                className="h-10 px-6 rounded-pill bg-white text-primary-dark font-bold text-xs flex items-center gap-2 hover:bg-neutral-50 transition-colors"
                            >
                                <ArrowUpRight size={16} weight="bold" />
                                {t('owner.earnings_page.request_bank_transfer')}
                            </button>
                            <button 
                                onClick={() => router.push(`/${locale}/owner/payouts`)}
                                className="h-10 px-6 rounded-pill bg-white/20 text-white font-bold text-xs backdrop-blur-md hover:bg-white/30 transition-colors"
                            >
                                {t('owner.earnings_page.transfer_history')}
                            </button>
                        </div>
                        <Wallet size={120} weight="duotone" className="absolute -bottom-6 -left-6 text-white/10 -rotate-12" />
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendUp size={20} className="text-success" />
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('owner.earnings_page.total_earnings')}</span>
                            </div>
                            <h4 className="text-2xl font-bold text-neutral-900">{ownerAccount.total_earned.toFixed(2)} {t('common.currency')}</h4>
                            <p className="text-[10px] text-success mt-1 font-bold">{t('owner.earnings_page.monthly_change')}</p>
                        </div>
                        <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                            <div className="flex items-center gap-3 mb-2">
                                <Receipt size={20} className="text-primary" />
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t('owner.earnings_page.previous_payouts')}</span>
                            </div>
                            <h4 className="text-2xl font-bold text-neutral-900">{ownerAccount.total_paid_out.toFixed(2)} {t('common.currency')}</h4>
                            <p className="text-[10px] text-neutral-500 mt-1">{t('owner.earnings_page.last_payout')}</p>
                        </div>
                    </div>
                </div>

                {/* Revenue Overview Placeholder */}
                <div className="p-6 rounded-md border border-neutral-200 bg-surface-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                            <ChartLineUp size={20} className="text-primary" weight="fill" />
                            {t('owner.earnings_page.revenue_overview')}
                        </h3>
                        <div className="flex gap-2">
                            {(['day', 'week', 'month', 'year'] as const).map(v => (
                                <button key={v} className={`px-3 py-1 rounded-pill text-[10px] font-bold transition-all ${v === 'week' ? 'bg-primary text-white hover:opacity-90' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`}>{t(`owner.earnings_page.periods.${v}`)}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-48 w-full bg-surface-100 rounded border border-neutral-100 border-dashed flex items-center justify-center overflow-hidden relative">
                         <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary/5 to-transparent shadow-inner" />
                          <p className="text-xs text-neutral-600 font-medium z-10 px-4 py-2 bg-white/50 backdrop-blur-md rounded-pill border border-neutral-200">{t('owner.earnings_page.chart_placeholder')}</p>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <DataTableLayout
                    title={t('owner.earnings_page.recent_transactions')}
                    columns={columns}
                    data={mockIncome}
                />

                <WithdrawalWizard 
                    isOpen={isWithdrawalOpen} 
                    onClose={() => setIsWithdrawalOpen(false)} 
                    balance={ownerAccount.current_balance} 
                />
            </div>
        </AppShell>
    );
}
