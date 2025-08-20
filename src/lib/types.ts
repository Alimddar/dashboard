export type User = {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
};

export type Transaction = {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'deposit' | 'withdrawal' | 'transfer';
  cardId: string;
  cardProvider: string;
  cardLastFour: string;
};

export type Balance = {
  userId: string;
  userName: string;
  balance: number;
  currency: string;
};

export type PaymentCard = {
    id: string;
    provider: string;
    lastFour: string;
    expiryDate: string;
    status: 'Active' | 'Inactive';
};
