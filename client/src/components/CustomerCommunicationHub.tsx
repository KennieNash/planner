
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Phone, Video, Mail, Search, Filter, Star, Clock, MapPin } from 'lucide-react';
import MessagingInterface from './MessagingInterface';
import CustomerProfileModal from './CustomerProfileModal';

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

const CustomerCommunicationHub = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // Mock customer data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      rating: 5,
      totalJobs: 12,
      lastContact: '2024-01-15T10:30:00Z',
      status: 'active',
      location: { city: 'Seattle', state: 'WA' },
      tags: ['VIP', 'Regular'],
      notes: 'Prefers morning appointments. Emergency contact for plumbing.'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 987-6543',
      rating: 4,
      totalJobs: 8,
      lastContact: '2024-01-14T16:45:00Z',
      status: 'active',
      location: { city: 'Bellevue', state: 'WA' },
      tags: ['New Customer'],
      notes: 'First-time customer. Kitchen renovation project.'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      rating: 5,
      totalJobs: 25,
      lastContact: '2024-01-12T09:15:00Z',
      status: 'active',
      location: { city: 'Tacoma', state: 'WA' },
      tags: ['VIP', 'Commercial'],
      notes: 'Commercial property manager. Multiple locations.'
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatLastContact = (timestamp: string) => {
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

  const handleViewProfile = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowProfile(true);
  };

  const handleStartConversation = (customer: Customer) => {
    console.log('Starting conversation with:', customer.name);
    // This would typically navigate to the messaging interface
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Customer Communications</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/20">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="messages" className="text-white data-[state=active]:bg-blue-500">
            Messages
          </TabsTrigger>
          <TabsTrigger value="customers" className="text-white data-[state=active]:bg-blue-500">
            Customers
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-500">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-6">
          <Card className="glass-card">
            <CardContent className="p-0">
              <div className="h-[600px]">
                <MessagingInterface />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <div className="grid gap-4">
            {filteredCustomers.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <p className="text-gray-400">
                    {searchTerm ? 'No customers found matching your search.' : 'No customers yet.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredCustomers.map((customer) => (
                <Card key={customer.id} className="glass-card hover:bg-white/10 transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt={customer.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-medium text-lg">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-white font-semibold text-lg">{customer.name}</h3>
                            <Badge variant="outline" className={
                              customer.status === 'active' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }>
                              {customer.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{customer.email}</span>
                            </div>
                            {customer.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{customer.location.city}, {customer.location.state}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Last contact: {formatLastContact(customer.lastContact)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {customer.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-yellow-400 text-sm">{customer.rating}</span>
                              </div>
                            )}
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-400 text-sm">{customer.totalJobs} jobs</span>
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
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleStartConversation(customer)}
                          variant="outline"
                          size="sm"
                          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button
                          onClick={() => handleViewProfile(customer)}
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/20"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{customers.length}</div>
                <p className="text-green-400 text-xs">+2 this week</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Active Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">8</div>
                <p className="text-blue-400 text-xs">3 unread</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12m</div>
                <p className="text-green-400 text-xs">-3m from last week</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">4.8</div>
                <p className="text-yellow-400 text-xs">★ Average rating</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedCustomer && showProfile && (
        <CustomerProfileModal
          customer={selectedCustomer}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default CustomerCommunicationHub;
