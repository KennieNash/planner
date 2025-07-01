
import React, { useState } from 'react';
import { Search, Filter, MapPin, DollarSign, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import LocationFilters from './LocationFilters';
import { useLocationService } from '@/hooks/useLocationService';

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    searchQuery: string;
    categories: string[];
    priceRange: [number, number];
    location: { lat: number; lng: number; address: string } | null;
    radius: number;
    rating: number;
    availability: string;
  }) => void;
}

const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [radius, setRadius] = useState(25);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { currentLocation, setLocation, clearLocation } = useLocationService();

  const categories = [
    'Plumbing', 'Electrical', 'Cleaning', 'Gardening', 
    'Handyman', 'Moving', 'Tutoring', 'Pet Care', 
    'Home Repair', 'Painting', 'Carpentry', 'HVAC'
  ];

  const availabilityOptions = [
    { value: '', label: 'Any time' },
    { value: 'today', label: 'Available today' },
    { value: 'this-week', label: 'This week' },
    { value: 'emergency', label: 'Emergency services' }
  ];

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    updateFilters(updated);
  };

  const updateFilters = (categories = selectedCategories) => {
    onFiltersChange({
      searchQuery,
      categories,
      priceRange,
      location: currentLocation,
      radius,
      rating: minRating,
      availability
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilters();
  };

  const handleLocationChange = (location: { lat: number; lng: number; address: string }) => {
    setLocation(location);
    updateFilters();
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    updateFilters();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setRadius(25);
    setMinRating(0);
    setAvailability('');
    clearLocation();
    onFiltersChange({
      searchQuery: '',
      categories: [],
      priceRange: [0, 1000],
      location: null,
      radius: 25,
      rating: 0,
      availability: ''
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search for services..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Location Filters - Always visible for location-based search */}
      <LocationFilters
        currentLocation={currentLocation}
        radius={radius}
        onLocationChange={handleLocationChange}
        onRadiusChange={handleRadiusChange}
        onClearLocation={clearLocation}
      />

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          className="text-white hover:bg-white/20"
        >
          <Filter className="w-4 h-4 mr-2" />
          More Filters
          {(selectedCategories.length > 0 || minRating > 0 || availability) && (
            <Badge variant="secondary" className="ml-2">
              {selectedCategories.length + (minRating > 0 ? 1 : 0) + (availability ? 1 : 0)}
            </Badge>
          )}
        </Button>
        
        {(selectedCategories.length > 0 || searchQuery || minRating > 0 || availability || currentLocation) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-gray-300 hover:text-white hover:bg-white/20"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Additional Filter Panel */}
      {showFilters && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Additional Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="text-white font-medium mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? 'default' : 'secondary'}
                    className={`cursor-pointer transition-colors ${
                      selectedCategories.includes(category)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-white font-medium mb-3">Price Range</h4>
              <div className="space-y-3">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value as [number, number]);
                    updateFilters();
                  }}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}+</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-white font-medium mb-3">Minimum Rating</h4>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMinRating(rating === minRating ? 0 : rating);
                      updateFilters();
                    }}
                    className={`flex items-center space-x-1 ${
                      minRating >= rating ? 'text-yellow-400' : 'text-gray-400'
                    } hover:bg-white/20`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span>{rating}+</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h4 className="text-white font-medium mb-3">Availability</h4>
              <div className="space-y-2">
                {availabilityOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAvailability(option.value === availability ? '' : option.value);
                      updateFilters();
                    }}
                    className={`w-full justify-start ${
                      availability === option.value
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchFilters;
