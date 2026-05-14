'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import CarrierHomeModule from '@/components/modules/carrier/CarrierHomeModule'

export default function CarrierHomePage() {
  const { t } = useLocale();

  return (
    <RoleGuard requiredRole="Carrier">
      <AppShell role="Carrier" header={t('carrier.home.header')}>
        <CarrierHomeModule />
      </AppShell>
    </RoleGuard>
  )
}
