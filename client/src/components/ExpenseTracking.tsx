
import React, { useState } from 'react';
import { Receipt, Plus, Calendar, Tag, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  receipt?: string;
  taxDeductible: boolean;
}

interface ExpenseTrackingProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onViewReceipt: (expenseId: string) => void;
}

const ExpenseTracking = ({ expenses, onAddExpense, onViewReceipt }: ExpenseTrackingProps) => {
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...new Set(expenses.map(exp => exp.category))];
  
  const filteredExpenses = expenses.filter(expense => 
    filter === 'all' || expense.category === filter
  );

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const taxDeductibleTotal = expenses
    .filter(exp => exp.taxDeductible)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const currentMonth = new Date().getMonth();
  const monthlyExpenses = expenses
    .filter(exp => new Date(exp.date).getMonth() === currentMonth)
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Expense Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">${totalExpenses.toLocaleString()}</div>
                <p className="text-sm text-red-400">Total Expenses</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">${monthlyExpenses.toLocaleString()}</div>
            <p className="text-sm text-orange-400">This Month</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">${taxDeductibleTotal.toLocaleString()}</div>
            <p className="text-sm text-green-400">Tax Deductible</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Management */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Expense Tracking
            </CardTitle>
            <Button
              onClick={onAddExpense}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(category)}
                className={filter === category ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}
              >
                <Tag className="w-3 h-3 mr-1" />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Description</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Tax Deductible</TableHead>
                  <TableHead className="text-gray-300">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-gray-300">{expense.date}</TableCell>
                    <TableCell className="text-white">{expense.description}</TableCell>
                    <TableCell>
                      <Badge className="bg-purple-500 text-white text-xs">
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white font-medium">${expense.amount}</TableCell>
                    <TableCell>
                      <Badge className={expense.taxDeductible ? 'bg-green-500' : 'bg-gray-500'}>
                        {expense.taxDeductible ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {expense.receipt && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewReceipt(expense.id)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Receipt className="w-4 h-4" />
                        </Button>
                      )}
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

export default ExpenseTracking;
