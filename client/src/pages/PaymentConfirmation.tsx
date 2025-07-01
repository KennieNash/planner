import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentConfirmation = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Mock search params for development
  const searchParams = new URLSearchParams(window.location.search);
  
  const transactionId = searchParams.get('transactionId');
  const serviceId = searchParams.get('serviceId');
  const amountParam = searchParams.get('amount');
  
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [isConfirming, setIsConfirming] = useState(false);

  // Validate required parameters
  useEffect(() => {
    if (!transactionId || !serviceId || !amountParam) {
      toast({
        title: "Payment Error",
        description: "Missing required payment information",
        variant: "destructive"
      });
      setLocation('/services');
    }
  }, [transactionId, serviceId, amountParam, setLocation, toast]);

  const handleConfirm = async () => {
    if (!transactionId) return;

    setIsConfirming(true);
    try {
      // Mock payment confirmation
      setTimeout(() => {
        setStatus('completed');
        toast({
          title: "Payment Confirmed",
          description: "Payment confirmed successfully"
        });
        // Redirect to bookings after a short delay
        setTimeout(() => {
          setLocation('/customer-dashboard');
        }, 2000);
        setIsConfirming(false);
      }, 1000);
    } catch (error) {
      setStatus('failed');
      toast({
        title: "Payment Failed",
        description: "An error occurred while confirming payment",
        variant: "destructive"
      });
      setIsConfirming(false);
    }
  };

  const formatAmount = (amount: string | null): string => {
    if (!amount) return '$0';
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return '$0';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
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
            <Button onClick={() => setLocation('/customer-dashboard')}>
              View Dashboard
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
              There was an issue confirming your payment. Please try again.
            </p>
            <Button onClick={() => setLocation('/payment')} variant="outline" className="mr-2">
              Try Again
            </Button>
            <Button onClick={() => setLocation('/services')}>
              Return to Services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Confirmation</CardTitle>
          <CardDescription>
            Confirming your payment of {formatAmount(amountParam)}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-muted-foreground mb-4">
            Please wait while we confirm your payment...
          </p>
          <Button 
            onClick={handleConfirm} 
            disabled={isConfirming}
            className="w-full"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              'Confirm Payment'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmation;