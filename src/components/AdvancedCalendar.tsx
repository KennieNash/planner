
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  User,
  AlertTriangle
} from 'lucide-react';
import { useJobs } from '@/contexts/JobContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import JobSchedulingModal from './JobSchedulingModal';

const AdvancedCalendar = () => {
  const { jobs, activeJobs, pendingJobs } = useJobs();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // Get jobs for a specific date
  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => {
      if (!job.scheduledDate) return false;
      return isSameDay(parseISO(job.scheduledDate), date);
    });
  };

  // Get week days for week view
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
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
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return 'No time set';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderMonthView = () => (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border border-white/20 bg-white/5"
        modifiers={{
          hasJobs: (date) => getJobsForDate(date).length > 0
        }}
        modifiersStyles={{
          hasJobs: {
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            color: 'white'
          }
        }}
      />
      
      {/* Selected Date Jobs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getJobsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-400 text-center py-4">No jobs scheduled for this date</p>
          ) : (
            <div className="space-y-3">
              {getJobsForDate(selectedDate).map(job => (
                <div key={job.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium">{job.serviceType}</h4>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className={getPriorityColor(job.priority)}>
                        {job.priority === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {job.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(job.status)}>
                        {job.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(job.scheduledTime)}</span>
                      {job.estimatedDuration && (
                        <span className="text-gray-400">({job.estimatedDuration}h estimated)</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{job.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location.address}, {job.location.city}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderWeekView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
          className="border-white/20 text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-white font-semibold">
          {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
          className="border-white/20 text-white hover:bg-white/20"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => (
          <Card key={day.toISOString()} className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white text-center">
                <div>{format(day, 'EEE')}</div>
                <div className="text-xl">{format(day, 'd')}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {getJobsForDate(day).map(job => (
                  <div key={job.id} className="bg-blue-500/20 rounded p-1 text-xs text-blue-300">
                    <div className="truncate">{job.serviceType}</div>
                    <div className="text-gray-400">{formatTime(job.scheduledTime)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDayView = () => {
    const dayJobs = getJobsForDate(selectedDate).sort((a, b) => {
      const timeA = a.scheduledTime || '00:00';
      const timeB = b.scheduledTime || '00:00';
      return timeA.localeCompare(timeB);
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
            className="border-white/20 text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-white font-semibold">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
            className="border-white/20 text-white hover:bg-white/20"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Card className="glass-card">
          <CardContent className="p-6">
            {dayJobs.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No jobs scheduled for this day</p>
                <Button 
                  onClick={() => setShowSchedulingModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Job
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dayJobs.map(job => (
                  <div key={job.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h4 className="text-white font-medium text-lg">{job.serviceType}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(job.scheduledTime)}</span>
                          {job.estimatedDuration && (
                            <span className="text-gray-400">- {job.estimatedDuration} hours</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className={getPriorityColor(job.priority)}>
                          {job.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(job.status)}>
                          {job.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{job.customerName}</span>
                        {job.customerPhone && (
                          <span className="text-gray-400">• {job.customerPhone}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location.address}, {job.location.city}</span>
                      </div>
                      {job.description && (
                        <p className="text-gray-400 mt-2">{job.description}</p>
                      )}
                    </div>

                    {job.pricing.estimatedCost && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <span className="text-green-400 font-medium">
                          Estimated: ${job.pricing.estimatedCost}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Schedule & Calendar</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowSchedulingModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Job
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={view} onValueChange={(value) => setView(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="month" className="text-white data-[state=active]:bg-blue-500">
            Month
          </TabsTrigger>
          <TabsTrigger value="week" className="text-white data-[state=active]:bg-blue-500">
            Week
          </TabsTrigger>
          <TabsTrigger value="day" className="text-white data-[state=active]:bg-blue-500">
            Day
          </TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-6">
          {renderMonthView()}
        </TabsContent>

        <TabsContent value="week" className="mt-6">
          {renderWeekView()}
        </TabsContent>

        <TabsContent value="day" className="mt-6">
          {renderDayView()}
        </TabsContent>
      </Tabs>

      {/* Scheduling Modal */}
      {showSchedulingModal && (
        <JobSchedulingModal
          jobId={selectedJob}
          defaultDate={selectedDate}
          onClose={() => {
            setShowSchedulingModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default AdvancedCalendar;
