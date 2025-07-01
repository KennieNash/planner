
import React from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  lastPayout: string;
  nextPayout: string;
  payoutFrequency: 'weekly' | 'monthly';
}

interface EarningsOverviewProps {
  earnings: EarningsData;
}

const EarningsOverview = ({ earnings }: EarningsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Total Earnings</CardTitle>
          <DollarSign className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            ${earnings.totalEarnings.toLocaleString()}
          </div>
          <p className="text-xs text-green-400">All time</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            ${earnings.monthlyEarnings.toLocaleString()}
          </div>
          <p className="text-xs text-blue-400">+12% from last month</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Pending Payouts</CardTitle>
          <CreditCard className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            ${earnings.pendingPayouts.toLocaleString()}
          </div>
          <p className="text-xs text-yellow-400">Processing</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Next Payout</CardTitle>
          <Calendar className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{earnings.nextPayout}</div>
          <p className="text-xs text-purple-400">{earnings.payoutFrequency} schedule</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsOverview;
