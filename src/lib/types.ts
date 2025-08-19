export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  joinedDate: string;
  avatar: string;
};

export type Transaction = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  type: 'deposit' | 'withdrawal' | 'transfer';
};

export type ActivityLog = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  details: string;
  timestamp: string;
};

export type Balance = {
  userId: string;
  userName: string;
  userAvatar: string;
  balance: number;
  currency: string;
};
