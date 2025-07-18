'use client'
 
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatsCard from '@/components/dashboard/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FolderOpen, CheckCircle, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

interface Lead {
  id: number;
  name: string;
  lead_sources?: { name: string };
  created_at: string;
}

interface Project {
  id: number;
  name: string;
  customers?: { name: string };
  status: string;
  created_at: string;
}

interface Stats {
  totalLeads: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  recentLeads: Lead[];
  recentProjects: Project[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    recentLeads: [],
    recentProjects: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch leads count
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      // Fetch active projects count
      const { count: activeProjectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .not('status', 'eq', 'completed')
        .not('status', 'eq', 'cancelled')

      // Fetch completed projects count
      const { count: completedProjectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')

      // Fetch recent leads
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('*, lead_sources(name)')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent projects
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('*, customers(name), project_types(name)')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalLeads: leadsCount || 0,
        activeProjects: activeProjectsCount || 0,
        completedProjects: completedProjectsCount || 0,
        totalRevenue: 0, // This would come from finance module
        recentLeads: recentLeads || [],
        recentProjects: recentProjects || []
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to SolarPro ERP</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Leads"
            value={stats.totalLeads.toString()}
            change="+12% from last month"
            changeType="positive"
            icon={Users}
          />
          <StatsCard
            title="Active Projects"
            value={stats.activeProjects.toString()}
            change="+8% from last month"
            changeType="positive"
            icon={FolderOpen}
          />
          <StatsCard
            title="Completed Projects"
            value={stats.completedProjects.toString()}
            change="+23% from last month"
            changeType="positive"
            icon={CheckCircle}
          />
          <StatsCard
            title="Revenue (TND)"
            value="0"
            change="Coming soon"
            changeType="neutral"
            icon={DollarSign}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Recent Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.lead_sources?.name}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {stats.recentLeads.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No recent leads</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FolderOpen className="h-5 w-5 mr-2" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentProjects.map((project: any) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.customers?.name}</div>
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {project.status}
                    </div>
                  </div>
                ))}
                {stats.recentProjects.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No recent projects</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium">Add New Lead</div>
                    <div className="text-sm text-gray-500">Create a new lead record</div>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <FolderOpen className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium">Start New Project</div>
                    <div className="text-sm text-gray-500">Create a new project</div>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <div className="font-medium">View Tasks</div>
                    <div className="text-sm text-gray-500">Check pending tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
