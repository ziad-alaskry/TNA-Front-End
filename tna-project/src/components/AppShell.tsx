'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { TenantSwitcher } from '@/components/shared/TenantSwitcher'; // Corrected import path

export type Role = 'owner' | 'carrier' | 'gov' | 'visitor';

interface AppShellProps {
  children: ReactNode;
  role: Role;
  userName?: string;
  avatarUrl?: string;
}

export default function AppShell({ 
  children, 
  role = 'visitor',
  userName = 'User',
  avatarUrl = 'https://ui-avatars.com/api/?name=User&background=random'
}: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Configuration for dynamic navigation
  const navLinks: Record<Role, { label: string; href: string; icon: string }[]> = {
    owner: [
      { label: 'Home', href: '/owner/home', icon: 'ph-house' },
      { label: 'Properties', href: '/owner/properties', icon: 'ph-buildings' },
      { label: 'Earnings', href: '/owner/earnings', icon: 'ph-currency-circle-dollar' },
      { label: 'Requests', href: '/owner/linking', icon: 'ph-envelope-simple' },
    ],
    carrier: [
      { label: 'Home', href: '/carrier/home', icon: 'ph-house' },
      { label: 'Shipments', href: '/carrier/shipments', icon: 'ph-truck' },
      { label: 'Reports', href: '/carrier/reports', icon: 'ph-chart-bar' },
      { label: 'Settings', href: '/carrier/settings', icon: 'ph-gear' },
    ],
    gov: [
      { label: 'Home', href: '/gov/home', icon: 'ph-house' },
      { label: 'Issuance', href: '/gov/issuance', icon: 'ph-file-text' },
      { label: 'Addresses', href: '/gov/addresses', icon: 'ph-map-pin' },
      { label: 'Audit', href: '/gov/audit', icon: 'ph-shield-check' },
    ],
    visitor: [
      { label: 'Home', href: '/visitor/home', icon: 'ph-house' },
      { label: 'Addresses', href: '/visitor/addresses', icon: 'ph-map-pin' },
      { label: 'Shipments', href: '/visitor/shipments', icon: 'ph-truck' },
    ] // Adding basic visitor nav as fallback
  };

  const currentLinks = navLinks[role];

  // Helper to determine the role badge color class based on SPATIAL tokens
  const getRoleBadgeClass = (r: Role) => {
    switch (r) {
      case 'owner': return 'bg-info-bg text-brand-navy border-info-border';
      case 'carrier': return 'bg-pending-bg text-brand-navy border-neutral-300';
      case 'gov': return 'bg-warning-bg text-warning border-warning-border';
      case 'visitor': return 'bg-neutral-100 text-neutral-700 border-neutral-200';
      default: return 'bg-neutral-100 text-neutral-500 border-neutral-200';
    }
  };

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col font-sans">
      {/* Universal Header - Fixed Top */}
      <header className="fixed top-0 inset-x-0 h-16 bg-surface-200 border-b border-neutral-200 z-50 flex items-center justify-between px-4 lg:px-6">
        {/* Left: Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-neutral-600 hover:bg-neutral-100 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="ph ph-list text-2xl"></i>
          </button>
          
          <Link href={`/${role}/home`} className="flex items-center gap-2">
            {/* TNA Logo Mock */}
            <div className="w-8 h-8 bg-brand-navy rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">TNA Tracker</span>
          </Link>
        </div>

        {/* Right: Notifications, Tenant Switcher, Language Switcher, Role Chip, Avatar */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-neutral-500 hover:text-neutral-700 transition-colors">
            <i className="ph ph-bell text-2xl"></i>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border border-white"></span>
          </button>
          
          {/* Tenant Switcher integrated here */}
          <TenantSwitcher />
          
          {/* Language Switcher placed here */}
          <LanguageSwitcher />
          
          <div className="h-6 w-px bg-neutral-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex border px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getRoleBadgeClass(role)}`}>
              {role}
            </div>
            
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={avatarUrl} alt="User Avatar" className="w-8 h-8 rounded-full border border-neutral-200 object-cover" />
              <div className="hidden md:block text-sm">
                <p className="font-medium text-neutral-900 leading-none">{userName}</p>
              </div>
              <i className="ph ph-caret-down text-neutral-400 hidden md:block text-sm"></i>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Dynamic Navigation - Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-surface-200 border-r border-neutral-200 h-[calc(100vh-4rem)] sticky top-16">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {currentLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-brand-navy transition-colors font-medium"
              >
                <i className={`ph ${link.icon} text-xl`}></i>
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-neutral-200">
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error-bg transition-colors font-medium">
              <i className="ph ph-sign-out text-xl"></i>
              Log Out
            </button>
          </div>
        </aside>

        {/* Dynamic Navigation - Mobile Slide-over */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-neutral-900/50" onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className="fixed top-0 left-0 bottom-0 top-16 w-64 bg-surface-200 border-r border-neutral-200 shadow-xl flex flex-col">
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {currentLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-brand-navy transition-colors font-medium"
                  >
                    <i className={`ph ${link.icon} text-xl`}></i>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Content Slot */}
        <main className="flex-1 flex justify-center p-4 md:p-6 lg:p-8 bg-surface-100">
          <div className="w-full max-w-6xl [&_header]:hidden [&_nav]:hidden font-sans text-neutral-900">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
