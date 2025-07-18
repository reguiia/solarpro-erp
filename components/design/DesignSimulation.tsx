'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calculator, FileText, Download, Zap, DollarSign, Sun, Home } from 'lucide-react'

interface DesignParameters {
  systemType: 'on_grid_residential' | 'on_grid_industrial' | 'off_grid_agricultural'
  roofArea: number
  energyConsumption: number
  location: string
  roofOrientation: 'south' | 'southeast' | 'southwest' | 'east' | 'west'
  roofTilt: number
  shadingFactor: number
  panelType: 'monocrystalline' | 'polycrystalline' | 'thin_film'
  inverterType: 'string' | 'power_optimizer' | 'microinverter'
  batteryCapacity?: number
}

interface SimulationResults {
  systemSize: number
  panelCount: number
  annualProduction: number
  co2Savings: number
  paybackPeriod: number
  totalCost: number
  annualSavings: number
  roi25Years: number
}

export default function DesignSimulation() {
  const [parameters, setParameters] = useState<DesignParameters>({
    systemType: 'on_grid_residential',
    roofArea: 50,
    energyConsumption: 4000,
    location: 'Tunis',
    roofOrientation: 'south',
    roofTilt: 30,
    shadingFactor: 0.95,
    panelType: 'monocrystalline',
    inverterType: 'string',
    batteryCapacity: 0
  })

  const [results, setResults] = useState<SimulationResults | null>(null)
  const [loading, setLoading] = useState(false)

  const runSimulation = async () => {
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock calculation logic
    const panelWattage = parameters.panelType === 'monocrystalline' ? 400 : 
                        parameters.panelType === 'polycrystalline' ? 350 : 300
    
    const usableArea = parameters.roofArea * 0.7 // 70% usable area
    const maxPanels = Math.floor(usableArea / 2) // 2m² per panel
    
    const systemSize = Math.min(
      parameters.energyConsumption / 1200, // kW needed based on consumption
      maxPanels * panelWattage / 1000 // kW available based on roof space
    )
    
    const panelCount = Math.ceil(systemSize * 1000 / panelWattage)
    
    // Tunisia solar irradiation: ~1,800 kWh/m²/year
    const solarIrradiation = 1800
    const systemEfficiency = 0.85 * parameters.shadingFactor
    const orientationFactor = parameters.roofOrientation === 'south' ? 1.0 : 0.9
    
    const annualProduction = systemSize * solarIrradiation * systemEfficiency * orientationFactor
    
    const costPerKW = parameters.systemType === 'on_grid_residential' ? 2500 :
                     parameters.systemType === 'on_grid_industrial' ? 2000 : 3000
    
    const totalCost = systemSize * costPerKW
    const electricityRate = 0.15 // TND per kWh
    const annualSavings = annualProduction * electricityRate
    const paybackPeriod = totalCost / annualSavings
    const roi25Years = (annualSavings * 25 - totalCost) / totalCost * 100
    
    const co2Savings = annualProduction * 0.5 // kg CO2 per kWh
    
    setResults({
      systemSize: Math.round(systemSize * 100) / 100,
      panelCount,
      annualProduction: Math.round(annualProduction),
      co2Savings: Math.round(co2Savings),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      totalCost: Math.round(totalCost),
      annualSavings: Math.round(annualSavings),
      roi25Years: Math.round(roi25Years)
    })
    
    setLoading(false)
  }

  const generateReport = () => {
    // This would generate a PDF report
    alert('PDF report generation would be implemented here')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Design & Simulation</h1>
        <p className="text-gray-600">Calculate optimal solar system sizing and financial returns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                System Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>System Type</Label>
                <Select 
                  value={parameters.systemType} 
                  onValueChange={(value: any) => setParameters(prev => ({ ...prev, systemType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_grid_residential">On-Grid Residential</SelectItem>
                    <SelectItem value="on_grid_industrial">On-Grid Industrial</SelectItem>
                    <SelectItem value="off_grid_agricultural">Off-Grid Agricultural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roof Area (m²)</Label>
                <Input
                  type="number"
                  value={parameters.roofArea}
                  onChange={(e) => setParameters(prev => ({ ...prev, roofArea: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Annual Energy Consumption (kWh)</Label>
                <Input
                  type="number"
                  value={parameters.energyConsumption}
                  onChange={(e) => setParameters(prev => ({ ...prev, energyConsumption: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select 
                  value={parameters.location} 
                  onValueChange={(value) => setParameters(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tunis">Tunis</SelectItem>
                    <SelectItem value="Sfax">Sfax</SelectItem>
                    <SelectItem value="Sousse">Sousse</SelectItem>
                    <SelectItem value="Kairouan">Kairouan</SelectItem>
                    <SelectItem value="Tozeur">Tozeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roof Orientation</Label>
                <Select 
                  value={parameters.roofOrientation} 
                  onValueChange={(value: any) => setParameters(prev => ({ ...prev, roofOrientation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="southeast">Southeast</SelectItem>
                    <SelectItem value="southwest">Southwest</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roof Tilt (degrees)</Label>
                <Input
                  type="number"
                  min="0"
                  max="90"
                  value={parameters.roofTilt}
                  onChange={(e) => setParameters(prev => ({ ...prev, roofTilt: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Panel Type</Label>
                <Select 
                  value={parameters.panelType} 
                  onValueChange={(value: any) => setParameters(prev => ({ ...prev, panelType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monocrystalline">Monocrystalline</SelectItem>
                    <SelectItem value="polycrystalline">Polycrystalline</SelectItem>
                    <SelectItem value="thin_film">Thin Film</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={runSimulation} disabled={loading} className="w-full">
                {loading ? 'Calculating...' : 'Run Simulation'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {results ? (
            <Tabs defaultValue="technical" className="space-y-4">
              <TabsList>
                <TabsTrigger value="technical">Technical Results</TabsTrigger>
                <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
                <TabsTrigger value="environmental">Environmental Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="technical">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Zap className="h-5 w-5 mr-2" />
                        System Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>System Size:</span>
                        <Badge variant="outline">{results.systemSize} kW</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Panel Count:</span>
                        <Badge variant="outline">{results.panelCount} panels</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Production:</span>
                        <Badge variant="outline">{results.annualProduction.toLocaleString()} kWh</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Sun className="h-5 w-5 mr-2" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Capacity Factor:</span>
                        <Badge variant="outline">21%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>System Efficiency:</span>
                        <Badge variant="outline">85%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Shading Factor:</span>
                        <Badge variant="outline">{(parameters.shadingFactor * 100).toFixed(0)}%</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="financial">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Investment Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Cost:</span>
                        <Badge variant="outline">{results.totalCost.toLocaleString()} TND</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Savings:</span>
                        <Badge variant="outline">{results.annualSavings.toLocaleString()} TND</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Payback Period:</span>
                        <Badge variant="outline">{results.paybackPeriod} years</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>25-Year ROI:</span>
                        <Badge variant="outline">{results.roi25Years}%</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Home className="h-5 w-5 mr-2" />
                        Subsidy Eligibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>PROSOL Eligible:</span>
                        <Badge className="bg-green-100 text-green-800">Yes</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Subsidy Amount:</span>
                        <Badge variant="outline">30% of cost</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Net Investment:</span>
                        <Badge variant="outline">{Math.round(results.totalCost * 0.7).toLocaleString()} TND</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="environmental">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Sun className="h-5 w-5 mr-2" />
                      Environmental Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{results.co2Savings.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">kg CO₂ saved annually</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{Math.round(results.co2Savings * 25 / 1000)}</div>
                        <div className="text-sm text-gray-600">tons CO₂ saved (25 years)</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{Math.round(results.co2Savings / 21)}</div>
                        <div className="text-sm text-gray-600">trees equivalent annually</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={generateReport}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button onClick={generateReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Calculate</h3>
                <p className="text-gray-500">Enter your system parameters and click "Run Simulation" to see results</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}