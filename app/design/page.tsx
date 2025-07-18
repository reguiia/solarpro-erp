'use client'

import React from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DesignSimulation from '@/components/design/DesignSimulation'

export default function DesignPage() {
  return (
    <DashboardLayout>
      <DesignSimulation />
    </DashboardLayout>
  )
}