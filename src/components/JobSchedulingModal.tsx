
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, User, MapPin, DollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { useJobs } from '@/contexts/JobContext';
import { format } from 'date-fns';

interface JobSchedulingModalProps {
  jobId?: string | null;
  defaultDate?: Date;
  onClose: () => void;
}

const JobSchedulingModal = ({ jobId, defaultDate, onClose }: JobSchedulingModalProps) => {
  const { jobs, pendingJobs, updateJobSchedule, updateJobStatus, updateJobPricing } = useJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>(jobId || '');
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate || new Date());
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [estimatedDuration, setEstimatedDuration] = useState<string>('2');
  const [notes, setNotes] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<string>('');

  const selectedJob = jobs.find(job => job.id === selectedJobId);

  useEffect(() => {
    if (selectedJob) {
      setSelectedDate(selectedJob.scheduledDate ? new Date(selectedJob.scheduledDate) : defaultDate || new Date());
      setSelectedTime(selectedJob.scheduledTime || '09:00');
      setEstimatedDuration(selectedJob.estimatedDuration?.toString() || '2');
      setEstimatedCost(selectedJob.pricing.estimatedCost?.toString() || '');
      setNotes(selectedJob.notes || '');
    }
  }, [selectedJob, defaultDate]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const handleSchedule = () => {
    if (!selectedJobId || !selectedDate) return;

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    // Update job schedule
    updateJobSchedule(selectedJobId, dateString, selectedTime);
    
    // Update estimated duration and cost if provided
    if (estimatedDuration) {
      updateJobPricing(selectedJobId, { 
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined 
      });
    }

    // If job is pending, accept it when scheduling
    if (selectedJob?.status === 'pending') {
      updateJobStatus(selectedJobId, 'accepted', notes || 'Job scheduled and accepted');
    }

    onClose();
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {selectedJob ? 'Schedule Job' : 'Select Job to Schedule'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Selection */}
          {!jobId && (
            <div className="space-y-3">
              <Label className="text-white">Select Job</Label>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Choose a job to schedule" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/20">
                  {pendingJobs.map(job => (
                    <SelectItem key={job.id} value={job.id} className="text-white">
                      {job.serviceType} - {job.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selected Job Details */}
          {selectedJob && (
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-white font-semibold text-lg">{selectedJob.serviceType}</h3>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {selectedJob.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{selectedJob.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedJob.location.city}</span>
                    </div>
                    {selectedJob.customerPhone && (
                      <div className="flex items-center space-x-2">
                        <span>📱 {selectedJob.customerPhone}</span>
                      </div>
                    )}
                    {selectedJob.pricing.estimatedCost && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>${selectedJob.pricing.estimatedCost}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm">{selectedJob.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedJob && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div className="space-y-4">
                <Label className="text-white">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border border-white/20 bg-white/5"
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </div>

              {/* Time and Details */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-white">Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20 max-h-48">
                      {generateTimeSlots().map(time => (
                        <SelectItem key={time} value={time} className="text-white">
                          {formatTime(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Estimated Duration (hours)</Label>
                  <Input
                    type="number"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    min="0.5"
                    max="24"
                    step="0.5"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Estimated Cost ($)</Label>
                  <Input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    min="0"
                    step="10"
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter estimated cost"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any scheduling notes..."
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Schedule Summary */}
          {selectedJob && selectedDate && (
            <Card className="glass-card">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Schedule Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <div className="text-white">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Time:</span>
                    <div className="text-white">{formatTime(selectedTime)}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <div className="text-white">{estimatedDuration} hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={!selectedJobId || !selectedDate}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Clock className="w-4 h-4 mr-2" />
              Schedule Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobSchedulingModal;
