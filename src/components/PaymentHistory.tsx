
import React, { useState } from 'react';
import { Download, Filter, Search, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Payment {
  id: string;
  customerName: string;
  serviceType: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  paymentMethod: string;
  invoiceId: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
  onDownloadInvoice: (invoiceId: string) => void;
  onExportData: () => void;
}

const PaymentHistory = ({ payments, onDownloadInvoice, onExportData }: PaymentHistoryProps) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Payment History</CardTitle>
          <Button
            onClick={onExportData}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            {['all', 'completed', 'pending', 'failed'].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(filterOption as typeof filter)}
                className={filter === filterOption ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20">
                <TableHead className="text-gray-300">Customer</TableHead>
                <TableHead className="text-gray-300">Service</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Payment Method</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">{payment.customerName}</TableCell>
                  <TableCell className="text-gray-300">{payment.serviceType}</TableCell>
                  <TableCell className="text-white font-medium">${payment.amount}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(payment.status)} text-white text-xs`}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{payment.date}</TableCell>
                  <TableCell className="text-gray-300">{payment.paymentMethod}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadInvoice(payment.invoiceId)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {searchTerm ? 'No payments match your search.' : `No ${filter === 'all' ? '' : filter + ' '}payments found.`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
