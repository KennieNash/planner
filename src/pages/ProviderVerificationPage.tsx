
import React from 'react';
import { Shield } from 'lucide-react';
import ProviderVerificationManagement from '@/components/ProviderVerificationManagement';

const ProviderVerificationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-400" />
              Provider Verification
            </h1>
            <p className="text-gray-300 text-sm">Manage your verification documents and status</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <ProviderVerificationManagement />
      </div>
    </div>
  );
};

export default ProviderVerificationPage;
