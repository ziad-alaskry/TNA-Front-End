'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { 
    Wallet, 
    ArrowUpRight, 
    ArrowDownLeft, 
    PlusCircle, 
    Clock,
    Receipt,
    Bank,
    CreditCard
} from '@phosphor-icons/react'
import { useBindingContext } from '@/context/BindingContext'
import DataTableLayout, { DataTableColumn } from '@/components/templates/DataTableLayout'

interface Transaction {
    id: string;
    type: 'TOP_UP' | 'PAYMENT' | 'REFUND';
    amount: number;
    description: string;
    date: string;
    method: string;
}

export default function VisitorWalletPage() {
    const { ownerAccount } = useBindingContext();
    const { t } = useLocale();

    const mockTransactions: Transaction[] = [
        {
            id: 'TX-9901',
            type: 'PAYMENT',
            amount: -50.00,
            description: t('visitor.wallet.mock_tx_1'),
            date: '2025/11/10 02:30 PM',
            method: 'Wallet Balance'
        },
        {
            id: 'TX-9855',
            type: 'TOP_UP',
            amount: 200.00,
            description: t('visitor.wallet.mock_tx_2'),
            date: '2025/11/10 10:15 AM',
            method: 'Mada (**** 1234)'
        },
        {
            id: 'TX-9721',
            type: 'PAYMENT',
            amount: -30.00,
            description: t('visitor.wallet.mock_tx_3'),
            date: '2025/11/05 09:00 AM',
            method: 'Wallet Balance'
        }
    ];

    const columns: DataTableColumn<Transaction>[] = [
        {
            key: 'type',
            label: t('visitor.wallet.operation'),
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        val === 'TOP_UP' ? 'bg-success-bg text-success' : 'bg-error-bg text-error'
                    }`}>
                        {val === 'TOP_UP' ? <ArrowDownLeft size={16} weight="bold" /> : <ArrowUpRight size={16} weight="bold" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-neutral-900">{row.description}</span>
                        <span className="text-[10px] text-neutral-400">{row.id} • {row.method}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'date',
            label: t('visitor.wallet.date'),
            render: (val) => <span className="text-xs text-neutral-500">{val}</span>
        },
        {
            key: 'amount',
            label: t('visitor.wallet.amount'),
            render: (val) => (
                <span className={`font-bold ${val > 0 ? 'text-success' : 'text-neutral-900'}`}>
                    {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)} SAR
                </span>
            )
        }
    ];

    return (
        <AppShell role="Visitor" header={t('visitor.wallet.header')}>
            <div className="space-y-8">
                {/* Balance Card */}
                <div className="relative overflow-hidden p-8 rounded-md bg-btn-primary text-white shadow-btn flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative z-10">
                        <p className="text-sm font-medium opacity-80 mb-2">{t('visitor.wallet.available_balance')}</p>
                        <h2 className="text-4xl font-bold flex items-baseline gap-2">
                            {ownerAccount.current_balance.toFixed(2)}
                            <span className="text-lg opacity-80">SAR</span>
                        </h2>
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <button className="h-12 px-6 rounded-pill bg-white text-primary font-bold flex items-center gap-2 shadow-sm hover:bg-neutral-50 transition-colors">
                            <PlusCircle size={20} weight="fill" />
                            {t('visitor.wallet.top_up')}
                        </button>
                        <button className="h-12 px-6 rounded-pill bg-white/20 text-white font-bold flex items-center gap-2 backdrop-blur-md hover:bg-white/30 transition-colors">
                            <Receipt size={20} weight="fill" />
                            {t('visitor.wallet.statement')}
                        </button>
                    </div>
                    
                    {/* Decorative Blob */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: t('visitor.wallet.mada'), icon: <CreditCard size={24} />, color: 'text-primary bg-primary/5' },
                        { label: t('visitor.wallet.bank_transfer'), icon: <Bank size={24} />, color: 'text-neutral-600 bg-neutral-100' },
                        { label: 'Apple Pay', icon: <div className="font-bold"></div>, color: 'text-neutral-900 bg-neutral-100' },
                        { label: 'STC Pay', icon: <div className="font-bold text-xs">STC</div>, color: 'text-error bg-error/5' },
                    ].map((m, i) => (
                        <button key={i} className="p-4 rounded-md border border-neutral-200 bg-surface-200 hover:border-primary/50 transition-all flex flex-col items-center gap-3">
                            <div className={`w-12 h-12 rounded-md flex items-center justify-center ${m.color}`}>
                                {m.icon}
                            </div>
                            <span className="text-xs font-bold text-neutral-700">{m.label}</span>
                        </button>
                    ))}
                </div>

                {/* Transaction History */}
                <DataTableLayout
                    title={t('visitor.wallet.recent_transactions')}
                    columns={columns}
                    data={mockTransactions}
                    pageSize={5}
                />
            </div>
        </AppShell>
    );
}
