import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  locale: string;
  lang: 'ar' | 'en'; // Alias for compatibility with useT
  dir: 'rtl' | 'ltr';
  setLanguage: (locale: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'ar',
      lang: 'ar',
      dir: 'rtl',
      setLanguage: (locale) => set({ 
        locale, 
        lang: locale as 'ar' | 'en',
        dir: locale === 'ar' ? 'rtl' : 'ltr' 
      }),
    }),
    {
      name: 'language-storage',
    }
  )
);
