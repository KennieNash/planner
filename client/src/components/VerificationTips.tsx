
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VerificationTips = () => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-400" />
          Verification Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-300 text-sm space-y-2">
          <p>• Ensure all documents are clear and readable</p>
          <p>• Upload documents in their original format when possible</p>
          <p>• Business license should be current and valid</p>
          <p>• Insurance certificate should cover liability and be current</p>
          <p>• Portfolio images should showcase your best work</p>
          <p>• Verification typically takes 1-2 business days</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationTips;
