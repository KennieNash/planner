
import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VerificationDocument } from '@/types/verification';

interface VerificationProgressProps {
  documents: VerificationDocument[];
  verificationStatus: 'pending' | 'partial' | 'verified' | 'rejected';
}

const VerificationProgress = ({ documents, verificationStatus }: VerificationProgressProps) => {
  const requiredDocTypes = ['license', 'insurance'];
  const optionalDocTypes = ['certification', 'portfolio'];
  
  const getDocumentsByType = (type: string) => {
    return documents.filter(doc => doc.type === type);
  };

  const hasRequiredDoc = (type: string) => {
    const docs = getDocumentsByType(type);
    return docs.some(doc => doc.status === 'approved');
  };

  const hasSubmittedDoc = (type: string) => {
    return getDocumentsByType(type).length > 0;
  };

  const getDocumentStatus = (type: string) => {
    const docs = getDocumentsByType(type);
    if (docs.some(doc => doc.status === 'approved')) return 'approved';
    if (docs.some(doc => doc.status === 'pending')) return 'pending';
    if (docs.some(doc => doc.status === 'rejected')) return 'rejected';
    return 'missing';
  };

  const requiredCompleted = requiredDocTypes.filter(type => hasRequiredDoc(type)).length;
  const totalRequired = requiredDocTypes.length;
  const progressPercentage = (requiredCompleted / totalRequired) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'rejected':
        return <Circle className="w-4 h-4 text-red-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Submitted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Verification Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Required Documents</span>
            <span className="text-white">{requiredCompleted}/{totalRequired}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-gray-400">
            {progressPercentage === 100 
              ? 'All required documents approved!' 
              : `${totalRequired - requiredCompleted} required documents remaining`
            }
          </p>
        </div>

        {/* Required Documents */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Required Documents</h4>
          {requiredDocTypes.map((type) => {
            const status = getDocumentStatus(type);
            const title = type === 'license' ? 'Business License' : 'Insurance Certificate';
            
            return (
              <div key={type} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <span className="text-white text-sm">{title}</span>
                </div>
                <span className={`text-xs ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Optional Documents */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Optional Documents</h4>
          {optionalDocTypes.map((type) => {
            const status = getDocumentStatus(type);
            const title = type === 'certification' ? 'Certifications' : 'Portfolio';
            
            return (
              <div key={type} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <span className="text-white text-sm">{title}</span>
                </div>
                <span className={`text-xs ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-xs">
            {verificationStatus === 'verified' && '✅ Your account is fully verified!'}
            {verificationStatus === 'partial' && '⚠️ Complete required documents to become verified.'}
            {verificationStatus === 'pending' && '⏳ Your documents are being reviewed.'}
            {verificationStatus === 'rejected' && '❌ Some documents need attention.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationProgress;
