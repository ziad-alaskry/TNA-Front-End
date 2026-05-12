'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Package, Send, Menu } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: 'الرئيسية', icon: Home, href: '/visitor/home' },
        { label: 'عناويني', icon: MapPin, href: '/visitor/addresses' },
        { label: 'شحناتي', icon: Package, href: '/visitor/shipments' },
        { label: 'الشحن', icon: Send, href: '/visitor/shipping' },
        { label: 'القائمة', icon: Menu, href: '/visitor/menu' },
    ];

    return (
        <nav className="fixed bottom-0 inset-x-0 w-full bg-card border-t border-divider flex items-center justify-around px-2 pb-2 safe-area-bottom z-navbar">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/visitor/home' && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 min-w-[64px] transition-all duration-fast relative pt-3 pb-1 flex-1 ${isActive ? 'text-primary' : 'text-text-placeholder'
                            }`}
                    >
                        {isActive && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary rounded-b-full shadow-button" />
                        )}
                        <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-xs font-bold">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}