'use client'

import React from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProcurementDashboard from '@/components/procurement/ProcurementDashboard'

export default function ProcurementPage() {
  return (
    <DashboardLayout>
      <ProcurementDashboard />
    </DashboardLayout>
  )
}