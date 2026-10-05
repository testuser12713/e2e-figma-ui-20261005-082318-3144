import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { transactions as sampleTransactions } from '../data/transactions';
import { timeEntries as sampleTimeEntries } from '../data/timeEntries';
import { TimeEntry, Transaction } from '../data/types';

export interface AppDataTotals {
  balance: number;
  income: number;
  expenses: number;
  totalMinutes: number;
}

export interface AppDataContextValue {
  transactions: Transaction[];
  timeEntries: TimeEntry[];
  totals: AppDataTotals;
  addTransaction(input: Omit<Transaction, 'id'>): void;
  addTimeEntry(input: Omit<TimeEntry, 'id'>): void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

function computeTotals(
  transactions: Transaction[],
  timeEntries: TimeEntry[],
): AppDataTotals {
  let income = 0;
  let expenses = 0;
  for (const transaction of transactions) {
    if (transaction.kind === 'income') {
      income += transaction.amount;
    } else {
      expenses += transaction.amount;
    }
  }
  const totalMinutes = timeEntries.reduce(
    (sum, entry) => sum + entry.durationMinutes,
    0,
  );
  return {
    balance: income - expenses,
    income,
    expenses,
    totalMinutes,
  };
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    () => sampleTransactions,
  );
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(
    () => sampleTimeEntries,
  );
  const idCounter = useRef(0);

  const nextId = useCallback((prefix: string): string => {
    idCounter.current += 1;
    return `${prefix}-${Date.now().toString(36)}-${idCounter.current}`;
  }, []);

  const addTransaction = useCallback(
    (input: Omit<Transaction, 'id'>): void => {
      setTransactions((current) => [
        { ...input, id: nextId('txn') },
        ...current,
      ]);
    },
    [nextId],
  );

  const addTimeEntry = useCallback(
    (input: Omit<TimeEntry, 'id'>): void => {
      setTimeEntries((current) => [
        { ...input, id: nextId('time') },
        ...current,
      ]);
    },
    [nextId],
  );

  const totals = useMemo(
    () => computeTotals(transactions, timeEntries),
    [transactions, timeEntries],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      transactions,
      timeEntries,
      totals,
      addTransaction,
      addTimeEntry,
    }),
    [transactions, timeEntries, totals, addTransaction, addTimeEntry],
  );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const value = useContext(AppDataContext);
  if (value === null) {
    throw new Error('useAppData must be used inside an AppDataProvider');
  }
  return value;
}
