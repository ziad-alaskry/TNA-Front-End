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
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-tna-gray-200 flex items-center justify-around z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/carrier/home' && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center gap-1 pt-3 pb-1 flex-1 relative transition-colors ${isActive ? 'text-primary' : 'text-tna-gray-400'
                            }`}
                    >
                        {isActive && (
                            <div className="absolute top-0 w-10 h-0.5 bg-amber-500 rounded-b-full" />
                        )}
                        <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
