
import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationPreferences from './NotificationPreferences';

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Manage how and when you receive notifications about your business activities.
          </p>
        </CardContent>
      </Card>
      
      <NotificationPreferences />
    </div>
  );
};

export default NotificationSettings;
