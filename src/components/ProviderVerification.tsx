
import React from 'react';
import { Upload, FileText, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ProviderFormData } from '@/pages/ProviderRegistration';

interface ProviderVerificationProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const commonCertifications = [
  'Licensed Professional',
  'Insured & Bonded',
  'Background Checked',
  'EPA Certified',
  'OSHA Safety Trained',
  'Better Business Bureau',
  'Industry Association Member'
];

const ProviderVerification = ({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep, 
  currentStep, 
  totalSteps 
}: ProviderVerificationProps) => {
  const handleCertificationToggle = (certification: string) => {
    const updatedCertifications = formData.certifications.includes(certification)
      ? formData.certifications.filter(c => c !== certification)
      : [...formData.certifications, certification];
    updateFormData({ certifications: updatedCertifications });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <Card className="glass-card text-white">
      <CardHeader>
        <CardTitle className="text-xl">Verification & Credentials</CardTitle>
        <p className="text-gray-300">Build trust with proper documentation</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business License */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <Label className="text-white text-base">Business License</Label>
            </div>
            <p className="text-sm text-gray-400">Upload your business license or registration documents</p>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>

          {/* Insurance */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <Label className="text-white text-base">Insurance Documentation</Label>
            </div>
            <p className="text-sm text-gray-400">Liability insurance certificate or policy documents</p>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-400" />
              <Label className="text-white text-base">Professional Certifications</Label>
            </div>
            <p className="text-sm text-gray-400">Select all certifications and qualifications you have</p>
            <div className="flex flex-wrap gap-2">
              {commonCertifications.map((certification) => (
                <Badge
                  key={certification}
                  variant={formData.certifications.includes(certification) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.certifications.includes(certification)
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'border-white/30 text-gray-300 hover:bg-white/10'
                  }`}
                  onClick={() => handleCertificationToggle(certification)}
                >
                  {certification}
                </Badge>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="space-y-3">
            <Label className="text-white text-base">Portfolio Images</Label>
            <p className="text-sm text-gray-400">Upload photos of your previous work to showcase your quality</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center aspect-square flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-400">Photo {index}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <Label className="text-white text-base">Availability</Label>
            <p className="text-sm text-gray-400">When are you typically available for work?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Weekdays', 'Weekends', 'Evenings', 'Emergency 24/7'].map((time) => (
                <Badge
                  key={time}
                  variant={formData.availability.includes(time) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors justify-center ${
                    formData.availability.includes(time)
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'border-white/30 text-gray-300 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    const updatedAvailability = formData.availability.includes(time)
                      ? formData.availability.filter(a => a !== time)
                      : [...formData.availability, time];
                    updateFormData({ availability: updatedAvailability });
                  }}
                >
                  {time}
                </Badge>
              ))}
            </div>
          </div>
          
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
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Complete Registration ({currentStep + 1}/{totalSteps})
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProviderVerification;
