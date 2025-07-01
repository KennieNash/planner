
import React, { useState } from 'react';
import { X, Clock, MapPin, DollarSign, User, Phone, Mail, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useJobs, Job } from '@/contexts/JobContext';
import { formatDistanceToNow } from 'date-fns';

interface JobDetailsModalProps {
  jobId: string;
  onClose: () => void;
}

const JobDetailsModal = ({ jobId, onClose }: JobDetailsModalProps) => {
  const { jobs, updateJobStatus, updateJobSchedule, updateJobPricing, addJobNotes, acceptJob, completeJob, cancelJob } = useJobs();
  const job = jobs.find(j => j.id === jobId);
  
  const [notes, setNotes] = useState('');
  const [scheduledDate, setScheduledDate] = useState(job?.scheduledDate || '');
  const [scheduledTime, setScheduledTime] = useState(job?.scheduledTime || '');
  const [finalCost, setFinalCost] = useState(job?.pricing.finalCost?.toString() || job?.pricing.estimatedCost?.toString() || '');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  if (!job) {
    return null;
  }

  const handleAcceptJob = () => {
    acceptJob(job.id);
    onClose();
  };

  const handleCompleteJob = () => {
    if (finalCost) {
      completeJob(job.id, parseFloat(finalCost), notes || undefined);
      onClose();
    }
  };

  const handleCancelJob = () => {
    if (cancelReason) {
      cancelJob(job.id, cancelReason);
      onClose();
    }
  };

  const handleUpdateSchedule = () => {
    if (scheduledDate && scheduledTime) {
      updateJobSchedule(job.id, scheduledDate, scheduledTime);
    }
  };

  const handleAddNotes = () => {
    if (notes) {
      addJobNotes(job.id, notes);
      setNotes('');
    }
  };

  const handleStatusChange = (status: Job['status']) => {
    updateJobStatus(job.id, status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'accepted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{job.serviceType}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className={getStatusColor(job.status)}>
              {job.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={job.priority === 'urgent' ? 'bg-red-500' : job.priority === 'high' ? 'bg-orange-500' : job.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}>
              {job.priority.toUpperCase()} PRIORITY
            </Badge>
            <span className="text-gray-400 text-sm">
              Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="w-4 h-4" />
                <span>{job.customerName}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>{job.customerEmail}</span>
              </div>
              {job.customerPhone && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>{job.customerPhone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>{job.location.address}, {job.location.city}, {job.location.zipCode}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Job Description */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Job Description</h3>
            <p className="text-gray-300">{job.description}</p>
          </div>

          {/* Schedule */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-300">Date</Label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Time</Label>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleUpdateSchedule}
                  disabled={!scheduledDate || !scheduledTime}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Update Schedule
                </Button>
              </div>
            </div>
            {job.estimatedDuration && (
              <p className="text-gray-400 text-sm">
                Estimated duration: {job.estimatedDuration} hours
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {job.pricing.estimatedCost && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <DollarSign className="w-4 h-4" />
                  <span>Estimated: ${job.pricing.estimatedCost}</span>
                </div>
              )}
              {job.pricing.hourlyRate && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>Rate: ${job.pricing.hourlyRate}/hr</span>
                </div>
              )}
              {job.pricing.materialCosts && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <span>Materials: ${job.pricing.materialCosts}</span>
                </div>
              )}
            </div>
            {job.pricing.finalCost && (
              <div className="text-green-400 font-semibold">
                Final Cost: ${job.pricing.finalCost}
              </div>
            )}
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Notes</h3>
              <div className="bg-gray-800 p-3 rounded-md">
                <p className="text-gray-300 whitespace-pre-wrap">{job.notes}</p>
              </div>
            </div>
          )}

          {/* Add Notes */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold">Add Notes</h3>
            <div className="space-y-2">
              <Textarea
                placeholder="Add notes about this job..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button
                onClick={handleAddNotes}
                disabled={!notes}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
              >
                Add Notes
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Actions</h3>
            
            {job.status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  onClick={handleAcceptJob}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Job
                </Button>
                <Button
                  onClick={() => setShowCancelForm(true)}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Decline Job
                </Button>
              </div>
            )}

            {job.status === 'accepted' && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleStatusChange('in_progress')}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Start Job
                </Button>
                <Button
                  onClick={() => setShowCancelForm(true)}
                  variant="destructive"
                >
                  Cancel Job
                </Button>
              </div>
            )}

            {job.status === 'in_progress' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Final Cost</Label>
                    <Input
                      type="number"
                      placeholder="Enter final cost"
                      value={finalCost}
                      onChange={(e) => setFinalCost(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCompleteJob}
                    disabled={!finalCost}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Job
                  </Button>
                  <Button
                    onClick={() => setShowCancelForm(true)}
                    variant="destructive"
                  >
                    Cancel Job
                  </Button>
                </div>
              </div>
            )}

            {/* Cancel Form */}
            {showCancelForm && (
              <div className="space-y-3 border border-red-500/30 p-4 rounded-md bg-red-500/10">
                <Label className="text-white">Cancellation Reason</Label>
                <Textarea
                  placeholder="Please provide a reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCancelJob}
                    disabled={!cancelReason}
                    variant="destructive"
                  >
                    Confirm Cancellation
                  </Button>
                  <Button
                    onClick={() => setShowCancelForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
