'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import GovHomeModule from '@/components/modules/gov/GovHomeModule'

export default function GovHomePage() {
  const { t, isRTL } = useLocale();

  return (
    <RoleGuard requiredRole="Gov">
      <AppShell role="Gov" header={isRTL ? 'مركز التحكم والرقابة' : 'Gov Control Center'}>
        <GovHomeModule />
      </AppShell>
    </RoleGuard>
  )
}
