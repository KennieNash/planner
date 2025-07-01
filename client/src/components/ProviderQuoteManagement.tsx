
import React, { useState } from 'react';
import { MessageSquare, Filter, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProviderQuoteCard from './ProviderQuoteCard';

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

interface ProviderQuoteManagementProps {
  quoteRequests: QuoteRequest[];
  onRespondToQuote: (id: number, response: any) => void;
  onAcceptQuote: (id: number) => void;
  onDeclineQuote: (id: number) => void;
}

const ProviderQuoteManagement = ({ 
  quoteRequests, 
  onRespondToQuote, 
  onAcceptQuote, 
  onDeclineQuote 
}: ProviderQuoteManagementProps) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'accepted' | 'declined'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = quoteRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = quoteRequests.filter(r => r.status === 'pending').length;

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Quote Requests
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {pendingCount}
              </span>
            )}
          </CardTitle>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            {['all', 'pending', 'responded', 'accepted', 'declined'].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(filterOption as typeof filter)}
                className={filter === filterOption ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                {filterOption === 'pending' && pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchTerm ? 'No quote requests match your search.' : `No ${filter === 'all' ? '' : filter + ' '}quote requests found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <ProviderQuoteCard
                key={request.id}
                quoteRequest={request}
                onRespond={onRespondToQuote}
                onAccept={onAcceptQuote}
                onDecline={onDeclineQuote}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderQuoteManagement;
