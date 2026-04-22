'use client'

import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useLocale } from '@/i18n/LocaleProvider';
import { locales, type Locale } from '@/i18n/config';
import React, { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'tna-locale';

export function LanguageSwitcher() {
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
    return <div className="h-8 w-24 bg-slate-100 rounded-md animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100/50 p-1">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleChange(locale)}
          className={`rounded-sm px-3 py-1 text-xs font-bold transition-all duration-200 ${
            currentLocale === locale
              ? 'bg-primitive-navy text-white shadow-sm'
              : 'text-slate-500 hover:bg-white hover:text-slate-900'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
