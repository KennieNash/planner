
import React, { useState } from 'react';
import { FileText, Eye, CheckCircle, X, MessageSquare, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface VerificationQueueItem {
  id: string;
  providerId: string;
  providerName: string;
  documentType: 'license' | 'insurance' | 'certification' | 'portfolio';
  documentName: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
}

interface AdminVerificationQueueProps {
  verificationQueue: VerificationQueueItem[];
  onApprove: (itemId: string, notes?: string) => void;
  onReject: (itemId: string, reason: string) => void;
  onRequestInfo: (itemId: string, message: string) => void;
}

const AdminVerificationQueue = ({
  verificationQueue,
  onApprove,
  onReject,
  onRequestInfo
}: AdminVerificationQueueProps) => {
  const [selectedItem, setSelectedItem] = useState<VerificationQueueItem | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const { toast } = useToast();

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'license': return 'Business License';
      case 'insurance': return 'Insurance Certificate';
      case 'certification': return 'Professional Certification';
      case 'portfolio': return 'Portfolio/Work Samples';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-400">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-green-500 text-green-400">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="border-red-500 text-red-400">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleApprove = () => {
    if (!selectedItem) return;
    onApprove(selectedItem.id, approvalNotes);
    setShowApprovalDialog(false);
    setApprovalNotes('');
    setSelectedItem(null);
    toast({
      title: "Document Approved",
      description: `${selectedItem.documentName} has been approved.`,
    });
  };

  const handleReject = () => {
    if (!selectedItem || !rejectionReason.trim()) return;
    onReject(selectedItem.id, rejectionReason);
    setShowRejectionDialog(false);
    setRejectionReason('');
    setSelectedItem(null);
    toast({
      title: "Document Rejected",
      description: `${selectedItem.documentName} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleRequestInfo = () => {
    if (!selectedItem || !requestMessage.trim()) return;
    onRequestInfo(selectedItem.id, requestMessage);
    setShowRequestDialog(false);
    setRequestMessage('');
    setSelectedItem(null);
    toast({
      title: "Information Requested",
      description: `Request sent to ${selectedItem.providerName}.`,
    });
  };

  const pendingItems = verificationQueue.filter(item => item.status === 'pending');
  const reviewedItems = verificationQueue.filter(item => item.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Reviews */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Pending Reviews ({pendingItems.length})</span>
            <Badge variant="outline" className="border-yellow-500 text-yellow-400">
              Requires Action
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No pending reviews</p>
          ) : (
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div key={item.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-medium">{item.documentName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getDocumentTypeLabel(item.documentType)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {item.providerName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {item.uploadDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.documentUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => window.open(item.documentUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Dialog open={showApprovalDialog && selectedItem?.id === item.id} onOpenChange={setShowApprovalDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300"
                            onClick={() => setSelectedItem(item)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Approve Document</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-gray-300">
                              Approve "{item.documentName}" from {item.providerName}?
                            </p>
                            <div>
                              <Label className="text-gray-300">Approval Notes (Optional)</Label>
                              <Textarea
                                value={approvalNotes}
                                onChange={(e) => setApprovalNotes(e.target.value)}
                                placeholder="Add any notes for the provider..."
                                className="bg-white/10 border-white/20 text-white"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" onClick={() => setShowApprovalDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600">
                                Approve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={showRejectionDialog && selectedItem?.id === item.id} onOpenChange={setShowRejectionDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => setSelectedItem(item)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Reject Document</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-gray-300">
                              Reject "{item.documentName}" from {item.providerName}?
                            </p>
                            <div>
                              <Label className="text-gray-300">Rejection Reason *</Label>
                              <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Please provide a reason for rejection..."
                                className="bg-white/10 border-white/20 text-white"
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" onClick={() => setShowRejectionDialog(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleReject} 
                                className="bg-red-500 hover:bg-red-600"
                                disabled={!rejectionReason.trim()}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={showRequestDialog && selectedItem?.id === item.id} onOpenChange={setShowRequestDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => setSelectedItem(item)}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Request Additional Information</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-gray-300">
                              Request more information about "{item.documentName}" from {item.providerName}?
                            </p>
                            <div>
                              <Label className="text-gray-300">Message *</Label>
                              <Textarea
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                placeholder="What additional information do you need?"
                                className="bg-white/10 border-white/20 text-white"
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" onClick={() => setShowRequestDialog(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleRequestInfo} 
                                className="bg-blue-500 hover:bg-blue-600"
                                disabled={!requestMessage.trim()}
                              >
                                Send Request
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently Reviewed */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Recently Reviewed ({reviewedItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviewedItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recent reviews</p>
          ) : (
            <div className="space-y-3">
              {reviewedItems.slice(0, 10).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-white text-sm">{item.documentName}</p>
                      <p className="text-gray-400 text-xs">{item.providerName} • {item.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(item.status)}
                    {item.documentUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => window.open(item.documentUrl, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVerificationQueue;
