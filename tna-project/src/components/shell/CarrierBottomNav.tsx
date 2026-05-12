'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Clock, Menu } from 'lucide-react';

export default function CarrierBottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: 'الرئيسية', icon: Home, href: '/carrier/home' },
        { label: 'الشحنات', icon: Package, href: '/carrier/shipments' },
        { label: 'السجل', icon: Clock, href: '/carrier/history' },
        { label: 'القائمة', icon: Menu, href: '/carrier/menu' },
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 w-full bg-card border-t border-divider flex items-center justify-around z-navbar rounded-t-2xl shadow-navbar safe-area-bottom">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/carrier/home' && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-1 pt-3 pb-1 flex-1 relative transition-all duration-fast ${isActive ? 'text-primary' : 'text-text-placeholder'
                            }`}
                    >
                        {isActive && (
                            <div className="absolute top-0 w-10 h-1 bg-secondary rounded-b-full shadow-button" />
                        )}
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-xs font-bold">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
