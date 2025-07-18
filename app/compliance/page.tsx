'use client'

import React from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ComplianceTracker from '@/components/compliance/ComplianceTracker'

export default function CompliancePage() {
  return (
    <DashboardLayout>
      <ComplianceTracker />
    </DashboardLayout>
  )
}