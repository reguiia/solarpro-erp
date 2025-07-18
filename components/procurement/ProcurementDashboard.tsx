'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package, 
  Truck, 
  Users, 
  ShoppingCart, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter
} from 'lucide-react'

interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  category: string
  rating: number
  status: 'active' | 'inactive'
}

interface Product {
  id: string
  name: string
  category: 'panels' | 'inverters' | 'batteries' | 'mounting' | 'cables' | 'accessories'
  supplier: string
  sku: string
  price: number
  currency: string
  stock: number
  minStock: number
  unit: string
}

interface PurchaseOrder {
  id: string
  supplier: string
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled'
  total: number
  currency: string
  orderDate: string
  expectedDelivery: string
  items: number
}

export default function ProcurementDashboard() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchProcurementData()
  }, [])

  const fetchProcurementData = async () => {
    // Mock data - in real app, this would come from Supabase
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'SolarTech Tunisia',
        contact: 'Ahmed Ben Ali',
        email: 'ahmed@solartech.tn',
        phone: '+216 71 123 456',
        category: 'panels',
        rating: 4.8,
        status: 'active'
      },
      {
        id: '2',
        name: 'Inverter Solutions SARL',
        contact: 'Fatma Trabelsi',
        email: 'fatma@invertersol.tn',
        phone: '+216 73 987 654',
        category: 'inverters',
        rating: 4.5,
        status: 'active'
      },
      {
        id: '3',
        name: 'Energy Storage Co.',
        contact: 'Mohamed Gharbi',
        email: 'mohamed@energystorage.tn',
        phone: '+216 72 456 789',
        category: 'batteries',
        rating: 4.2,
        status: 'active'
      }
    ]

    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Monocrystalline Solar Panel 400W',
        category: 'panels',
        supplier: 'SolarTech Tunisia',
        sku: 'SP-MONO-400',
        price: 180,
        currency: 'TND',
        stock: 150,
        minStock: 50,
        unit: 'piece'
      },
      {
        id: '2',
        name: 'String Inverter 5kW',
        category: 'inverters',
        supplier: 'Inverter Solutions SARL',
        sku: 'INV-STR-5K',
        price: 850,
        currency: 'TND',
        stock: 25,
        minStock: 10,
        unit: 'piece'
      },
      {
        id: '3',
        name: 'Lithium Battery 10kWh',
        category: 'batteries',
        supplier: 'Energy Storage Co.',
        sku: 'BAT-LI-10K',
        price: 2500,
        currency: 'TND',
        stock: 8,
        minStock: 15,
        unit: 'piece'
      },
      {
        id: '4',
        name: 'Roof Mounting Rails',
        category: 'mounting',
        supplier: 'SolarTech Tunisia',
        sku: 'MNT-RAIL-4M',
        price: 45,
        currency: 'TND',
        stock: 200,
        minStock: 100,
        unit: 'meter'
      }
    ]

    const mockPurchaseOrders: PurchaseOrder[] = [
      {
        id: 'PO-2024-001',
        supplier: 'SolarTech Tunisia',
        status: 'confirmed',
        total: 18000,
        currency: 'TND',
        orderDate: '2024-01-15',
        expectedDelivery: '2024-01-25',
        items: 100
      },
      {
        id: 'PO-2024-002',
        supplier: 'Inverter Solutions SARL',
        status: 'sent',
        total: 8500,
        currency: 'TND',
        orderDate: '2024-01-18',
        expectedDelivery: '2024-01-28',
        items: 10
      },
      {
        id: 'PO-2024-003',
        supplier: 'Energy Storage Co.',
        status: 'draft',
        total: 12500,
        currency: 'TND',
        orderDate: '2024-01-20',
        expectedDelivery: '2024-02-05',
        items: 5
      }
    ]

    setSuppliers(mockSuppliers)
    setProducts(mockProducts)
    setPurchaseOrders(mockPurchaseOrders)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
      case 'active': return 'bg-green-100 text-green-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'panels': return 'bg-blue-100 text-blue-800'
      case 'inverters': return 'bg-purple-100 text-purple-800'
      case 'batteries': return 'bg-green-100 text-green-800'
      case 'mounting': return 'bg-orange-100 text-orange-800'
      case 'cables': return 'bg-gray-100 text-gray-800'
      case 'accessories': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { status: 'low', color: 'text-red-600', icon: AlertTriangle }
    if (current <= min * 1.5) return { status: 'medium', color: 'text-yellow-600', icon: Clock }
    return { status: 'good', color: 'text-green-600', icon: CheckCircle }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockProducts = products.filter(p => p.stock <= p.minStock)

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
        <h1 className="text-2xl font-bold text-gray-900">Procurement & Inventory</h1>
        <p className="text-gray-600">Manage suppliers, products, and purchase orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.filter(s => s.status === 'active').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.filter(po => po.status !== 'delivered').length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Inventory</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="panels">Panels</SelectItem>
                    <SelectItem value="inverters">Inverters</SelectItem>
                    <SelectItem value="batteries">Batteries</SelectItem>
                    <SelectItem value="mounting">Mounting</SelectItem>
                    <SelectItem value="cables">Cables</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock, product.minStock)
                    const StatusIcon = stockStatus.icon
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(product.category)}>
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.supplier}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`h-4 w-4 ${stockStatus.color}`} />
                            <span>{product.stock} {product.unit}</span>
                          </div>
                          <div className="text-xs text-gray-500">Min: {product.minStock}</div>
                        </TableCell>
                        <TableCell>
                          {product.price} {product.currency}
                        </TableCell>
                        <TableCell>
                          <Badge className={stockStatus.status === 'low' ? 'bg-red-100 text-red-800' : 
                                          stockStatus.status === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-green-100 text-green-800'}>
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Order</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Supplier Management</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-gray-500">{supplier.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{supplier.contact}</div>
                          <div className="text-sm text-gray-500">{supplier.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(supplier.category)}>
                          {supplier.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{supplier.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(supplier.status)}>
                          {supplier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Contact</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Purchase Orders</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.total.toLocaleString()} {order.currency}
                      </TableCell>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(order.expectedDelivery).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Track</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-600">
                            Current stock: {product.stock} {product.unit} (Min: {product.minStock})
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All Stock Levels Good</h3>
                  <p>No products are currently below minimum stock levels</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}