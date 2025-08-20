'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, ChevronDown, CreditCard } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import type { Transaction, User, PaymentCard } from '@/lib/types';

export function TransactionsClient({
  initialTransactions,
  users,
  cards
}: {
  initialTransactions: Transaction[];
  users: User[];
  cards: PaymentCard[];
}) {
  const [transactions, setTransactions] = React.useState(initialTransactions);
  const { toast } = useToast();

  const handleUpdateTransactionStatus = (transactionId: string, status: 'Completed' | 'Failed') => {
    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === transactionId ? { ...t, status } : t
      )
    );
    toast({
      title: 'Transaction Updated',
      description: `Transaction status has been changed to ${status}.`,
    });
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
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map(transaction => (
                  <Collapsible asChild key={transaction.id} tagName="tbody">
                    <>
                      <TableRow>
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
                          {new Intl.NumberFormat('az-AZ', { style: 'currency', currency: 'AZN' }).format(transaction.amount)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center">
                          <Badge variant={getStatusBadgeVariant(transaction.status)}>{transaction.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex justify-end gap-2">
                            {transaction.status === 'Pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                  onClick={() => handleUpdateTransactionStatus(transaction.id, 'Completed')}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Verify
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                  onClick={() => handleUpdateTransactionStatus(transaction.id, 'Failed')}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            </div>
                        </TableCell>
                        <TableCell>
                          <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="icon" className="data-[state=open]:rotate-180">
                                  <ChevronDown className="h-4 w-4" />
                                  <span className="sr-only">Toggle details</span>
                              </Button>
                          </CollapsibleTrigger>
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                          <TableRow>
                              <TableCell colSpan={6}>
                                  <div className="p-4 bg-muted/50">
                                      <div className="flex items-center gap-3">
                                          <CreditCard className="w-6 h-6" />
                                          <div>
                                              <p className="font-medium">Payment Card</p>
                                              <p className="text-sm text-muted-foreground">{transaction.cardProvider} ending in {transaction.cardLastFour}</p>
                                          </div>
                                      </div>
                                  </div>
                              </TableCell>
                          </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
