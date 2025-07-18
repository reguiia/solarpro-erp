'use client'

import React, { useEffect, useState } from 'react'
import { supabase, Project } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Calendar, DollarSign, User } from 'lucide-react'
import { format } from 'date-fns'

interface ProjectsTableProps {
  onCreateProject: () => void
  onEditProject: (project: Project) => void
}

export default function ProjectsTable({ onCreateProject, onEditProject }: ProjectsTableProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          customers (name, customer_type),
          project_types (name, category),
          user_profiles (full_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'design': return 'bg-purple-100 text-purple-800'
      case 'approval': return 'bg-yellow-100 text-yellow-800'
      case 'procurement': return 'bg-orange-100 text-orange-800'
      case 'installation': return 'bg-indigo-100 text-indigo-800'
      case 'commissioning': return 'bg-teal-100 text-teal-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.customers?.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button onClick={onCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="approval">Approval</SelectItem>
              <SelectItem value="procurement">Procurement</SelectItem>
              <SelectItem value="installation">Installation</SelectItem>
              <SelectItem value="commissioning">Commissioning</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow 
                key={project.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onEditProject(project)}
              >
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{project.customers?.name}</div>
                    <div className="text-sm text-gray-500 capitalize">
                      {project.customers?.customer_type}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{project.project_types?.name}</div>
                    <div className="text-sm text-gray-500 capitalize">
                      {project.project_types?.category?.replace('_', ' ')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {project.start_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(project.start_date), 'MMM dd')}
                      </div>
                    )}
                    {project.end_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(project.end_date), 'MMM dd')}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {project.budget_amount && (
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {project.budget_amount.toLocaleString()} TND
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {project.user_profiles?.full_name || (
                    <div className="flex items-center text-gray-400">
                      <User className="h-3 w-3 mr-1" />
                      Unassigned
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(project.created_at), 'MMM dd, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No projects found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  )
}