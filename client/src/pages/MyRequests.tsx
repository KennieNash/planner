
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Eye, MessageSquare, Star, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import QuotesListModal from '@/components/QuotesListModal';

interface ServiceRequest {
  id: number;
  serviceTitle: string;
  category: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  providerName?: string;
  requestDate: string;
  completionDate?: string;
  price?: number;
  rating?: number;
  quotesCount: number;
}

const MyRequests = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [showQuotesModal, setShowQuotesModal] = useState(false);

  // Mock data
  const requests: ServiceRequest[] = [
    {
      id: 1,
      serviceTitle: 'Emergency Plumbing Repair',
      category: 'Plumbing',
      description: 'Kitchen sink is leaking and needs immediate repair',
      status: 'pending',
      requestDate: '2024-01-15',
      quotesCount: 3
    },
    {
      id: 2,
      serviceTitle: 'House Deep Cleaning',
      category: 'Cleaning',
      description: 'Complete deep cleaning for 3-bedroom house',
      status: 'in-progress',
      providerName: 'Sarah Williams',
      requestDate: '2024-01-10',
      price: 180,
      quotesCount: 2
    },
    {
      id: 3,
      serviceTitle: 'Garden Landscaping',
      category: 'Gardening',
      description: 'Redesign front yard garden with new plants',
      status: 'completed',
      providerName: 'Emma Garcia',
      requestDate: '2023-12-20',
      completionDate: '2023-12-28',
      price: 350,
      rating: 5,
      quotesCount: 1
    }
  ];

  const filteredRequests = requests.filter(request => 
    filter === 'all' || request.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300';
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-20 lg:pb-4">
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-white hover:text-blue-400 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">My Service Requests</h1>
                <p className="text-gray-300">
                  {filteredRequests.length} of {requests.length} requests
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowQuotesModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Quotes
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {(['all', 'pending', 'in-progress', 'completed', 'cancelled'] as const).map((status) => (
              <Button
                key={status}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(status)}
                className={`capitalize whitespace-nowrap ${
                  filter === status 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-300 hover:bg-white/20'
                }`}
              >
                {status.replace('-', ' ')}
                {status !== 'all' && (
                  <span className="ml-1 text-xs">
                    ({requests.filter(r => r.status === status).length})
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-white mb-2">No requests found</h3>
                <p className="text-gray-300 mb-4">
                  {filter === 'all' 
                    ? 'You haven\'t made any service requests yet.' 
                    : `No ${filter.replace('-', ' ')} requests found.`}
                </p>
                <Link to="/services">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Browse Services
                  </Button>
                </Link>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <Card key={request.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {request.category}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-white">{request.serviceTitle}</h3>
                        <p className="text-gray-300 text-sm mt-1">{request.description}</p>
                      </div>
                      
                      {request.price && (
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">${request.price}</div>
                          {request.rating && (
                            <div className="flex items-center mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm ml-1 text-white">{request.rating}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-300">
                      <div>
                        <span className="block text-gray-400">Requested:</span>
                        {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                      {request.providerName && (
                        <div>
                          <span className="block text-gray-400">Provider:</span>
                          {request.providerName}
                        </div>
                      )}
                      {request.completionDate && (
                        <div>
                          <span className="block text-gray-400">Completed:</span>
                          {new Date(request.completionDate).toLocaleDateString()}
                        </div>
                      )}
                      <div>
                        <span className="block text-gray-400">Quotes:</span>
                        <span className="font-medium">{request.quotesCount} received</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      {request.status === 'in-progress' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Provider
                        </Button>
                      )}
                      
                      {request.quotesCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowQuotesModal(true)}
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Quotes ({request.quotesCount})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <Navigation />
      </div>

      <QuotesListModal
        isOpen={showQuotesModal}
        onClose={() => setShowQuotesModal(false)}
      />
    </>
  );
};

export default MyRequests;
