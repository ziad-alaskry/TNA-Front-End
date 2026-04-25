'use client'

import React from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { 
    ShieldCheck, 
    MapPin, 
    Clock, 
    Pulse, 
    ListChecks, 
    Gear, 
    Fingerprint,
    ArrowRight,
    ChartLineUp
} from '@phosphor-icons/react'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { RoleGuard } from '@/components/shared/RoleGuard'

export default function GovHomePage() {
  const router = useRouter();
  const { locale } = useParams();
  const { t, isRTL } = useLocale();

  const stats = [
    { 
      label: t('gov.home.stats.pending_verification'), 
      value: '١٤٢', 
      icon: <ShieldCheck size={24} weight="fill" className="text-primary" /> 
    },
    { 
      label: t('common.roles.Owner.properties'), 
      value: '٢٢', 
      icon: <MapPin size={24} weight="fill" className="text-secondary" /> 
    },
    { 
      label: t('gov.home.stats.daily_issuance'), 
      value: '٩٩.٢٪', 
      icon: <ListChecks size={24} weight="fill" className="text-success" /> 
    },
    { 
      label: t('gov.home.stats.critical_alerts'), 
      value: '٤.٢ ساعة', 
      icon: <Clock size={24} weight="fill" className="text-warning" /> 
    },
  ];

  const activity = [
    {
      id: '1',
      title: 'تدقيق: اعتماد TNA #٩٩١',
      description: 'قام المشرف رقم ٨٨٢ بمراجعة الصك العقاري للعنوان الملقا.',
      timestamp: 'منذ دقيقتين',
      status: 'success' as const,
    },
    {
      id: '2',
      title: 'رفض عنوان: منطقة نجد',
      description: 'رقم السجل العقاري المدخل من المالك غير مطابق للبيانات الوطنية.',
      timestamp: 'منذ ساعة',
      status: 'error' as const,
    },
    {
      id: '3',
      title: 'تحديث السياسة: الإصدار الذاتي',
      description: 'تفعيل المراجعة الآلية للطلبات السكنية في مدينة الرياض.',
      timestamp: 'منذ ٣ ساعات',
      status: 'pending' as const,
    },
  ];

  return (
    <RoleGuard requiredRole="Gov">
      <AppShell role="Gov" header={t('gov.home.header')}>
        <DashboardLayout
          title={t('gov.home.title')}
          subtitle={t('gov.home.subtitle')}
          stats={stats}
          activity={activity}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* System Health Card */}
              <div className="lg:col-span-2 p-6 rounded-md border border-neutral-200 bg-surface-200 text-start">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                          <Pulse size={20} className="text-success" weight="bold" />
                          {t('gov.home.health.title')}
                      </h3>
                      <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-success-bg text-success text-[10px] font-bold rounded uppercase">{t('common.statuses.ACTIVE')}</span>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                          { label: 'زمن استجابة API', value: '٤٥ مللي ثانية', status: 'optimal' },
                          { label: 'معدل الخطأ', value: '٠.٠١٪', status: 'optimal' },
                          { label: 'الطلبات المتزامنة', value: '١.٢ ألف', status: 'normal' }
                      ].map((item, i) => (
                          <div key={i} className="p-4 bg-surface-100 rounded border border-neutral-100 shadow-sm text-start">
                              <p className="text-[10px] font-bold text-neutral-400 uppercase mb-2">{item.label}</p>
                              <p className="text-lg font-bold text-neutral-900">{item.value}</p>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Quick Policy Actions */}
              <div className="p-6 rounded-md bg-neutral-900 text-white flex flex-col justify-between shadow-xl text-start">
                  <div>
                      <h4 className="text-lg font-bold mb-2">{t('gov.actions.title')}</h4>
                      <p className="text-xs opacity-60 leading-relaxed">
                          تعديل قواعد الأهلية، تحديث الرسوم السيادية، أو تغيير أنماط المراجعة.
                      </p>
                  </div>
                  <div className="space-y-2 mt-6">
                      <button 
                          onClick={() => router.push(`/${locale}/gov/policy`)}
                          className="w-full h-10 bg-primary text-white rounded-sm font-bold text-xs flex items-center justify-center gap-2 shadow-btn hover:bg-opacity-90 transition-all"
                      >
                          <Gear size={16} weight="fill" />
                          {t('gov.actions.policy_config')}
                      </button>
                      <button 
                          onClick={() => router.push(`/${locale}/gov/audit`)}
                          className="w-full h-10 bg-white/10 text-white rounded-sm font-bold text-xs hover:bg-white/20 transition-colors"
                      >
                          <Fingerprint size={16} weight="bold" />
                          {t('gov.actions.audit_logs')}
                      </button>
                  </div>
              </div>
          </div>

          {/* Verification Queue Preview */}
          <div className="mt-8 p-6 rounded-md border border-neutral-200 bg-surface-200 text-start">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                      <ChartLineUp size={20} className="text-primary" weight="fill" />
                      تحليل حجم الطلبات (أسبوعي)
                  </h3>
                  <button 
                      onClick={() => router.push(`/${locale}/gov/verification/queue`)}
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                  >
                      الانتقال لغرفة المعالجة
                      <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                  </button>
              </div>
              
              {/* Mock Chart Area */}
              <div className="h-[180px] w-full bg-surface-100 rounded border border-neutral-100 border-dashed flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
                  <p className="text-xs text-neutral-400 font-medium z-10 px-6 py-2 bg-white/50 backdrop-blur-md rounded-pill border border-neutral-200">إحصاءات النظام المتقدمة</p>
              </div>
          </div>
        </DashboardLayout>
      </AppShell>
    </RoleGuard>
  )
}
