'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import VisitorHomeModule from '@/components/modules/visitor/VisitorHomeModule'

export default function VisitorHomePage() {
  const { t } = useLocale();

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header={t('common.roles.Visitor.overview')}>
        <VisitorHomeModule />
      </AppShell>
    </RoleGuard>
  )
}
