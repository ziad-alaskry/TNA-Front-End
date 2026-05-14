'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import CarrierHomeModule from '@/components/modules/carrier/CarrierHomeModule'
import { useTranslation } from 'react-i18next';

export default function CarrierHomePage() {
  const { t, isRTL } = useLocale();

  return (
    <RoleGuard requiredRole="Carrier">
      <AppShell role="Carrier">
        <CarrierHomeModule />
      </AppShell>
    </RoleGuard>
  )
}
