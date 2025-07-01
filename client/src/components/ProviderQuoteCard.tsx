
import React, { useState } from 'react';
import { Clock, User, MapPin, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProviderQuoteResponseModal from './ProviderQuoteResponseModal';

interface QuoteRequest {
  id: number;
  serviceTitle: string;
  customerName: string;
  customerLocation: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  preferredDate: string;
  budget: string;
  submittedAt: string;
  status: 'pending' | 'responded' | 'accepted' | 'declined';
  contactInfo: {
    phone?: string;
    email: string;
  };
}

interface ProviderQuoteCardProps {
  quoteRequest: QuoteRequest;
  onRespond: (id: number, response: any) => void;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

const ProviderQuoteCard = ({ quoteRequest, onRespond, onAccept, onDecline }: ProviderQuoteCardProps) => {
  const [showResponseModal, setShowResponseModal] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-300 border-green-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'accepted': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <Card className="glass-card hover:bg-white/10 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-lg mb-2">{quoteRequest.serviceTitle}</CardTitle>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getUrgencyColor(quoteRequest.urgency)}>
                  {quoteRequest.urgency} priority
                </Badge>
                <Badge className={getStatusColor(quoteRequest.status)}>
                  {quoteRequest.status}
                </Badge>
              </div>
            </div>
            <div className="text-right text-sm text-gray-400">
              {formatTime(quoteRequest.submittedAt)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center text-gray-300 text-sm">
              <User className="w-4 h-4 mr-2" />
              <span>{quoteRequest.customerName}</span>
            </div>
            
            <div className="flex items-center text-gray-300 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{quoteRequest.customerLocation}</span>
            </div>
            
            <div className="flex items-center text-gray-300 text-sm">
              <Clock className="w-4 h-4 mr-2" />
              <span>Preferred: {new Date(quoteRequest.preferredDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <h4 className="text-sm font-medium text-white mb-1">Request Details</h4>
            <p className="text-gray-300 text-sm line-clamp-2">{quoteRequest.description}</p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Budget: {quoteRequest.budget}</span>
            <span className="text-gray-400">Email: {quoteRequest.contactInfo.email}</span>
          </div>
          
          {quoteRequest.status === 'pending' && (
            <div className="flex space-x-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDecline(quoteRequest.id)}
                className="flex-1 text-red-400 hover:bg-red-500/20 border border-red-500/30"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Decline
              </Button>
              <Button
                onClick={() => setShowResponseModal(true)}
                size="sm"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Send Quote
              </Button>
            </div>
          )}

          {quoteRequest.status === 'responded' && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:bg-blue-500/20"
              >
                View Sent Quote
              </Button>
            </div>
          )}

          {(quoteRequest.status === 'accepted' || quoteRequest.status === 'declined') && (
            <div className="flex justify-center pt-2">
              <Badge className={getStatusColor(quoteRequest.status)}>
                {quoteRequest.status === 'accepted' ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                Quote {quoteRequest.status}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <ProviderQuoteResponseModal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        quoteRequest={quoteRequest}
        onSubmit={(response) => {
          onRespond(quoteRequest.id, response);
          setShowResponseModal(false);
        }}
      />
    </>
  );
};

export default ProviderQuoteCard;
