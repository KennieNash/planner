import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EarningsOverview from './EarningsOverview';
import PaymentHistory from './PaymentHistory';
import PayoutSettings from './PayoutSettings';
import FinancialAnalytics from './FinancialAnalytics';
import InvoiceManagement from './InvoiceManagement';
import ExpenseTracking from './ExpenseTracking';
import TaxReporting from './TaxReporting';
import PaymentManagement from './PaymentManagement';

interface FinancialDashboardProps {
  earningsData: {
    totalEarnings: number;
    monthlyEarnings: number;
    pendingPayouts: number;
    lastPayout: string;
    nextPayout: string;
    payoutFrequency: 'weekly' | 'monthly';
  };
  paymentsData: Array<{
    id: string;
    customerName: string;
    serviceType: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    paymentMethod: string;
    invoiceId: string;
  }>;
  payoutMethods: Array<{
    id: string;
    type: 'bank' | 'card';
    last4: string;
    isDefault: boolean;
    bankName?: string;
    cardBrand?: string;
  }>;
  analyticsData: {
    monthlyRevenue: Array<{ month: string; revenue: number; jobs: number }>;
    serviceBreakdown: Array<{ service: string; revenue: number; count: number }>;
    totalJobs: number;
    averageJobValue: number;
    customerRetention: number;
    topMonth: string;
  };
  onDownloadInvoice: (invoiceId: string) => void;
  onExportPaymentData: () => void;
  onAddPayoutMethod: () => void;
  onSetDefaultPayout: (methodId: string) => void;
  onChangePayoutSchedule: (schedule: 'weekly' | 'monthly') => void;
  onRemovePayoutMethod: (methodId: string) => void;
}

const FinancialDashboard = ({
  earningsData,
  paymentsData,
  payoutMethods,
  analyticsData,
  onDownloadInvoice,
  onExportPaymentData,
  onAddPayoutMethod,
  onSetDefaultPayout,
  onChangePayoutSchedule,
  onRemovePayoutMethod
}: FinancialDashboardProps) => {
  // Mock data for new components
  const invoicesData = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerName: 'John Smith',
      serviceType: 'Plumbing Repair',
      amount: 250,
      status: 'paid' as const,
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      jobId: 'job-1'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerName: 'Sarah Johnson',
      serviceType: 'Electrical Installation',
      amount: 450,
      status: 'sent' as const,
      issueDate: '2024-01-20',
      dueDate: '2024-02-20',
      jobId: 'job-2'
    }
  ];

  const expensesData = [
    {
      id: '1',
      description: 'Professional Tools',
      amount: 350,
      category: 'Equipment',
      date: '2024-01-10',
      receipt: 'receipt-1.pdf',
      taxDeductible: true
    },
    {
      id: '2',
      description: 'Vehicle Maintenance',
      amount: 125,
      category: 'Transportation',
      date: '2024-01-15',
      taxDeductible: true
    }
  ];

  const taxData = [
    {
      quarter: 'Q1 2024',
      revenue: 15000,
      expenses: 4500,
      taxableIncome: 10500,
      estimatedTax: 2625
    },
    {
      quarter: 'Q2 2024',
      revenue: 18000,
      expenses: 5200,
      taxableIncome: 12800,
      estimatedTax: 3200
    }
  ];

  // Event handlers for new components
  const handleCreateInvoice = () => {
    console.log('Create new invoice');
  };

  const handleSendInvoice = (invoiceId: string) => {
    console.log('Send invoice:', invoiceId);
  };

  const handleViewInvoice = (invoiceId: string) => {
    console.log('View invoice:', invoiceId);
  };

  const handleAddExpense = () => {
    console.log('Add new expense');
  };

  const handleViewReceipt = (expenseId: string) => {
    console.log('View receipt:', expenseId);
  };

  const handleGenerateTaxReport = (period: 'quarterly' | 'yearly') => {
    console.log('Generate tax report:', period);
  };

  const handleDownloadTaxForms = () => {
    console.log('Download tax forms');
  };

  return (
    <div className="space-y-6">
      {/* Earnings Overview - Always visible */}
      <EarningsOverview earnings={earningsData} />

      {/* Enhanced Financial Management Tabs */}
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-white/10">
          <TabsTrigger value="payments" className="text-white data-[state=active]:bg-blue-500">
            Payments
          </TabsTrigger>
          <TabsTrigger value="processor" className="text-white data-[state=active]:bg-blue-500">
            Process
          </TabsTrigger>
          <TabsTrigger value="invoices" className="text-white data-[state=active]:bg-blue-500">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-white data-[state=active]:bg-blue-500">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-500">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-white data-[state=active]:bg-blue-500">
            Tax Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-white data-[state=active]:bg-blue-500">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-6">
          <PaymentHistory
            payments={paymentsData}
            onDownloadInvoice={onDownloadInvoice}
            onExportData={onExportPaymentData}
          />
        </TabsContent>

        <TabsContent value="processor" className="mt-6">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <InvoiceManagement
            invoices={invoicesData}
            onCreateInvoice={handleCreateInvoice}
            onSendInvoice={handleSendInvoice}
            onDownloadInvoice={onDownloadInvoice}
            onViewInvoice={handleViewInvoice}
          />
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <ExpenseTracking
            expenses={expensesData}
            onAddExpense={handleAddExpense}
            onViewReceipt={handleViewReceipt}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <FinancialAnalytics analytics={analyticsData} />
        </TabsContent>

        <TabsContent value="tax" className="mt-6">
          <TaxReporting
            taxData={taxData}
            onGenerateReport={handleGenerateTaxReport}
            onDownloadTaxForms={handleDownloadTaxForms}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <PayoutSettings
            payoutMethods={payoutMethods}
            currentSchedule={earningsData.payoutFrequency}
            onAddPayoutMethod={onAddPayoutMethod}
            onSetDefault={onSetDefaultPayout}
            onChangeSchedule={onChangePayoutSchedule}
            onRemoveMethod={onRemovePayoutMethod}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;
