'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import TNAIssuanceWizard from '@/components/modules/visitor/TNAIssuanceWizard'

export default function CreateTNAPage() {
  const { t } = useLocale();

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header="Request New TNA">
        <TNAIssuanceWizard />
      </AppShell>
    </RoleGuard>
  )
}
