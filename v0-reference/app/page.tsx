'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/shell/AppShell'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DataTableLayout } from '@/components/layouts/DataTableLayout'
import { FormWizardLayout } from '@/components/layouts/FormWizardLayout'
import { DetailViewLayout } from '@/components/layouts/DetailViewLayout'
import { MapTaskLayout } from '@/components/layouts/MapTaskLayout'
import { ModalOverlay } from '@/components/layouts/ModalOverlay'
import { BarChart3, Users, TrendingUp, Zap, MapPin } from 'lucide-react'

export default function Home() {
  const [demoView, setDemoView] = useState<'dashboard' | 'table' | 'wizard' | 'detail' | 'map' | 'modal'>('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [selectedRow, setSelectedRow] = useState<any>(null)

  // Sample data
  const sampleStats = [
    { label: 'Total Transactions', value: '2,456', change: '+12% from last month', icon: <BarChart3 size={24} /> },
    { label: 'Active Users', value: '1,203', change: '+8% from last month', icon: <Users size={24} /> },
    { label: 'Revenue', value: '$45.2K', change: '+23% from last month', icon: <TrendingUp size={24} /> },
    { label: 'Performance', value: '98.5%', change: '+2.3% from last month', icon: <Zap size={24} /> },
  ]

  const sampleActivity = [
    { id: '1', title: 'New shipment received', description: 'Order #2341', timestamp: '2 hours ago', status: 'success' },
    { id: '2', title: 'Payment processed', description: 'Transaction #5678', timestamp: '4 hours ago', status: 'pending' },
    { id: '3', title: 'Document verification', description: 'KYC pending', timestamp: '1 day ago', status: 'error' },
  ]

  const sampleTableData = [
    { id: 1, date: '2024-01-15', status: 'Completed', amount: '$1,200', user: 'John Doe', action: 'View' },
    { id: 2, date: '2024-01-14', status: 'Pending', amount: '$850', user: 'Jane Smith', action: 'View' },
    { id: 3, date: '2024-01-13', status: 'Failed', amount: '$2,100', user: 'Bob Johnson', action: 'Retry' },
    { id: 4, date: '2024-01-12', status: 'Completed', amount: '$500', user: 'Alice Brown', action: 'View' },
  ]

  const tableColumns = [
    { key: 'date' as const, label: 'Date', width: '15%', sortable: true },
    { key: 'user' as const, label: 'User', width: '20%' },
    { key: 'status' as const, label: 'Status', width: '15%', render: (value: string) => (
      <span className={`px-2 py-1 rounded-sm text-xs font-semibold ${
        value === 'Completed' ? 'bg-status-success-bg text-status-success' :
        value === 'Pending' ? 'bg-status-pending-bg text-status-pending' :
        'bg-status-error-bg text-status-error'
      }`}>
        {value}
      </span>
    )},
    { key: 'amount' as const, label: 'Amount', width: '15%', sortable: true },
    { key: 'action' as const, label: 'Action', width: '15%' },
  ]

  const wizardSteps = [
    { id: 'info', label: 'Personal Info', description: 'Enter your details' },
    { id: 'docs', label: 'Documents', description: 'Upload documents' },
    { id: 'verify', label: 'Verification', description: 'Verify information' },
  ]

  const detailSections = [
    {
      title: 'Shipment Details',
      items: [
        { label: 'Tracking ID', value: '#SHP-2024-001' },
        { label: 'Status', value: '🟢 In Transit' },
        { label: 'Origin', value: 'New York, NY' },
        { label: 'Destination', value: 'Los Angeles, CA' },
      ],
    },
    {
      title: 'Timeline',
      items: [
        { label: 'Pickup', value: 'Jan 15, 2024 - 09:30 AM' },
        { label: 'In Transit', value: 'Jan 16, 2024 - 02:15 PM' },
        { label: 'Expected Delivery', value: 'Jan 18, 2024' },
      ],
    },
  ]

  // Navigation menu
  const navMenu = (
    <div className="space-y-2">
      {[
        { view: 'dashboard', label: '📊 Dashboard' },
        { view: 'table', label: '📋 Data Table' },
        { view: 'wizard', label: '✨ Form Wizard' },
        { view: 'detail', label: 'ℹ️ Detail View' },
        { view: 'map', label: '🗺️ Map Task' },
        { view: 'modal', label: '💬 Modal' },
      ].map((item) => (
        <button
          key={item.view}
          onClick={() => setDemoView(item.view as any)}
          className={`w-full text-start px-4 py-2 rounded-sm font-medium transition-colors ${
            demoView === item.view
              ? 'bg-brand-primary text-white'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )

  // Render appropriate layout
  const renderContent = () => {
    switch (demoView) {
      case 'dashboard':
        return (
          <DashboardLayout
            title="Dashboard Overview"
            subtitle="Welcome to the TNA Platform"
            stats={sampleStats}
            activity={sampleActivity}
            onStatClick={(stat) => console.log('Clicked stat:', stat)}
          />
        )

      case 'table':
        return (
          <DataTableLayout
            title="Transaction History"
            columns={tableColumns}
            data={sampleTableData}
            pageSize={2}
            onRowClick={(row) => setSelectedRow(row)}
          >
            <button className="rounded-sm bg-brand-primary px-4 py-2 text-white hover:shadow-btn transition-shadow">
              + Add New
            </button>
          </DataTableLayout>
        )

      case 'wizard':
        return (
          <FormWizardLayout
            steps={wizardSteps}
            currentStep={wizardStep}
            onStepChange={setWizardStep}
            onSubmit={() => alert('Form submitted!')}
            onCancel={() => alert('Form cancelled')}
            canProceed={true}
          >
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-neutral-900">
                {wizardSteps[wizardStep]?.label}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Sample Field 1
                  </label>
                  <input
                    type="text"
                    placeholder="Enter information"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-sm focus:border-brand-secondary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Sample Field 2
                  </label>
                  <textarea
                    placeholder="Enter description"
                    rows={4}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-sm focus:border-brand-secondary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </FormWizardLayout>
        )

      case 'detail':
        return (
          <DetailViewLayout
            title="Shipment #SHP-2024-001"
            breadcrumb={['Shipments', 'Active', 'SHP-2024-001']}
            mainContent={detailSections}
            onBack={() => console.log('Go back')}
            actions={
              <button className="rounded-sm bg-brand-secondary px-4 py-2 text-white text-sm hover:shadow-btn transition-shadow">
                Track Real-time
              </button>
            }
          />
        )

      case 'map':
        return (
          <MapTaskLayout
            mapComponent={
              <div className="w-full h-full bg-neutral-300 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto text-white mb-4" />
                  <p className="text-white font-semibold">Map View Placeholder</p>
                  <p className="text-white/80 text-sm">Integrate with Leaflet, Mapbox, or react-simple-maps</p>
                </div>
              </div>
            }
            taskCard={
              <div>
                <h3 className="font-semibold text-neutral-900 mb-2">Active Delivery</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Current location: 5.2 km away
                </p>
                <div className="space-y-2">
                  <p className="text-xs"><strong>Driver:</strong> James Wilson</p>
                  <p className="text-xs"><strong>Vehicle:</strong> Truck #2341</p>
                  <p className="text-xs"><strong>ETA:</strong> 15 minutes</p>
                </div>
              </div>
            }
            showTaskCard={true}
            taskPosition="bottom-right"
          />
        )

      case 'modal':
        return (
          <DashboardLayout title="Modal Example">
            <div className="rounded-md border border-neutral-200 bg-surface-200 p-6">
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-sm bg-brand-primary px-6 py-2 text-white hover:shadow-btn transition-shadow"
              >
                Open Modal
              </button>
            </div>
          </DashboardLayout>
        )

      default:
        return null
    }
  }

  return (
    <AppShell
      role="Gov"
      header={
        <div className="flex-1">
          <h1 className="text-2xl font-bold">TNA Master UI System</h1>
          <p className="mt-1 text-sm opacity-90">Production-ready layouts with design tokens</p>
        </div>
      }
      sidebar={navMenu}
    >
      {renderContent()}

      {/* MODAL EXAMPLE */}
      <ModalOverlay
        isOpen={modalOpen && demoView === 'modal'}
        onClose={() => setModalOpen(false)}
        title="Confirmation Required"
        size="md"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 rounded-pill border-2 border-brand-secondary bg-transparent px-4 py-2 font-semibold text-brand-primary hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setModalOpen(false)
                alert('Confirmed!')
              }}
              className="flex-1 rounded-pill bg-brand-primary px-4 py-2 font-semibold text-white hover:shadow-btn"
            >
              Confirm
            </button>
          </div>
        }
      >
        <p className="text-neutral-700">
          Are you sure you want to proceed with this action? This cannot be undone.
        </p>
      </ModalOverlay>
    </AppShell>
  )
}
