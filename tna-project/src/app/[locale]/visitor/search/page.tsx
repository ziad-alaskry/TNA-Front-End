'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'

const t = (key: string) => key

/** Mirrors CFIP `financial_transaction.status` for mock binding / checkout gating. */
type FinancialTransactionStatus = 'PAID' | 'PENDING' | 'FAILED'

interface MockNationalAddress {
  na_id: string
  buildingName: string
  city: string
  region: string
  financial_transaction_status: FinancialTransactionStatus
}

// Mock data: discoverable national addresses + payment state per CFIP financial rule
const mockAddresses: MockNationalAddress[] = [
  {
    na_id: 'NA-001',
    buildingName: 'Building Alpha',
    city: 'Riyadh',
    region: 'Olaya',
    financial_transaction_status: 'PAID',
  },
  {
    na_id: 'NA-002',
    buildingName: 'Complex Beta',
    city: 'Jeddah',
    region: 'Al-Shati',
    financial_transaction_status: 'PENDING',
  },
  {
    na_id: 'NA-003',
    buildingName: 'Tower Gamma',
    city: 'Dammam',
    region: 'Al-Taawun',
    financial_transaction_status: 'PAID',
  },
]

export default function VisitorSearchPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNaId, setSelectedNaId] = useState<string | null>(null)

  const filteredAddresses = mockAddresses.filter(
    (addr) =>
      addr.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.na_id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedAddress = useMemo(
    () => mockAddresses.find((a) => a.na_id === selectedNaId) ?? null,
    [selectedNaId]
  )

  const canProceedToCheckout =
    selectedAddress !== null &&
    selectedAddress.financial_transaction_status === 'PAID'

  const handleSelectAddress = (na_id: string) => {
    setSelectedNaId(na_id)
  }

  const handleProceedToCheckout = () => {
    if (!selectedAddress || !canProceedToCheckout) return
    router.push(
      `/${locale}/visitor/checkout?na_id=${encodeURIComponent(selectedAddress.na_id)}`
    )
  }

  const sidebar = (
    <div className="space-y-4 text-start">
      <h3 className="text-lg font-bold">{t('filterResults')}</h3>
      <div className="relative">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 p-3"
        />
      </div>
      <p className="text-xs text-neutral-500">
        {t('financialRuleHint')}: {t('bindingRequiresPaid')}
      </p>
    </div>
  )

  return (
    <AppShell role="Visitor" header={<h1>{t('addressDiscovery')}</h1>}>
      <DetailViewLayout
        title={t('findNewAddress')}
        mainContent={[]}
        sidebar={sidebar}
        actions={
          <button
            type="button"
            disabled={!canProceedToCheckout}
            onClick={handleProceedToCheckout}
            className="rounded-pill bg-[linear-gradient(135deg,#02488D,#00B4C9)] px-6 py-2.5 text-sm font-bold text-white shadow-btn transition-opacity enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('proceedToCheckout')}
          </button>
        }
      >
        <div className="rounded-md border border-neutral-200 bg-surface-200 shadow-card">
          <div className="border-b border-neutral-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              {t('availableAddresses')}
            </h2>
          </div>
          <ul className="divide-y divide-neutral-200">
            {filteredAddresses.map((addr) => {
              const isSelected = selectedNaId === addr.na_id
              const isPaid = addr.financial_transaction_status === 'PAID'
              return (
                <li
                  key={addr.na_id}
                  className={`px-6 py-4 transition-colors ${
                    isSelected
                      ? 'bg-[#E6F7FA] ring-2 ring-inset ring-[#00B4C9]'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 text-start">
                      <p className="font-semibold text-neutral-900">
                        {addr.buildingName}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        {addr.city} · {addr.region}
                      </p>
                      <p className="mt-2 font-mono text-sm font-medium tracking-[0.04em] text-primitive-navy">
                        {addr.na_id}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {t('financial_transaction.status')}:{' '}
                        <span
                          className={
                            isPaid ? 'font-medium text-success' : 'font-medium text-warning'
                          }
                        >
                          {addr.financial_transaction_status}
                        </span>
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                      <button
                        type="button"
                        onClick={() => handleSelectAddress(addr.na_id)}
                        className="rounded-pill bg-[linear-gradient(135deg,#02488D,#00B4C9)] px-4 py-2 text-sm font-bold text-white shadow-btn transition-opacity hover:opacity-95"
                      >
                        {isSelected ? t('selected') : t('selectAddress')}
                      </button>
                      {isSelected && !isPaid && (
                        <p className="max-w-[220px] text-end text-xs text-danger">
                          {t('paidRequiredForCheckout')}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </DetailViewLayout>
    </AppShell>
  )
}
