'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { RoleGuard } from '@/components/shared/RoleGuard'
import {
  MagnifyingGlass,
  QrCode,
  MapPin,
  NavigationArrow,
  WarningCircle,
  CheckCircle,
  X
} from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { useMutation } from '@tanstack/react-query'
import { resolverApi, TNAResolutionResult } from '@/lib/api/resolver'
import { cn } from '@/lib/utils/cn'
import { useTranslation } from 'react-i18next';

export default function CarrierResolvePage() {
  const router = useRouter()
  const { locale, isRTL, t } = useLocale()
  const toast = useToast()

  const [tnaCode, setTnaCode] = useState('')
  const [result, setResult] = useState<TNAResolutionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const resolveMutation = useMutation({
    mutationFn: resolverApi.resolveTNA,
    onSuccess: (data) => {
      setResult(data)
      setIsLoading(false)
      if (!data.deliverable && data.error) {
        toast.error(data.error)
      }
    },
    onError: (error: any) => {
      setIsLoading(false)
      toast.error(error.message || 'Failed to resolve TNA')
    }
  })

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tnaCode.trim()) return
    setIsLoading(true)
    resolveMutation.mutate(tnaCode.trim())
  }

  const handleScanClick = () => {
    router.push(`/${locale}/carrier/scan`)
  }

  return (
    <RoleGuard requiredRole="Carrier">
      <AppShell role="Carrier">
        <div className="max-w-2xl mx-auto space-y-8 pb-12">

          {/* Intro Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-primary-gradient text-white p-8 md:p-10 shadow-xl">
            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <MapPin size={28} weight="bold" />
              </div>
              <h2 className="text-2xl font-black tracking-tight leading-tight">
                {t('carrier.national_address_resolver_64')}
              </h2>
              <p className="text-white/80 text-sm md:text-base">
                {isRTL 
                  ? 'أدخل رمز TNA للتحقق من العنوان والانتقال إلى الموقع. لا يتم عرض أي معلومات شخصية للمرسل.'
                  : 'Enter a TNA code to verify the delivery address and get navigation. No sender PII is displayed.'}
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <NavigationArrow size={200} weight="thin" />
            </div>
          </section>

          {/* Input Form */}
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6">
            <form onSubmit={handleResolve} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-700">
                  {t('carrier.tna_code_65')}
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <InputField
                      value={tnaCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTnaCode(e.target.value)}
                      placeholder={t('carrier.example_tna_1')}
                      disabled={isLoading}
                      className="h-12 text-lg font-mono"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-6 gap-2 border-neutral-200"
                    onClick={handleScanClick}
                    disabled={isLoading}
                  >
                    <QrCode size={24} weight="bold" />
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold shadow-glow-primary"
                disabled={!tnaCode.trim() || isLoading}
                isLoading={isLoading}
              >
                {isLoading 
                  ? (t('carrier.resolving_67'))
                  : (
                    <>
                      <MagnifyingGlass size={20} weight="bold" />
                      {t('carrier.resolve_address_68')}
                    </>
                    )
                  }
              </Button>
            </form>
          </section>

          {/* Result Display */}
          {result && (
            <section className={cn(
              "rounded-2xl border-2 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500",
              result.deliverable 
                ? "bg-success/5 border-success/20" 
                : "bg-warning/5 border-warning/20"
            )}>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                    result.deliverable 
                      ? "bg-success/20 text-success" 
                      : "bg-warning/20 text-warning"
                  )}>
                    {result.deliverable ? (
                      <CheckCircle size={28} weight="fill" />
                    ) : (
                      <WarningCircle size={28} weight="fill" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-bold text-neutral-900">
                      {result.deliverable 
                        ? (t('carrier.deliverable_address_69'))
                        : (t('carrier.not_deliverable_70'))
                      }
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {result.deliverable 
                        ? (t('carrier.address_resultnationaladdressfulladdress_71'))
                        : result.error
                      }
                    </p>
                  </div>
                </div>

                {result.deliverable && (
                  <div className="space-y-4 pt-4 border-t border-neutral-200">
                    {/* Sub-address info */}
                    <div className="bg-white/50 rounded-lg p-4 space-y-2">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        {t('carrier.subaddress_72')}
                      </p>
                      <p className="text-base font-bold text-neutral-900 font-mono">
                        {result.sub_address.suffix_code} — {result.sub_address.label}
                      </p>
                    </div>

                    {/* Full address */}
                    <div className="bg-white/50 rounded-lg p-4 space-y-2">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        {t('carrier.full_national_address_73')}
                      </p>
                      <p className="text-sm font-bold text-neutral-900 leading-relaxed">
                        {result.national_address.full_address}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {result.national_address.city}, {result.national_address.district}
                      </p>
                    </div>

                    {/* Binding status */}
                    <div className="flex items-center justify-between bg-white/50 rounded-lg p-4">
                      <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                          {t('carrier.binding_status_74')}
                        </p>
                        <p className={cn(
                          "text-sm font-bold",
                          result.binding_status === 'ACTIVE' ? "text-success" :
                          result.binding_status === 'EXPIRED' ? "text-error" : "text-warning"
                        )}>
                          {isRTL 
                            ? {
                                ACTIVE: 'نشط',
                                EXPIRED: 'منتهي',
                                UNLINKED: 'غير مرتبط'
                              }[result.binding_status]
                            : result.binding_status
                          }
                        </p>
                      </div>
                      <Button
                        className="shadow-glow-primary"
                        onClick={() => {
                          if (result.binding_status === 'UNLINKED') {
                            router.push(`/${locale}/visitor/tnas/${result.tna_code}/bind`)
                          } else {
                            toast.info(t('carrier.address_already_bound_75'))
                          }
                        }}
                      >
                        <NavigationArrow size={20} weight="bold" className={cn(isRTL && "rotate-180")} />
                        {t(result.binding_status === 'UNLINKED' ? 'carrier.bind_address' : 'carrier.view_details')}
                      </Button>
                    </div>
                  </div>
                )}

                {!result.deliverable && result.tna_code && (
                  <div className="pt-4 border-t border-warning/20">
                    <p className="text-xs text-warning font-bold flex items-center gap-2">
                      <X size={16} weight="bold" />
                      {t('carrier.please_verify_the_tna_code_and_try_again_76')}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </AppShell>
    </RoleGuard>
  )
}
