
import React, { useState } from 'react';
import { X, Eye, Calendar, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import QuoteViewModal from './QuoteViewModal';

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

interface QuotesListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuotesListModal = ({ isOpen, onClose }: QuotesListModalProps) => {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  // Mock quotes data
  const quotes: Quote[] = [
    {
      id: 1,
      serviceTitle: 'Emergency Plumbing Repair',
      providerName: 'Mike Johnson',
      providerRating: 4.8,
      totalPrice: 250,
      estimatedDuration: '2-3 hours',
      description: 'Fix kitchen sink leak and replace faulty pipes',
      breakdown: [
        { item: 'Labor (2 hours)', price: 160 },
        { item: 'Pipe replacement', price: 60 },
        { item: 'Materials', price: 30 }
      ],
      validUntil: '2024-01-25',
      status: 'pending',
      submittedAt: '2024-01-15',
      notes: 'Emergency service available 24/7'
    },
    {
      id: 2,
      serviceTitle: 'House Deep Cleaning',
      providerName: 'Sarah Williams',
      providerRating: 4.9,
      totalPrice: 180,
      estimatedDuration: '4-5 hours',
      description: 'Complete deep cleaning of 3-bedroom house',
      breakdown: [
        { item: 'Deep cleaning service', price: 150 },
        { item: 'Cleaning supplies', price: 30 }
      ],
      validUntil: '2024-01-20',
      status: 'accepted',
      submittedAt: '2024-01-10'
    }
  ];

  if (!isOpen) return null;

  const filteredQuotes = quotes.filter(quote => 
    filter === 'all' || quote.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-300';
      case 'declined': return 'bg-red-500/20 text-red-300';
      default: return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const handleAcceptQuote = (quoteId: number) => {
    console.log('Accepting quote:', quoteId);
    setSelectedQuote(null);
  };

  const handleDeclineQuote = (quoteId: number) => {
    console.log('Declining quote:', quoteId);
    setSelectedQuote(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <Card className="glass-card text-white border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">My Quotes ({quotes.length})</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Filter Tabs */}
              <div className="flex space-x-2">
                {(['all', 'pending', 'accepted', 'declined'] as const).map((status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter(status)}
                    className={`capitalize ${
                      filter === status 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {status}
                    {status !== 'all' && (
                      <span className="ml-1 text-xs">
                        ({quotes.filter(q => q.status === status).length})
                      </span>
                    )}
                  </Button>
                ))}
              </div>

              {/* Quotes List */}
              <div className="space-y-4">
                {filteredQuotes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
                    <p className="text-gray-400">
                      {filter === 'all' 
                        ? 'You haven\'t received any quotes yet.' 
                        : `No ${filter} quotes found.`}
                    </p>
                  </div>
                ) : (
                  filteredQuotes.map((quote) => (
                    <Card key={quote.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{quote.serviceTitle}</h3>
                            <p className="text-gray-300 text-sm">From: {quote.providerName}</p>
                          </div>
                          <Badge className={getStatusColor(quote.status)}>
                            {quote.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div className="flex items-center text-gray-300">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span className="font-semibold text-green-400">${quote.totalPrice}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{quote.estimatedDuration}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Valid until {new Date(quote.validUntil).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-400">
                            Received: {new Date(quote.submittedAt).toLocaleDateString()}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSelectedQuote(quote)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <QuoteViewModal
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          quote={selectedQuote}
          onAccept={handleAcceptQuote}
          onDecline={handleDeclineQuote}
        />
      )}
    </>
  );
};

export default QuotesListModal;
