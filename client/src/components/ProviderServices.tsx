
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ProviderFormData } from '@/pages/ProviderRegistration';

interface ProviderServicesProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const serviceCategories = [
  'Plumbing', 'Electrical', 'Cleaning', 'Handyman', 'Gardening', 
  'Pet Care', 'Tutoring', 'Moving', 'Painting', 'Carpentry'
];

const ProviderServices = ({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep, 
  currentStep, 
  totalSteps 
}: ProviderServicesProps) => {
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    updateFormData({ categories: updatedCategories });
  };

  const addService = () => {
    if (newService.name && newService.price) {
      updateFormData({
        services: [...formData.services, { ...newService }]
      });
      setNewService({ name: '', description: '', price: '', duration: '' });
    }
  };

  const removeService = (index: number) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    updateFormData({ services: updatedServices });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const isFormValid = formData.categories.length > 0 && formData.services.length > 0;

  return (
    <Card className="glass-card text-white">
      <CardHeader>
        <CardTitle className="text-xl">Services & Pricing</CardTitle>
        <p className="text-gray-300">Define what services you offer</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Categories */}
          <div className="space-y-3">
            <Label className="text-white text-base">Service Categories *</Label>
            <p className="text-sm text-gray-400">Select all categories that apply to your business</p>
            <div className="flex flex-wrap gap-2">
              {serviceCategories.map((category) => (
                <Badge
                  key={category}
                  variant={formData.categories.includes(category) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.categories.includes(category)
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'border-white/30 text-gray-300 hover:bg-white/10'
                  }`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Add Service */}
          <div className="space-y-4 border border-white/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white">Add Service</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName" className="text-white">Service Name</Label>
                <Input
                  id="serviceName"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g., Emergency Plumbing Repair"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="servicePrice" className="text-white">Price</Label>
                <Input
                  id="servicePrice"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  placeholder="e.g., $80-150/hour or $200 fixed"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceDuration" className="text-white">Typical Duration</Label>
              <Input
                id="serviceDuration"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                placeholder="e.g., 2-3 hours"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceDescription" className="text-white">Description</Label>
              <Textarea
                id="serviceDescription"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Describe what's included in this service..."
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            
            <Button
              type="button"
              onClick={addService}
              disabled={!newService.name || !newService.price}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>

          {/* Services List */}
          {formData.services.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-white">Your Services ({formData.services.length})</h3>
              <div className="space-y-3">
                {formData.services.map((service, index) => (
                  <div key={index} className="border border-white/20 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{service.name}</h4>
                        <p className="text-green-400 font-medium">{service.price}</p>
                        {service.duration && (
                          <p className="text-sm text-gray-400">Duration: {service.duration}</p>
                        )}
                        {service.description && (
                          <p className="text-sm text-gray-300 mt-2">{service.description}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Previous
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Continue to Verification ({currentStep + 1}/{totalSteps})
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProviderServices;
