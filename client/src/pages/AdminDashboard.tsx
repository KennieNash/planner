import React, { useState } from 'react';
import { Shield, Users, FileCheck, TrendingUp, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminVerificationQueue from '@/components/AdminVerificationQueue';
import AdminProviderManagement from '@/components/AdminProviderManagement';
import AdminAnalytics from '@/components/AdminAnalytics';
import NotificationDropdown from '@/components/NotificationDropdown';
import { useNotifications } from '@/hooks/useNotifications';
import { VerificationDocument } from '@/types/verification';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    addNotification 
  } = useNotifications();

  const { logout } = useAuth();

  // Mock verification queue data
  const [verificationQueue] = useState([
    {
      id: '1',
      providerId: 'provider-1',
      providerName: 'John Smith Plumbing',
      documentType: 'license' as const,
      documentName: 'Business License 2024',
      uploadDate: '2024-01-15',
      status: 'pending' as const,
      documentUrl: '/docs/license-1.pdf'
    },
    {
      id: '2',
      providerId: 'provider-2',
      providerName: 'Sarah Johnson Electrical',
      documentType: 'insurance' as const,
      documentName: 'Liability Insurance Certificate',
      uploadDate: '2024-01-14',
      status: 'pending' as const,
      documentUrl: '/docs/insurance-2.pdf'
    },
    {
      id: '3',
      providerId: 'provider-3',
      providerName: 'Mike Wilson HVAC',
      documentType: 'certification' as const,
      documentName: 'HVAC Master Certification',
      uploadDate: '2024-01-13',
      status: 'approved' as const,
      documentUrl: '/docs/cert-3.pdf'
    }
  ]);

  // Mock admin stats
  const adminStats = {
    totalProviders: 156,
    pendingVerifications: 8,
    verifiedProviders: 142,
    rejectedDocuments: 6
  };

  const handleApprove = (itemId: string, notes?: string) => {
    console.log('Approving document:', itemId, notes);
    // In real app, this would update the verification status
    
    // Add notification for approval
    addNotification({
      type: 'verification',
      title: 'Document Approved',
      message: `Document has been approved and provider notified.`,
      priority: 'low'
    });
  };

  const handleReject = (itemId: string, reason: string) => {
    console.log('Rejecting document:', itemId, reason);
    // In real app, this would update the verification status and send notification
    
    // Add notification for rejection
    addNotification({
      type: 'verification',
      title: 'Document Rejected',
      message: `Document has been rejected and provider notified with feedback.`,
      priority: 'medium'
    });
  };

  const handleRequestInfo = (itemId: string, message: string) => {
    console.log('Requesting info for:', itemId, message);
    // In real app, this would send a message to the provider
    
    // Add notification for info request
    addNotification({
      type: 'verification',
      title: 'Information Requested',
      message: `Additional information requested from provider.`,
      priority: 'low'
    });
  };

  const handleSendMessage = (providerId: string, message: string) => {
    console.log('Sending message to provider:', providerId, message);
    // In real app, this would send a message to the provider
    
    addNotification({
      type: 'system',
      title: 'Message Sent',
      message: `Message sent to provider successfully.`,
      priority: 'low'
    });
  };

  const handleSuspendProvider = (providerId: string, reason: string) => {
    console.log('Suspending provider:', providerId, reason);
    // In real app, this would suspend the provider account
    
    addNotification({
      type: 'system',
      title: 'Provider Suspended',
      message: `Provider account has been suspended.`,
      priority: 'high'
    });
  };

  const handleActivateProvider = (providerId: string) => {
    console.log('Activating provider:', providerId);
    // In real app, this would reactivate the provider account
    
    addNotification({
      type: 'system',
      title: 'Provider Activated',
      message: `Provider account has been reactivated.`,
      priority: 'medium'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300 text-sm">Manage providers and verifications</p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationDropdown
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
            />
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-400 cursor-pointer" onClick={logout} title="Logout" />
              <span className="text-white font-medium">Administrator</span>
              <Button variant="ghost" size="sm" className="text-white hover:text-red-400" onClick={logout}>
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Providers</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{adminStats.totalProviders}</div>
              <p className="text-xs text-green-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pending Verifications</CardTitle>
              <FileCheck className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{adminStats.pendingVerifications}</div>
              <p className="text-xs text-yellow-400">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Verified Providers</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{adminStats.verifiedProviders}</div>
              <p className="text-xs text-green-400">91% verification rate</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Rejected Documents</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{adminStats.rejectedDocuments}</div>
              <p className="text-xs text-red-400">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="verification" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-6">
            <TabsTrigger value="verification" className="text-white data-[state=active]:bg-blue-500">
              Verification Queue
            </TabsTrigger>
            <TabsTrigger value="providers" className="text-white data-[state=active]:bg-blue-500">
              Provider Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-500">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verification">
            <AdminVerificationQueue
              verificationQueue={verificationQueue}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestInfo={handleRequestInfo}
            />
          </TabsContent>

          <TabsContent value="providers">
            <AdminProviderManagement
              onSendMessage={handleSendMessage}
              onSuspendProvider={handleSuspendProvider}
              onActivateProvider={handleActivateProvider}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
