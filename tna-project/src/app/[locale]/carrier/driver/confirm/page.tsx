'use client'

import React, { useState, useRef, Suspense } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import Button from '@/components/ui/Button'
import InputField from '@/components/ui/InputField'
import { 
  CheckCircle, 
  Camera, 
  QrCode, 
  Key,
  ArrowLeft,
  Info
} from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/ui/Toast'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { formatDate } from '@/lib/utils/formatDate'
import { deliveriesApi } from '@/lib/api/deliveries'
import type { Shipment } from '@/lib/types/deliveries'

function DeliveryConfirmationContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { locale, isRTL, t } = useLocale()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const shipmentId = ((params.id as string) || searchParams.get('shipment'))!
  const [otpCode, setOtpCode] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const { data: shipment, isLoading } = useQuery<Shipment>({
    queryKey: ['shipment', shipmentId],
    queryFn: () => deliveriesApi.getShipmentById(shipmentId),
    enabled: !!shipmentId,
  })

  const confirmDeliveryMutation = useMutation({
    mutationFn: async (data: { otp: string; photo_base64: string }) => {
      // TODO: Call real API
      // await apiClient.post(`/shipments/${shipmentId}/confirm`, data)
      return { success: true }
    },
    onSuccess: () => {
      toast.success(isRTL ? 'تم تأكيد التوصيل بنجاح' : 'Delivery confirmed successfully')
      router.push(`/${locale}/carrier/driver/tasks`)
    },
    onError: (error: any) => {
      toast.error(error.message || (isRTL ? 'فشل تأكيد التوصيل' : 'Failed to confirm delivery'))
    }
  })

  if (isLoading) {
    return (
      <AppShell role="Carrier" header={isRTL ? 'تأكيد التوصيل' : 'Confirm Delivery'}>
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-neutral-200 rounded-2xl" />
        </div>
      </AppShell>
    )
  }

  if (!shipment) {
    return (
      <AppShell role="Carrier" header={isRTL ? 'غير موجود' : 'Not Found'}>
        <div className="text-center py-12 space-y-4">
          <Info size={64} className="text-warning mx-auto" weight="fill" />
          <h2 className="text-xl font-bold text-neutral-900">
            {isRTL ? 'الشحنة غير موجودة' : 'Shipment not found'}
          </h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft size={20} className={isRTL ? "rotate-180 ml-2" : "mr-2"} />
            {isRTL ? 'رجوع' : 'Go Back'}
          </Button>
        </div>
       </AppShell>
     )
   }

   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode.trim() || !photo) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }

    // Convert photo to base64
    const photoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(photo)
    })

    confirmDeliveryMutation.mutate({
      otp: otpCode,
      photo_base64: photoBase64
    })
  }

  if (isLoading) {
    return (
      <AppShell role="Carrier" header={isRTL ? 'تأكيد التوصيل' : 'Confirm Delivery'}>
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-neutral-200 rounded-2xl" />
        </div>
      </AppShell>
    )
  }

  if (!shipment) {
    return (
      <AppShell role="Carrier" header={isRTL ? 'غير موجود' : 'Not Found'}>
        <div className="text-center py-12 space-y-4">
          <Info size={64} className="text-warning mx-auto" weight="fill" />
          <h2 className="text-xl font-bold text-neutral-900">
            {isRTL ? 'الشحنة غير موجودة' : 'Shipment not found'}
          </h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft size={20} className={isRTL ? "rotate-180 ml-2" : "mr-2"} />
            {isRTL ? 'رجوع' : 'Go Back'}
          </Button>
        </div>
      </AppShell>
    )
  }

  return (
    <RoleGuard requiredRole="Carrier">
      <AppShell role="Carrier" header={isRTL ? 'تأكيد التوصيل' : 'Confirm Delivery'} showBottomNav={false}>
        <div className="max-w-2xl mx-auto space-y-6 pb-8">
        
        {/* Shipment Info */}
        <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <QrCode size={24} className="text-primary" weight="bold" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-mono">{shipment.tracking_number}</p>
              <h2 className="text-lg font-black text-neutral-900">{shipment.tna_code}</h2>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Key size={18} className="text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-neutral-500 text-xs">
                  {isRTL ? 'رمز التحقق (OTP)' : 'Verification OTP'}
                </p>
                <p className="font-mono font-bold text-neutral-900">
                  {isRTL ? 'أرسل إلى العميل' : 'Sent to customer'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Confirmation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* OTP Input */}
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700">
                {isRTL ? 'أدخل رمز التحقق' : 'Enter Verification Code'}
              </label>
              <p className="text-xs text-neutral-500">
                {isRTL 
                  ? 'أدخل الرمز المكون من 6 أرقام المرسل إلى العميل'
                  : 'Enter the 6-digit code sent to the customer'}
              </p>
            </div>
            <InputField
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder={isRTL ? 'XXXXXX' : 'XXXXXX'}
              maxLength={6}
              className="h-14 text-center text-2xl font-mono tracking-widest"
            />
          </section>

          {/* Photo Upload */}
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700">
                {isRTL ? 'صورة إثبات التوصيل' : 'Delivery Proof Photo'}
              </label>
              <p className="text-xs text-neutral-500">
                {isRTL 
                  ? 'التقط صورة للطرد في موقع التسليم'
                  : 'Take a photo of the package at the delivery location'}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Delivery proof" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null)
                    setPhoto(null)
                  }}
                  className="absolute top-2 right-2 p-2 bg-error text-white rounded-full shadow-lg"
                >
                  <Info size={20} weight="fill" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Camera size={40} className="text-neutral-400" weight="fill" />
                <span className="text-sm font-bold text-neutral-600">
                  {isRTL ? 'اضغط لالتقاط صورة' : 'Tap to take photo'}
                </span>
              </button>
            )}
          </section>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold"
            variant="primary"
            disabled={confirmDeliveryMutation.isPending || !otpCode.trim() || !photo}
            isLoading={confirmDeliveryMutation.isPending}
          >
            <CheckCircle size={24} weight="fill" className={isRTL ? "rotate-180 ml-2" : "mr-2"} />
            {isRTL ? 'تأكيد التوصيل' : 'Confirm Delivery'}
          </Button>

        </form>

        {/* Info Note */}
        <div className="bg-warning/5 border border-warning/10 rounded-xl p-4 flex gap-3">
          <Info size={24} className="text-warning shrink-0" weight="fill" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-warning-dark">
              {isRTL ? 'ملاحظة هامة' : 'Important Note'}
            </p>
            <p className="text-xs text-neutral-600">
              {isRTL 
                ? 'التأكيد نهائي. لا يمكن التراجع عن هذه العملية.'
                : 'This action is final and cannot be undone.'}
            </p>
          </div>
          </div>
</div>
         </AppShell>
       </RoleGuard>
   )
}

export default function DeliveryConfirmationPage() {
  return (
    <Suspense fallback={
      <AppShell role="Carrier" header="Confirm Delivery">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-neutral-200 rounded-2xl" />
        </div>
      </AppShell>
    }>
      <DeliveryConfirmationContent />
    </Suspense>
  )
}
