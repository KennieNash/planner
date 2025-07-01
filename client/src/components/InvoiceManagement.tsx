
import React, { useState } from 'react';
import { FileText, Download, Send, Plus, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  serviceType: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  jobId: string;
}

interface InvoiceManagementProps {
  invoices: Invoice[];
  onCreateInvoice: () => void;
  onSendInvoice: (invoiceId: string) => void;
  onDownloadInvoice: (invoiceId: string) => void;
  onViewInvoice: (invoiceId: string) => void;
}

const InvoiceManagement = ({
  invoices,
  onCreateInvoice,
  onSendInvoice,
  onDownloadInvoice,
  onViewInvoice
}: InvoiceManagementProps) => {
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');

  const filteredInvoices = invoices.filter(invoice => 
    filter === 'all' || invoice.status === filter
  );

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'paid': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const totalUnpaid = invoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">${totalUnpaid.toLocaleString()}</div>
            <p className="text-sm text-yellow-400">Outstanding Balance</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{invoices.filter(inv => inv.status === 'overdue').length}</div>
            <p className="text-sm text-red-400">Overdue Invoices</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{invoices.filter(inv => inv.status === 'paid').length}</div>
            <p className="text-sm text-green-400">Paid This Month</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{invoices.filter(inv => inv.status === 'draft').length}</div>
            <p className="text-sm text-gray-400">Draft Invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Management */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Invoice Management
            </CardTitle>
            <Button
              onClick={onCreateInvoice}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex space-x-2 mt-4">
            {['all', 'draft', 'sent', 'paid', 'overdue'].map((filterOption) => (
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
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-gray-300">Invoice #</TableHead>
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Service</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Due Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="text-gray-300">{invoice.customerName}</TableCell>
                    <TableCell className="text-gray-300">{invoice.serviceType}</TableCell>
                    <TableCell className="text-white font-medium">${invoice.amount}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(invoice.status)} text-white text-xs`}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{invoice.dueDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewInvoice(invoice.id)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadInvoice(invoice.id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {invoice.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSendInvoice(invoice.id)}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            <Send className="w-4 h-4" />
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
    </div>
  );
};

export default InvoiceManagement;
