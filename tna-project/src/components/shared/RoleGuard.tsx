'use client'

import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/useAuthStore'

type UserRole = 'Visitor' | 'Owner' | 'Gov' | 'Carrier'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: UserRole
}

/**
 * RoleGuard - Client-side component to protect routes based on user role.
 * Redirects to the correct dashboard if the user doesn't have the required role.
 */
export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { role, token } = useAuthStore()
  const router = useRouter()
  const { locale } = useParams()

  useEffect(() => {
    // 1. If not logged in, we let the app handle it (usually via middleware or login page)
    // For now, if no token, redirect to login might be too aggressive if they are visitors
    // but the store 'role' should be 'VISITOR' by default if we want public access to some areas.
    
    // Map store role to requiredRole format
    const storeRoleMap: Record<string, UserRole> = {
      'VISITOR': 'Visitor',
      'OWNER': 'Owner',
      'GOV_USER': 'Gov',
      'CARRIER_STAFF': 'Carrier'
    }

    const currentRole = role ? storeRoleMap[role] : null

    if (token && currentRole && currentRole !== requiredRole) {
      // Redirect to their own dashboard
      const dashboardMap: Record<UserRole, string> = {
        'Visitor': `/${locale}/visitor/home`,
        'Owner': `/${locale}/owner/home`,
        'Gov': `/${locale}/gov/home`,
        'Carrier': `/${locale}/carrier/home`
      }
      router.replace(dashboardMap[currentRole])
    }
  }, [role, token, requiredRole, router, locale])

  // Optional: Show loading or nothing while checking
  return <>{children}</>
}
