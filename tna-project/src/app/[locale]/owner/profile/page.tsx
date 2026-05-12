'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { ProfileModule } from '@/components/modules/profile/ProfileModule'
import { useLocale } from '@/i18n/LocaleProvider'

export default function OwnerProfilePage() {
  const { t } = useLocale()

  return (
    <AppShell role="Owner" header={t('common.roles.Owner.profile')}>
      <ProfileModule role="Owner" />
    </AppShell>
  )
}
