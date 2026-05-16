'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import TNAIssuanceWizard from '@/components/modules/visitor/TNAIssuanceWizard'
import { useLocale } from '@/i18n/LocaleProvider'

export default function RequestTnaPage() {
  const { t } = useLocale()

  return (
    <AppShell role="Visitor" header={t('tna.new.title')}>
      <TNAIssuanceWizard />
    </AppShell>
  )
}
