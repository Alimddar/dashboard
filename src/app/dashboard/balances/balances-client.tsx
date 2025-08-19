'use client';

import * as React from 'react';
import { format } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Balance, User } from '@/lib/types';

export function BalancesClient({
  initialBalances,
  users,
}: {
  initialBalances: Balance[];
  users: User[];
}) {
  const [balances] = React.useState(initialBalances);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Currency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.length > 0 ? (
                balances.map(balance => (
                  <TableRow key={balance.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={balance.userAvatar} alt={balance.userName} data-ai-hint="avatar" />
                          <AvatarFallback>{balance.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{balance.userName}</p>
                          <p className="text-sm text-muted-foreground">{users.find(u => u.id === balance.userId)?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: balance.currency }).format(balance.balance)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                        {balance.currency}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No balances found.
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
