
import React from 'react';
import { Clock, CheckCircle, AlertCircle, Eye, MessageSquare, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface ServiceRequest {
  id: number;
  serviceTitle: string;
  status: 'pending' | 'in-progress' | 'completed';
  providerName?: string;
  requestDate: string;
  completionDate?: string;
  quotesReceived: number;
  price: number | null;
  rating?: number;
}

interface CustomerRequestsOverviewProps {
  requests: ServiceRequest[];
}

const CustomerRequestsOverview = ({ requests }: CustomerRequestsOverviewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Recent Service Requests</CardTitle>
          <Link to="/my-requests">
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No service requests yet</p>
            <Link to="/services">
              <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                Browse Services
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status.replace('-', ' ')}</span>
                      </Badge>
                      {request.quotesReceived > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {request.quotesReceived} quotes
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-white font-medium">{request.serviceTitle}</h3>
                    {request.providerName && (
                      <p className="text-gray-300 text-sm mt-1">Provider: {request.providerName}</p>
                    )}
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

                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
                  {request.completionDate && (
                    <span>Completed: {new Date(request.completionDate).toLocaleDateString()}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  
                  {request.status === 'in-progress' && (
                    <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-500/20">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  )}
                  
                  {request.quotesReceived > 0 && (
                    <Link to="/quotes">
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20">
                        View Quotes
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerRequestsOverview;
