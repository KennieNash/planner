
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, DollarSign, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QuoteModal from './QuoteModal';

interface ServiceCardProps {
  service: {
    id: number;
    providerId: number;
    title: string;
    category: string;
    description: string;
    price: string;
    location: string;
    providerName: string;
    providerRating: number;
    reviewsCount: number;
    responseTime: string;
    availability: string;
    isEmergency: boolean;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <>
      <Card className="glass-card hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {service.category}
                </Badge>
                {service.isEmergency && (
                  <Badge variant="destructive" className="text-xs">
                    Emergency
                  </Badge>
                )}
              </div>
              <CardTitle className="text-white text-lg leading-tight">
                {service.title}
              </CardTitle>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-400">{service.price}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm line-clamp-2">
            {service.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-300 text-sm">
              <User className="w-4 h-4 mr-2" />
              <span>{service.providerName}</span>
              <div className="flex items-center ml-auto">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1">{service.providerRating}</span>
                <span className="text-gray-400 ml-1">({service.reviewsCount})</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-300 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{service.location}</span>
            </div>
            
            <div className="flex items-center text-gray-300 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>Responds in {service.responseTime}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-400">
              {service.availability}
            </div>
            
            <div className="flex space-x-2">
              <Link to={`/provider/${service.providerId}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                >
                  View Provider
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={() => setShowQuoteModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Request Quote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <QuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        service={service}
      />
    </>
  );
};

export default ServiceCard;
