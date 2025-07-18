'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Shield, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Upload,
  Download,
  Eye
} from 'lucide-react'

interface ComplianceItem {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  dueDate: string
  category: 'technical' | 'administrative' | 'financial' | 'environmental'
  required: boolean
  documents: string[]
}

interface ComplianceTemplate {
  id: string
  name: string
  projectType: string
  items: ComplianceItem[]
  completionRate: number
}

export default function ComplianceTracker() {
  const [templates, setTemplates] = useState<ComplianceTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComplianceTemplates()
  }, [])

  const fetchComplianceTemplates = async () => {
    // Mock data - in real app, this would come from Supabase
    const mockTemplates: ComplianceTemplate[] = [
      {
        id: '1',
        name: 'Residential On-Grid System',
        projectType: 'on_grid_residential',
        completionRate: 75,
        items: [
          {
            id: '1',
            title: 'STEG Connection Application',
            description: 'Application for grid connection approval from STEG',
            status: 'completed',
            dueDate: '2024-02-15',
            category: 'administrative',
            required: true,
            documents: ['steg_application.pdf', 'technical_specs.pdf']
          },
          {
            id: '2',
            title: 'Building Permit',
            description: 'Municipal building permit for rooftop installation',
            status: 'completed',
            dueDate: '2024-02-20',
            category: 'administrative',
            required: true,
            documents: ['building_permit.pdf']
          },
          {
            id: '3',
            title: 'Technical Compliance Certificate',
            description: 'IEC 61215 and IEC 61730 compliance for PV modules',
            status: 'in_progress',
            dueDate: '2024-03-01',
            category: 'technical',
            required: true,
            documents: []
          },
          {
            id: '4',
            title: 'Insurance Certificate',
            description: 'Professional liability and installation insurance',
            status: 'pending',
            dueDate: '2024-03-10',
            category: 'financial',
            required: true,
            documents: []
          },
          {
            id: '5',
            title: 'Environmental Impact Assessment',
            description: 'Environmental compliance for installations > 10kW',
            status: 'pending',
            dueDate: '2024-03-15',
            category: 'environmental',
            required: false,
            documents: []
          }
        ]
      },
      {
        id: '2',
        name: 'Industrial On-Grid System',
        projectType: 'on_grid_industrial',
        completionRate: 45,
        items: [
          {
            id: '6',
            title: 'ANME Authorization',
            description: 'National Agency for Energy Management authorization',
            status: 'in_progress',
            dueDate: '2024-02-25',
            category: 'administrative',
            required: true,
            documents: ['anme_application.pdf']
          },
          {
            id: '7',
            title: 'Grid Impact Study',
            description: 'Electrical grid impact assessment for large installations',
            status: 'pending',
            dueDate: '2024-03-05',
            category: 'technical',
            required: true,
            documents: []
          },
          {
            id: '8',
            title: 'Fire Safety Compliance',
            description: 'Fire safety measures and emergency procedures',
            status: 'pending',
            dueDate: '2024-03-12',
            category: 'technical',
            required: true,
            documents: []
          }
        ]
      }
    ]

    setTemplates(mockTemplates)
    setSelectedTemplate(mockTemplates[0]?.id || '')
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800'
      case 'administrative': return 'bg-purple-100 text-purple-800'
      case 'financial': return 'bg-green-100 text-green-800'
      case 'environmental': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'rejected': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Regulatory Compliance</h1>
        <p className="text-gray-600">Track compliance with Tunisian energy regulations</p>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-colors ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{template.projectType.replace('_', ' ')}</Badge>
                <span className="text-sm text-gray-500">{template.completionRate}% complete</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={template.completionRate} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplateData && (
        <Tabs defaultValue="checklist" className="space-y-4">
          <TabsList>
            <TabsTrigger value="checklist">Compliance Checklist</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    {selectedTemplateData.name} - Compliance Items
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedTemplateData.completionRate} className="w-32 h-2" />
                    <span className="text-sm text-gray-500">{selectedTemplateData.completionRate}%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTemplateData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(item.dueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.required ? (
                            <Badge variant="destructive">Required</Badge>
                          ) : (
                            <Badge variant="outline">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <Upload className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2" />
                  Document Repository
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTemplateData.items
                    .filter(item => item.documents.length > 0)
                    .map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{item.title}</h4>
                        <div className="space-y-2">
                          {item.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center">
                                <FileCheck className="h-4 w-4 mr-2 text-green-600" />
                                <span className="text-sm">{doc}</span>
                              </div>
                              <div className="flex space-x-1">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  
                  {selectedTemplateData.items.filter(item => item.documents.length > 0).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No documents uploaded yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Compliance Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTemplateData.items
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((item, index) => (
                      <div key={item.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'completed' ? 'bg-green-100' :
                            item.status === 'in_progress' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            {getStatusIcon(item.status)}
                          </div>
                          {index < selectedTemplateData.items.length - 1 && (
                            <div className="w-px h-12 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{item.title}</h4>
                            <span className="text-sm text-gray-500">
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}