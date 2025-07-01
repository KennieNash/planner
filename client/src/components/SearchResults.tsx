
import React from 'react';
import { MapPin, Star, Clock, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
}

interface SearchResultsProps {
  services: Service[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  onServiceClick: (serviceId: string) => void;
  onProviderClick: (providerId: string) => void;
}

const SearchResults = ({ 
  services, 
  loading, 
  viewMode, 
  onServiceClick, 
  onProviderClick 
}: SearchResultsProps) => {
  const formatPrice = (price: Service['price']) => {
    if (price.type === 'quote') return 'Get Quote';
    if (price.type === 'hourly') return `$${price.amount}/hr`;
    if (price.type === 'fixed' && price.range) return `$${price.range.min}-${price.range.max}`;
    return `$${price.amount}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="glass-card animate-pulse">
            <div className="h-48 bg-white/10 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-white/10 rounded w-20"></div>
                <div className="h-3 bg-white/10 rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">No services found</h3>
        <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
        <Button className="bg-blue-500 hover:bg-blue-600">
          Browse All Services
        </Button>
      </div>
    );
  }

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card className="glass-card text-white hover:scale-105 transition-all duration-300 cursor-pointer">
      <div className="relative">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {service.provider.verified && (
            <Badge className="bg-green-500/90 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {service.isEmergency && (
            <Badge className="bg-red-500/90 text-white">
              <Zap className="w-3 h-3 mr-1" />
              Emergency
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/50 text-white">
            {service.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{service.title}</CardTitle>
        <p className="text-gray-300 text-sm line-clamp-2">{service.description}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div 
          className="flex items-center space-x-2 mb-3 cursor-pointer hover:text-blue-400 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onProviderClick(service.provider.name);
          }}
        >
          <img 
            src={service.provider.avatar} 
            alt={service.provider.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{service.provider.name}</p>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-300">
                {service.provider.rating} ({service.provider.reviewCount})
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-gray-300 text-xs">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{service.provider.location}</span>
              {service.distance && (
                <span className="text-blue-400">({service.distance}mi)</span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{service.responseTime}</span>
            </div>
          </div>
          <span className="text-blue-400 font-semibold">
            {formatPrice(service.price)}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {service.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-white/30 text-gray-300">
              {tag}
            </Badge>
          ))}
          {service.tags.length > 3 && (
            <Badge variant="outline" className="text-xs border-white/30 text-gray-300">
              +{service.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            onServiceClick(service.id);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  const ServiceListItem = ({ service }: { service: Service }) => (
    <Card className="glass-card text-white hover:scale-[1.02] transition-all duration-300 cursor-pointer">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img 
            src={service.image} 
            alt={service.title}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {service.category}
                  </Badge>
                  {service.provider.verified && (
                    <Badge className="bg-green-500 text-white text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {service.isEmergency && (
                    <Badge className="bg-red-500 text-white text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Emergency
                    </Badge>
                  )}
                </div>
              </div>
              <span className="text-blue-400 font-semibold text-lg">
                {formatPrice(service.price)}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{service.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-300">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{service.provider.rating} ({service.provider.reviewCount})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{service.provider.location}</span>
                  {service.distance && (
                    <span className="text-blue-400">({service.distance}mi)</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{service.responseTime}</span>
                </div>
              </div>
              <Button 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onServiceClick(service.id);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-300">
          {services.length} service{services.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} onClick={() => onServiceClick(service.id)}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} onClick={() => onServiceClick(service.id)}>
              <ServiceListItem service={service} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
