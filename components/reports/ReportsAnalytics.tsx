'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  DollarSign,
  Zap,
  Target,
  PieChart,
  LineChart
} from 'lucide-react'

interface KPIMetric {
  id: string
  name: string
  value: number
  unit: string
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
  target?: number
}

interface ChartData {
  name: string
  value: number
  color?: string
}

export default function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [kpis, setKpis] = useState<KPIMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    // Mock data - in real app, this would come from Supabase with real calculations
    const mockKPIs: KPIMetric[] = [
      {
        id: 'revenue',
        name: 'Total Revenue',
        value: 125000,
        unit: 'TND',
        change: 12.5,
        changeType: 'positive',
        target: 150000
      },
      {
        id: 'projects',
        name: 'Projects Completed',
        value: 15,
        unit: 'projects',
        change: 25,
        changeType: 'positive',
        target: 20
      },
      {
        id: 'leads',
        name: 'Leads Generated',
        value: 45,
        unit: 'leads',
        change: -8.2,
        changeType: 'negative',
        target: 50
      },
      {
        id: 'conversion',
        name: 'Lead Conversion Rate',
        value: 33.3,
        unit: '%',
        change: 5.1,
        changeType: 'positive',
        target: 35
      },
      {
        id: 'capacity',
        name: 'Total Capacity Installed',
        value: 285,
        unit: 'kW',
        change: 18.7,
        changeType: 'positive',
        target: 350
      },
      {
        id: 'margin',
        name: 'Average Profit Margin',
        value: 22.5,
        unit: '%',
        change: 2.3,
        changeType: 'positive',
        target: 25
      }
    ]

    setKpis(mockKPIs)
    setLoading(false)
  }

  const salesData: ChartData[] = [
    { name: 'Jan', value: 15000 },
    { name: 'Feb', value: 18000 },
    { name: 'Mar', value: 22000 },
    { name: 'Apr', value: 19000 },
    { name: 'May', value: 25000 },
    { name: 'Jun', value: 26000 }
  ]

  const projectTypeData: ChartData[] = [
    { name: 'Residential', value: 60, color: '#3B82F6' },
    { name: 'Commercial', value: 30, color: '#10B981' },
    { name: 'Industrial', value: 10, color: '#F59E0B' }
  ]

  const leadSourceData: ChartData[] = [
    { name: 'Website', value: 35, color: '#8B5CF6' },
    { name: 'Referrals', value: 25, color: '#06B6D4' },
    { name: 'Social Media', value: 20, color: '#84CC16' },
    { name: 'Trade Shows', value: 15, color: '#F97316' },
    { name: 'Direct Mail', value: 5, color: '#EF4444' }
  ]

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive': return '↗'
      case 'negative': return '↘'
      default: return '→'
    }
  }

  const exportReport = () => {
    // This would generate and download a report
    alert('Report export functionality would be implemented here')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Business intelligence and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                {kpi.id === 'revenue' && <DollarSign className="h-4 w-4" />}
                {kpi.id === 'projects' && <Target className="h-4 w-4" />}
                {kpi.id === 'leads' && <Users className="h-4 w-4" />}
                {kpi.id === 'conversion' && <TrendingUp className="h-4 w-4" />}
                {kpi.id === 'capacity' && <Zap className="h-4 w-4" />}
                {kpi.id === 'margin' && <BarChart3 className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.value.toLocaleString()} {kpi.unit}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${getChangeColor(kpi.changeType)}`}>
                  {getChangeIcon(kpi.changeType)} {Math.abs(kpi.change)}% from last period
                </p>
                {kpi.target && (
                  <Badge variant="outline" className="text-xs">
                    Target: {kpi.target.toLocaleString()}
                  </Badge>
                )}
              </div>
              {kpi.target && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {((kpi.value / kpi.target) * 100).toFixed(1)}% of target
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="projects">Project Analytics</TabsTrigger>
          <TabsTrigger value="crm">CRM Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {salesData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-blue-500 w-full rounded-t"
                        style={{ height: `${(item.value / 30000) * 200}px` }}
                      ></div>
                      <span className="text-xs mt-2">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Project Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{item.value}%</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${item.value}%`,
                              backgroundColor: item.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">Revenue Growth</div>
                      <div className="text-sm text-green-600">Above target by 12.5%</div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-800">Project Completion</div>
                      <div className="text-sm text-blue-600">15 projects this month</div>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div>
                      <div className="font-medium text-orange-800">Lead Conversion</div>
                      <div className="text-sm text-orange-600">Needs improvement</div>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Lead Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leadSourceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{item.value}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${item.value}%`,
                              backgroundColor: item.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Sales</span>
                    <span className="font-bold">125,000 TND</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Deal Size</span>
                    <span className="font-bold">8,333 TND</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sales Cycle</span>
                    <span className="font-bold">45 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Win Rate</span>
                    <span className="font-bold">33.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Residential 5kW Systems</span>
                    <Badge>8 sold</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Commercial 20kW Systems</span>
                    <Badge>4 sold</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Industrial 100kW Systems</span>
                    <Badge>2 sold</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Off-grid Agricultural</span>
                    <Badge>1 sold</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Planning</span>
                    <Badge variant="outline">3 projects</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>In Progress</span>
                    <Badge className="bg-blue-100 text-blue-800">8 projects</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Completed</span>
                    <Badge className="bg-green-100 text-green-800">15 projects</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>On Hold</span>
                    <Badge className="bg-yellow-100 text-yellow-800">2 projects</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Installation Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Capacity Installed</span>
                    <span className="font-bold">285 kW</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Project Size</span>
                    <span className="font-bold">19 kW</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Installation Time</span>
                    <span className="font-bold">3.2 days avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <span className="font-bold">4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Management Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Leads</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Qualified Leads</span>
                    <span className="font-bold">28</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Converted Leads</span>
                    <span className="font-bold">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conversion Rate</span>
                    <span className="font-bold">33.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Customers</span>
                    <span className="font-bold">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Repeat Customers</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Lifetime Value</span>
                    <span className="font-bold">15,500 TND</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Referral Rate</span>
                    <span className="font-bold">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}