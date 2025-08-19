'use client';

import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Filter, Search, ShieldAlert, BadgePercent, AlertTriangle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnomalyDialog } from '@/components/anomaly-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Transaction, User } from '@/lib/types';
import { detectTransactionAnomaly } from './actions';

type AnomalyResult = {
  isAnomalous: boolean;
  explanation: string;
  riskScore: number;
} | null;

export function TransactionsClient({
  initialTransactions,
  users,
}: {
  initialTransactions: Transaction[];
  users: User[];
}) {
  const [transactions, setTransactions] = React.useState(initialTransactions);
  const [filters, setFilters] = React.useState({
    user: 'all',
    amountMin: '',
    amountMax: '',
    dateRange: undefined as DateRange | undefined,
  });

  const [anomalyResult, setAnomalyResult] = React.useState<AnomalyResult>(null);
  const [isCheckingAnomaly, setIsCheckingAnomaly] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    let filtered = initialTransactions;

    if (filters.user !== 'all') {
      filtered = filtered.filter(t => t.userId === filters.user);
    }
    if (filters.amountMin) {
      filtered = filtered.filter(t => t.amount >= parseFloat(filters.amountMin));
    }
    if (filters.amountMax) {
      filtered = filtered.filter(t => t.amount <= parseFloat(filters.amountMax));
    }
    if (filters.dateRange?.from) {
      filtered = filtered.filter(t => new Date(t.date) >= (filters.dateRange?.from as Date));
    }
    if (filters.dateRange?.to) {
      filtered = filtered.filter(t => new Date(t.date) <= (filters.dateRange?.to as Date));
    }

    setTransactions(filtered);
  }, [filters, initialTransactions]);

  const handleCheckAnomaly = async (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsCheckingAnomaly(true);
    setAnomalyResult(null);

    try {
      const historicalData = initialTransactions.filter(t => t.userId === transaction.userId && t.id !== transaction.id);
      const result = await detectTransactionAnomaly(transaction, historicalData);
      setAnomalyResult(result);
    } catch (error) {
      console.error('Failed to detect anomaly:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to check for anomaly. Please try again.',
      });
      setIsCheckingAnomaly(false);
    }
  };

  const closeAnomalyDialog = () => {
    setSelectedTransaction(null);
    setIsCheckingAnomaly(false);
  };

  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Failed':
        return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filter Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={filters.user} onValueChange={value => setFilters(f => ({ ...f, user: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min Amount"
                value={filters.amountMin}
                onChange={e => setFilters(f => ({ ...f, amountMin: e.target.value }))}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max Amount"
                value={filters.amountMax}
                onChange={e => setFilters(f => ({ ...f, amountMax: e.target.value }))}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn('w-full justify-start text-left font-normal', !filters.dateRange && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, 'LLL dd, y')} - {format(filters.dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(filters.dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={range => setFilters(f => ({ ...f, dateRange: range }))}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{transaction.userName}</p>
                          <p className="text-sm text-muted-foreground">{transaction.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{format(new Date(transaction.date), 'PP')}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${Number(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>{transaction.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckAnomaly(transaction)}
                        disabled={isCheckingAnomaly && selectedTransaction?.id === transaction.id}
                      >
                         <ShieldAlert className="mr-2 h-4 w-4" />
                        Check Anomaly
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AnomalyDialog
        isOpen={!!selectedTransaction && (isCheckingAnomaly || !!anomalyResult)}
        onClose={closeAnomalyDialog}
        isLoading={isCheckingAnomaly && !anomalyResult}
        result={anomalyResult}
        transaction={selectedTransaction}
      />
    </div>
  );
}
