'use client'

import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useLocale } from '@/i18n/LocaleProvider';
import { locales, type Locale } from '@/i18n/config';
import Button from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'tna-locale';

export function LanguageSwitcher({ variant = 'ghost' as const }: { variant?: 'ghost' }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale: currentLocale } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      return;
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, newLocale);
    Cookies.set(LOCAL_STORAGE_KEY, newLocale, { path: '/', expires: 365 });

    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = newLocale;
    }
    
    const newPath = segments.join('/') || '/';
    router.push(newPath);
  };

  if (!mounted) {
    return <div className="h-8 w-20 bg-surface-200 rounded-sm animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-neutral-200 bg-surface-200/50 p-1">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant="ghost"
          size="sm"
          onClick={() => handleChange(locale)}
          className={`min-w-[2.5rem] text-xs font-bold uppercase tracking-widest ${
            currentLocale === locale
              ? 'bg-primary text-white shadow-sm'
              : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
          }`}
        >
          {locale}
        </Button>
      ))}
    </div>
  );
}
