
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface LocationServiceProps {
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  currentLocation?: { lat: number; lng: number; address: string } | null;
  placeholder?: string;
}

const LocationService = ({ onLocationChange, currentLocation, placeholder = "Enter your location" }: LocationServiceProps) => {
  const [address, setAddress] = useState(currentLocation?.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ address: string; lat: number; lng: number }>>([]);
  const { toast } = useToast();

  // Get current GPS location
  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: data.display_name || `${latitude}, ${longitude}`
          };
          
          setAddress(locationData.address);
          onLocationChange(locationData);
          
          toast({
            title: "Location Found",
            description: "Your current location has been detected.",
          });
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: `${latitude}, ${longitude}`
          };
          
          setAddress(locationData.address);
          onLocationChange(locationData);
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location Error",
          description: "Unable to get your current location. Please enter manually.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    );
  };

  // Search for address suggestions
  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      const locationSuggestions = data.map((item: any) => ({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));
      
      setSuggestions(locationSuggestions);
    } catch (error) {
      console.error('Geocoding error:', error);
      setSuggestions([]);
    }
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    searchAddress(value);
  };

  const selectSuggestion = (suggestion: { address: string; lat: number; lng: number }) => {
    setAddress(suggestion.address);
    setSuggestions([]);
    onLocationChange(suggestion);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
          
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="p-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0"
                >
                  <div className="text-white text-sm">{suggestion.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="border-white/30 text-white hover:bg-white/10"
        >
          <Navigation className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default LocationService;
