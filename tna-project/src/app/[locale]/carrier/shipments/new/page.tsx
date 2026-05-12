'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/formatDate'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { resolverApi } from '@/lib/api/resolver'
import type { TNAResolutionResult } from '@/lib/api/resolver'
import {
  Package,
  Truck,
  User,
  QrCode,
  CheckCircle,
  ArrowRight,
  WarningCircle
} from '@phosphor-icons/react'

interface PackageDetails {
  weight: string
  dimensions: string
  contents: string
}

export default function NewShipmentPage() {
  const router = useRouter()
  /* TODO: review isRTL usage */ /* TODO: review isRTL usage */ const { locale, isRTL, t } = useLocale()
  const toast = useToast()

  const [step, setStep] = useState(1)
  const [tnaCode, setTnaCode] = useState('')
  const [tnaResolution, setTnaResolution] = useState<TNAResolutionResult | null>(null)
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
    weight: '',
    dimensions: '',
    contents: ''
  })
  const [assignedStaff, setAssignedStaff] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const validateTNA = async () => {
    if (!tnaCode.trim()) return
    setIsValidating(true)
    try {
      const result = await resolverApi.resolveTNA(tnaCode.trim())
      setTnaResolution(result)
      if (!result.deliverable) {
        toast.error(result.error || 'TNA is not deliverable')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to validate TNA')
    } finally {
      setIsValidating(false)
    }
  }

  const createShipmentMutation = useMutation({
    mutationFn: async (data: {
      tna_id: string
      carrier_id: string
      tracking_number: string
      package_details?: {
        weight?: number
        dimensions?: string
        contents?: string
      }
      assigned_staff_id?: string
    }) => {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to create shipment')
      return response.json()
    },
    onSuccess: () => {
      toast.success(t('carrier.shipment_created_successfully_34'))
      router.push(`/${locale}/carrier/shipments`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create shipment')
    }
  })

  const handleSubmit = () => {
    if (!tnaResolution?.deliverable) return

    const trackingNumber = 'TRK-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    createShipmentMutation.mutate({
      tna_id: tnaResolution.tna_code,
      carrier_id: 'carrier-current', // TODO: Get from auth
      tracking_number: trackingNumber,
      package_details: {
        weight: parseFloat(packageDetails.weight) || undefined,
        dimensions: packageDetails.dimensions || undefined,
        contents: packageDetails.contents
      },
      assigned_staff_id: assignedStaff || undefined
    })
  }

  // Mock staff list - would come from API
  const staffList = [
    { staff_id: 'STF-001', full_name: 'Mohammed Ali', position: 'DRIVER' },
    { staff_id: 'STF-002', full_name: 'Ibrahim Hassan', position: 'DISPATCHER' },
    { staff_id: 'STF-003', full_name: 'Khalid Saleh', position: 'DRIVER' },
  ]

  return (
    <RoleGuard requiredRole="Carrier">
      <AppShell role="Carrier" header={t('carrier.register_new_shipment_35')}>
        <div className="max-w-2xl mx-auto space-y-8 pb-12">

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                  step >= s ? "bg-primary text-white" : "bg-neutral-100 text-neutral-400"
                )}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={cn(
                    "w-16 h-1 rounded",
                    step > s ? "bg-primary" : "bg-neutral-200"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: TNA Validation */}
          {step === 1 && (
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-neutral-900">
                  {t('carrier.verify_tna_address_36')}
                </h2>
                <p className="text-sm text-neutral-600">
                  {isRTL 
                    ? 'أدخل رمز TNA للتحقق من صحة العنوان وتوفر الخدمة'
                    : 'Enter the TNA code to verify address and service availability'}
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-neutral-700">
                  {t('carrier.tna_code_37')}
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <InputField
                      value={tnaCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTnaCode(e.target.value)}
                      placeholder={t('carrier.example_tna_1')}
                      disabled={isValidating}
                      className="h-12 text-lg font-mono"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-6"
                    onClick={validateTNA}
                    disabled={!tnaCode.trim() || isValidating}
                    isLoading={isValidating}
                  >
                    <QrCode size={20} weight="bold" />
                  </Button>
                </div>
              </div>

              {tnaResolution && (
                <div className={cn(
                  "p-4 rounded-lg border-2 animate-in fade-in",
                  tnaResolution.deliverable
                    ? "bg-success/5 border-success/20"
                    : "bg-error/5 border-error/20"
                )}>
                  <div className="flex items-start gap-3">
                    {tnaResolution.deliverable ? (
                      <CheckCircle size={24} className="text-success shrink-0" weight="fill" />
                    ) : (
                      <WarningCircle size={24} className="text-error shrink-0" weight="fill" />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold text-neutral-900">
                        {tnaResolution.deliverable
                          ? (t('carrier.address_is_deliverable_39'))
                          : (t('carrier.address_is_not_deliverable_40'))
                        }
                      </p>
                      <p className="text-sm text-neutral-600">
                        {tnaResolution.deliverable
                          ? tnaResolution.national_address.full_address
                          : tnaResolution.error
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  className="px-8"
                  onClick={() => setStep(2)}
                  disabled={!tnaResolution?.deliverable}
                >
                  {t('carrier.continue_41')}
                  <ArrowRight size={20} className={isRTL ? "rotate-180 mr-2" : "ml-2"} />
                </Button>
              </div>
            </section>
          )}

          {/* Step 2: Package Details */}
          {step === 2 && (
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-neutral-900">
                  {t('carrier.package_details_43')}
                </h2>
                <p className="text-sm text-neutral-600">
                  {isRTL 
                    ? 'أدخل معلومات الطرد للمساعدة في التوصيل'
                    : 'Enter package information to assist with delivery'}
                </p>
              </div>

              <div className="space-y-4">
                <InputField
                  label={t('carrier.weight_kg_44')}
                  type="number"
                  value={packageDetails.weight}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPackageDetails(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder={t('carrier.eg_25_45')}
                />
                <InputField
                  label={t('carrier.dimensions_46')}
                  value={packageDetails.dimensions}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPackageDetails(prev => ({ ...prev, dimensions: e.target.value }))}
                  placeholder={t('carrier.eg_30x20x15_cm_47')}
                />
                <InputField
                  label={t('carrier.package_contents_48')}
                  value={packageDetails.contents}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPackageDetails(prev => ({ ...prev, contents: e.target.value }))}
                  placeholder={t('carrier.eg_books_clothing_49')}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  {t('carrier.back_50')}
                </Button>
                <Button className="px-8" onClick={() => setStep(3)}>
                  {t('carrier.continue_41')}
                  <ArrowRight size={20} className={isRTL ? "rotate-180 ml-2" : "ml-2"} />
                </Button>
              </div>
            </section>
          )}

          {/* Step 3: Assign Staff */}
          {step === 3 && (
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-neutral-900">
                  {t('carrier.assign_delivery_staff_53')}
                </h2>
                <p className="text-sm text-neutral-600">
                  {isRTL 
                    ? 'اختر موظف النقل المسؤول عن التوصيل'
                    : 'Select the delivery staff member responsible for this shipment'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-700">
                  {t('carrier.delivery_staff_54')}
                </label>
                <div className="grid gap-3">
                  {staffList.map((staff) => (
                    <button
                      key={staff.staff_id}
                      onClick={() => setAssignedStaff(staff.staff_id)}
                      className={cn(
                        "p-4 rounded-lg border-2 text-start transition-all",
                        assignedStaff === staff.staff_id
                          ? "border-primary bg-primary/5"
                          : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <User size={20} className="text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{staff.full_name}</p>
                          <p className="text-xs text-neutral-500">{staff.position}</p>
                        </div>
                        {assignedStaff === staff.staff_id && (
                          <CheckCircle size={20} className="text-primary mr-auto" weight="fill" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-surface-200 rounded-lg p-4 space-y-2">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                  {t('carrier.shipment_summary_55')}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">{t('carrier.tna_code_37')}:</span>
                    <span className="font-mono font-bold text-neutral-900 ms-2">{tnaCode}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{t('carrier.weight_57')}:</span>
                    <span className="font-bold text-neutral-900 ms-2">{packageDetails.weight || '-'} kg</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{t('carrier.dimensions_46')}:</span>
                    <span className="font-bold text-neutral-900 ms-2">{packageDetails.dimensions || '-'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{t('carrier.staff_59')}:</span>
                    <span className="font-bold text-neutral-900 ms-2">
                      {staffList.find(s => s.staff_id === assignedStaff)?.full_name || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  {t('carrier.back_50')}
                </Button>
                <Button
                  className="px-8"
                  onClick={handleSubmit}
                  disabled={createShipmentMutation.isPending}
                  isLoading={createShipmentMutation.isPending}
                >
                  <Truck size={20} weight="bold" className={isRTL ? "rotate-180 ml-2" : "mr-2"} />
                  {t('carrier.create_shipment_62')}
                </Button>
              </div>
            </section>
          )}

        </div>
      </AppShell>
    </RoleGuard>
  )
}
