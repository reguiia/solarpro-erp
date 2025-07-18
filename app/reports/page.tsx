'use client'

import React from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ReportsAnalytics from '@/components/reports/ReportsAnalytics'

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <ReportsAnalytics />
    </DashboardLayout>
  )
}