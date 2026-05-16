'use client'

import React, { useState } from 'react';
import FormWizardLayout from '@/components/templates/FormWizardLayout';
import { AppShell } from '@/components/layout/AppShell';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import {
    Package,
    Truck,
    MapPin,
    Info,
    CheckCircle,
    CaretRight,
    ArrowsLeftRight,
    Cube,
    Selection
} from '@phosphor-icons/react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useBindingContext } from '@/context/BindingContext';
import { useLocale } from '@/i18n/LocaleProvider';

const shipmentSchema = z.object({
  origin: z.string().min(1, { message: 'يجب اختيار مصدر الشحنة' }),
  destination: z.string().min(1, { message: 'يجب اختيار وجهة الشحنة' }),
  weight: z.string().min(1, { message: 'يجب تحديد الوزن' }),
  category: z.string().min(1, { message: 'يجب تحديد نوع الشحنة' }),
  carrier: z.string().min(1, { message: 'يجب اختيار الناقل' }),
});

type ShipmentInputs = z.infer<typeof shipmentSchema>;

export default function NewShipmentPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { t } = useLocale();
  const { visitorTnas } = useBindingContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeTnas = visitorTnas.filter(tna => tna.status === 'ACTIVE');

  const methods = useForm<ShipmentInputs>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      origin: '',
      destination: '',
      weight: '',
      category: '',
      carrier: '',
    },
  });

  const { handleSubmit, watch, formState: { errors } } = methods;

  const categories = [
    { value: 'documents', label: t('visitor.shipments.new.cat_documents') },
    { value: 'electronics', label: t('visitor.shipments.new.cat_electronics') },
    { value: 'clothes', label: t('visitor.shipments.new.cat_clothes') },
    { value: 'food', label: t('visitor.shipments.new.cat_food') },
    { value: 'other', label: t('visitor.shipments.new.cat_other') },
  ];

  const carriers = [
    { id: 'smsa', name: t('visitor.shipments.new.carrier_smsa'), price: 45, time: t('visitor.shipments.new.carrier_time_smsa') },
    { id: 'aramex', name: t('visitor.shipments.new.carrier_aramex'), price: 55, time: t('visitor.shipments.new.carrier_time_aramex') },
    { id: 'spl', name: t('visitor.shipments.new.carrier_spl'), price: 35, time: t('visitor.shipments.new.carrier_time_spl') },
  ];

  const steps = [
    {
      id: 'step1',
      label: t('visitor.shipments.new.step1_label'),
      title: t('visitor.shipments.new.step1_title'),
      description: t('visitor.shipments.new.step1_description'),
      content: (
        <div className="space-y-6">
          <Select
            label={t('visitor.shipments.new.step1_from')}
            options={[
                { value: 'current', label: t('visitor.shipments.new.step1_from_current') },
                ...activeTnas.map(tna => ({ value: tna.tna_code, label: t('visitor.shipments.new.step1_from_tna', { tnaCode: tna.tna_code }) }))
            ]}
            {...methods.register('origin')}
            error={errors.origin?.message}
          />
          <InputField
            label={t('visitor.shipments.new.step1_to')}
            placeholder={t('visitor.shipments.new.step1_placeholder')}
            {...methods.register('destination')}
            error={errors.destination?.message}
          />
          <div className="p-4 bg-info-bg rounded-md flex gap-3 text-right">
            <Info size={24} className="text-primary shrink-0" weight="fill" />
            <p className="text-xs text-neutral-600 leading-relaxed">
              {t('visitor.shipments.new.step1_info')}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'step2',
      label: t('visitor.shipments.new.step2_label'),
      title: t('visitor.shipments.new.step2_title'),
      description: t('visitor.shipments.new.step2_description'),
      content: (
        <div className="space-y-6">
          <Select
            label={t('visitor.shipments.new.step2_category')}
            options={categories}
            {...methods.register('category')}
            error={errors.category?.message}
          />
          <InputField
            label={t('visitor.shipments.new.step2_weight')}
            type="number"
            {...methods.register('weight')}
            error={errors.weight?.message}
          />
          <div className="grid grid-cols-3 gap-3">
             <div className="p-3 border border-neutral-200 rounded-md text-center">
                <p className="text-[10px] text-neutral-400">{t('visitor.shipments.new.step2_length')}</p>
                <p className="font-bold">--</p>
             </div>
             <div className="p-3 border border-neutral-200 rounded-md text-center">
                <p className="text-[10px] text-neutral-400">{t('visitor.shipments.new.step2_width')}</p>
                <p className="font-bold">--</p>
             </div>
             <div className="p-3 border border-neutral-200 rounded-md text-center">
                <p className="text-[10px] text-neutral-400">{t('visitor.shipments.new.step2_height')}</p>
                <p className="font-bold">--</p>
             </div>
          </div>
        </div>
      ),
    },
    {
      id: 'step3',
      label: t('visitor.shipments.new.step3_label'),
      title: t('visitor.shipments.new.step3_title'),
      description: t('visitor.shipments.new.step3_description'),
      content: (
        <div className="space-y-4">
          {carriers.map((carrier) => (
            <label
                key={carrier.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${watch('carrier') === carrier.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-neutral-200 hover:border-neutral-300'}`}
            >
                <div className="flex items-center gap-4">
                    <input
                        type="radio"
                        className="sr-only"
                        value={carrier.id}
                        {...methods.register('carrier')}
                    />
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <Truck size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-neutral-900">{carrier.name}</p>
                        <p className="text-xs text-neutral-500">{carrier.time}</p>
                    </div>
                </div>
                <div className="text-left">
                    <p className="text-lg font-bold text-primary">{carrier.price} {t('common.currency')}</p>
                </div>
            </label>
          ))}
          {errors.carrier && <p className="text-xs text-error font-medium">{t('visitor.shipments.new.step3_error_required')}</p>}
        </div>
      ),
    },
    {
      id: 'step4',
      label: t('visitor.shipments.new.step4_label'),
      title: t('visitor.shipments.new.step4_title'),
      description: t('visitor.shipments.new.step4_description'),
      content: (
        <div className="space-y-6">
          <div className="bg-surface-200 border border-neutral-200 rounded-md divide-y divide-neutral-100">
            <div className="p-4">
                <p className="text-[10px] text-neutral-400 uppercase font-bold mb-2">{t('visitor.shipments.new.step4_summary_label')}</p>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-neutral-500">{t('visitor.shipments.new.step4_origin_label')}</span>
                        <span className="font-bold text-neutral-900">{watch('origin') === 'current' ? t('visitor.shipments.new.step1_from_current') : watch('origin')}</span>
                    </div>
                    <ArrowsLeftRight size={20} className="text-neutral-300" />
                    <div className="flex flex-col text-left">
                        <span className="text-xs text-neutral-500">{t('visitor.shipments.new.step4_destination_label')}</span>
                        <span className="font-bold text-neutral-900">{watch('destination')}</span>
                    </div>
                </div>
            </div>
            <div className="p-4 flex justify-between">
                <div>
                    <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">{t('visitor.shipments.new.step4_summary_label')}</p>
                    <p className="text-sm font-medium">{categories.find(c => c.value === watch('category'))?.label} ({watch('weight')} {t('visitor.shipments.new.step2_weight_unit')})</p>
                </div>
                <div className="text-left">
                    <p className="text-[10px] text-neutral-400 uppercase font-bold mb-1">{t('visitor.shipments.new.step4_carrier_label')}</p>
                    <p className="text-sm font-medium">{carriers.find(c => c.id === watch('carrier'))?.name}</p>
                </div>
            </div>
            <div className="p-4 bg-primary/5 flex justify-between items-center">
                <span className="font-bold text-neutral-900">{t('visitor.shipments.new.step4_total_label')}</span>
                <span className="text-xl font-extrabold text-primary">{carriers.find(c => c.id === watch('carrier'))?.price} {t('common.currency')}</span>
            </div>
          </div>

          <div className="p-4 bg-warning-bg rounded-md border border-warning-border flex gap-3">
             <Info size={20} className="text-warning shrink-0" weight="fill" />
             <p className="text-xs text-neutral-600 leading-relaxed">
               {t('visitor.shipments.new.step4_warning')}
             </p>
          </div>
        </div>
      ),
    },
  ];

  const onSubmit: SubmitHandler<ShipmentInputs> = (data) => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
        <AppShell role="Visitor" header={t('visitor.shipments.new.header')}>
            <div className="max-w-xl mx-auto py-12 px-4">
                <div className="bg-white border border-neutral-200 rounded-lg shadow-card p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-success-bg rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={48} weight="fill" className="text-success" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">{t('visitor.shipments.new.success_title')}</h2>
                        <p className="text-neutral-500 mt-2">{t('visitor.shipments.new.success_desc')}</p>
                    </div>

                    <div className="p-6 bg-neutral-50 rounded-md border border-neutral-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package size={32} className="text-neutral-400" />
                            <div className="text-right">
                                <p className="text-xs text-neutral-400">{t('visitor.shipments.new.success_tracking_label')}</p>
                                <p className="text-lg font-mono font-bold">TRK-{Math.floor(10000000 + Math.random() * 90000000)}</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-primary font-bold">
                            {t('visitor.shipments.new.success_download_policy')}
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            className="w-full h-12 rounded-md font-bold"
                            onClick={() => router.push(`/${locale}/visitor/shipments`)}
                        >
                            {t('visitor.shipments.new.success_track_shipments')}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-md font-bold"
                            onClick={() => router.push(`/${locale}/visitor/home`)}
                        >
                            {t('visitor.shipments.new.success_back_home')}
                        </Button>
                    </div>
                </div>
            </div>
        </AppShell>
    );
  }

  return (
    <FormProvider {...methods}>
      <AppShell role="Visitor" header={t('visitor.shipments.new.header')}>
        <FormWizardLayout
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSubmit={handleSubmit(onSubmit)}
            onCancel={() => router.back()}
            canProceed={true}
        >
            {steps[currentStep].content}
        </FormWizardLayout>
      </AppShell>
    </FormProvider>
  );
}
