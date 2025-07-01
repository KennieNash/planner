import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Search, Filter } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface ServiceSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  location: {
    lat: number;
    lng: number;
  };
  radius: number;
  priceRange: [number, number];
  rating: number;
  category: string;
}

export default function ServiceSearch({ onSearch }: ServiceSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: { lat: 0, lng: 0 },
    radius: 10,
    priceRange: [0, 1000],
    rating: 0,
    category: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setFilters((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFilters((prev) => ({
      ...prev,
      location: { lat, lng },
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for services..."
            value={filters.query}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, query: e.target.value }))
            }
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price Range</Label>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={filters.priceRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                }
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.rating === rating ? "default" : "outline"}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, rating }))
                    }
                    className="flex-1"
                  >
                    {rating}+
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="h-[300px] rounded-lg overflow-hidden">
              {userLocation && (
                <MapContainer
                  center={userLocation}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker
                    position={userLocation}
                    onLocationSelect={handleLocationSelect}
                  />
                </MapContainer>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Search Radius (km)</Label>
            <Slider
              min={1}
              max={50}
              step={1}
              value={[filters.radius]}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, radius: value[0] }))
              }
            />
            <div className="text-sm text-gray-500 text-right">
              {filters.radius} km
            </div>
          </div>
        </Card>
      )}

      <Button onClick={handleSearch} className="w-full">
        Search Services
      </Button>
    </div>
  );
}

interface LocationMarkerProps {
  position: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onLocationSelect }: LocationMarkerProps) {
  const map = useMap();

  useEffect(() => {
    map.on("click", (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    });
  }, [map, onLocationSelect]);

  return (
    <Marker position={position}>
      <Popup>
        <div className="text-sm">
          <p>Selected Location</p>
          <p className="text-gray-500">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
} 