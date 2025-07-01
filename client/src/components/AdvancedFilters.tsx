
import React, { useState } from 'react';
import { Filter, X, ChevronDown, MapPin, DollarSign, Star, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterOptions {
  categories: string[];
  priceRange: [number, number];
  location: string;
  radius: number;
  rating: number;
  availability: string[];
  verified: boolean;
  emergency: boolean;
  responseTime: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  isOpen, 
  onToggle 
}: AdvancedFiltersProps) => {
  const categories = [
    'Plumbing', 'Electrical', 'Cleaning', 'Gardening', 
    'Handyman', 'Moving', 'Tutoring', 'Pet Care', 
    'Home Repair', 'Painting', 'Carpentry', 'HVAC',
    'Roofing', 'Flooring', 'Kitchen', 'Bathroom'
  ];

  const availabilityOptions = [
    { value: 'today', label: 'Available today' },
    { value: 'this-week', label: 'This week' },
    { value: 'next-week', label: 'Next week' },
    { value: 'flexible', label: 'Flexible schedule' }
  ];

  const responseTimeOptions = [
    { value: 'immediate', label: 'Within 1 hour' },
    { value: 'fast', label: 'Within 4 hours' },
    { value: 'same-day', label: 'Same day' },
    { value: 'next-day', label: 'Next day' },
    { value: 'flexible', label: 'Flexible' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'price', label: 'Price' },
    { value: 'distance', label: 'Distance' },
    { value: 'reviews', label: 'Number of reviews' },
    { value: 'response-time', label: 'Response time' },
    { value: 'newest', label: 'Newest first' }
  ];

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: updatedCategories });
  };

  const handleAvailabilityToggle = (availability: string) => {
    const updatedAvailability = filters.availability.includes(availability)
      ? filters.availability.filter(a => a !== availability)
      : [...filters.availability, availability];
    
    onFiltersChange({ ...filters, availability: updatedAvailability });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.availability.length + 
    (filters.verified ? 1 : 0) + 
    (filters.emergency ? 1 : 0) + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.responseTime !== '' ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onToggle}
          className="border-white/30 text-white hover:bg-white/10"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Filter & Sort Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="text-white font-medium mb-3">Service Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={filters.categories.includes(category) ? 'default' : 'outline'}
                    className={`cursor-pointer transition-colors ${
                      filters.categories.includes(category)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'border-white/30 text-gray-300 hover:bg-white/20'
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
              <h4 className="text-white font-medium mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Price Range
              </h4>
              <div className="space-y-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}+</span>
                </div>
              </div>
            </div>

            {/* Location & Radius */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </h4>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">Search Radius</h4>
                <Select value={filters.radius.toString()} onValueChange={(value) => onFiltersChange({ ...filters, radius: parseInt(value) })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="25">25 miles</SelectItem>
                    <SelectItem value="50">50 miles</SelectItem>
                    <SelectItem value="100">100 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Minimum Rating
              </h4>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, rating: rating === filters.rating ? 0 : rating })}
                    className={`flex items-center space-x-1 ${
                      filters.rating >= rating ? 'text-yellow-400' : 'text-gray-400'
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
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Availability
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {availabilityOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleAvailabilityToggle(option.value)}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      filters.availability.includes(option.value)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-sm">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div>
              <h4 className="text-white font-medium mb-3">Response Time</h4>
              <Select value={filters.responseTime} onValueChange={(value) => onFiltersChange({ ...filters, responseTime: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Any response time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any response time</SelectItem>
                  {responseTimeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Filters */}
            <div>
              <h4 className="text-white font-medium mb-3">Quick Filters</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Verified providers only</span>
                  </div>
                  <Switch
                    checked={filters.verified}
                    onCheckedChange={(checked) => onFiltersChange({ ...filters, verified: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span className="text-gray-300">Emergency services</span>
                  </div>
                  <Switch
                    checked={filters.emergency}
                    onCheckedChange={(checked) => onFiltersChange({ ...filters, emergency: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-medium mb-3">Sort By</h4>
                <Select value={filters.sortBy} onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">Order</h4>
                <Select value={filters.sortOrder} onValueChange={(value) => onFiltersChange({ ...filters, sortOrder: value as 'asc' | 'desc' })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">High to Low</SelectItem>
                    <SelectItem value="asc">Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFilters;
