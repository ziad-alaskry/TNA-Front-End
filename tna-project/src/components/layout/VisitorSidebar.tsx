'use client'

import React, { ReactNode } from 'react'
import { Home, Search, Wallet, User, Bell } from 'lucide-react'
import Link from 'next/link'

interface VisitorSidebarProps {
  activePath?: string
}

export function VisitorSidebar({ activePath }: VisitorSidebarProps) {
  const menuItems = [
    { label: 'Overview', icon: <Home size={20} />, href: '/visitor/home' },
    { label: 'Address Search', icon: <Search size={20} />, href: '/visitor/search' },
    { label: 'TNA Wallet', icon: <Wallet size={20} />, href: '/visitor/wallet' },
    { label: 'My TNA Codes', icon: <Bell size={20} />, href: '/visitor/tna/detail' },
    { label: 'Profile', icon: <User size={20} />, href: '/visitor/profile' },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="mb-10 px-2 py-4">
        <div className="flex items-center gap-3 rounded-md bg-primitive-cyan-mid p-3 text-white">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
            T
          </div>
          <span className="font-bold tracking-tight">TNA Visitor</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-medium transition-colors ${
              activePath === item.href
                ? 'bg-primitive-cyan-mid/10 text-primitive-cyan-mid'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-neutral-100 pt-6">
        <div className="rounded-md bg-neutral-50 p-4">
          <p className="text-xs font-semibold text-neutral-400 uppercase mb-2">Help Center</p>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Need help with your TNA code? Visit our support page.
          </p>
        </div>
      </div>
    </div>
  )
}
