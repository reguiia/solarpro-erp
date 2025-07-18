'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { 
  DollarSign, 
  FileText, 
  CreditCard, 
  TrendingUp,
  Receipt,
  Banknote,
  Calculator,
  Download,
  Eye,
  Plus
} from 'lucide-react'

interface Quote {
  id: string
  customer: string
  project: string
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  validUntil: string
  createdAt: string
}

interface Invoice {
  id: string
  customer: string
  project: string
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate?: string
  createdAt: string
}

interface Payment {
  id: string
  invoice: string
  customer: string
  amount: number
  currency: string
  method: 'bank_transfer' | 'check' | 'cash' | 'card'
  status: 'pending' | 'completed' | 'failed'
  date: string
}

interface Subsidy {
  id: string
  project: string
  customer: string
  program: string
  amount: number
  currency: string
  status: 'applied' | 'approved' | 'received' | 'rejected'
  applicationDate: string
  approvalDate?: string
}

export default function FinanceDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [subsidies, setSubsidies] = useState<Subsidy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinanceData()
  }, [])

  const fetchFinanceData = async () => {
    // Mock data - in real app, this would come from Supabase
    const mockQuotes: Quote[] = [
      {
        id: 'QT-2024-001',
        customer: 'Ahmed Ben Salem',
        project: 'Residential 5kW System',
        amount: 12500,
        currency: 'TND',
        status: 'sent',
        validUntil: '2024-02-15',
        createdAt: '2024-01-15'
      },
      {
        id: 'QT-2024-002',
        customer: 'Société Industrielle XYZ',
        project: 'Industrial 100kW System',
        amount: 85000,
        currency: 'TND',
        status: 'accepted',
        validUntil: '2024-02-20',
        createdAt: '2024-01-18'
      }
    ]

    const mockInvoices: Invoice[] = [
      {
        id: 'INV-2024-001',
        customer: 'Fatma Trabelsi',
        project: 'Residential 3kW System',
        amount: 8500,
        currency: 'TND',
        status: 'paid',
        dueDate: '2024-01-30',
        paidDate: '2024-01-25',
        createdAt: '2024-01-10'
      },
      {
        id: 'INV-2024-002',
        customer: 'Mohamed Gharbi',
        project: 'Commercial 20kW System',
        amount: 35000,
        currency: 'TND',
        status: 'sent',
        dueDate: '2024-02-10',
        createdAt: '2024-01-20'
      }
    ]

    const mockPayments: Payment[] = [
      {
        id: 'PAY-2024-001',
        invoice: 'INV-2024-001',
        customer: 'Fatma Trabelsi',
        amount: 8500,
        currency: 'TND',
        method: 'bank_transfer',
        status: 'completed',
        date: '2024-01-25'
      }
    ]

    const mockSubsidies: Subsidy[] = [
      {
        id: 'SUB-2024-001',
        project: 'Residential 5kW System',
        customer: 'Ahmed Ben Salem',
        program: 'PROSOL Résidentiel',
        amount: 3750,
        currency: 'TND',
        status: 'applied',
        applicationDate: '2024-01-16'
      },
      {
        id: 'SUB-2024-002',
        project: 'Industrial 100kW System',
        customer: 'Société Industrielle XYZ',
        program: 'PROSOL Tertiaire',
        amount: 25500,
        currency: 'TND',
        status: 'approved',
        applicationDate: '2024-01-19',
        approvalDate: '2024-01-22'
      }
    ]

    setQuotes(mockQuotes)
    setInvoices(mockInvoices)
    setPayments(mockPayments)
    setSubsidies(mockSubsidies)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
      case 'accepted':
      case 'approved':
      case 'received': return 'bg-green-100 text-green-800'
      case 'sent':
      case 'applied':
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'overdue':
      case 'rejected':
      case 'failed': return 'bg-red-100 text-red-800'
      case 'expired':
      case 'cancelled': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0)
  const totalSubsidies = subsidies.filter(sub => sub.status === 'received').reduce((sum, sub) => sum + sub.amount, 0)
  const pendingQuotes = quotes.filter(q => q.status === 'sent').length

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
        <h1 className="text-2xl font-bold text-gray-900">Finance Management</h1>
        <p className="text-gray-600">Manage quotes, invoices, payments, and subsidies</p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices.toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">{invoices.filter(inv => inv.status === 'sent').length} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subsidies Received</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubsidies.toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">Government incentives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingQuotes}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="quotes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="subsidies">Subsidies</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quotes Management</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quote
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.id}</TableCell>
                      <TableCell>{quote.customer}</TableCell>
                      <TableCell>{quote.project}</TableCell>
                      <TableCell>{quote.amount.toLocaleString()} {quote.currency}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(quote.validUntil).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
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

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoice Management</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{invoice.project}</TableCell>
                      <TableCell>{invoice.amount.toLocaleString()} {invoice.currency}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
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

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.invoice}</TableCell>
                      <TableCell>{payment.customer}</TableCell>
                      <TableCell>{payment.amount.toLocaleString()} {payment.currency}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.method.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subsidies">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Subsidy Management</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Apply for Subsidy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Available Programs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">PROSOL Résidentiel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subsidy Rate:</span>
                          <span className="font-medium">30%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Max Amount:</span>
                          <span className="font-medium">5,000 TND</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>System Size:</span>
                          <span className="font-medium">≤ 10 kW</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">PROSOL Tertiaire</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subsidy Rate:</span>
                          <span className="font-medium">30%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Max Amount:</span>
                          <span className="font-medium">50,000 TND</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>System Size:</span>
                          <span className="font-medium">≤ 200 kW</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Agricultural Program</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subsidy Rate:</span>
                          <span className="font-medium">40%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Max Amount:</span>
                          <span className="font-medium">20,000 TND</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>System Type:</span>
                          <span className="font-medium">Off-grid</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Application Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subsidies.map((subsidy) => (
                    <TableRow key={subsidy.id}>
                      <TableCell className="font-medium">{subsidy.id}</TableCell>
                      <TableCell>{subsidy.project}</TableCell>
                      <TableCell>{subsidy.customer}</TableCell>
                      <TableCell>{subsidy.program}</TableCell>
                      <TableCell>{subsidy.amount.toLocaleString()} {subsidy.currency}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(subsidy.status)}>
                          {subsidy.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(subsidy.applicationDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}