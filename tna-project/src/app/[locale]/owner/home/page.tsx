'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import OwnerHomeModule from '@/components/modules/owner/OwnerHomeModule'

export default function OwnerHomePage() {
  const { t, isRTL } = useLocale();

  return (
    <RoleGuard requiredRole="Owner">
      <AppShell role="Owner" header={isRTL ? 'لوحة تحكم المالك' : 'Owner Dashboard'}>
        <OwnerHomeModule />
      </AppShell>
    </RoleGuard>
  )
}
