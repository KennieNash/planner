
import React from 'react';
import { Calendar, DollarSign, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import ProviderStats from '@/components/ProviderStats';
import RecentActivity from '@/components/RecentActivity';
import ServiceManagement from '@/components/ServiceManagement';
import ProviderQuoteManagement from '@/components/ProviderQuoteManagement';
import FinancialDashboard from '@/components/FinancialDashboard';
import JobManagement from '@/components/JobManagement';
import CustomerCommunicationHub from '@/components/CustomerCommunicationHub';
import CalendarDashboard from '@/components/CalendarDashboard';
import ProviderDashboardHeader from '@/components/ProviderDashboardHeader';
import ProviderQuickActions from '@/components/ProviderQuickActions';
import ProviderSettings from '@/components/ProviderSettings';
import { useProviderData } from '@/hooks/useProviderData';
import { useProviderHandlers } from '@/hooks/useProviderHandlers';

const ProviderDashboard = () => {
  const {
    providerStats,
    earningsData,
    paymentsData,
    payoutMethods,
    analyticsData,
    recentActivities,
    providerServices,
    quoteRequests
  } = useProviderData();

  const {
    handleAddService,
    handleEditService,
    handleToggleService,
    handleDeleteService,
    handleRespondToQuote,
    handleAcceptQuote,
    handleDeclineQuote,
    handleDownloadInvoice,
    handleExportPaymentData,
    handleAddPayoutMethod,
    handleSetDefaultPayout,
    handleChangePayoutSchedule,
    handleRemovePayoutMethod
  } = useProviderHandlers();

  // Mock user profile for settings
  const userProfile = {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    businessName: 'Smith Plumbing Services'
  };

  const handleProfileUpdate = (data: any) => {
    console.log('Update profile:', data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <ProviderDashboardHeader />

      {/* Main Content */}
      <div className="p-4 pb-20 lg:pb-4">
        {/* Stats Overview */}
        <ProviderStats stats={providerStats} />

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-white/10 mb-6">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-blue-500">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-white data-[state=active]:bg-blue-500">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-white data-[state=active]:bg-blue-500">
              <DollarSign className="w-4 h-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="services" className="text-white data-[state=active]:bg-blue-500">
              Services
            </TabsTrigger>
            <TabsTrigger value="communication" className="text-white data-[state=active]:bg-blue-500">
              Communication
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-blue-500">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quote Management */}
              <div className="lg:col-span-2">
                <ProviderQuoteManagement
                  quoteRequests={quoteRequests}
                  onRespondToQuote={handleRespondToQuote}
                  onAcceptQuote={handleAcceptQuote}
                  onDeclineQuote={handleDeclineQuote}
                />
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <RecentActivity activities={recentActivities} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarDashboard />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialDashboard
              earningsData={earningsData}
              paymentsData={paymentsData}
              payoutMethods={payoutMethods}
              analyticsData={analyticsData}
              onDownloadInvoice={handleDownloadInvoice}
              onExportPaymentData={handleExportPaymentData}
              onAddPayoutMethod={handleAddPayoutMethod}
              onSetDefaultPayout={handleSetDefaultPayout}
              onChangePayoutSchedule={handleChangePayoutSchedule}
              onRemovePayoutMethod={handleRemovePayoutMethod}
            />
          </TabsContent>

          <TabsContent value="services">
            <ServiceManagement
              services={providerServices}
              onAddService={handleAddService}
              onEditService={handleEditService}
              onToggleService={handleToggleService}
              onDeleteService={handleDeleteService}
            />
          </TabsContent>

          <TabsContent value="communication" className="mt-6">
            <CustomerCommunicationHub />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <ProviderSettings
              userProfile={userProfile}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <ProviderQuickActions />
      </div>

      <div className="lg:hidden">
        <Navigation />
      </div>
    </div>
  );
};

export default ProviderDashboard;
