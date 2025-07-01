
import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import ProviderBasicInfo from '@/components/ProviderBasicInfo';
import ProviderServices from '@/components/ProviderServices';
import ProviderVerification from '@/components/ProviderVerification';
import ProviderSuccess from '@/components/ProviderSuccess';

export type ProviderFormData = {
  // Basic Info
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Services
  categories: string[];
  services: Array<{
    name: string;
    description: string;
    price: string;
    duration: string;
  }>;
  
  // Verification
  businessLicense: string;
  insurance: string;
  certifications: string[];
  portfolio: string[];
  
  // Additional
  bio: string;
  experience: number;
  availability: string[];
};

const ProviderRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProviderFormData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    categories: [],
    services: [],
    businessLicense: '',
    insurance: '',
    certifications: [],
    portfolio: [],
    bio: '',
    experience: 0,
    availability: []
  });

  const steps = [
    { number: 1, title: 'Basic Information', component: ProviderBasicInfo },
    { number: 2, title: 'Services & Pricing', component: ProviderServices },
    { number: 3, title: 'Verification', component: ProviderVerification },
    { number: 4, title: 'Complete', component: ProviderSuccess }
  ];

  const updateFormData = (newData: Partial<ProviderFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-20 lg:pb-4">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-blue-400 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Become a Service Provider</h1>
              <p className="text-gray-300">Join our marketplace and start earning</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="glass-card mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-400 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-white' : 'text-gray-400'
                    }`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${
                      currentStep >= step.number ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </div>

      <Navigation />
    </div>
  );
};

export default ProviderRegistration;
