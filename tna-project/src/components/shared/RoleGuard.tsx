'use client'

import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/useAuthStore'

type UserRole = 'Visitor' | 'Owner' | 'Gov' | 'Carrier'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: UserRole
  requireAuth?: boolean
}

/**
 * RoleGuard - Client-side component to protect routes based on user role.
 * Redirects unauthenticated users to login, and authenticated users with wrong role
 * to their own dashboard.
 * 
 * Note: This check happens client-side after hydration. For protected routes,
 * ensure server-side auth checks are also in place.
 */
export function RoleGuard({ children, requiredRole, requireAuth = true }: RoleGuardProps) {
  const { role, token } = useAuthStore()
  const router = useRouter()
  const { locale } = useParams()

  useEffect(() => {
    // Map store role to requiredRole format
    const storeRoleMap: Record<string, UserRole> = {
      'VISITOR': 'Visitor',
      'OWNER': 'Owner',
      'GOV_USER': 'Gov',
      'CARRIER_STAFF': 'Carrier'
    }

    const currentRole = role ? storeRoleMap[role] : null

    // If authentication is required but user has no token, redirect to login
    if (requireAuth && !token) {
      router.replace(`/${locale}/login`)
      return
    }

    // If user is authenticated but has a different role, redirect to their dashboard
    if (token && currentRole && currentRole !== requiredRole) {
      const dashboardMap: Record<UserRole, string> = {
        'Visitor': `/${locale}/visitor/home`,
        'Owner': `/${locale}/owner/home`,
        'Gov': `/${locale}/gov/home`,
        'Carrier': `/${locale}/carrier/home`
      }
      router.replace(dashboardMap[currentRole])
    }
  }, [role, token, requiredRole, requireAuth, router, locale])

  // Optional: Show loading or nothing while checking
  return <>{children}</>
}
