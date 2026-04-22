'use client'

import React from 'react'
import { Inter } from 'next/font/google'
import Providers from '@/components/shell/Providers'

const inter = Inter({ subsets: ['latin'] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <Providers>{children}</Providers>
    </div>
  )
}
