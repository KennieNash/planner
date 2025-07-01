
import React, { useState } from 'react';
import { CreditCard, DollarSign, TrendingUp, RefreshCw, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProviderHandlers } from '@/hooks/useProviderHandlers';
import PaymentProcessor from './PaymentProcessor';

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'payout';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: 'mtn' | 'airtel' | 'stripe';
  date: string;
  description: string;
  customerName?: string;
}

const PaymentManagement = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { handleRefundPayment, handleDownloadInvoice } = useProviderHandlers();

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: 'TXN_001',
      type: 'payment',
      amount: 150000,
      status: 'completed',
      method: 'mtn',
      date: '2024-01-15',
      description: 'Plumbing service payment',
      customerName: 'John Doe'
    },
    {
      id: 'TXN_002', 
      type: 'payout',
      amount: -135000,
      status: 'completed',
      method: 'airtel',
      date: '2024-01-14',
      description: 'Weekly payout'
    },
    {
      id: 'TXN_003',
      type: 'payment',
      amount: 200000,
      status: 'pending',
      method: 'stripe',
      date: '2024-01-13',
      description: 'Electrical installation',
      customerName: 'Sarah Johnson'
    }
  ];

  const totalBalance = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyRevenue = transactions
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'mtn': return '📱';
      case 'airtel': return '📱';
      case 'stripe': return '💳';
      default: return '💰';
    }
  };

  const handleRefund = async (transaction: Transaction) => {
    if (transaction.type === 'payment' && transaction.status === 'completed') {
      await handleRefundPayment(transaction.id, transaction.amount);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{formatAmount(totalBalance)}</div>
                <p className="text-sm text-green-400">Available Balance</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{formatAmount(pendingAmount)}</div>
                <p className="text-sm text-yellow-400">Pending Payments</p>
              </div>
              <RefreshCw className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{formatAmount(monthlyRevenue)}</div>
                <p className="text-sm text-blue-400">This Month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Payment Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
            <Button 
              onClick={() => handleDownloadInvoice('sample-invoice')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Statements
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-gray-300">Transaction ID</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Method</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-mono text-sm">{transaction.id}</TableCell>
                    <TableCell>
                      <Badge className={
                        transaction.type === 'payment' ? 'bg-green-500' :
                        transaction.type === 'refund' ? 'bg-red-500' : 'bg-blue-500'
                      }>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-medium ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {getMethodIcon(transaction.method)} {transaction.method.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(transaction.status)} text-white text-xs`}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{transaction.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {transaction.type === 'payment' && transaction.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRefund(transaction)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <PaymentProcessor
              amount={50000}
              serviceId="test-service"
              onPaymentSuccess={(transactionId) => {
                console.log('Payment successful:', transactionId);
                setShowPaymentModal(false);
              }}
              onPaymentCancel={() => setShowPaymentModal(false)}
            />
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="glass-card max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-white">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Transaction ID</Label>
                <p className="text-white font-mono">{selectedTransaction.id}</p>
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <p className="text-white">{selectedTransaction.description}</p>
              </div>
              {selectedTransaction.customerName && (
                <div>
                  <Label className="text-gray-300">Customer</Label>
                  <p className="text-white">{selectedTransaction.customerName}</p>
                </div>
              )}
              <div>
                <Label className="text-gray-300">Amount</Label>
                <p className={`text-lg font-medium ${selectedTransaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedTransaction.amount > 0 ? '+' : ''}{formatAmount(selectedTransaction.amount)}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => setSelectedTransaction(null)}
                  variant="ghost"
                  className="text-gray-300"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const Label = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

export default PaymentManagement;
