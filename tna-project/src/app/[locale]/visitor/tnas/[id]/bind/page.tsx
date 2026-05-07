'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import TNABindingWizard from '@/components/modules/visitor/TNABindingWizard'

export default function BindTNAPage() {
  const { t } = useLocale();

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header="Bind TNA to Address">
        <TNABindingWizard />
      </AppShell>
    </RoleGuard>
  )
}
