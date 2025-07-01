
import React from 'react';
import { TrendingUp, Users, DollarSign, Star, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProviderStatsProps {
  stats: {
    totalEarnings: number;
    activeRequests: number;
    completedJobs: number;
    averageRating: number;
    responseTime: string;
    completionRate: number;
  };
}

const ProviderStats = ({ stats }: ProviderStatsProps) => {
  const statCards = [
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Active Requests',
      value: stats.activeRequests.toString(),
      icon: Calendar,
      change: '+3',
      trend: 'up'
    },
    {
      title: 'Completed Jobs',
      value: stats.completedJobs.toString(),
      icon: CheckCircle,
      change: '+8',
      trend: 'up'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      change: '+0.2',
      trend: 'up'
    },
    {
      title: 'Response Time',
      value: stats.responseTime,
      icon: Users,
      change: '-15min',
      trend: 'down'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      change: '+2%',
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProviderStats;
