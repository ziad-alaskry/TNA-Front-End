'use client'

import React, { ReactNode } from 'react'
import { Check } from 'lucide-react'

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
export function FormWizardLayout({
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

  return (
    <div className="min-h-screen bg-surface-100">
      {/* HEADER */}
      <div className="border-b border-neutral-200 bg-surface-200 px-5 py-8 shadow-card">
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
            <button
              onClick={onCancel}
              className="flex-1 rounded-pill border-2 border-brand-secondary bg-transparent px-6 py-3 font-semibold text-brand-primary transition-colors hover:bg-neutral-50"
            >
              Cancel
            </button>

            {!isLastStep && (
              <button
                onClick={() => onStepChange?.(currentStep + 1)}
                disabled={!canProceed}
                className="flex-1 rounded-pill border-0 bg-brand-primary px-6 py-3 font-semibold text-white shadow-btn transition-all hover:shadow-modal hover:opacity-90 disabled:opacity-50"
              >
                Continue
              </button>
            )}

            {isLastStep && (
              <button
                onClick={onSubmit}
                disabled={isSubmitting || !canProceed}
                className="flex-1 rounded-pill border-0 bg-brand-primary px-6 py-3 font-semibold text-white shadow-btn transition-all hover:shadow-modal hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
