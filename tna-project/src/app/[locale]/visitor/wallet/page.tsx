'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
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
import type { FinancialTransaction } from '@/lib/types/ledger'
import { useLocale } from '@/i18n/LocaleProvider'

export default function VisitorWalletPage() {
  const { locale, t, isRTL } = useLocale();
  const { financialTransactions, ownerAccount } = useBindingContext();

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'TNA_ISSUANCE_FEE': t('transactions.type.tna_issuance') || 'TNA Issuance Fee',
      'RENTAL_PAYMENT': t('transactions.type.rental_payment') || 'Rental Payment',
      'DEPOSIT': t('transactions.type.deposit') || 'Wallet Top-up',
      'WITHDRAWAL': t('transactions.type.withdrawal') || 'Withdrawal',
      'REFUND': t('transactions.type.refund') || 'Refund',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; class: string }> = {
      'PENDING': { label: t('common.statuses.PENDING') || 'Pending', class: 'bg-warning/10 text-warning' },
      'COMPLETED': { label: t('common.statuses.ACTIVE') || 'Completed', class: 'bg-success/10 text-success' },
      'FAILED': { label: t('common.statuses.REJECTED') || 'Failed', class: 'bg-error/10 text-error' },
      'REFUNDED': { label: 'Refunded', class: 'bg-neutral-100 text-neutral-500' },
      'DISPUTED': { label: 'Disputed', class: 'bg-warning/10 text-warning' },
    };
    const cfg = configs[status] || { label: status, class: 'bg-neutral-100 text-neutral-500' };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${cfg.class}`}>{cfg.label}</span>;
  };

  const columns: DataTableColumn<FinancialTransaction>[] = [
    {
      key: 'transaction_type',
      label: t('wallet.columns.type') || 'Transaction Type',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            val === 'DEPOSIT' || val === 'REFUND' ? 'bg-success/10 text-success' : 'bg-neutral-100 text-neutral-600'
          }`}>
            {val === 'DEPOSIT' || val === 'REFUND' ? <ArrowDownLeft size={16} weight="bold" /> : <ArrowUpRight size={16} weight="bold" />}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-neutral-900">{getTransactionTypeLabel(val)}</span>
            <span className="text-[10px] text-neutral-400">
              {row.transaction_id} {row.payment_method?.type ? `• ${row.payment_method.type}` : ''}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'created_at',
      label: t('wallet.columns.date') || 'Date',
      render: (val) => (
        <span className="text-xs text-neutral-500">
          {new Date(val).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'status',
      label: t('wallet.columns.status') || 'Status',
      render: (val) => getStatusBadge(val)
    },
    {
      key: 'amount',
      label: t('wallet.columns.amount') || 'Amount',
      render: (val, row) => (
        <span className={`font-bold ${val > 0 ? 'text-success' : 'text-neutral-900'}`}>
          {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)} {row.currency}
        </span>
      )
    }
  ];

  return (
    <AppShell role="Visitor">
      <div className="space-y-8">
        {/* Balance Card */}
        <div className="relative overflow-hidden p-8 rounded-md bg-primary-dark text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10">
            <p className="text-sm font-medium mb-2">{t('wallet.available_balance') || 'Available Balance'}</p>
            <h2 className="text-4xl font-bold flex items-baseline gap-2">
              {ownerAccount.current_balance.toFixed(2)}
              <span className="text-lg opacity-90">SAR</span>
            </h2>
          </div>
          <div className="relative z-10 flex gap-4">
            <button className="h-12 px-6 rounded-md bg-white text-primary-dark font-bold flex items-center gap-2 shadow-sm hover:bg-neutral-50 transition-colors">
              <PlusCircle size={20} weight="fill" />
              {t('wallet.top_up') || 'Top Up'}
            </button>
            <button className="h-12 px-6 rounded-pill bg-white/20 text-white font-bold flex items-center gap-2 backdrop-blur-md hover:bg-white/30 transition-colors">
              <Receipt size={20} weight="fill" />
              {t('wallet.statement') || 'Statement'}
            </button>
          </div>
          
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Transactions */}
        <DataTableLayout
          title={t('wallet.transactions_title') || 'Transaction History'}
          columns={columns}
          data={financialTransactions}
          pageSize={10}
        />
      </div>
    </AppShell>
  );
}