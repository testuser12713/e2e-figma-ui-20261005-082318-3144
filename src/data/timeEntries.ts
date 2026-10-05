import { TimeEntry } from './types';

/**
 * Typed sample time entries, spread over several days and categories.
 * The Time Management list needs at least 5 rows and the dashboard stats are
 * derived from these durations by the AppData provider.
 */
export const timeEntries: TimeEntry[] = [
  {
    id: 'time-001',
    title: 'Dentist - Clara Odding',
    category: 'Health',
    date: '2020-04-09',
    durationMinutes: 60,
  },
  {
    id: 'time-002',
    title: 'Team Standup',
    category: 'Work',
    date: '2020-04-09',
    durationMinutes: 30,
  },
  {
    id: 'time-003',
    title: 'Cardiologist - Steven Pauliner',
    category: 'Health',
    date: '2020-04-21',
    durationMinutes: 45,
  },
  {
    id: 'time-004',
    title: 'Gym Session',
    category: 'Fitness',
    date: '2020-04-22',
    durationMinutes: 90,
  },
  {
    id: 'time-005',
    title: 'Dermatologist - Noemi Shinte',
    category: 'Health',
    date: '2020-06-18',
    durationMinutes: 30,
  },
  {
    id: 'time-006',
    title: 'Project Review',
    category: 'Work',
    date: '2020-06-19',
    durationMinutes: 120,
  },
];
