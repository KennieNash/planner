
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, Mail, Phone, MapPin, Star, Calendar, DollarSign, 
  MessageCircle, Edit, Save, X, Clock, Briefcase
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rating?: number;
  totalJobs: number;
  lastContact: string;
  status: 'active' | 'inactive' | 'blocked';
  location: {
    city: string;
    state: string;
  };
  tags: string[];
  notes?: string;
}

interface Job {
  id: string;
  serviceType: string;
  status: string;
  date: string;
  cost: number;
}

interface CustomerProfileModalProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerProfileModal = ({ customer, onClose }: CustomerProfileModalProps) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(customer.notes || '');

  // Mock job history data
  const jobHistory: Job[] = [
    {
      id: '1',
      serviceType: 'Emergency Plumbing Repair',
      status: 'completed',
      date: '2024-01-10',
      cost: 285
    },
    {
      id: '2',
      serviceType: 'Drain Cleaning',
      status: 'completed',
      date: '2023-12-15',
      cost: 150
    },
    {
      id: '3',
      serviceType: 'Bathroom Renovation',
      status: 'completed',
      date: '2023-11-20',
      cost: 4500
    }
  ];

  const totalSpent = jobHistory.reduce((sum, job) => sum + job.cost, 0);

  const handleSaveNotes = () => {
    console.log('Saving notes:', notes);
    setIsEditingNotes(false);
    // Here you would typically save to your backend
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Customer Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Header */}
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              {customer.avatar ? (
                <img src={customer.avatar} alt={customer.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={
                    customer.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }>
                    {customer.status}
                  </Badge>
                  {customer.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-medium">{customer.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.location.city}, {customer.location.state}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Customer since Dec 2023</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {customer.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Briefcase className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{customer.totalJobs}</div>
                <div className="text-sm text-gray-400">Total Jobs</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">${totalSpent.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Spent</div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">12m</div>
                <div className="text-sm text-gray-400">Avg Response</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="history" className="text-white data-[state=active]:bg-blue-500">
                Job History
              </TabsTrigger>
              <TabsTrigger value="communication" className="text-white data-[state=active]:bg-blue-500">
                Communication
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-white data-[state=active]:bg-blue-500">
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-4">
              <div className="space-y-3">
                {jobHistory.map((job) => (
                  <Card key={job.id} className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="text-white font-medium">{job.serviceType}</h4>
                          <p className="text-gray-400 text-sm">{formatDate(job.date)}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant="outline" className={getStatusColor(job.status)}>
                            {job.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <p className="text-green-400 font-medium">${job.cost}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="communication" className="mt-4">
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Communication history will be displayed here</p>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Conversation
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Customer Notes</CardTitle>
                  {!isEditingNotes ? (
                    <Button
                      onClick={() => setIsEditingNotes(true)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveNotes}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditingNotes(false);
                          setNotes(customer.notes || '');
                        }}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditingNotes ? (
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this customer..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[120px]"
                    />
                  ) : (
                    <div className="text-gray-300 min-h-[120px]">
                      {notes || (
                        <p className="text-gray-400 italic">No notes yet. Click Edit to add notes about this customer.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/20"
            >
              Close
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerProfileModal;
