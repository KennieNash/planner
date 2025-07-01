
import React, { useState } from 'react';
import { User, Shield, ShieldCheck, ShieldX, Eye, MessageSquare, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  serviceType: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended';
  joinDate: string;
  lastActive: string;
  totalJobs: number;
  rating: number;
  totalEarnings: number;
}

interface AdminProviderManagementProps {
  onSendMessage?: (providerId: string, message: string) => void;
  onSuspendProvider?: (providerId: string, reason: string) => void;
  onActivateProvider?: (providerId: string) => void;
}

const AdminProviderManagement = ({
  onSendMessage,
  onSuspendProvider,
  onActivateProvider
}: AdminProviderManagementProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [suspendReason, setSuspendReason] = useState('');

  // Mock provider data
  const [providers] = useState<Provider[]>([
    {
      id: '1',
      name: 'John Smith',
      businessName: 'John Smith Plumbing',
      email: 'john@smithplumbing.com',
      phone: '+1 (555) 123-4567',
      serviceType: 'Plumbing',
      verificationStatus: 'verified',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      totalJobs: 45,
      rating: 4.8,
      totalEarnings: 12500
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      businessName: 'Sarah Johnson Electrical',
      email: 'sarah@sjelectrical.com',
      phone: '+1 (555) 234-5678',
      serviceType: 'Electrical',
      verificationStatus: 'pending',
      joinDate: '2024-01-20',
      lastActive: '1 day ago',
      totalJobs: 0,
      rating: 0,
      totalEarnings: 0
    },
    {
      id: '3',
      name: 'Mike Wilson',
      businessName: 'Mike Wilson HVAC',
      email: 'mike@wilsonhvac.com',
      phone: '+1 (555) 345-6789',
      serviceType: 'HVAC',
      verificationStatus: 'verified',
      joinDate: '2023-12-10',
      lastActive: '30 minutes ago',
      totalJobs: 78,
      rating: 4.9,
      totalEarnings: 18750
    },
    {
      id: '4',
      name: 'Lisa Brown',
      businessName: 'Brown Cleaning Services',
      email: 'lisa@browncleaning.com',
      phone: '+1 (555) 456-7890',
      serviceType: 'Cleaning',
      verificationStatus: 'suspended',
      joinDate: '2024-01-05',
      lastActive: '5 days ago',
      totalJobs: 23,
      rating: 3.2,
      totalEarnings: 3200
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Rejected</Badge>;
      case 'suspended':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <ShieldCheck className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Shield className="w-4 h-4 text-yellow-400" />;
      case 'rejected':
        return <ShieldX className="w-4 h-4 text-red-400" />;
      case 'suspended':
        return <Ban className="w-4 h-4 text-gray-400" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || provider.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = () => {
    if (!selectedProvider || !messageText.trim()) return;
    
    onSendMessage?.(selectedProvider.id, messageText);
    setShowMessageDialog(false);
    setMessageText('');
    setSelectedProvider(null);
    
    toast({
      title: "Message Sent",
      description: `Message sent to ${selectedProvider.name}`,
    });
  };

  const handleSuspendProvider = () => {
    if (!selectedProvider || !suspendReason.trim()) return;
    
    onSuspendProvider?.(selectedProvider.id, suspendReason);
    setShowSuspendDialog(false);
    setSuspendReason('');
    setSelectedProvider(null);
    
    toast({
      title: "Provider Suspended",
      description: `${selectedProvider.name} has been suspended`,
      variant: "destructive",
    });
  };

  const handleActivateProvider = (provider: Provider) => {
    onActivateProvider?.(provider.id);
    toast({
      title: "Provider Activated",
      description: `${provider.name} has been reactivated`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Provider Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Providers List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">
            Providers ({filteredProviders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-medium">{provider.name}</h3>
                        {getStatusIcon(provider.verificationStatus)}
                        {getStatusBadge(provider.verificationStatus)}
                      </div>
                      <p className="text-gray-300 text-sm">{provider.businessName}</p>
                      <p className="text-gray-400 text-sm">{provider.email} • {provider.phone}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>Service: {provider.serviceType}</span>
                        <span>Joined: {provider.joinDate}</span>
                        <span>Last Active: {provider.lastActive}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                        <span>Jobs: {provider.totalJobs}</span>
                        {provider.rating > 0 && <span>Rating: {provider.rating}/5</span>}
                        <span>Earnings: ${provider.totalEarnings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Dialog open={showMessageDialog && selectedProvider?.id === provider.id} onOpenChange={setShowMessageDialog}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-400 hover:text-green-300"
                          onClick={() => setSelectedProvider(provider)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Send Message to {provider.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type your message..."
                            className="bg-white/10 border-white/20 text-white"
                            rows={4}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" onClick={() => setShowMessageDialog(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSendMessage}
                              disabled={!messageText.trim()}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {provider.verificationStatus === 'suspended' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-400 hover:text-green-300"
                        onClick={() => handleActivateProvider(provider)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Dialog open={showSuspendDialog && selectedProvider?.id === provider.id} onOpenChange={setShowSuspendDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => setSelectedProvider(provider)}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Suspend {provider.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-gray-300">
                              Are you sure you want to suspend this provider? They will not be able to receive new bookings.
                            </p>
                            <Textarea
                              value={suspendReason}
                              onChange={(e) => setSuspendReason(e.target.value)}
                              placeholder="Reason for suspension..."
                              className="bg-white/10 border-white/20 text-white"
                              rows={3}
                            />
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" onClick={() => setShowSuspendDialog(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleSuspendProvider}
                                disabled={!suspendReason.trim()}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Suspend Provider
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProviderManagement;
