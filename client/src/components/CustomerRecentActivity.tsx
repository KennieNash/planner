
import React from 'react';
import { Clock, MessageSquare, FileText, CheckCircle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
  id: number;
  type: 'quote' | 'message' | 'completion' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
}

interface CustomerRecentActivityProps {
  activities: Activity[];
}

const CustomerRecentActivity = ({ activities }: CustomerRecentActivityProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quote': return FileText;
      case 'message': return MessageSquare;
      case 'completion': return CheckCircle;
      case 'payment': return DollarSign;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'quote': return 'text-purple-400';
      case 'message': return 'text-blue-400';
      case 'completion': return 'text-green-400';
      case 'payment': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
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

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Icon className={`w-5 h-5 mt-0.5 ${getActivityColor(activity.type)}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white">{activity.title}</h4>
                    <p className="text-sm text-gray-300 truncate">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{formatTime(activity.timestamp)}</span>
                      {activity.amount && (
                        <span className="text-sm font-medium text-green-400">${activity.amount}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerRecentActivity;
