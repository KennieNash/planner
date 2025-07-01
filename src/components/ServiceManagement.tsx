
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  isActive: boolean;
  requestsCount: number;
  lastUpdated: string;
}

interface ServiceManagementProps {
  services: Service[];
  onAddService: () => void;
  onEditService: (id: number) => void;
  onToggleService: (id: number) => void;
  onDeleteService: (id: number) => void;
}

const ServiceManagement = ({ 
  services, 
  onAddService, 
  onEditService, 
  onToggleService, 
  onDeleteService 
}: ServiceManagementProps) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredServices = services.filter(service => {
    if (filter === 'active') return service.isActive;
    if (filter === 'inactive') return !service.isActive;
    return true;
  });

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">My Services</CardTitle>
          <Button 
            onClick={onAddService}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
        <div className="flex space-x-2 mt-4">
          {['all', 'active', 'inactive'].map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(filterOption as typeof filter)}
              className={filter === filterOption ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-white">{service.name}</h4>
                  <Badge variant={service.isActive ? 'default' : 'secondary'}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 mb-1">{service.category}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>{service.price}</span>
                  <span>{service.requestsCount} requests</span>
                  <span>Updated {service.lastUpdated}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleService(service.id)}
                  className="text-gray-300 hover:text-white"
                >
                  {service.isActive ? (
                    <ToggleRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditService(service.id)}
                  className="text-gray-300 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteService(service.id)}
                  className="text-gray-300 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceManagement;
