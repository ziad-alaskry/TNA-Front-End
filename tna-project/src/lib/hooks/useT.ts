'use client';

import { useLanguageStore } from '../store/useLanguageStore';
import ar from '@/lib/i18n/ar.json';
import en from '@/lib/i18n/en.json';

const translations = { ar, en };

export function useT() {
    const { lang } = useLanguageStore();

    const t = (path: string): string => {
        const keys = path.split('.');
        let result: any = translations[lang];

        for (const key of keys) {
            if (!result || result[key] === undefined) {
                return path;
            }
            result = result[key];
        }

        return result as string;
    };

    return { t, lang };
}
