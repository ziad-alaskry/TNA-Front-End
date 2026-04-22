'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { Search, CreditCard } from 'lucide-react'
import { useTNAContext } from '@/context/TNAContext'
import { useRouter } from 'next/navigation'

const t = (key: string) => key;

export default function VisitorHomePage() {
  const router = useRouter();
  const { tnaData } = useTNAContext();

  const activeTnas = tnaData.filter(tna => tna.status === 'APPROVED');
  const pendingRequests = tnaData.filter(tna => tna.status === 'PENDING');

  return (
    <AppShell 
      role="Visitor"
      header={<h1 className="text-xl font-bold">{t('dashboardTitle')}</h1>}
    >
      <DashboardLayout
        title={t('welcomeBack')}
        subtitle={t('manageAddressesAndShipments')}
      >
        {/* Active TNA Widget */}
        <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">{t('activeTnas')}</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {activeTnas.map(tna => (
                    <div key={tna.tna_id} className="p-4 border rounded-lg bg-white shadow-sm border-s-4 border-green-500">
                        <p className="font-mono text-lg text-primary">{tna.tna_code}</p>
                        <p className="text-sm text-gray-500">{t('expires')}: {tna.linked_until || 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mt-8">
            <button 
                onClick={() => router.push('/visitor/search')}
                className="flex flex-1 items-center justify-center gap-2 rounded-pill bg-[linear-gradient(135deg,#02488D,#00B4C9)] py-3 font-bold text-white shadow-btn transition-opacity hover:opacity-95"
            >
                <Search size={20} />
                {t('searchNewAddress')}
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-pill border-[1.5px] border-[#00B4C9] py-3 font-bold text-[#02488D] transition-colors hover:bg-cyan-50">
                <CreditCard size={20} />
                {t('topUpWallet')}
            </button>
        </div>
      </DashboardLayout>
    </AppShell>
  )
}
