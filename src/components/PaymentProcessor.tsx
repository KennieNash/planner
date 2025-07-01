import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Loader2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useProviderHandlers } from '@/hooks/useProviderHandlers';
import { toast } from 'sonner';

interface PaymentProcessorProps {
  amount: number;
  serviceId: string;
  customerId: string;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentCancel?: () => void;
}

type PaymentMethod = 'mtn' | 'airtel' | 'stripe';

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0
  }).format(amount);
};

const PaymentProcessor = ({ 
  amount, 
  serviceId,
  customerId,
  onPaymentSuccess, 
  onPaymentCancel 
}: PaymentProcessorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const { handleProcessPayment, handleConfirmPayment, handleCheckPaymentStatus } = useProviderHandlers();

  // Poll for payment status when in processing state
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (paymentStatus === 'processing' && transactionId) {
      intervalId = setInterval(async () => {
        const result = await handleCheckPaymentStatus(transactionId);
        if (result.success && result.status === 'completed') {
          setPaymentStatus('success');
          onPaymentSuccess?.(transactionId);
        } else if (result.success && result.status === 'failed') {
          setPaymentStatus('failed');
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paymentStatus, transactionId, handleCheckPaymentStatus, onPaymentSuccess]);

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^(256|0)[7-9][0-9]{8}$/;
    return phoneRegex.test(number.replace(/\s+/g, ''));
  };

  const validateCardDetails = () => {
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const cvvRegex = /^[0-9]{3,4}$/;

    return (
      cardNumberRegex.test(cardDetails.number.replace(/\s+/g, '')) &&
      expiryRegex.test(cardDetails.expiry) &&
      cvvRegex.test(cardDetails.cvv) &&
      cardDetails.name.trim().length > 0
    );
  };

  const handlePayment = async () => {
    if (selectedMethod === 'mtn' || selectedMethod === 'airtel') {
      if (!validatePhoneNumber(phoneNumber)) {
        toast.error('Please enter a valid phone number');
        return;
      }
    } else if (selectedMethod === 'stripe') {
      if (!validateCardDetails()) {
        toast.error('Please enter valid card details');
        return;
      }
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const result = await handleProcessPayment(amount, selectedMethod, phoneNumber);
      
      if (result.success && result.transactionId) {
        setTransactionId(result.transactionId);
        
        if (result.status === 'completed') {
          setPaymentStatus('success');
          onPaymentSuccess?.(result.transactionId);
        }
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <Card className="glass-card max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
          <p className="text-gray-300 mb-4">
            Your payment of {formatAmount(amount)} has been processed successfully.
          </p>
          <Button 
            onClick={() => setPaymentStatus('idle')} 
            className="bg-blue-500 hover:bg-blue-600"
          >
            Done
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <Card className="glass-card max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Payment Failed</h3>
          <p className="text-gray-300 mb-4">
            Something went wrong with your payment. Please try again.
          </p>
          <div className="space-x-2">
            <Button 
              onClick={() => setPaymentStatus('idle')} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              Try Again
            </Button>
            <Button 
              onClick={onPaymentCancel} 
              variant="ghost" 
              className="text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-center">Complete Payment</CardTitle>
        <div className="text-center">
          <Badge className="bg-blue-500 text-white text-lg px-4 py-2">
            {formatAmount(amount)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <Label className="text-gray-300 mb-3 block">Choose Payment Method</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={selectedMethod === 'mtn' ? 'default' : 'ghost'}
              onClick={() => setSelectedMethod('mtn')}
              className={`h-16 flex flex-col space-y-1 ${
                selectedMethod === 'mtn' ? 'bg-yellow-500 text-black' : 'text-gray-300'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-xs">MTN Money</span>
            </Button>
            
            <Button
              variant={selectedMethod === 'airtel' ? 'default' : 'ghost'}
              onClick={() => setSelectedMethod('airtel')}
              className={`h-16 flex flex-col space-y-1 ${
                selectedMethod === 'airtel' ? 'bg-red-500 text-white' : 'text-gray-300'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-xs">Airtel Money</span>
            </Button>
            
            <Button
              variant={selectedMethod === 'stripe' ? 'default' : 'ghost'}
              onClick={() => setSelectedMethod('stripe')}
              className={`h-16 flex flex-col space-y-1 ${
                selectedMethod === 'stripe' ? 'bg-purple-500 text-white' : 'text-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Card</span>
            </Button>
          </div>
        </div>

        {/* Mobile Money Form */}
        {(selectedMethod === 'mtn' || selectedMethod === 'airtel') && (
          <div>
            <Label htmlFor="phone" className="text-gray-300">
              {selectedMethod === 'mtn' ? 'MTN' : 'Airtel'} Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="256 7XX XXX XXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              You will receive a prompt on your phone to authorize the payment
            </p>
          </div>
        )}

        {/* Card Payment Form */}
        {selectedMethod === 'stripe' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardName" className="text-gray-300">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry" className="text-gray-300">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ${formatAmount(amount)}`
            )}
          </Button>
          
          <Button
            onClick={onPaymentCancel}
            variant="ghost"
            className="w-full text-gray-300 hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>

        {/* Security Notice */}
        <div className="text-xs text-gray-400 text-center">
          🔒 Your payment information is secure and encrypted
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
