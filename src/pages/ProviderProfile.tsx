import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Mail, Calendar, Clock, Shield, Award, MessageCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ReviewsList from '@/components/ReviewsList';
import ReviewModal from '@/components/ReviewModal';

interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  phone: string;
  email: string;
  description: string;
  specialties: string[];
  experience: string;
  isVerified: boolean;
  services: Service[];
  reviews: Review[];
  gallery: string[];
  availability: {
    weekdays: string;
    weekends: string;
    emergencyService: boolean;
  };
  pricing: {
    hourlyRate?: number;
    minimumCharge?: number;
    freeEstimate: boolean;
  };
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: {
    type: 'fixed' | 'hourly' | 'quote';
    amount?: number;
    range?: { min: number; max: number };
  };
  duration: string;
}

interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  serviceType: string;
  isVerified?: boolean;
  helpfulCount?: number;
  images?: string[];
}

// Mock provider data
const mockProvider: Provider = {
  id: '1',
  name: 'Sarah Johnson',
  avatar: '/placeholder.svg',
  rating: 4.9,
  reviewCount: 127,
  location: 'Downtown, City Center',
  phone: '+1 (555) 123-4567',
  email: 'sarah@cleanpro.com',
  description: 'Professional cleaning specialist with over 8 years of experience. I take pride in delivering exceptional results and creating spotless, healthy environments for my clients.',
  specialties: ['Deep Cleaning', 'Eco-friendly Products', 'Post-construction Cleanup', 'Office Cleaning'],
  experience: '8+ years',
  isVerified: true,
  services: [
    {
      id: '1',
      title: 'Deep House Cleaning',
      description: 'Complete deep cleaning of your entire home including all rooms, bathrooms, and kitchen.',
      price: { type: 'hourly', amount: 35 },
      duration: '3-5 hours'
    },
    {
      id: '2',
      title: 'Regular Maintenance Cleaning',
      description: 'Weekly or bi-weekly maintenance cleaning to keep your home spotless.',
      price: { type: 'hourly', amount: 30 },
      duration: '2-3 hours'
    },
    {
      id: '3',
      title: 'Move-in/Move-out Cleaning',
      description: 'Thorough cleaning for moving situations, ensuring your space is move-ready.',
      price: { type: 'fixed', range: { min: 200, max: 400 } },
      duration: '4-6 hours'
    }
  ],
  reviews: [
    {
      id: '1',
      customerName: 'Michael Chen',
      customerAvatar: '/placeholder.svg',
      rating: 5,
      comment: 'Sarah did an amazing job cleaning our house. Very thorough and professional. Our home has never looked better!',
      date: '2024-01-15',
      serviceType: 'Deep House Cleaning',
      isVerified: true,
      helpfulCount: 15,
      images: ['/placeholder.svg', '/placeholder.svg']
    },
    {
      id: '2',
      customerName: 'Emily Davis',
      customerAvatar: '/placeholder.svg',
      rating: 5,
      comment: 'Excellent service! Sarah is reliable, punctual, and pays attention to every detail. Highly recommended.',
      date: '2024-01-10',
      serviceType: 'Regular Maintenance'
    }
  ],
  gallery: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  availability: {
    weekdays: '8:00 AM - 6:00 PM',
    weekends: '9:00 AM - 4:00 PM',
    emergencyService: false
  },
  pricing: {
    hourlyRate: 35,
    minimumCharge: 100,
    freeEstimate: true
  }
};

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews' | 'gallery'>('overview');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, you would fetch provider data based on the id
  const provider = mockProvider;

  const formatPrice = (price: Service['price']) => {
    if (price.type === 'quote') return 'Get Quote';
    if (price.type === 'hourly') return `$${price.amount}/hr`;
    if (price.type === 'fixed' && price.range) return `$${price.range.min}-${price.range.max}`;
    return `$${price.amount}`;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent!",
        description: `Your message has been sent to ${provider.name}. They will respond soon.`,
      });
      
      setMessage('');
      setIsContactModalOpen(false);
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = (reviewData: { rating: number; comment: string; images: string[] }) => {
    console.log('Submitting review:', reviewData);
    // In a real app, you would submit to your API
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    });
  };

  const handleMarkHelpful = (reviewId: string) => {
    console.log('Marking helpful:', reviewId);
    toast({
      title: "Thank you!",
      description: "Your feedback has been recorded.",
    });
  };

  const handleReportReview = (reviewId: string) => {
    console.log('Reporting review:', reviewId);
    toast({
      title: "Report Submitted",
      description: "We'll review this report shortly.",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/services" className="text-white hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Provider Profile</h1>
            <p className="text-gray-300">Service provider details and information</p>
          </div>
        </div>

        {/* Provider Header Card */}
        <Card className="glass-card text-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={provider.avatar} 
                  alt={provider.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto lg:mx-0"
                />
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                  <h2 className="text-2xl font-bold">{provider.name}</h2>
                  {provider.isVerified && (
                    <Badge className="bg-green-500">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-center lg:justify-start space-x-1 mb-3">
                  {renderStars(provider.rating)}
                  <button 
                    onClick={() => setIsReviewModalOpen(true)}
                    className="ml-2 text-white hover:text-blue-400 transition-colors"
                  >
                    {provider.rating} ({provider.reviewCount} reviews)
                  </button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start space-x-1 text-gray-300 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{provider.location}</span>
                </div>
                
                <p className="text-gray-300 mb-4">{provider.description}</p>
                
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                  {provider.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="border-white/30 text-gray-300">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/30 text-gray-300 hover:bg-white/10"
                    onClick={() => navigate('/request-service')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Service
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/10 rounded-lg p-1">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'services', label: 'Services' },
            { key: 'reviews', label: 'Reviews' },
            { key: 'gallery', label: 'Gallery' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>Availability</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-300">Weekdays:</p>
                    <p className="text-white">{provider.availability.weekdays}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Weekends:</p>
                    <p className="text-white">{provider.availability.weekends}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Emergency Service:</p>
                    <p className="text-white">{provider.availability.emergencyService ? 'Available' : 'Not Available'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span>Pricing Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-300">Starting Rate:</p>
                    <p className="text-white">${provider.pricing.hourlyRate}/hour</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Minimum Charge:</p>
                    <p className="text-white">${provider.pricing.minimumCharge}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Free Estimate:</p>
                    <p className="text-white">{provider.pricing.freeEstimate ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card text-white lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span>Experience & Qualifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-300">Years of Experience:</p>
                    <p className="text-white text-lg font-semibold">{provider.experience}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Contact:</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{provider.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-white">{provider.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {provider.services.map((service) => (
              <Card key={service.id} className="glass-card text-white">
                <CardHeader>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-300 text-sm">Duration:</p>
                      <p className="text-white">{service.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">Price:</p>
                      <p className="text-blue-400 font-semibold text-lg">{formatPrice(service.price)}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Request This Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <ReviewsList
            reviews={provider.reviews}
            averageRating={provider.rating}
            totalReviews={provider.reviewCount}
            showWriteReview={true}
            onWriteReview={() => setIsReviewModalOpen(true)}
            onMarkHelpful={handleMarkHelpful}
            onReport={handleReportReview}
          />
        )}

        {activeTab === 'gallery' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {provider.gallery.map((image, index) => (
              <div key={index} className="aspect-square">
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        {/* Contact Modal */}
        {isContactModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="glass-card text-white w-full max-w-md">
              <CardHeader>
                <CardTitle>Send Message to {provider.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Textarea
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsContactModalOpen(false)}
                      className="flex-1 border-white/30 text-gray-300 hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !message.trim()}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      {isLoading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          providerName={provider.name}
          serviceType="General Service"
          reviews={provider.reviews}
          averageRating={provider.rating}
          totalReviews={provider.reviewCount}
          canWriteReview={true}
          onSubmitReview={handleSubmitReview}
          onMarkHelpful={handleMarkHelpful}
          onReport={handleReportReview}
        />
      </div>
    </div>
  );
};

export default ProviderProfile;
