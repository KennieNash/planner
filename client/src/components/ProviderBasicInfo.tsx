
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProviderFormData } from '@/pages/ProviderRegistration';

interface ProviderBasicInfoProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const ProviderBasicInfo = ({ 
  formData, 
  updateFormData, 
  nextStep, 
  currentStep, 
  totalSteps 
}: ProviderBasicInfoProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const isFormValid = formData.businessName && formData.ownerName && 
                     formData.email && formData.phone && formData.address;

  return (
    <Card className="glass-card text-white">
      <CardHeader>
        <CardTitle className="text-xl">Basic Information</CardTitle>
        <p className="text-gray-300">Tell us about your business</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-white">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => updateFormData({ businessName: e.target.value })}
                placeholder="Enter your business name"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ownerName" className="text-white">Owner Name *</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => updateFormData({ ownerName: e.target.value })}
                placeholder="Enter owner's full name"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="Enter email address"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                placeholder="Enter phone number"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-white">Business Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              placeholder="Enter street address"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                placeholder="Enter city"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state" className="text-white">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => updateFormData({ state: e.target.value })}
                placeholder="Enter state"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-white">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => updateFormData({ zipCode: e.target.value })}
                placeholder="Enter ZIP code"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">Business Description</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => updateFormData({ bio: e.target.value })}
              placeholder="Tell customers about your business, experience, and what makes you unique..."
              className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-white">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              value={formData.experience}
              onChange={(e) => updateFormData({ experience: parseInt(e.target.value) || 0 })}
              placeholder="Enter years of experience"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Continue to Services ({currentStep + 1}/{totalSteps})
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProviderBasicInfo;
