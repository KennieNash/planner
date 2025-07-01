
import React, { useState } from 'react';
import { Save, User, MapPin, Bell, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import PersonalInfoForm from './PersonalInfoForm';
import ProviderLocationSettings from './ProviderLocationSettings';
import NotificationSettings from './NotificationSettings';
import PaymentManagement from './PaymentManagement';
import ProviderVerificationManagement from './ProviderVerificationManagement';
import { useVerificationManagement } from '@/hooks/useVerificationManagement';

interface ProviderSettingsProps {
  userProfile: {
    id: string;
    name: string;
    email: string;
    businessName: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    bio?: string;
    company?: string;
    website?: string;
  };
  onUpdate: (data: any) => void;
}

const ProviderSettings = ({ userProfile, onUpdate }: ProviderSettingsProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  
  const {
    documents,
    verificationStatus,
    isLoading,
    uploadDocumentHandler,
    removeDocumentHandler
  } = useVerificationManagement();

  // Mock location data for ProviderLocationSettings
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    address: '123 Main St, City, State 12345'
  });

  const [serviceAreas, setServiceAreas] = useState([
    { 
      id: '1', 
      name: 'Downtown', 
      center: { lat: 40.7128, lng: -74.0060 },
      radius: 10,
      travelFee: 25
    },
    { 
      id: '2', 
      name: 'Suburbs', 
      center: { lat: 40.7580, lng: -73.9855 },
      radius: 25,
      travelFee: 50
    }
  ]);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleLocationChange = (location: { lat: number; lng: number; address: string }) => {
    setCurrentLocation(location);
  };

  const handleServiceAreasChange = (areas: any) => {
    setServiceAreas(areas);
  };

  // Transform userProfile to match PersonalInfoForm expected format
  const personalInfoProfile = {
    firstName: userProfile.firstName || userProfile.name.split(' ')[0] || '',
    lastName: userProfile.lastName || userProfile.name.split(' ').slice(1).join(' ') || '',
    email: userProfile.email,
    phone: userProfile.phone || '',
    address: userProfile.address || '',
    bio: userProfile.bio || '',
    company: userProfile.company || userProfile.businessName || '',
    website: userProfile.website || ''
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Provider Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/10">
              <TabsTrigger value="personal" className="text-white data-[state=active]:bg-blue-500">
                <User className="w-4 h-4 mr-2" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="verification" className="text-white data-[state=active]:bg-blue-500">
                <Shield className="w-4 h-4 mr-2" />
                Verification
              </TabsTrigger>
              <TabsTrigger value="location" className="text-white data-[state=active]:bg-blue-500">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-blue-500">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="payment" className="text-white data-[state=active]:bg-blue-500">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <PersonalInfoForm
                userProfile={personalInfoProfile}
                userType="provider"
                onUpdate={onUpdate}
              />
            </TabsContent>

            <TabsContent value="verification" className="mt-6">
              <ProviderVerificationManagement
                verificationStatus={verificationStatus}
                documents={documents}
                onDocumentUpload={uploadDocumentHandler}
                onDocumentRemove={removeDocumentHandler}
              />
            </TabsContent>

            <TabsContent value="location" className="mt-6">
              <ProviderLocationSettings
                currentLocation={currentLocation}
                serviceAreas={serviceAreas}
                onLocationChange={handleLocationChange}
                onServiceAreasChange={handleServiceAreasChange}
              />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <PaymentManagement />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderSettings;
