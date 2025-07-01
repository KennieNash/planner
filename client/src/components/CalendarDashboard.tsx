
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useJobs } from '@/contexts/JobContext';
import AdvancedCalendar from './AdvancedCalendar';
import { format, isToday, isTomorrow, parseISO, startOfWeek, endOfWeek } from 'date-fns';

const CalendarDashboard = () => {
  const { jobs, activeJobs } = useJobs();

  // Get scheduled jobs for analytics
  const scheduledJobs = jobs.filter(job => job.scheduledDate);
  const todayJobs = scheduledJobs.filter(job => isToday(parseISO(job.scheduledDate!)));
  const tomorrowJobs = scheduledJobs.filter(job => isTomorrow(parseISO(job.scheduledDate!)));
  
  const thisWeekJobs = scheduledJobs.filter(job => {
    const jobDate = parseISO(job.scheduledDate!);
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return jobDate >= weekStart && jobDate <= weekEnd;
  });

  const upcomingJobs = scheduledJobs
    .filter(job => parseISO(job.scheduledDate!) > new Date())
    .sort((a, b) => parseISO(a.scheduledDate!).getTime() - parseISO(b.scheduledDate!).getTime())
    .slice(0, 5);

  const formatTime = (time?: string) => {
    if (!time) return 'No time set';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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

  return (
    <div className="space-y-6">
      {/* Calendar Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{todayJobs.length}</div>
            <div className="text-sm text-gray-400">Today's Jobs</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{tomorrowJobs.length}</div>
            <div className="text-sm text-gray-400">Tomorrow's Jobs</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{thisWeekJobs.length}</div>
            <div className="text-sm text-gray-400">This Week</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{activeJobs.length}</div>
            <div className="text-sm text-gray-400">Active Jobs</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <AdvancedCalendar />
        </div>

        {/* Upcoming Jobs Sidebar */}
        <div className="lg:col-span-1">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Upcoming Jobs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingJobs.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No upcoming jobs scheduled</p>
              ) : (
                <div className="space-y-3">
                  {upcomingJobs.map(job => (
                    <div key={job.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="text-white font-medium text-sm line-clamp-2">
                            {job.serviceType}
                          </h4>
                          {job.priority === 'urgent' && (
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-300">
                          <div className="flex items-center justify-between">
                            <span>{format(parseISO(job.scheduledDate!), 'MMM d')}</span>
                            <span>{formatTime(job.scheduledTime)}</span>
                          </div>
                          <div className="truncate">{job.customerName}</div>
                        </div>
                        
                        <Badge variant="outline" className={getStatusColor(job.status)}>
                          {job.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          {todayJobs.length > 0 && (
            <Card className="glass-card mt-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayJobs
                    .sort((a, b) => (a.scheduledTime || '00:00').localeCompare(b.scheduledTime || '00:00'))
                    .map(job => (
                    <div key={job.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-400 font-medium text-sm">
                            {formatTime(job.scheduledTime)}
                          </span>
                          {job.estimatedDuration && (
                            <span className="text-gray-400 text-xs">
                              {job.estimatedDuration}h
                            </span>
                          )}
                        </div>
                        <h4 className="text-white text-sm">{job.serviceType}</h4>
                        <p className="text-gray-400 text-xs">{job.customerName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDashboard;
