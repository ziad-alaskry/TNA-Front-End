'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { Wallet, ArrowDownCircle, ArrowUpCircle, CreditCard, RefreshCw } from 'lucide-react'

export default function VisitorWalletPage() {
  const stats = [
    { 
      label: 'Wallet Balance', 
      value: '420.00 SAR', 
      icon: <Wallet size={24} />,
      description: 'visitor_accounts.current_balance'
    },
    { 
      label: 'Total Paid Fees', 
      value: '1,250 SAR', 
      icon: <CreditCard size={24} />,
    },
    { 
      label: 'Pending Refunds', 
      value: '0.00 SAR', 
      icon: <RefreshCw size={24} />,
    },
  ]

  const activity = [
    {
      id: '1',
      title: 'TNA Issuance Fee: #88192',
      description: 'Payment for 30-day binding request.',
      timestamp: '10 mins ago',
      status: 'success' as const, // financial_transactions.status
      amount: '140.00 SAR' // financial_transactions.amount
    },
    {
      id: '2',
      title: 'Auto-Renewal: TNA #4421',
      description: 'Payment processed successfully.',
      timestamp: '2 days ago',
      status: 'success' as const,
      amount: '140.00 SAR'
    },
    {
      id: '3',
      title: 'Deposit via MADA',
      description: 'Wallet top-up.',
      timestamp: '5 days ago',
      status: 'success' as const,
      amount: '500.00 SAR'
    },
  ]

  return (
    <AppShell 
      role="Visitor" 
      header={<h1 className="text-xl font-bold">Financial Portfolio</h1>}
    >
      <DashboardLayout
        title="TNA Wallet Hub"
        subtitle="Manage your issuance funds and track your service transaction history."
        stats={stats}
        activity={activity}
      >
        <div className="mt-8 flex gap-4">
          <button className="bg-primitive-cyan-mid text-white px-6 py-2 rounded-sm text-sm font-bold hover:opacity-90 transition-opacity">
            Top Up Wallet
          </button>
          <button className="border border-primitive-cyan-mid text-primitive-cyan-mid px-6 py-2 rounded-sm text-sm font-bold hover:bg-cyan-50 transition-colors">
            Payment Methods
          </button>
        </div>
      </DashboardLayout>
    </AppShell>
  )
}
