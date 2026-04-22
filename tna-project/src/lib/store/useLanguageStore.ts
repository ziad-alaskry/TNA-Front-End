import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'ar' | 'en';
export type Dir = 'rtl' | 'ltr';

interface LanguageState {
    lang: Lang;
    dir: Dir;
    setLang: (lang: Lang) => void;
    toggleLang: () => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            lang: 'ar',
            dir: 'rtl',
            setLang: (lang) => set({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr' }),
            toggleLang: () => set((state) => {
                const newLang = state.lang === 'ar' ? 'en' : 'ar';
                return { lang: newLang, dir: newLang === 'ar' ? 'rtl' : 'ltr' };
            }),
        }),
        {
            name: 'tna-language-storage',
        }
    )
);
