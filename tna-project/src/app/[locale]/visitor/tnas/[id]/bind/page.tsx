'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { useLocale } from '@/i18n/LocaleProvider'
import TNABindingWizard from '@/components/modules/visitor/TNABindingWizard'

export default function BindTNAPage() {
  const { t } = useLocale()

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header={t('binding.title') || 'Link TNA to Address'}>
        <TNABindingWizard />
      </AppShell>
    </RoleGuard>
  )
}
