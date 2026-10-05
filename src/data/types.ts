/**
 * Shared data contract of the sprint.
 * `date` is always an ISO `YYYY-MM-DD` string; `amount` is a positive EUR
 * number and the direction is carried by `kind`.
 */
export type TransactionKind = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  kind: TransactionKind;
}

export interface TimeEntry {
  id: string;
  title: string;
  category: string;
  date: string;
  durationMinutes: number;
}
