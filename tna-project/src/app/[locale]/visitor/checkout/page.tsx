'use client'

import React, { Suspense } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'
import CheckoutModule from '@/components/modules/visitor/CheckoutModule'

export default function CheckoutPage() {
  const { t } = useLocale();

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header="Checkout">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading order details...</div>}>
          <CheckoutModule />
        </Suspense>
      </AppShell>
    </RoleGuard>
  )
}
