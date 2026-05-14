'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useLocale } from '@/i18n/LocaleProvider'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next';

const payoutSchema = z.object({
  bank_name: z.string().min(1, 'Bank name is required'),
  account_number: z.string().min(1, 'Account number is required'),
  iban: z.string().min(1, 'IBAN is required'),
  swift: z.string().optional(),
})

type PayoutInputs = z.infer<typeof payoutSchema>

export default function PayoutSettingsPage() {
  const {  isRTL , t } = useLocale()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const methods = useForm<PayoutInputs>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      bank_name: '',
      account_number: '',
      iban: '',
      swift: '',
    }
  })

  const onSubmit: SubmitHandler<PayoutInputs> = async (data) => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      // await api.post('/v1/owner/payout-details', data)
      console.log('Saving payout details:', data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save payout details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppShell role="Owner">
      <div className="max-w-2xl mx-auto">
        <div className="p-8 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-neutral-900">
              {t('owner.payout_method_settings_2')}
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              {isRTL 
                ? 'أدخل تفاصيل حسابك البنكي لتلقي مدفوعاتك' 
                : 'Enter your bank account details to receive your payments'}
            </p>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                label={t('owner.bank_name_3')}
                placeholder={t('owner.eg_al_rajhi_bank_4')}
                {...methods.register('bank_name')}
                error={methods.formState.errors.bank_name?.message}
              />
              <InputField
                label={t('owner.bank_account_number_5')}
                placeholder={t('owner.enter_your_bank_account_number_6')}
                {...methods.register('account_number')}
                error={methods.formState.errors.account_number?.message}
              />
              <InputField
                label={t('owner.iban_7')}
                placeholder={t('owner.sa00_0000_0000_0000_0000_0000_8')}
                {...methods.register('iban')}
                error={methods.formState.errors.iban?.message}
              />
              <InputField
                label={t('owner.swift_code_optional_9')}
                placeholder={t('owner.swiftbic_code_10')}
                {...methods.register('swift')}
              />

              {success && (
                <div className="p-3 bg-success/10 text-success text-sm rounded-lg">
                  {t('owner.settings_saved_successfully_11')}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  className="px-8"
                >
                  {t('owner.save_settings_12')}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </AppShell>
  )
}