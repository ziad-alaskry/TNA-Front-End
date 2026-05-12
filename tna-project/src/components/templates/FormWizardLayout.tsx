'use client'

import React, { ReactNode } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { Check } from '@phosphor-icons/react'
import Button from '@/components/ui/Button'

interface StepConfig {
  id: string
  label: string
  description?: string
}

interface FormWizardLayoutProps {
  steps: StepConfig[]
  currentStep: number
  onStepChange?: (step: number) => void
  onSubmit?: () => void
  onCancel?: () => void
  children: ReactNode
  isSubmitting?: boolean
  canProceed?: boolean
  showProgress?: boolean
}

/**
 * Form Wizard Template - Stepper-based centered container
 * Usage: KYC Uploads, TNA Registration, Sub-address Creation
 */
export default function FormWizardLayout({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  onCancel,
  children,
  isSubmitting = false,
  canProceed = true,
  showProgress = true,
}: FormWizardLayoutProps) {
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0
  const { t } = useLocale()

  return (
    <div className="min-h-screen bg-surface-100">
      {/* HEADER */}
      <div className="border border-neutral-200 bg-surface-200 px-5 py-8 shadow-card rounded-md">
        <h1 className="text-2xl font-bold text-neutral-900">
          {steps[currentStep]?.label || 'Form'}
        </h1>
        {steps[currentStep]?.description && (
          <p className="mt-2 text-neutral-600">
            {steps[currentStep].description}
          </p>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-2xl">
          {/* PROGRESS STEPPER */}
          {showProgress && (
            <div className="mb-12">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    {/* STEP INDICATOR */}
                    <button
                      onClick={() => idx < currentStep && onStepChange?.(idx)}
                      disabled={idx > currentStep}
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                        idx < currentStep
                          ? 'border-status-success bg-status-success text-white'
                          : idx === currentStep
                            ? 'border-brand-secondary bg-brand-primary text-white'
                            : 'border-neutral-300 bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {idx < currentStep ? (
                        <Check size={20} />
                      ) : (
                        idx + 1
                      )}
                    </button>

                    {/* CONNECTOR LINE */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 border-t-2 transition-colors ${
                          idx < currentStep
                            ? 'border-status-success'
                            : 'border-neutral-300'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* STEP LABELS */}
              <div className="mt-6 flex justify-between text-center">
                {steps.map((step) => (
                  <div key={step.id} className="flex-1">
                    <p className="text-xs font-semibold uppercase text-neutral-600">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FORM CONTENT */}
          <div className="rounded-md border border-neutral-200 bg-surface-200 p-8 shadow-card">
            {children}
          </div>

          {/* STICKY FOOTER ACTIONS */}
          <div className="mt-8 flex gap-4 border-t border-neutral-200 bg-surface-200 px-8 py-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              fullWidth
            >
              {t('common.cancel')}
            </Button>

            {!isLastStep && (
              <Button
                type="button"
                variant="primary"
                onClick={() => onStepChange?.(currentStep + 1)}
                disabled={!canProceed || isSubmitting}
                fullWidth
              >
                {t('common.next')}
              </Button>
            )}

            {isLastStep && (
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? t('common.loading') : t('common.confirm')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
