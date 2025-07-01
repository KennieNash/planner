
import React, { useState } from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VerificationStatusAlert from './VerificationStatusAlert';
import { useVerificationManagement } from '@/hooks/useVerificationManagement';

const ProviderDashboardHeader = () => {
  const [showVerificationAlert, setShowVerificationAlert] = useState(true);
  const { verificationStatus } = useVerificationManagement();

  const handleViewVerificationDetails = () => {
    // This would navigate to the settings tab with verification section
    const settingsTab = document.querySelector('[value="settings"]');
    if (settingsTab) {
      (settingsTab as HTMLElement).click();
      // Also switch to verification tab within settings
      setTimeout(() => {
        const verificationTab = document.querySelector('[value="verification"]');
        if (verificationTab) {
          (verificationTab as HTMLElement).click();
        }
      }, 100);
    }
  };

  const handleDismissAlert = () => {
    setShowVerificationAlert(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden text-white">
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Provider Dashboard</h1>
            <p className="text-gray-300 text-sm">Manage your services and bookings</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-white relative">
            <Bell className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </Button>
          <Button variant="ghost" size="sm" className="text-white">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Verification Status Alert */}
      {showVerificationAlert && verificationStatus !== 'verified' && (
        <div className="px-4 pb-4">
          <VerificationStatusAlert
            status={verificationStatus}
            onViewDetails={handleViewVerificationDetails}
            onDismiss={handleDismissAlert}
          />
        </div>
      )}
    </div>
  );
};

export default ProviderDashboardHeader;
