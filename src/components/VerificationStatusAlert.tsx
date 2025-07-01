
import React from 'react';
import { AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VerificationStatusAlertProps {
  status: 'pending' | 'partial' | 'verified' | 'rejected';
  onViewDetails: () => void;
  onDismiss?: () => void;
}

const VerificationStatusAlert = ({ 
  status, 
  onViewDetails, 
  onDismiss 
}: VerificationStatusAlertProps) => {
  const getAlertConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          title: 'Verification In Progress',
          message: 'Your documents are being reviewed. This typically takes 1-2 business days.',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          textColor: 'text-yellow-400',
          iconColor: 'text-yellow-400'
        };
      case 'partial':
        return {
          icon: AlertTriangle,
          title: 'Complete Your Verification',
          message: 'You need to upload additional documents to become fully verified and start receiving bookings.',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/20',
          textColor: 'text-orange-400',
          iconColor: 'text-orange-400'
        };
      case 'rejected':
        return {
          icon: X,
          title: 'Verification Issues Found',
          message: 'Some of your documents were rejected. Please review the feedback and resubmit.',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          textColor: 'text-red-400',
          iconColor: 'text-red-400'
        };
      case 'verified':
        return {
          icon: CheckCircle,
          title: 'Verification Complete!',
          message: 'Your account is fully verified. You can now receive bookings and payments.',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          textColor: 'text-green-400',
          iconColor: 'text-green-400'
        };
      default:
        return null;
    }
  };

  const config = getAlertConfig();
  if (!config || status === 'verified') return null;

  const { icon: Icon, title, message, bgColor, borderColor, textColor, iconColor } = config;

  return (
    <Card className={`${bgColor} ${borderColor} border`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Icon className={`w-5 h-5 mt-0.5 ${iconColor}`} />
          <div className="flex-1">
            <h4 className={`font-medium ${textColor}`}>{title}</h4>
            <p className="text-gray-300 text-sm mt-1">{message}</p>
            <div className="flex items-center space-x-2 mt-3">
              <Button
                size="sm"
                onClick={onViewDetails}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                View Details
              </Button>
              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDismiss}
                  className="text-gray-400 hover:text-gray-300"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatusAlert;
