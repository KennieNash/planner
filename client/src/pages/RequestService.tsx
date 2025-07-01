
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ServiceRequestData {
  serviceCategory: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferredDate: string;
  preferredTime: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  budgetRange: string;
  additionalNotes: string;
}

const serviceCategories = [
  'Plumbing', 'Electrical', 'Cleaning', 'Handyman', 'Gardening', 
  'Pet Care', 'Tutoring', 'Moving', 'Painting', 'Carpentry'
];

const urgencyLevels = [
  { value: 'low', label: 'Low Priority', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-500' },
  { value: 'high', label: 'High Priority', color: 'bg-orange-500' },
  { value: 'emergency', label: 'Emergency', color: 'bg-red-500' }
];

const RequestService = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceRequestData>({
    serviceCategory: '',
    title: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    preferredDate: '',
    preferredTime: '',
    urgency: 'medium',
    budgetRange: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.serviceCategory) {
      newErrors.serviceCategory = 'Please select a service category';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Service title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Service description is required';
    }
    if (!formData.location.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.location.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.location.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.location.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      console.log('Service request data:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Request Submitted!",
        description: "Your service request has been submitted. Providers will contact you soon.",
      });

      // Navigate to requests page
      setTimeout(() => {
        setLocation('/my-requests');
      }, 1000);

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/" className="text-white hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Request a Service</h1>
            <p className="text-gray-300">Tell us what you need help with</p>
          </div>
        </div>

        <Card className="glass-card text-white">
          <CardHeader>
            <CardTitle className="text-xl">Service Request Details</CardTitle>
            <p className="text-gray-300">Fill out the details below to get matched with the right provider</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Category */}
              <div className="space-y-3">
                <Label className="text-white text-base">Service Category *</Label>
                <div className="flex flex-wrap gap-2">
                  {serviceCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={formData.serviceCategory === category ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        formData.serviceCategory === category
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'border-white/30 text-gray-300 hover:bg-white/10'
                      }`}
                      onClick={() => setFormData({ ...formData, serviceCategory: category })}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                {errors.serviceCategory && <p className="text-red-400 text-sm">{errors.serviceCategory}</p>}
              </div>

              {/* Service Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Service Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Fix leaky kitchen faucet"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the problem or service needed in detail..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                />
                {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <Label className="text-white text-base">Service Location *</Label>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Input
                      value={formData.location.address}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, address: e.target.value }
                      })}
                      placeholder="Street address"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        value={formData.location.city}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          location: { ...formData.location, city: e.target.value }
                        })}
                        placeholder="City"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                      {errors.city && <p className="text-red-400 text-sm">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <Input
                        value={formData.location.state}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          location: { ...formData.location, state: e.target.value }
                        })}
                        placeholder="State"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                      {errors.state && <p className="text-red-400 text-sm">{errors.state}</p>}
                    </div>
                  </div>
                  
                  <div className="w-1/2">
                    <Input
                      value={formData.location.zipCode}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, zipCode: e.target.value }
                      })}
                      placeholder="ZIP Code"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    {errors.zipCode && <p className="text-red-400 text-sm">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <Label htmlFor="preferredDate" className="text-white">Preferred Date *</Label>
                  </div>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  {errors.preferredDate && <p className="text-red-400 text-sm">{errors.preferredDate}</p>}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <Label htmlFor="preferredTime" className="text-white">Preferred Time</Label>
                  </div>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-3">
                <Label className="text-white text-base">Urgency Level</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {urgencyLevels.map((level) => (
                    <Badge
                      key={level.value}
                      variant={formData.urgency === level.value ? "default" : "outline"}
                      className={`cursor-pointer transition-colors justify-center p-2 ${
                        formData.urgency === level.value
                          ? `${level.color} text-white hover:opacity-90`
                          : 'border-white/30 text-gray-300 hover:bg-white/10'
                      }`}
                      onClick={() => setFormData({ ...formData, urgency: level.value as any })}
                    >
                      {level.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <Label htmlFor="budgetRange" className="text-white">Budget Range</Label>
                </div>
                <Input
                  id="budgetRange"
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  placeholder="e.g., $100-200 or $50/hour"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <Label htmlFor="additionalNotes" className="text-white">Additional Notes</Label>
                </div>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="Any special requirements, access instructions, or additional details..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
              >
                {isLoading ? 'Submitting Request...' : 'Submit Service Request'}
              </Button>

              {/* Help Text */}
              <div className="text-center text-sm text-gray-400">
                <p>After submitting, qualified providers in your area will be notified.</p>
                <p>You'll receive quotes and can choose the best option for your needs.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestService;
