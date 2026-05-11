'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import GovHomeModule from '@/components/modules/gov/GovHomeModule'
import { useTranslation } from 'react-i18next';

export default function GovHomePage() {
  /* TODO: review isRTL usage */ /* TODO: review isRTL usage */ const { t, isRTL } = useLocale();

  return (
    <RoleGuard requiredRole="Gov">
      <AppShell role="Gov" header={t('gov.gov_control_center_87')}>
        <GovHomeModule />
      </AppShell>
    </RoleGuard>
  )
}
