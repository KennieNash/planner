
import React from 'react';
import { Clock, MapPin, DollarSign, User, Phone, Mail, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job } from '@/contexts/JobContext';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: string) => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
}

const JobCard = ({ job, onViewDetails, getPriorityColor, getStatusColor }: JobCardProps) => {
  const formatScheduleDate = (date?: string, time?: string) => {
    if (!date) return 'Not scheduled';
    const scheduleDate = new Date(`${date}T${time || '00:00'}`);
    return scheduleDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      ...(time && { hour: 'numeric', minute: '2-digit' })
    });
  };

  return (
    <Card className="glass-card hover:bg-white/10 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-white text-lg">{job.serviceType}</CardTitle>
              <Badge className={getPriorityColor(job.priority)}>
                {job.priority === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {job.priority.toUpperCase()}
              </Badge>
            </div>
            <Badge variant="outline" className={getStatusColor(job.status)}>
              {job.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="text-right">
            <p className="text-gray-400 text-sm">
              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </p>
            {job.pricing.estimatedCost && (
              <p className="text-green-400 font-semibold">
                ${job.pricing.estimatedCost}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{job.customerName}</span>
          </div>
          {job.customerPhone && (
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{job.customerPhone}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Mail className="w-4 h-4" />
            <span>{job.customerEmail}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <MapPin className="w-4 h-4" />
          <span>{job.location.address}, {job.location.city}</span>
        </div>

        {/* Schedule */}
        {job.scheduledDate && (
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Clock className="w-4 h-4" />
            <span>Scheduled: {formatScheduleDate(job.scheduledDate, job.scheduledTime)}</span>
            {job.estimatedDuration && (
              <span>({job.estimatedDuration}h estimated)</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2">
          {job.description}
        </p>

        {/* Pricing Info */}
        {(job.pricing.hourlyRate || job.pricing.materialCosts) && (
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <DollarSign className="w-4 h-4" />
            <div className="space-x-4">
              {job.pricing.hourlyRate && (
                <span>Rate: ${job.pricing.hourlyRate}/hr</span>
              )}
              {job.pricing.materialCosts && (
                <span>Materials: ${job.pricing.materialCosts}</span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={() => onViewDetails(job.id)}
            variant="outline"
            size="sm"
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
