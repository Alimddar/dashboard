import { users, balances } from '@/lib/data';
import { BalancesClient } from './balances-client';

export default function BalancesPage() {
  const initialBalances = balances;
  const userList = users;

  return <BalancesClient initialBalances={initialBalances} users={userList} />;
}
