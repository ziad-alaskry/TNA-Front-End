'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { 
    User, 
    Building, 
    Bell, 
    Globe,
    PencilSimple,
    Key,
    SignOut,
    Wallet
} from '@phosphor-icons/react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { useWallet } from '@/lib/hooks/useWallet'

export default function OwnerProfilePage() {
  const { user, logout } = useAuthStore();
  const { balance } = useWallet();
  const router = useRouter();
  const { locale, t } = useLocale();

    const sections = [
        {
            title: t('owner.profile_page.personal_info.title'),
            description: t('owner.profile_page.personal_info.description'),
            items: [
                { label: t('owner.profile_page.personal_info.full_name'), value: <div className="flex items-center gap-2"><span>{user?.full_name || 'Ahmed Al-Farsi'}</span><PencilSimple size={14} className="text-primary cursor-pointer" /></div> },
                { label: t('owner.profile_page.personal_info.email'), value: user?.email || 'ahmed@example.com' },
                { label: t('owner.profile_page.personal_info.mobile'), value: '055XXXXX12' },
            ]
        },
        {
            title: t('owner.profile_page.account.title'),
            description: t('owner.profile_page.account.description'),
            items: [
                { label: t('owner.profile_page.account.properties_count'), value: <span className="font-bold text-emerald-600">5</span> },
                { label: t('owner.profile_page.account.wallet_balance'), value: <span className="font-bold text-primary">{balance.toLocaleString()} {t('common.currency')}</span> },
            ]
        }
    ];

    const sidebar = (
        <div className="space-y-8">
            <div className="text-center pb-6 border-b border-neutral-100">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 border-2 border-emerald-200">
                    <User size={40} weight="duotone" />
                </div>
                <h3 className="font-bold text-neutral-900">{user?.full_name || 'Ahmed Al-Farsi'}</h3>
                <p className="text-xs text-neutral-500 mt-1">{t('owner.profile_page.member_since')}</p>
            </div>

            <div className="space-y-2">
                <button className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-start">
                    <Bell size={20} className="text-neutral-400" />
                    <span>{t('owner.profile_page.actions.notification_preferences')}</span>
                </button>
                <button className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-start">
                    <Globe size={20} className="text-neutral-400" />
                    <span>{t('owner.profile_page.actions.change_language')}</span>
                </button>
                <button className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-start">
                    <Key size={20} className="text-neutral-400" />
                    <span>{t('owner.profile_page.actions.change_password')}</span>
                </button>
                <div className="pt-4 mt-4 border-t border-neutral-100">
                    <button 
                        onClick={() => {
                            logout();
                            router.push(`/${locale}/login`);
                        }}
                        className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-bold text-error hover:bg-error/5 transition-colors text-start"
                    >
                        <SignOut size={20} />
                        <span>{t('common.signOut')}</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <AppShell role="Owner" header={t('owner.profile_page.header')}>
            <DetailViewLayout
                title={t('owner.profile_page.title')}
                mainContent={sections}
                sidebar={sidebar}
            />
        </AppShell>
    );
}
