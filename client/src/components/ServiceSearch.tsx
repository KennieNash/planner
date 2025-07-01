import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Search, Filter } from "lucide-react";

interface ServiceSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  query: string;
  location: { lat: number; lng: number };
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

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search for services..."
            value={filters.query}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, query: e.target.value }))
            }
            className="w-full"
          />
        </div>
        <Button onClick={handleSearch} className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search
        </Button>
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
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <Input
                  id="location"
                  placeholder="Enter location..."
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="radius">Radius: {filters.radius} miles</Label>
              <Slider
                id="radius"
                min={1}
                max={50}
                step={1}
                value={[filters.radius]}
                onValueChange={([value]) =>
                  setFilters((prev) => ({ ...prev, radius: value }))
                }
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="priceRange">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Label>
              <Slider
                id="priceRange"
                min={0}
                max={1000}
                step={10}
                value={filters.priceRange}
                onValueChange={([min, max]) =>
                  setFilters((prev) => ({ ...prev, priceRange: [min, max] }))
                }
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="rating">Minimum Rating: {filters.rating}</Label>
              <Slider
                id="rating"
                min={0}
                max={5}
                step={0.5}
                value={[filters.rating]}
                onValueChange={([value]) =>
                  setFilters((prev) => ({ ...prev, rating: value }))
                }
                className="w-full"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}