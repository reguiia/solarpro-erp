'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import LeadsTable from '@/components/crm/LeadsTable'
import LeadForm from '@/components/crm/LeadForm'
import { Lead } from '@/lib/supabase'

export default function CRMPage() {
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>()

  const handleCreateLead = () => {
    setSelectedLead(undefined)
    setShowLeadForm(true)
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setShowLeadForm(true)
  }

  const handleCloseForm = () => {
    setShowLeadForm(false)
    setSelectedLead(undefined)
  }

  const handleSaveLead = () => {
    // Refresh the table
    window.location.reload()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-600">Manage leads, customers, and communications</p>
        </div>

        <LeadsTable onCreateLead={handleCreateLead} onEditLead={handleEditLead} />

        <LeadForm 
          lead={selectedLead}
          open={showLeadForm}
          onClose={handleCloseForm}
          onSave={handleSaveLead}
        />
      </div>
    </DashboardLayout>
  )
}