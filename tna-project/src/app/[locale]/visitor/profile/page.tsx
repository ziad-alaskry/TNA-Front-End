'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DetailViewLayout } from '@/components/templates/DetailViewLayout'
import { 
    User, 
    ShieldCheck, 
    Bell, 
    Globe,
    PencilSimple,
    Key,
    SignOut
} from '@phosphor-icons/react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'

export default function VisitorProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { locale, t } = useLocale();

    const sections = [
        {
            title: t('visitor.profile_page.personal_info.title'),
            description: t('visitor.profile_page.personal_info.description'),
            items: [
                { label: t('visitor.profile_page.personal_info.full_name'), value: <div className="flex items-center gap-2"><span>{user?.full_name || t('visitor.profile_page.mock.full_name')}</span><PencilSimple size={14} className="text-primary cursor-pointer" /></div> },
                { label: t('visitor.profile_page.personal_info.email'), value: user?.email || 'ahmed@example.com' },
                { label: t('visitor.profile_page.personal_info.mobile'), value: '055XXXXX12' },
                { label: t('visitor.profile_page.personal_info.birth_date'), value: '1990/05/12' },
            ]
        },
        {
            title: t('visitor.profile_page.identity.title'),
            description: t('visitor.profile_page.identity.description'),
            items: [
                { label: t('visitor.profile_page.identity.document_type'), value: t('visitor.profile_page.identity.national_id') },
                { label: t('visitor.profile_page.identity.document_number'), value: <span className="font-mono">1029XXXX34</span> },
                { label: t('visitor.profile_page.identity.expiry_date'), value: '1448/10/20' },
                { label: t('visitor.profile_page.identity.verification_status'), value: <div className="flex items-center gap-1 text-success font-bold"><ShieldCheck size={16} weight="fill" /><span>{t('visitor.profile_page.identity.verified_nafath')}</span></div> },
            ]
        }
    ];

    const sidebar = (
        <div className="space-y-8">
            <div className="text-center pb-6 border-b border-neutral-100">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border-2 border-primary/20">
                    <User size={40} weight="duotone" />
                </div>
                <h3 className="font-bold text-neutral-900">{user?.full_name || t('visitor.profile_page.mock.short_name')}</h3>
                <p className="text-xs text-neutral-500 mt-1">{t('visitor.profile_page.member_since')}</p>
            </div>

            <div className="space-y-2">
                <button className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-start">
                    <Bell size={20} className="text-neutral-400" />
                    <span>{t('visitor.profile_page.actions.notification_preferences')}</span>
                </button>
                <button className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-start">
                    <Globe size={20} className="text-neutral-400" />
                    <span>{t('visitor.profile_page.actions.change_language')}</span>
                </button>
                <button 
                  className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-start"
                  onClick={() => router.push('/' + locale + '/visitor/profile/kyc')}
                >
                    <ShieldCheck size={20} className="text-primary" />
                    <span>{t('visitor.profile_page.actions.kyc_verification')}</span>
                </button>
                <button className="w-full p-3 rounded-sm flex items-center gap-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors text-start">
                    <Key size={20} className="text-neutral-400" />
                    <span>{t('visitor.profile_page.actions.change_password')}</span>
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
        <AppShell role="Visitor" header={t('visitor.profile_page.header')}>
            <DetailViewLayout
                title={t('visitor.profile_page.title')}
                mainContent={sections}
                sidebar={sidebar}
            />
        </AppShell>
    );
}
