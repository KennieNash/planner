import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, MapPin, Grid, List, ArrowLeft, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdvancedFilters from '@/components/AdvancedFilters';
import SearchResults from '@/components/SearchResults';
import SortOptions from '@/components/SortOptions';
import ServiceSearch from "@/components/ServiceSearch";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  provider: {
    name: string;
    rating: number;
    reviewCount: number;
    location: string;
    avatar: string;
    verified: boolean;
  };
  price: {
    type: 'fixed' | 'hourly' | 'quote';
    amount?: number;
    range?: { min: number; max: number };
  };
  image: string;
  tags: string[];
  isEmergency: boolean;
  responseTime: string;
  distance?: number;
  rating: number;
  location: {
    lat: number;
    lng: number;
  };
}

const mockServices: Service[] = [
  {
    id: '1',
    title: 'Professional House Cleaning',
    description: 'Deep cleaning service for your entire home. Eco-friendly products used.',
    category: 'Cleaning',
    provider: {
      name: 'Sarah Johnson',
      rating: 4.9,
      reviewCount: 127,
      location: 'Downtown',
      avatar: '/placeholder.svg',
      verified: true
    },
    price: { type: 'hourly', amount: 35 },
    image: '/placeholder.svg',
    tags: ['Eco-friendly', 'Insured', 'Same-day'],
    isEmergency: false,
    responseTime: '2 hours',
    distance: 2.5,
    rating: 4.9,
    location: {
      lat: 0,
      lng: 0
    }
  },
  {
    id: '2',
    title: 'Emergency Plumbing Repair',
    description: 'Fast and reliable plumbing services available 24/7.',
    category: 'Plumbing',
    provider: {
      name: 'Mike Rodriguez',
      rating: 4.8,
      reviewCount: 89,
      location: 'Citywide',
      avatar: '/placeholder.svg',
      verified: true
    },
    price: { type: 'quote' },
    image: '/placeholder.svg',
    tags: ['24/7', 'Licensed', 'Emergency'],
    isEmergency: true,
    responseTime: '30 minutes',
    distance: 1.2,
    rating: 4.8,
    location: {
      lat: 0,
      lng: 0
    }
  },
  {
    id: '3',
    title: 'Garden Landscaping',
    description: 'Transform your outdoor space with professional landscaping.',
    category: 'Gardening',
    provider: {
      name: 'Green Thumb Co.',
      rating: 4.7,
      reviewCount: 56,
      location: 'Suburbs',
      avatar: '/placeholder.svg',
      verified: false
    },
    price: { type: 'fixed', range: { min: 200, max: 800 } },
    image: '/placeholder.svg',
    tags: ['Design', 'Maintenance', 'Consultation'],
    isEmergency: false,
    responseTime: '1 day',
    distance: 5.8,
    rating: 4.7,
    location: {
      lat: 0,
      lng: 0
    }
  },
  {
    id: '4',
    title: 'Electrical Installation',
    description: 'Licensed electrician for all your electrical needs.',
    category: 'Electrical',
    provider: {
      name: 'PowerFix Electric',
      rating: 4.6,
      reviewCount: 203,
      location: 'Metro Area',
      avatar: '/placeholder.svg',
      verified: true
    },
    price: { type: 'hourly', amount: 85 },
    image: '/placeholder.svg',
    tags: ['Licensed', 'Insured', 'Certified'],
    isEmergency: true,
    responseTime: '4 hours',
    distance: 3.2,
    rating: 4.6,
    location: {
      lat: 0,
      lng: 0
    }
  }
];

const categories = [
  'All', 'Cleaning', 'Plumbing', 'Electrical', 'Handyman', 
  'Gardening', 'Pet Care', 'Tutoring', 'Moving', 'Painting'
];

const Services = () => {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 1000] as [number, number],
    location: '',
    radius: 25,
    rating: 0,
    availability: [] as string[],
    verified: false,
    emergency: false,
    responseTime: '',
    sortBy: 'rating',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  const filteredServices = useMemo(() => {
    let services = mockServices.filter(service => {
      // Basic search
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
      
      // Advanced filters
      const matchesCategories = filters.categories.length === 0 || 
                               filters.categories.includes(service.category);
      
      const matchesRating = filters.rating === 0 || service.provider.rating >= filters.rating;
      
      const matchesVerified = !filters.verified || service.provider.verified;
      
      const matchesEmergency = !filters.emergency || service.isEmergency;
      
      const matchesPrice = (() => {
        if (service.price.type === 'quote') return true;
        if (service.price.type === 'hourly' && service.price.amount) {
          return service.price.amount >= filters.priceRange[0] && 
                 service.price.amount <= filters.priceRange[1];
        }
        if (service.price.type === 'fixed' && service.price.range) {
          return service.price.range.min <= filters.priceRange[1] && 
                 service.price.range.max >= filters.priceRange[0];
        }
        return true;
      })();

      return matchesSearch && matchesCategory && matchesCategories && 
             matchesRating && matchesVerified && matchesEmergency && matchesPrice;
    });

    // Sorting
    services.sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'rating':
          return (b.provider.rating - a.provider.rating) * order;
        case 'price':
          const aPrice = a.price.amount || (a.price.range ? a.price.range.min : 0);
          const bPrice = b.price.amount || (b.price.range ? b.price.range.min : 0);
          return (aPrice - bPrice) * order;
        case 'distance':
          return ((a.distance || 0) - (b.distance || 0)) * order;
        case 'reviews':
          return (b.provider.reviewCount - a.provider.reviewCount) * order;
        case 'response-time':
          // Simple response time sorting (would need better logic in real app)
          const responseOrder = { 'minutes': 1, 'hour': 2, 'day': 3 };
          return 0; // Placeholder
        default:
          return 0;
      }
    });

    return services;
  }, [searchTerm, selectedCategory, filters]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      location: '',
      radius: 25,
      rating: 0,
      availability: [],
      verified: false,
      emergency: false,
      responseTime: '',
      sortBy: 'rating',
      sortOrder: 'desc'
    });
    setSelectedCategory('All');
    setSearchTerm('');
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const handleSearch = async (filters: any) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/services/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/" className="text-white hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Browse Services</h1>
            <p className="text-gray-300">Find the perfect service provider for your needs</p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="glass-card text-white mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="lg:w-48 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => handleFiltersChange({ ...filters, location: e.target.value })}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex border border-white/30 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-blue-500' : 'text-gray-300 hover:bg-white/10'}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-blue-500' : 'text-gray-300 hover:bg-white/10'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'border-white/30 text-gray-300 hover:bg-white/10'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Advanced Filters */}
        <AdvancedFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          isOpen={showAdvancedFilters}
          onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
        />

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <div className="text-gray-300">
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
          </div>
          <SortOptions
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Search Results */}
        <ServiceSearch onSearch={handleSearch} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <Badge variant="secondary">{service.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{service.distance?.toFixed(1)} km away</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>{service.provider.rating.toFixed(1)} ({Math.floor(Math.random() * 100)} reviews)</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{service.responseTime}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  ${service.price.amount || (service.price.range ? service.price.range.min : 0)}
                  <span className="text-sm text-muted-foreground">/hour</span>
                </div>
                <Button onClick={() => setLocation(`/provider/${service.id}`)}>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Searching for services...</p>
          </div>
        )}

        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No services found. Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
