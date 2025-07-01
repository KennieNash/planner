
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

interface ServiceArea {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // in kilometers
  travelFee: number;
}

interface ServiceAreaMapProps {
  serviceAreas: ServiceArea[];
  onServiceAreasChange: (areas: ServiceArea[]) => void;
  providerLocation?: { lat: number; lng: number; address: string } | null;
}

const ServiceAreaMap = ({ serviceAreas, onServiceAreasChange, providerLocation }: ServiceAreaMapProps) => {
  const [newArea, setNewArea] = useState<Partial<ServiceArea>>({
    name: '',
    radius: 25,
    travelFee: 0
  });
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const { toast } = useToast();

  const addServiceArea = () => {
    if (!newArea.name || !selectedLocation) {
      toast({
        title: "Incomplete Information",
        description: "Please provide area name and select location on map.",
        variant: "destructive",
      });
      return;
    }

    const area: ServiceArea = {
      id: Date.now().toString(),
      name: newArea.name,
      center: selectedLocation,
      radius: newArea.radius || 25,
      travelFee: newArea.travelFee || 0
    };

    onServiceAreasChange([...serviceAreas, area]);
    setNewArea({ name: '', radius: 25, travelFee: 0 });
    setSelectedLocation(null);
    setIsAddingArea(false);
    
    toast({
      title: "Service Area Added",
      description: `${area.name} has been added to your service areas.`,
    });
  };

  const removeServiceArea = (areaId: string) => {
    const updatedAreas = serviceAreas.filter(area => area.id !== areaId);
    onServiceAreasChange(updatedAreas);
    
    toast({
      title: "Service Area Removed",
      description: "Service area has been removed.",
    });
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="space-y-6">
      {/* Current Service Areas */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Service Areas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceAreas.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No service areas defined yet</p>
              <p className="text-sm">Add areas where you provide services</p>
            </div>
          ) : (
            <div className="space-y-3">
              {serviceAreas.map((area) => (
                <div key={area.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{area.name}</h4>
                    <div className="text-sm text-gray-300">
                      Radius: {area.radius}km
                      {area.travelFee > 0 && ` • Travel fee: $${area.travelFee}`}
                    </div>
                    <div className="text-xs text-gray-400">
                      {area.center.lat.toFixed(4)}, {area.center.lng.toFixed(4)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeServiceArea(area.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Service Area */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Add Service Area
            <Button
              variant="outline"
              onClick={() => setIsAddingArea(!isAddingArea)}
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Area
            </Button>
          </CardTitle>
        </CardHeader>
        
        {isAddingArea && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Area Name</Label>
              <Input
                type="text"
                placeholder="e.g., Downtown, City Center"
                value={newArea.name || ''}
                onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Service Radius: {newArea.radius}km</Label>
              <Slider
                value={[newArea.radius || 25]}
                onValueChange={(value) => setNewArea({ ...newArea, radius: value[0] })}
                max={100}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>5km</span>
                <span>100km</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Travel Fee (Optional)</Label>
              <Input
                type="number"
                placeholder="0"
                value={newArea.travelFee || ''}
                onChange={(e) => setNewArea({ ...newArea, travelFee: parseFloat(e.target.value) || 0 })}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            {/* Simple location picker placeholder */}
            <div className="space-y-2">
              <Label className="text-gray-300">Area Center</Label>
              <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center border border-white/20">
                <div className="text-center text-gray-400">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Click to select area center</p>
                  {selectedLocation && (
                    <p className="text-xs mt-2 text-blue-400">
                      Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Mock location selection for MVP
                  const mockLat = 0.3476 + (Math.random() - 0.5) * 0.1;
                  const mockLng = 32.5825 + (Math.random() - 0.5) * 0.1;
                  setSelectedLocation({ lat: mockLat, lng: mockLng });
                }}
                className="w-full border-white/30 text-white hover:bg-white/10"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Select Location (Demo)
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={addServiceArea}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Add Service Area
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddingArea(false)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ServiceAreaMap;
