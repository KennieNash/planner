
import React from 'react';
import { X, Calendar, DollarSign, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Quote {
  id: number;
  serviceTitle: string;
  providerName: string;
  providerRating: number;
  totalPrice: number;
  estimatedDuration: string;
  description: string;
  breakdown: {
    item: string;
    price: number;
  }[];
  validUntil: string;
  status: 'pending' | 'accepted' | 'declined';
  submittedAt: string;
  notes?: string;
}

interface QuoteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  onAccept?: (quoteId: number) => void;
  onDecline?: (quoteId: number) => void;
}

const QuoteViewModal = ({ isOpen, onClose, quote, onAccept, onDecline }: QuoteViewModalProps) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'declined': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="glass-card text-white border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">Quote Details</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Quote Header */}
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{quote.serviceTitle}</h3>
                  <p className="text-gray-300 text-sm">From: {quote.providerName}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm ml-1">{quote.providerRating}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(quote.status)}>
                  {getStatusIcon(quote.status)}
                  <span className="ml-1 capitalize">{quote.status}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Price:</span>
                  <div className="text-2xl font-bold text-green-400">${quote.totalPrice}</div>
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <div className="font-medium">{quote.estimatedDuration}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Service Description
              </h4>
              <p className="text-gray-300 bg-white/5 rounded-lg p-3">{quote.description}</p>
            </div>

            {/* Price Breakdown */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Price Breakdown
              </h4>
              <div className="space-y-2">
                {quote.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-white/5 rounded">
                    <span className="text-gray-300">{item.item}</span>
                    <span className="font-medium">${item.price}</span>
                  </div>
                ))}
                <div className="border-t border-white/20 pt-2 mt-3">
                  <div className="flex justify-between items-center py-2 px-3 bg-white/10 rounded font-semibold">
                    <span>Total</span>
                    <span className="text-green-400">${quote.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block">Submitted:</span>
                <span>{new Date(quote.submittedAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Valid Until:</span>
                <span>{new Date(quote.validUntil).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Notes */}
            {quote.notes && (
              <div>
                <h4 className="font-medium mb-2">Additional Notes</h4>
                <p className="text-gray-300 bg-white/5 rounded-lg p-3">{quote.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            {quote.status === 'pending' && (
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => onDecline?.(quote.id)}
                  className="flex-1 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                >
                  Decline Quote
                </Button>
                <Button
                  onClick={() => onAccept?.(quote.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  Accept Quote
                </Button>
              </div>
            )}
            
            {quote.status !== 'pending' && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuoteViewModal;
