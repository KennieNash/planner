
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Settings, User, MessageSquare, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import CustomerStats from '@/components/CustomerStats';
import CustomerRequestsOverview from '@/components/CustomerRequestsOverview';
import CustomerRecentActivity from '@/components/CustomerRecentActivity';

const CustomerDashboard = () => {
  // Sample customer data
  const customerStats = {
    activeRequests: 3,
    completedServices: 12,
    totalSpent: 2450,
    savedProviders: 8,
    avgRating: 4.6,
    pendingQuotes: 5
  };

  const recentRequests = [
    {
      id: 1,
      serviceTitle: 'Emergency Plumbing Repair',
      status: 'in-progress' as const,
      providerName: 'Mike Johnson',
      requestDate: '2024-01-15',
      quotesReceived: 3,
      price: 280
    },
    {
      id: 2,
      serviceTitle: 'House Deep Cleaning',
      status: 'pending' as const,
      requestDate: '2024-01-14',
      quotesReceived: 2,
      price: null
    },
    {
      id: 3,
      serviceTitle: 'Garden Landscaping',
      status: 'completed' as const,
      providerName: 'Emma Garcia',
      requestDate: '2024-01-10',
      completionDate: '2024-01-12',
      quotesReceived: 1,
      price: 450,
      rating: 5
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'quote' as const,
      title: 'New Quote Received',
      description: 'Mike Johnson sent a quote for plumbing repair - $280',
      timestamp: '2024-01-15T10:30:00Z',
      amount: 280
    },
    {
      id: 2,
      type: 'message' as const,
      title: 'New Message',
      description: 'Sarah Williams: I can start the cleaning tomorrow',
      timestamp: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      type: 'completion' as const,
      title: 'Service Completed',
      description: 'Garden landscaping by Emma Garcia finished',
      timestamp: '2024-01-12T16:45:00Z'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/10 border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-white hover:text-blue-400 transition-colors lg:hidden"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
              <p className="text-gray-300">Track your service requests and providers</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Bell className="w-5 h-5" />
            </Button>
            <Link to="/messages">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Calendar className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20 lg:pb-4">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Welcome back, John!</h2>
              <p className="text-gray-300">Here's what's happening with your services</p>
            </div>
            <Link to="/request-service">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Request Service
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <CustomerStats stats={customerStats} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <div className="lg:col-span-2">
            <CustomerRequestsOverview requests={recentRequests} />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <CustomerRecentActivity activities={recentActivities} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <Link to="/services">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Browse Services
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <Link to="/my-requests">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  View All Requests
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <Link to="/quotes">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  Manage Quotes
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="lg:hidden">
        <Navigation />
      </div>
    </div>
  );
};

export default CustomerDashboard;
