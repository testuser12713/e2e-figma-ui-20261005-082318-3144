import { Transaction } from './types';

/**
 * Typed sample transactions, spread over several days and categories.
 * The Money Management list needs at least 8 rows; the dashboard totals are
 * recomputed from this array by the AppData provider.
 */
export const transactions: Transaction[] = [
  {
    id: 'txn-001',
    title: 'Monthly Salary',
    category: 'Income',
    date: '2020-04-01',
    amount: 3200,
    kind: 'income',
  },
  {
    id: 'txn-002',
    title: 'Spend On Fun Mall Cinema',
    category: 'Movie',
    date: '2020-04-02',
    amount: 23,
    kind: 'expense',
  },
  {
    id: 'txn-003',
    title: 'Spend On Starbucks',
    category: 'Coffee',
    date: '2020-04-02',
    amount: 13,
    kind: 'expense',
  },
  {
    id: 'txn-004',
    title: 'Spend On Super Market',
    category: 'Shop',
    date: '2020-04-05',
    amount: 43,
    kind: 'expense',
  },
  {
    id: 'txn-005',
    title: 'Freelance Project',
    category: 'Income',
    date: '2020-04-06',
    amount: 850,
    kind: 'income',
  },
  {
    id: 'txn-006',
    title: 'Spend On Super Market',
    category: 'Shop',
    date: '2020-04-08',
    amount: 25,
    kind: 'expense',
  },
  {
    id: 'txn-007',
    title: 'Fuel Station',
    category: 'Gas',
    date: '2020-04-10',
    amount: 68.5,
    kind: 'expense',
  },
  {
    id: 'txn-008',
    title: 'Electricity Bill',
    category: 'Home',
    date: '2020-04-12',
    amount: 96.4,
    kind: 'expense',
  },
  {
    id: 'txn-009',
    title: 'Birthday Gift',
    category: 'Friends',
    date: '2020-04-14',
    amount: 40,
    kind: 'expense',
  },
  {
    id: 'txn-010',
    title: 'Interest Refund',
    category: 'Income',
    date: '2020-04-15',
    amount: 120,
    kind: 'income',
  },
];
