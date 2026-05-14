'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import GovHomeModule from '@/components/modules/gov/GovHomeModule'
import { useTranslation } from 'react-i18next';

export default function GovHomePage() {
  const { t, isRTL } = useLocale();

  return (
    <RoleGuard requiredRole="Gov">
      <AppShell role="Gov">
        <GovHomeModule />
      </AppShell>
    </RoleGuard>
  )
}
