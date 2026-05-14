'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ProfileModule } from '@/components/modules/profile/ProfileModule'
import { useLocale } from '@/i18n/LocaleProvider'

export default function CarrierProfilePage() {
  const { t } = useLocale()

  return (
    <AppShell role="Carrier">
      <ProfileModule role="Carrier" />
    </AppShell>
  )
}
