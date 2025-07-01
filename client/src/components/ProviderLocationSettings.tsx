
import React, { useState } from 'react';
import { MapPin, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import LocationService from './LocationService';
import ServiceAreaMap from './ServiceAreaMap';

interface ServiceArea {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number;
  travelFee: number;
}

interface ProviderLocationSettingsProps {
  currentLocation: { lat: number; lng: number; address: string } | null;
  serviceAreas: ServiceArea[];
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  onServiceAreasChange: (areas: ServiceArea[]) => void;
}

const ProviderLocationSettings = ({
  currentLocation,
  serviceAreas,
  onLocationChange,
  onServiceAreasChange
}: ProviderLocationSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate saving to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Location Settings Saved",
      description: "Your location and service areas have been updated.",
    });
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Primary Business Location */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Business Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium">
              Primary Business Address
            </label>
            <LocationService
              onLocationChange={onLocationChange}
              currentLocation={currentLocation}
              placeholder="Enter your business address"
            />
            <p className="text-xs text-gray-400">
              This will be your primary location for distance calculations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Service Areas */}
      <ServiceAreaMap
        serviceAreas={serviceAreas}
        onServiceAreasChange={onServiceAreasChange}
        providerLocation={currentLocation}
      />

      {/* Save Button */}
      <Button
        onClick={handleSaveSettings}
        disabled={isLoading || !currentLocation}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        <Save className="w-4 h-4 mr-2" />
        {isLoading ? 'Saving Settings...' : 'Save Location Settings'}
      </Button>
    </div>
  );
};

export default ProviderLocationSettings;
