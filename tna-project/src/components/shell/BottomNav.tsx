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
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bg-white border-t border-tna-gray-200 flex items-center justify-around px-2 pb-2 safe-area-bottom z-[100]">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/visitor/home' && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors relative pt-3 pb-1 flex-1 ${isActive ? 'text-primary' : 'text-tna-gray-400'
                            }`}
                    >
                        {isActive && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-amber-500 rounded-b-full" />
                        )}
                        <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}