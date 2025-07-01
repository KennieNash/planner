
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

interface Appointment {
  id: string;
  title: string;
  customerName: string;
  customerPhone: string;
  time: string;
  duration: number;
  location: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  service: string;
  notes?: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: '1',
      title: 'Emergency Plumbing Repair',
      customerName: 'John Smith',
      customerPhone: '+1 (555) 123-4567',
      time: '09:00',
      duration: 120,
      location: '123 Main St, Seattle',
      status: 'confirmed',
      service: 'Plumbing',
      notes: 'Burst pipe in basement'
    },
    {
      id: '2',
      title: 'Drain Cleaning',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 987-6543',
      time: '14:00',
      duration: 90,
      location: '456 Oak Ave, Seattle',
      status: 'pending',
      service: 'Plumbing'
    },
    {
      id: '3',
      title: 'Bathroom Consultation',
      customerName: 'Mike Wilson',
      customerPhone: '+1 (555) 456-7890',
      time: '11:00',
      duration: 60,
      location: '789 Pine St, Seattle',
      status: 'confirmed',
      service: 'Renovation',
      notes: 'Complete bathroom remodel discussion'
    }
  ];

  const getWeekDays = () => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    return currentDate.toDateString() === today;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-20 lg:pb-4">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/provider-dashboard" className="text-white hover:text-blue-400 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Calendar</h1>
              <p className="text-gray-300">Manage your schedule and appointments</p>
            </div>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Appointment
          </Button>
        </div>

        {/* Calendar Navigation */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                  className="text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold text-white">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                  className="text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={view === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('week')}
                  className={view === 'week' ? 'bg-blue-500' : 'text-gray-300 hover:text-white'}
                >
                  Week
                </Button>
                <Button
                  variant={view === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('day')}
                  className={view === 'day' ? 'bg-blue-500' : 'text-gray-300 hover:text-white'}
                >
                  Day
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card className="glass-card">
              <CardContent className="p-6">
                {view === 'week' ? (
                  <div className="grid grid-cols-7 gap-4">
                    {getWeekDays().map((day, index) => {
                      const isToday = day.toDateString() === new Date().toDateString();
                      const dayAppointments = appointments.filter(apt => {
                        // For demo, just show appointments on today
                        return isToday;
                      });

                      return (
                        <div key={index} className="space-y-2">
                          <div className={`text-center p-2 rounded ${isToday ? 'bg-blue-500 text-white' : 'text-gray-300'}`}>
                            <div className="text-sm font-medium">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="text-lg">{day.getDate()}</div>
                          </div>
                          <div className="space-y-1 min-h-[200px]">
                            {dayAppointments.map((apt) => (
                              <div
                                key={apt.id}
                                className="p-2 bg-white/10 rounded text-xs text-white cursor-pointer hover:bg-white/20 transition-colors"
                              >
                                <div className="font-medium">{apt.time}</div>
                                <div className="truncate">{apt.title}</div>
                                <Badge className={`${getStatusColor(apt.status)} text-white text-xs mt-1`}>
                                  {apt.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {formatDate(currentDate)}
                    </h3>
                    <div className="space-y-2">
                      {todayAppointments.map((apt) => (
                        <div key={apt.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Badge className={`${getStatusColor(apt.status)} text-white`}>
                                {apt.status}
                              </Badge>
                              <span className="text-white font-medium">{apt.time}</span>
                            </div>
                            <span className="text-gray-400 text-sm">{apt.duration} mins</span>
                          </div>
                          <h4 className="text-white font-semibold mb-1">{apt.title}</h4>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              {apt.customerName} - {apt.customerPhone}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {apt.location}
                            </div>
                            {apt.notes && (
                              <div className="flex items-start">
                                <Clock className="w-4 h-4 mr-2 mt-0.5" />
                                {apt.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Appointments</span>
                    <span className="text-white font-semibold">{todayAppointments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Hours Scheduled</span>
                    <span className="text-white font-semibold">
                      {Math.round(todayAppointments.reduce((acc, apt) => acc + apt.duration, 0) / 60)}h
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Confirmed</span>
                    <span className="text-green-400 font-semibold">
                      {todayAppointments.filter(apt => apt.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Pending</span>
                    <span className="text-yellow-400 font-semibold">
                      {todayAppointments.filter(apt => apt.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Appointment
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Set Availability
                </Button>
                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  View Requests
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.slice(0, 3).map((apt) => (
                    <div key={apt.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">{apt.time}</span>
                        <Badge className={`${getStatusColor(apt.status)} text-white text-xs`}>
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm truncate">{apt.title}</p>
                      <p className="text-gray-400 text-xs">{apt.customerName}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <Navigation />
      </div>
    </div>
  );
};

export default Calendar;
