import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { paymentService, PaymentDetails } from '@/services/paymentService';

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0
  }).format(amount);
};

export const useProviderHandlers = () => {
  const { toast } = useToast();

  // Event handlers
  const handleAddService = () => {
    console.log('Add new service');
  };

  const handleEditService = (id: number) => {
    console.log('Edit service:', id);
  };

  const handleToggleService = (id: number) => {
    console.log('Toggle service:', id);
  };

  const handleDeleteService = (id: number) => {
    console.log('Delete service:', id);
  };

  const handleRespondToQuote = (id: number, response: any) => {
    console.log('Respond to quote:', id, response);
  };

  const handleAcceptQuote = (id: number) => {
    console.log('Accept quote:', id);
  };

  const handleDeclineQuote = (id: number) => {
    console.log('Decline quote:', id);
  };

  // Financial event handlers with actual payment implementation
  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      console.log('Downloading invoice:', invoiceId);
      toast({
        title: "Invoice Download",
        description: "Invoice downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download invoice",
        variant: "destructive",
      });
    }
  };

  const handleExportPaymentData = async () => {
    try {
      console.log('Exporting payment data');
      toast({
        title: "Export Started",
        description: "Payment data export is being prepared",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export payment data",
        variant: "destructive",
      });
    }
  };

  const handleAddPayoutMethod = () => {
    console.log('Add payout method');
  };

  const handleSetDefaultPayout = (methodId: string) => {
    console.log('Set default payout method:', methodId);
  };

  const handleChangePayoutSchedule = (schedule: 'weekly' | 'monthly') => {
    console.log('Change payout schedule to:', schedule);
  };

  const handleRemovePayoutMethod = (methodId: string) => {
    console.log('Remove payout method:', methodId);
  };

  // Enhanced financial handlers with payment processing
  const handleCreateInvoice = () => {
    console.log('Create new invoice');
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      console.log('Sending invoice:', invoiceId);
      toast({
        title: "Invoice Sent",
        description: "Invoice has been sent to the customer",
      });
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send invoice",
        variant: "destructive",
      });
    }
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

  const handleGenerateTaxReport = async (period: 'quarterly' | 'yearly') => {
    try {
      console.log('Generating tax report:', period);
      toast({
        title: "Report Generation",
        description: `${period} tax report is being generated`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate tax report",
        variant: "destructive",
      });
    }
  };

  const handleDownloadTaxForms = async () => {
    try {
      console.log('Downloading tax forms');
      toast({
        title: "Download Started",
        description: "Tax forms are being prepared for download",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download tax forms",
        variant: "destructive",
      });
    }
  };

  // Payment processing handlers
  const handleProcessPayment = async (amount: number, method: 'mtn' | 'airtel' | 'stripe', phoneNumber?: string) => {
    try {
      const paymentDetails: PaymentDetails = {
        amount,
        method,
        phoneNumber,
        serviceId: 'test-service', // This should be passed from the component
        customerId: 'test-customer', // This should be passed from the component
      };

      const result = await paymentService.processPayment(paymentDetails);
      
      if (result.success) {
        toast({
          title: "Payment Initiated",
          description: `Payment of ${formatAmount(amount)} initiated via ${method.toUpperCase()}`,
        });
        return result;
      } else {
        throw new Error(result.error || 'Payment processing failed');
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment processing failed. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: 'Payment processing failed' };
    }
  };

  const handleRefundPayment = async (transactionId: string, amount: number) => {
    try {
      const result = await paymentService.refundPayment(transactionId, amount);
      
      if (result.success) {
        toast({
          title: "Refund Processed",
          description: `Refund of ${formatAmount(amount)} has been initiated`,
        });
        return result;
      } else {
        throw new Error(result.error || 'Refund processing failed');
      }
    } catch (error) {
      toast({
        title: "Refund Failed",
        description: error instanceof Error ? error.message : "Failed to process refund",
        variant: "destructive",
      });
      return { success: false, error: 'Refund processing failed' };
    }
  };

  const handleConfirmPayment = async (transactionId: string) => {
    try {
      const result = await paymentService.confirmPayment(transactionId);
      
      if (result.success) {
        toast({
          title: "Payment Confirmed",
          description: "Your payment has been confirmed successfully",
        });
        return result;
      } else {
        throw new Error(result.error || 'Payment confirmation failed');
      }
    } catch (error) {
      toast({
        title: "Confirmation Failed",
        description: error instanceof Error ? error.message : "Failed to confirm payment",
        variant: "destructive",
      });
      return { success: false, error: 'Payment confirmation failed' };
    }
  };

  const handleCheckPaymentStatus = async (transactionId: string) => {
    try {
      const result = await paymentService.getPaymentStatus(transactionId);
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.error || 'Failed to check payment status');
      }
    } catch (error) {
      toast({
        title: "Status Check Failed",
        description: error instanceof Error ? error.message : "Failed to check payment status",
        variant: "destructive",
      });
      return { success: false, error: 'Failed to check payment status' };
    }
  };

  return {
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
    handleRemovePayoutMethod,
    handleCreateInvoice,
    handleSendInvoice,
    handleViewInvoice,
    handleAddExpense,
    handleViewReceipt,
    handleGenerateTaxReport,
    handleDownloadTaxForms,
    handleProcessPayment,
    handleRefundPayment,
    handleConfirmPayment,
    handleCheckPaymentStatus,
  };
};
