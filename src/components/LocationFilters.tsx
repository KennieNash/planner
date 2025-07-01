
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import LocationService from './LocationService';

interface LocationFiltersProps {
  currentLocation: { lat: number; lng: number; address: string } | null;
  radius: number;
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  onRadiusChange: (radius: number) => void;
  onClearLocation: () => void;
}

const LocationFilters = ({
  currentLocation,
  radius,
  onLocationChange,
  onRadiusChange,
  onClearLocation
}: LocationFiltersProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Location & Distance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Input */}
        <div className="space-y-2">
          <label className="text-gray-300 text-sm font-medium">Your Location</label>
          <LocationService
            onLocationChange={onLocationChange}
            currentLocation={currentLocation}
            placeholder="Enter your location to find nearby services"
          />
          {currentLocation && (
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-400 truncate flex-1 mr-2">
                {currentLocation.address}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearLocation}
                className="text-gray-400 hover:text-white hover:bg-white/10 text-xs"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Distance Radius */}
        {currentLocation && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-gray-300 text-sm font-medium">Search Radius</label>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {radius}km
              </Badge>
            </div>
            <Slider
              value={[radius]}
              onValueChange={(value) => onRadiusChange(value[0])}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1km</span>
              <span>100km</span>
            </div>
          </div>
        )}

        {/* Quick Distance Options */}
        {currentLocation && (
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium">Quick Options</label>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 25, 50].map((distance) => (
                <Button
                  key={distance}
                  variant={radius === distance ? "default" : "outline"}
                  size="sm"
                  onClick={() => onRadiusChange(distance)}
                  className={
                    radius === distance
                      ? "bg-blue-500 text-white"
                      : "border-white/30 text-gray-300 hover:bg-white/10"
                  }
                >
                  {distance}km
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Location Tips */}
        {!currentLocation && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Navigation className="w-4 h-4 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Find Services Near You</p>
                <p className="text-xs text-blue-200">
                  Set your location to discover service providers in your area and see accurate distances.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationFilters;
