'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import InputField from '@/components/ui/InputField'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { subAddressesApi } from '@/lib/api/subAddresses'
import { useLocale } from '@/i18n/LocaleProvider'

const subAddressSchema = z.object({
  suffix_code: z.string().length(4, 'Suffix code must be exactly 4 characters'),
  label: z.string().min(1, 'Label is required'),
  description: z.string().optional(),
})

type SubAddressInputs = z.infer<typeof subAddressSchema>

export default function AddSubAddressPage() {
  const { id: na_id } = useParams<{ id: string }>()
  const router = useRouter()
  const { isRTL } = useLocale()
  const [existingSubAddresses, setExistingSubAddresses] = useState<Array<{ suffix_code: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  const t = (key: string): string => {
    const translations: Record<string, string> = {
      'suffixCode': isRTL ? 'كود اللاحقة' : 'Suffix Code',
      'suffixCodeDescription': isRTL ? '4 أحرف فريدة للوحدة (مثال: ROOM)' : '4 unique characters for the unit (e.g., ROOM)',
      'label': isRTL ? 'التسمية' : 'Label',
      'labelDescription': isRTL ? 'اسم الوحدة' : 'Unit name',
      'description': isRTL ? 'الوصف' : 'Description',
      'descriptionDescription': isRTL ? 'وصف اختياري للوحدة' : 'Optional unit description',
      'createSubAddress': isRTL ? 'إنشاء الوحدة' : 'Create Unit',
      'loading': isRTL ? 'جاري التحميل...' : 'Loading...',
    }
    return translations[key] || key
  }

  React.useEffect(() => {
    const fetchExisting = async () => {
      try {
        const response = await subAddressesApi.getSubAddresses(na_id)
        setExistingSubAddresses(response.data || [])
      } catch (error) {
        console.error('Failed to fetch existing sub-addresses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (na_id) {
      fetchExisting()
    }
  }, [na_id])

  const methods = useForm<SubAddressInputs>({
    resolver: zodResolver(subAddressSchema),
  })

  const onSubmit: SubmitHandler<SubAddressInputs> = async (data) => {
    const isDuplicate = existingSubAddresses.some(
      (sub) => sub.suffix_code.toUpperCase() === data.suffix_code.toUpperCase()
    )

    if (isDuplicate) {
      methods.setError('suffix_code', {
        type: 'validate',
        message: 'Suffix code already exists for this property',
      })
      return
    }

    try {
      const subAddressData = {
        ...data,
        na_id,
        is_verified: false,
        is_available: true,
      }

      await subAddressesApi.createSubAddress(na_id, subAddressData)
      router.push(`/[locale]/owner/properties/${na_id}`)
    } catch (error) {
      console.error('Failed to create sub-address:', error)
    }
  }

  if (isLoading) {
    return (
      <AppShell role="Owner" header={isRTL ? 'إضافة وحدة فرعية' : 'Add Sub-Address'}>
        <div className="p-12 text-center">{t('loading')}</div>
      </AppShell>
    )
  }

  return (
    <AppShell role="Owner" header={isRTL ? 'إضافة وحدة فرعية' : 'Add Sub-Address'}>
      <div className="max-w-2xl mx-auto">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <InputField
                label={t('suffixCode')}
                helperText={t('suffixCodeDescription')}
                {...methods.register('suffix_code')}
              />
              <InputField
                label={t('label')}
                helperText={t('labelDescription')}
                {...methods.register('label')}
              />
              <Textarea
                label={t('description')}
                helperText={t('descriptionDescription')}
                {...methods.register('description')}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="w-48">
                {t('createSubAddress')}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </AppShell>
  )
}