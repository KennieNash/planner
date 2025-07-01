
import React from 'react';
import { TrendingUp, Clock, CheckCircle, DollarSign, Star, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomerStatsProps {
  stats: {
    activeRequests: number;
    completedServices: number;
    totalSpent: number;
    savedProviders: number;
    avgRating: number;
    pendingQuotes: number;
  };
}

const CustomerStats = ({ stats }: CustomerStatsProps) => {
  const statCards = [
    {
      title: 'Active Requests',
      value: stats.activeRequests,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      description: 'In progress'
    },
    {
      title: 'Completed Services',
      value: stats.completedServices,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      description: 'All time'
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      description: 'Lifetime'
    },
    {
      title: 'Pending Quotes',
      value: stats.pendingQuotes,
      icon: FileText,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      description: 'Awaiting response'
    },
    {
      title: 'Average Rating',
      value: stats.avgRating,
      icon: Star,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      description: 'Given to providers'
    },
    {
      title: 'Saved Providers',
      value: stats.savedProviders,
      icon: TrendingUp,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      description: 'Favorites'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CustomerStats;
