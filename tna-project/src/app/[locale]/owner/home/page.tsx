'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import OwnerHomeModule from '@/components/modules/owner/OwnerHomeModule'
import { useTranslation } from 'react-i18next';

export default function OwnerHomePage() {
  /* TODO: review isRTL usage */ /* TODO: review isRTL usage */ /* TODO: review isRTL usage */ const { t, isRTL } = useLocale();

  return (
    <RoleGuard requiredRole="Owner">
      <AppShell role="Owner" header={t('owner.owner_dashboard_46')}>
        <OwnerHomeModule />
      </AppShell>
    </RoleGuard>
  )
}
