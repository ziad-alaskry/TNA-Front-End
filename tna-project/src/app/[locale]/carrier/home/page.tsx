'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import CarrierHomeModule from '@/components/modules/carrier/CarrierHomeModule'
import { useTranslation } from 'react-i18next';

export default function CarrierHomePage() {
  /* TODO: review isRTL usage */ /* TODO: review isRTL usage */ const { t, isRTL } = useLocale();

  return (
    <RoleGuard requiredRole="Carrier">
      <AppShell role="Carrier" header={t('carrier.carrier_dashboard_77')}>
        <CarrierHomeModule />
      </AppShell>
    </RoleGuard>
  )
}
