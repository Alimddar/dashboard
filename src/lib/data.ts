import { faker } from '@faker-js/faker';
import { subDays } from 'date-fns';
import type { User, Transaction, Balance, PaymentCard } from './types';

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
      // Use a deterministic date based on index to avoid hydration issues
      joinedDate: subDays(refDate, i * 30 + 10).toISOString(),
    });
  }
  return users;
};

export const users: User[] = generateUsers(10);

const generatePaymentCards = (count: number): PaymentCard[] => {
    const cards: PaymentCard[] = [];
    for (let i = 0; i < count; i++) {
        cards.push({
            id: faker.string.uuid(),
            provider: faker.helpers.arrayElement(['Visa', 'Mastercard', 'Amex', 'Discover']),
            lastFour: faker.string.numeric(4),
            expiryDate: `${faker.number.int({min: 1, max: 12}).toString().padStart(2, '0')}/${faker.number.int({min: 25, max: 30})}`,
            status: faker.helpers.arrayElement(['Active', 'Inactive']),
        });
    }
    return cards;
};

export const paymentCards: PaymentCard[] = generatePaymentCards(4);

const generateTransactions = (count: number, userList: User[], cardList: PaymentCard[]): Transaction[] => {
  const transactions: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    const user = userList[i % userList.length]; // Cycle through users deterministically
    const card = cardList[i % cardList.length]; // Cycle through cards deterministically
    transactions.push({
      id: faker.string.uuid(),
      userId: user.id,
      userName: user.name,
      amount: parseFloat(faker.finance.amount({ min: 5, max: 5000, dec: 2 })),
      // Use a deterministic date based on index to avoid hydration issues
      date: subDays(refDate, i).toISOString(),
      status: faker.helpers.arrayElement(['Completed', 'Pending', 'Failed']),
      type: faker.helpers.arrayElement(['deposit', 'withdrawal', 'transfer']),
      cardId: card.id,
      cardProvider: card.provider,
      cardLastFour: card.lastFour,
    });
  }
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const transactions: Transaction[] = generateTransactions(100, users, paymentCards);

const generateBalances = (userList: User[]): Balance[] => {
  return userList.map(user => ({
    userId: user.id,
    userName: user.name,
    balance: parseFloat(faker.finance.amount({ min: 100, max: 50000, dec: 2 })),
    currency: 'AZN',
  }));
};

export const balances: Balance[] = generateBalances(users);
