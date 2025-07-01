import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentProcessor from "@/components/PaymentProcessor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const amount = searchParams.get("amount");
  const serviceId = searchParams.get("serviceId");

  // Validate required parameters
  if (!amount || !serviceId || !user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Invalid Payment</CardTitle>
            <CardDescription>
              Missing required payment information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/services")}>
              Return to Services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Invalid Amount</CardTitle>
            <CardDescription>
              The payment amount is invalid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/services")}>
              Return to Services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePaymentSuccess = (txId: string) => {
    setTransactionId(txId);
    setShowConfirmation(true);
    // Redirect to confirmation page with necessary parameters
    navigate(`/payment/confirm?transactionId=${txId}&serviceId=${serviceId}&amount=${amount}`);
  };

  const handlePaymentCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-8">
      <PaymentProcessor
        amount={parsedAmount}
        serviceId={serviceId}
        customerId={user.id}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentCancel={handlePaymentCancel}
      />
    </div>
  );
} 