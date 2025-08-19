import { faker } from '@faker-js/faker';
import { subDays } from 'date-fns';
import type { User, Transaction, ActivityLog, Balance } from './types';

// Use a static date for consistent data generation
const refDate = new Date('2024-07-18T10:00:00.000Z');
faker.seed(123);

const generateUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['Admin', 'Editor', 'Viewer']),
      // Use a deterministic date based on index to avoid hydration issues
      joinedDate: subDays(refDate, i * 30 + 10).toISOString(),
    });
  }
  return users;
};

export const users: User[] = generateUsers(10);

const generateTransactions = (count: number, userList: User[]): Transaction[] => {
  const transactions: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(userList);
    transactions.push({
      id: faker.string.uuid(),
      userId: user.id,
      userName: user.name,
      amount: parseFloat(faker.finance.amount({ min: 5, max: 5000, dec: 2 })),
      date: faker.date.recent({ days: 90, refDate }).toISOString(),
      status: faker.helpers.arrayElement(['Completed', 'Pending', 'Failed']),
      type: faker.helpers.arrayElement(['deposit', 'withdrawal', 'transfer']),
    });
  }
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const transactions: Transaction[] = generateTransactions(100, users);

const generateActivityLogs = (count: number, userList: User[]): ActivityLog[] => {
  const logs: ActivityLog[] = [];
  const actions = [
    'Logged in',
    'Updated profile',
    'Created a new user',
    'Deleted a user',
    'Viewed transaction report',
    'Flagged a transaction',
    'Changed user permissions',
  ];
  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(userList.filter(u => u.role === 'Admin' || u.role === 'Editor'));
    logs.push({
      id: faker.string.uuid(),
      userId: user.id,
      userName: user.name,
      action: faker.helpers.arrayElement(actions),
      details: `User ${user.name} performed an action.`,
      timestamp: faker.date.recent({ days: 30, refDate }).toISOString(),
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const activityLogs: ActivityLog[] = generateActivityLogs(50, users);

const generateBalances = (userList: User[]): Balance[] => {
  return userList.map(user => ({
    userId: user.id,
    userName: user.name,
    balance: parseFloat(faker.finance.amount({ min: 100, max: 50000, dec: 2 })),
    currency: faker.finance.currencyCode(),
  }));
};

export const balances: Balance[] = generateBalances(users);
