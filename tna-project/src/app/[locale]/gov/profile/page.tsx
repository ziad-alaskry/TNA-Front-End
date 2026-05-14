'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ProfileModule } from '@/components/modules/profile/ProfileModule'
import { useLocale } from '@/i18n/LocaleProvider'

export default function GovProfilePage() {
  const { t } = useLocale()

  return (
    <AppShell role="Gov">
      <ProfileModule role="Gov" />
    </AppShell>
  )
}
