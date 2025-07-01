import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X } from 'lucide-react';
import { useProviderHandlers } from '@/hooks/useProviderHandlers';
import { toast } from 'sonner';

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleConfirmPayment, handleCheckPaymentStatus } = useProviderHandlers();
  
  const transactionId = searchParams.get('transactionId');
  const serviceId = searchParams.get('serviceId');
  const amountParam = searchParams.get('amount');
  
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [isConfirming, setIsConfirming] = useState(false);

  // Validate required parameters
  useEffect(() => {
    if (!transactionId || !serviceId || !amountParam) {
      toast.error('Missing required payment information');
      navigate('/services');
    }
  }, [transactionId, serviceId, amountParam, navigate]);

  useEffect(() => {
    if (!transactionId) return;

    const checkStatus = async () => {
      const result = await handleCheckPaymentStatus(transactionId);
      if (result.success) {
        setStatus(result.status || 'pending');
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 5000);

    return () => clearInterval(intervalId);
  }, [transactionId, handleCheckPaymentStatus]);

  const handleConfirm = async () => {
    if (!transactionId) return;

    setIsConfirming(true);
    try {
      const result = await handleConfirmPayment(transactionId);
      if (result.success) {
        setStatus('completed');
        toast.success('Payment confirmed successfully');
        // Redirect to booking details or dashboard after a short delay
        setTimeout(() => {
          navigate('/bookings');
        }, 2000);
      } else {
        setStatus('failed');
        toast.error('Failed to confirm payment');
      }
    } catch (error) {
      setStatus('failed');
      toast.error('An error occurred while confirming payment');
    } finally {
      setIsConfirming(false);
    }
  };

  const formatAmount = (amount: string | null): string => {
    if (!amount) return '0 UGX';
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return '0 UGX';
    
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(parsedAmount);
  };

  if (!transactionId || !serviceId || !amountParam) {
    return null; // Will be redirected by the useEffect
  }

  if (status === 'completed') {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Confirmed!</h3>
            <p className="text-muted-foreground mb-4">
              Your payment of {formatAmount(amountParam)} has been confirmed.
            </p>
            <Button onClick={() => navigate('/bookings')}>
              View Booking
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't confirm your payment. Please try again or contact support.
            </p>
            <div className="space-x-2">
              <Button onClick={() => navigate(-1)}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/support')}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Confirm Payment</CardTitle>
          <CardDescription>
            Please confirm that you have completed the payment on your mobile money app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              {formatAmount(amountParam)}
            </div>
            <p className="text-sm text-muted-foreground">
              Transaction ID: {transactionId}
            </p>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isConfirming}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Confirming...
                </>
              ) : (
                "I've Completed the Payment"
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            🔒 Your payment information is secure and encrypted
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmation; 