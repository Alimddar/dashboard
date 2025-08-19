'use server';

import { detectAnomalousTransactions } from '@/ai/flows/detect-anomalous-transactions';
import type { Transaction } from '@/lib/types';

export async function detectTransactionAnomaly(
  transaction: Transaction,
  historicalData: Transaction[]
) {
  try {
    const transactionDataString = JSON.stringify(transaction);
    const historicalDataString = JSON.stringify(historicalData);

    const result = await detectAnomalousTransactions({
      transactionData: transactionDataString,
      historicalTransactionData: historicalDataString,
    });

    return result;
  } catch (error) {
    console.error('Error in detectTransactionAnomaly server action:', error);
    throw new Error('Failed to process transaction anomaly detection.');
  }
}
