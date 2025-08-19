import { transactions, users } from '@/lib/data';
import { TransactionsClient } from './transactions-client';

export default function DashboardPage() {
  // In a real app, you'd fetch this data from an API
  const initialTransactions = transactions;
  const userList = users;

  return <TransactionsClient initialTransactions={initialTransactions} users={userList} />;
}
