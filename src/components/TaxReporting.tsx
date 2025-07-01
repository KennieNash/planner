
import React, { useState } from 'react';
import { FileBarChart, Download, Calendar, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TaxData {
  quarter: string;
  revenue: number;
  expenses: number;
  taxableIncome: number;
  estimatedTax: number;
}

interface TaxReportingProps {
  taxData: TaxData[];
  onGenerateReport: (period: 'quarterly' | 'yearly') => void;
  onDownloadTaxForms: () => void;
}

const TaxReporting = ({ taxData, onGenerateReport, onDownloadTaxForms }: TaxReportingProps) => {
  const [selectedYear] = useState(new Date().getFullYear());

  const currentYearData = taxData.filter(data => 
    data.quarter.includes(selectedYear.toString())
  );

  const totalRevenue = currentYearData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = currentYearData.reduce((sum, data) => sum + data.expenses, 0);
  const totalTaxableIncome = totalRevenue - totalExpenses;
  const estimatedAnnualTax = totalTaxableIncome * 0.25; // Simplified calculation

  const expenseBreakdown = [
    { name: 'Equipment', value: 15000, color: '#3B82F6' },
    { name: 'Transportation', value: 8500, color: '#10B981' },
    { name: 'Materials', value: 12000, color: '#F59E0B' },
    { name: 'Insurance', value: 3500, color: '#EF4444' },
    { name: 'Marketing', value: 2000, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      {/* Tax Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-green-400">Total Revenue ({selectedYear})</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">${totalExpenses.toLocaleString()}</div>
            <p className="text-sm text-red-400">Total Expenses ({selectedYear})</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">${totalTaxableIncome.toLocaleString()}</div>
            <p className="text-sm text-blue-400">Taxable Income</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">${estimatedAnnualTax.toLocaleString()}</div>
            <p className="text-sm text-yellow-400">Estimated Tax</p>
          </CardContent>
        </Card>
      </div>

      {/* Tax Reporting Tabs */}
      <Tabs defaultValue="quarterly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="quarterly" className="text-white data-[state=active]:bg-blue-500">
            Quarterly Reports
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-white data-[state=active]:bg-blue-500">
            Expense Breakdown
          </TabsTrigger>
          <TabsTrigger value="forms" className="text-white data-[state=active]:bg-blue-500">
            Tax Forms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quarterly" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Quarterly Tax Overview</CardTitle>
                <Button
                  onClick={() => onGenerateReport('quarterly')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <FileBarChart className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentYearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="quarter" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.8)',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  <Bar dataKey="taxableIncome" fill="#3B82F6" name="Taxable Income" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Deductible Expenses Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-3">
                  {expenseBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white">{item.name}</span>
                      </div>
                      <span className="text-white font-medium">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Tax Forms & Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Form 1099-NEC</h3>
                  <p className="text-gray-400 text-sm mb-3">Nonemployee Compensation</p>
                  <Button
                    onClick={onDownloadTaxForms}
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Schedule C</h3>
                  <p className="text-gray-400 text-sm mb-3">Profit or Loss from Business</p>
                  <Button
                    onClick={onDownloadTaxForms}
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Quarterly Summary</h3>
                  <p className="text-gray-400 text-sm mb-3">Income & Expense Report</p>
                  <Button
                    onClick={() => onGenerateReport('quarterly')}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                  >
                    <FileBarChart className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Annual Summary</h3>
                  <p className="text-gray-400 text-sm mb-3">Year-end Tax Report</p>
                  <Button
                    onClick={() => onGenerateReport('yearly')}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxReporting;
