'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { useLocale } from '@/i18n/LocaleProvider'
import { useKYCStore } from '@/lib/store/useKYCStore'
import { useAuthStore } from '@/lib/store/useAuthStore'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import ErrorAlert from '@/components/ui/ErrorAlert'
import { 
  UploadSimple, 
  File, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  XCircle,
  FileArrowUp
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'

export type KYCDocType = 'NATIONAL_ID' | 'PASSPORT' | 'RESIDENCE_PERMIT'

export default function KYCUploadPage() {
  const { t, isRTL } = useLocale()
  const { user } = useAuthStore()
  const { currentStatus, fetchKYCStatus, submitDocuments, loading } = useKYCStore()

  const [docType, setDocType] = useState<KYCDocType>('NATIONAL_ID')
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Fetch current KYC status on mount
    if (user?.user_id) {
      fetchKYCStatus(user.user_id).catch(() => {})
    }
  }, [user, fetchKYCStatus])

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (err) => reject(err)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitLoading(true)

    try {
      if (!user?.user_id) throw new Error('User not authenticated')

      const documents = []
      if (frontFile) {
        documents.push({
          doc_type: docType,
          file_base64: await handleFileToBase64(frontFile),
          filename: frontFile.name
        })
      }
      if (backFile) {
        documents.push({
          doc_type: docType,
          file_base64: await handleFileToBase64(backFile),
          filename: backFile.name
        })
      }
      if (selfieFile) {
        documents.push({
          doc_type: 'SELFIE',
          file_base64: await handleFileToBase64(selfieFile),
          filename: selfieFile.name
        })
      }

      if (documents.length === 0) {
        throw new Error('At least one document must be uploaded')
      }

      await submitDocuments(user.user_id, documents)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit documents')
    } finally {
      setSubmitLoading(false)
    }
  }

  const renderStatus = () => {
    if (!currentStatus) return null

    const statusConfig = {
      'NOT_STARTED': { icon: UploadSimple, color: 'text-neutral-500 bg-neutral-100', label: 'Not Started' },
      'PENDING': { icon: Clock, color: 'text-warning bg-warning/10', label: 'Pending Review' },
      'APPROVED': { icon: CheckCircle, color: 'text-success bg-success/10', label: 'Verified' },
      'REJECTED': { icon: XCircle, color: 'text-error bg-error/10', label: 'Rejected' },
      'EXPIRED': { icon: Clock, color: 'text-neutral-500 bg-neutral-100', label: 'Expired' },
    }

    const config = statusConfig[currentStatus] || statusConfig['NOT_STARTED']
    const Icon = config.icon

    return (
      <div className={cn("p-4 rounded-xl border flex items-start gap-3", config.color)}>
        <Icon size={24} weight="fill" />
        <div>
          <p className="font-bold text-sm">{config.label}</p>
          {currentStatus === 'PENDING' && (
            <p className="text-xs opacity-80 mt-1">Your documents are being reviewed. This usually takes 24-48 hours.</p>
          )}
          {currentStatus === 'REJECTED' && (
            <p className="text-xs opacity-80 mt-1">Your documents were rejected. Please upload corrected documents.</p>
          )}
          {currentStatus === 'APPROVED' && (
            <p className="text-xs opacity-80 mt-1">Your identity has been verified. You can now request a TNA.</p>
          )}
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <RoleGuard requiredRole="Visitor">
        <AppShell role="Visitor" header={t('kyc.title') || 'KYC Verification'}>
          <div className="max-w-md mx-auto py-12 text-center space-y-6">
            <div className="mx-auto w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success animate-bounce">
              <CheckCircle size={64} weight="fill" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-neutral-900 uppercase">
                {t('kyc.success.title') || 'Documents Submitted'}
              </h2>
              <p className="text-neutral-500">
                {t('kyc.success.message') || 'Your KYC documents have been submitted for review.'}
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="px-8"
            >
              {t('common.back') || 'Back'}
            </Button>
          </div>
        </AppShell>
      </RoleGuard>
    )
  }

  const docOptions = [
    { value: 'NATIONAL_ID', label: t('kyc.doc_types.national_id') || 'National ID' },
    { value: 'PASSPORT', label: t('kyc.doc_types.passport') || 'Passport' },
    { value: 'RESIDENCE_PERMIT', label: t('kyc.doc_types.residence_permit') || 'Residence Permit (Iqama)' },
  ]

  return (
    <RoleGuard requiredRole="Visitor">
      <AppShell role="Visitor" header={t('kyc.title') || 'Identity Verification'}>
        <div className="max-w-3xl mx-auto space-y-8 py-4">
          {/* Status Banner */}
          <section>
            <h2 className="text-lg font-bold text-neutral-900 mb-3">
              {t('kyc.status_title') || 'Verification Status'}
            </h2>
            {renderStatus()}
          </section>

          {/* Upload Form */}
          <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 md:p-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <FileArrowUp className="text-primary" />
                {t('kyc.upload_title') || 'Upload Documents'}
              </h2>
              <p className="text-neutral-500">
                {t('kyc.upload_desc') || 'Please upload clear images of your identification documents.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Document Type */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">
                  {t('kyc.document_type') || 'Document Type'} *
                </label>
                <Select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as KYCDocType)}
                  options={docOptions}
                  className="w-full md:w-80"
                />
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front Side */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">
                    {t('kyc.front_side') || 'Front Side'} *
                  </label>
                  <FileUpload
                    accept="image/*,.pdf"
                    value={frontFile}
                    onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
                    placeholder={t('kyc.drop_front') || 'Drop front image or click to upload'}
                  />
                  <p className="text-xs text-neutral-500">
                    {t('kyc.max_size') || 'Max 10MB'}
                  </p>
                </div>

                {/* Back Side */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">
                    {t('kyc.back_side') || 'Back Side'} *
                  </label>
                  <FileUpload
                    accept="image/*,.pdf"
                    value={backFile}
                    onChange={(e) => setBackFile(e.target.files?.[0] || null)}
                    placeholder={t('kyc.drop_back') || 'Drop back image or click to upload'}
                  />
                </div>
              </div>

              {/* Selfie */}
              <div className="space-y-2 max-w-md">
                <label className="text-sm font-bold text-neutral-700">
                  {t('kyc.selfie') || 'Selfie Photo'} *
                </label>
                <FileUpload
                  accept="image/*"
                  value={selfieFile}
                  onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                  placeholder={t('kyc.drop_selfie') || 'Take or upload a clear selfie'}
                />
                <p className="text-xs text-neutral-500">
                  {t('kyc.selfie_hint') || 'Face must be clearly visible'}
                </p>
              </div>

              {error && <ErrorAlert message={error} />}

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-200">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  {t('common.cancel') || 'Cancel'}
                </Button>
                <Button 
                  type="submit"
                  isLoading={submitLoading}
                  disabled={!currentStatus || currentStatus === 'APPROVED' || currentStatus === 'PENDING'}
                  className="px-8"
                >
                  {currentStatus === 'REJECTED' 
                    ? (t('kyc.resubmit') || 'Resubmit Documents')
                    : (t('kyc.submit') || 'Submit for Verification')
                  }
                </Button>
              </div>
            </form>
          </section>

          {/* Info Box */}
          <div className="p-6 bg-info/5 rounded-2xl border border-info/10 space-y-3">
            <div className="flex items-center gap-2 text-info">
              <ShieldCheck size={20} weight="fill" />
              <p className="text-sm font-bold uppercase tracking-wider">
                {t('kyc.security_title') || 'Secure & Private'}
              </p>
            </div>
            <ul className="text-sm text-neutral-600 space-y-1 list-disc list-inside ps-2">
              <li>{t('kyc.security_note1') || 'Your documents are encrypted and stored securely.'}</li>
              <li>{t('kyc.security_note2') || 'We never share your personal data with third parties.'}</li>
              <li>{t('kyc.security_note3') || 'Verification typically completes within 24-48 hours.'}</li>
            </ul>
          </div>
        </div>
      </AppShell>
    </RoleGuard>
  )
}

// Simple FileUpload component variant for images/PDFs
function FileUpload({
  accept,
  value,
  onChange,
  placeholder
}: {
  accept: string
  value: File | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}) {
  const [dragActive, setDragActive] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e)
    }
  }

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer hover:border-primary/30 hover:bg-primary/5",
        dragActive && "border-primary bg-primary/5",
        value && "border-success bg-success/5"
      )}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          onChange({ target: { files: e.dataTransfer.files } } as any)
        }
      }}
      onClick={() => document.getElementById(`file-${placeholder}`)?.click()}
    >
      <input
        id={`file-${placeholder}`}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      
      {value ? (
        <div className="flex items-center gap-3 justify-center text-success">
          <File size={24} weight="fill" />
          <div className="text-sm font-bold text-neutral-900">{value.name}</div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange({ target: { files: null } } as any) }}
            className="text-neutral-400 hover:text-error"
          >
            <XCircle size={20} />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <UploadSimple size={24} />
          </div>
          <p className="text-sm font-medium text-neutral-600">{placeholder}</p>
          <p className="text-xs text-neutral-400">or drag and drop</p>
        </div>
      )}
    </div>
  )
}
