
import React, { useState } from 'react';
import { TrendingUp, Users, FileCheck, DollarSign, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock analytics data
  const verificationTrends = [
    { date: '2024-01-01', pending: 12, approved: 45, rejected: 8 },
    { date: '2024-01-02', pending: 15, approved: 52, rejected: 5 },
    { date: '2024-01-03', pending: 18, approved: 48, rejected: 12 },
    { date: '2024-01-04', pending: 22, approved: 55, rejected: 7 },
    { date: '2024-01-05', pending: 16, approved: 62, rejected: 9 },
    { date: '2024-01-06', pending: 19, approved: 58, rejected: 6 },
    { date: '2024-01-07', pending: 14, approved: 51, rejected: 11 }
  ];

  const providersByService = [
    { service: 'Plumbing', count: 45, color: '#3b82f6' },
    { service: 'Electrical', count: 38, color: '#10b981' },
    { service: 'HVAC', count: 32, color: '#f59e0b' },
    { service: 'Cleaning', count: 28, color: '#ef4444' },
    { service: 'Landscaping', count: 22, color: '#8b5cf6' },
    { service: 'Other', count: 15, color: '#6b7280' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12500, bookings: 156 },
    { month: 'Feb', revenue: 15200, bookings: 189 },
    { month: 'Mar', revenue: 18900, bookings: 234 },
    { month: 'Apr', revenue: 16800, bookings: 208 },
    { month: 'May', revenue: 21400, bookings: 267 },
    { month: 'Jun', revenue: 24200, bookings: 298 }
  ];

  const verificationStats = [
    { status: 'Verified', count: 142, percentage: 85 },
    { status: 'Pending', count: 18, percentage: 11 },
    { status: 'Rejected', count: 7, percentage: 4 }
  ];

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: '$108,700',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Active Providers',
      value: '142',
      change: '+8.3%',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Monthly Bookings',
      value: '298',
      change: '+15.2%',
      icon: Calendar,
      color: 'text-purple-400'
    },
    {
      title: 'Verification Rate',
      value: '94.2%',
      change: '+2.1%',
      icon: FileCheck,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Analytics & Reports</CardTitle>
              <p className="text-gray-300 text-sm">Platform performance insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Metrics</SelectItem>
                  <SelectItem value="verifications">Verifications</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="providers">Providers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">{metric.title}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <p className={`text-sm ${metric.color}`}>{metric.change}</p>
                </div>
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Trends */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Verification Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={verificationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Provider Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Providers by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={providersByService}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ service, count }) => `${service}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {providersByService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Revenue & Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" />
                <Bar dataKey="bookings" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{stat.status}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stat.status === 'Verified' ? 'bg-green-500' :
                          stat.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Platform Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Growth Rate</h3>
              <p className="text-2xl font-bold text-green-400">+23.5%</p>
              <p className="text-gray-400 text-sm">vs last month</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">User Satisfaction</h3>
              <p className="text-2xl font-bold text-blue-400">4.8/5</p>
              <p className="text-gray-400 text-sm">average rating</p>
            </div>
            <div className="text-center">
              <FileCheck className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium">Response Time</h3>
              <p className="text-2xl font-bold text-purple-400">2.3h</p>
              <p className="text-gray-400 text-sm">avg verification time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
