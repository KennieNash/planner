
import React from 'react';
import { CheckCircle, Star, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProviderFormData } from '@/pages/ProviderRegistration';

interface ProviderSuccessProps {
  formData: ProviderFormData;
  updateFormData: (data: Partial<ProviderFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
}

const ProviderSuccess = ({ formData }: ProviderSuccessProps) => {
  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Provider registration data:', formData);
    alert('Registration submitted! You will receive an email confirmation shortly.');
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="glass-card text-white text-center">
        <CardContent className="p-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
          <p className="text-gray-300 mb-6">
            Thank you for joining our marketplace. Your application is now under review.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-medium">Review Process</h3>
              <p className="text-sm text-gray-400">24-48 hours</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-medium">Profile Setup</h3>
              <p className="text-sm text-gray-400">Upon approval</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-medium">Start Earning</h3>
              <p className="text-sm text-gray-400">Accept jobs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Summary */}
      <Card className="glass-card text-white">
        <CardHeader>
          <CardTitle>Registration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Business Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Business:</span> {formData.businessName}</p>
                <p><span className="text-gray-400">Owner:</span> {formData.ownerName}</p>
                <p><span className="text-gray-400">Email:</span> {formData.email}</p>
                <p><span className="text-gray-400">Phone:</span> {formData.phone}</p>
                <p><span className="text-gray-400">Experience:</span> {formData.experience} years</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Services</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Categories:</span> {formData.categories.join(', ')}</p>
                <p><span className="text-gray-400">Total Services:</span> {formData.services.length}</p>
                <p><span className="text-gray-400">Certifications:</span> {formData.certifications.length}</p>
                <p><span className="text-gray-400">Availability:</span> {formData.availability.join(', ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="glass-card text-white">
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Application Review</h4>
                <p className="text-sm text-gray-400">Our team will review your application and verify your documents within 24-48 hours.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Email Confirmation</h4>
                <p className="text-sm text-gray-400">You'll receive an email with your approval status and next steps.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Start Receiving Requests</h4>
                <p className="text-sm text-gray-400">Once approved, your profile will be live and you can start accepting service requests.</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white flex-1"
            >
              Submit Registration
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderSuccess;
