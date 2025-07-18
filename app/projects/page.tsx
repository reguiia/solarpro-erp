'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProjectsTable from '@/components/projects/ProjectsTable'
import { Project } from '@/lib/supabase'

export default function ProjectsPage() {
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | undefined>()

  const handleCreateProject = () => {
    setSelectedProject(undefined)
    setShowProjectForm(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setShowProjectForm(true)
  }

  const handleCloseForm = () => {
    setShowProjectForm(false)
    setSelectedProject(undefined)
  }

  const handleSaveProject = () => {
    // Refresh the table
    window.location.reload()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Manage solar installation projects</p>
        </div>

        <ProjectsTable onCreateProject={handleCreateProject} onEditProject={handleEditProject} />
      </div>
    </DashboardLayout>
  )
}