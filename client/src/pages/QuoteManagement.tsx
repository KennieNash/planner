
import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Calendar, Clock, DollarSign, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

interface Quote {
  id: string;
  serviceTitle: string;
  providerName: string;
  providerAvatar: string;
  status: 'pending' | 'received' | 'accepted' | 'declined' | 'completed';
  requestDate: string;
  responseDate?: string;
  description: string;
  budget: string;
  providerQuote?: {
    amount: number;
    breakdown: string;
    timeline: string;
    validUntil: string;
  };
  urgency: 'low' | 'medium' | 'high';
  location: string;
}

const mockQuotes: Quote[] = [
  {
    id: '1',
    serviceTitle: 'Emergency Plumbing Repair',
    providerName: 'Mike Wilson',
    providerAvatar: '/placeholder.svg',
    status: 'received',
    requestDate: '2024-01-15',
    responseDate: '2024-01-15',
    description: 'Burst pipe in basement causing flooding. Need immediate repair.',
    budget: '$200-400',
    providerQuote: {
      amount: 350,
      breakdown: 'Pipe replacement ($200) + Labor ($100) + Emergency fee ($50)',
      timeline: 'Same day service available',
      validUntil: '2024-01-20'
    },
    urgency: 'high',
    location: 'Downtown Seattle'
  },
  {
    id: '2',
    serviceTitle: 'House Deep Cleaning',
    providerName: 'Sarah Johnson',
    providerAvatar: '/placeholder.svg',
    status: 'pending',
    requestDate: '2024-01-14',
    description: 'Deep cleaning for 3-bedroom house before move-in.',
    budget: '$150-250',
    urgency: 'medium',
    location: 'Capitol Hill'
  },
  {
    id: '3',
    serviceTitle: 'Kitchen Renovation',
    providerName: 'Alex Thompson',
    providerAvatar: '/placeholder.svg',
    status: 'accepted',
    requestDate: '2024-01-10',
    responseDate: '2024-01-12',
    description: 'Complete kitchen remodel including cabinets, countertops, and appliances.',
    budget: '$15000-25000',
    providerQuote: {
      amount: 22000,
      breakdown: 'Materials ($15000) + Labor ($6000) + Permits ($1000)',
      timeline: '3-4 weeks completion time',
      validUntil: '2024-02-01'
    },
    urgency: 'low',
    location: 'Ballard'
  }
];

const QuoteManagement = () => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState(mockQuotes);
  const [filter, setFilter] = useState<'all' | 'pending' | 'received' | 'accepted' | 'declined' | 'completed'>('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const filteredQuotes = quotes.filter(quote => 
    filter === 'all' || quote.status === filter
  );

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'received': return 'bg-blue-500';
      case 'accepted': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: Quote['urgency']) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleAcceptQuote = (quoteId: string) => {
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: 'accepted' as const } : quote
    ));
    toast({
      title: "Quote Accepted!",
      description: "The provider has been notified. They will contact you soon to schedule the service.",
    });
  };

  const handleDeclineQuote = (quoteId: string) => {
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: 'declined' as const } : quote
    ));
    toast({
      title: "Quote Declined",
      description: "The provider has been notified of your decision.",
    });
  };

  const handleSendMessage = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsResponseModalOpen(true);
  };

  const submitResponse = () => {
    if (!responseMessage.trim()) return;

    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${selectedQuote?.providerName}.`,
    });
    
    setResponseMessage('');
    setIsResponseModalOpen(false);
    setSelectedQuote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/my-requests" className="text-white hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Quote Management</h1>
            <p className="text-gray-300">Track and manage your service quote requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'received', 'accepted', 'declined', 'completed'].map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(filterOption as typeof filter)}
              className={filter === filterOption ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Button>
          ))}
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className={`glass-card text-white border-l-4 ${getUrgencyColor(quote.urgency)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{quote.serviceTitle}</CardTitle>
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={quote.providerAvatar} 
                        alt={quote.providerName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-gray-300">{quote.providerName}</span>
                      <Badge className={`${getStatusColor(quote.status)} text-white`}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm">{quote.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Location:</p>
                      <p className="text-white">{quote.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Budget:</p>
                      <p className="text-white">{quote.budget}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Requested:</p>
                      <p className="text-white">{new Date(quote.requestDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Urgency:</p>
                      <Badge 
                        variant="outline" 
                        className={`border-white/30 text-${quote.urgency === 'high' ? 'red' : quote.urgency === 'medium' ? 'yellow' : 'green'}-400`}
                      >
                        {quote.urgency.charAt(0).toUpperCase() + quote.urgency.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Provider Quote Details */}
                  {quote.providerQuote && (
                    <div className="bg-white/5 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                        Provider Quote
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-400">Total Amount:</p>
                          <p className="text-green-400 font-semibold text-lg">${quote.providerQuote.amount}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Breakdown:</p>
                          <p className="text-white">{quote.providerQuote.breakdown}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Timeline:</p>
                          <p className="text-white">{quote.providerQuote.timeline}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Valid Until:</p>
                          <p className="text-white">{new Date(quote.providerQuote.validUntil).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {quote.status === 'received' && (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleAcceptQuote(quote.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          onClick={() => handleDeclineQuote(quote.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-white/30 text-gray-300 hover:bg-white/10"
                      onClick={() => handleSendMessage(quote)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>

                    {quote.status === 'accepted' && (
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Schedule
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No quotes found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? "You haven't requested any quotes yet." 
                : `No ${filter} quotes found.`
              }
            </p>
            <Link to="/services">
              <Button className="bg-blue-500 hover:bg-blue-600">
                Browse Services
              </Button>
            </Link>
          </div>
        )}

        {/* Message Modal */}
        {isResponseModalOpen && selectedQuote && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="glass-card text-white w-full max-w-md">
              <CardHeader>
                <CardTitle>Message {selectedQuote.providerName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Textarea
                      placeholder="Type your message here..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsResponseModalOpen(false)}
                      className="flex-1 border-white/30 text-gray-300 hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitResponse}
                      disabled={!responseMessage.trim()}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="lg:hidden">
        <Navigation />
      </div>
    </div>
  );
};

export default QuoteManagement;
