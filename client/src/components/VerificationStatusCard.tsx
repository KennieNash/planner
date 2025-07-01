
import React from 'react';
import { Shield, CheckCircle, Clock, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VerificationStatusCardProps {
  verificationStatus: 'pending' | 'partial' | 'verified' | 'rejected';
}

const VerificationStatusCard = ({ verificationStatus }: VerificationStatusCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="outline" className="border-green-500 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'partial':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-400"><Clock className="w-3 h-3 mr-1" />Partially Verified</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-400"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="border-red-500 text-red-400"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-500 text-gray-400">Unknown</Badge>;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'verified':
        return '✅ Your account is fully verified! You can receive bookings and payments.';
      case 'partial':
        return '⚠️ Your account is partially verified. Complete all required documents to become fully verified.';
      case 'pending':
        return '⏳ Your verification is being reviewed. This typically takes 1-2 business days.';
      case 'rejected':
        return '❌ Some documents were rejected. Please review the feedback and resubmit.';
      default:
        return 'Unknown verification status.';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-400" />
            Provider Verification Status
          </div>
          {getStatusBadge(verificationStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-300">
          <p>{getStatusMessage(verificationStatus)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationStatusCard;
