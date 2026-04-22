'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { Home, Link2, Wallet } from 'lucide-react'

const t = (key: string) => key;

export default function OwnerHomePage() {
  const stats = [
    { label: t('registeredProperties'), value: '12', icon: <Home size={24} className="text-[#02488D]" /> },
    { label: t('activeBindings'), value: '8', icon: <Link2 size={24} className="text-[#00B4C9]" /> },
    { label: t('walletBalance'), value: '8,420 SAR', icon: <Wallet size={24} className="text-amber-500" /> },
  ]

  return (
    <AppShell role="Owner" header={<h1 className="text-xl font-bold">{t('ownerDashboard')}</h1>}>
      <DashboardLayout
        title={t('portfolioOverview')}
        subtitle={t('manageAddressesAndBindings')}
        stats={stats}
      />
    </AppShell>
  )
}
