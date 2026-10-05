import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { AppDataProvider } from '../src/state/AppData';
import TimeCalendarScreen from '../src/screens/TimeCalendarScreen';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
} as never;

const route = {
  key: 'TimeCalendar-1',
  name: 'TimeCalendar' as const,
  params: undefined,
} as never;

function renderScreen() {
  return render(
    <AppDataProvider>
      <TimeCalendarScreen navigation={navigation} route={route} />
    </AppDataProvider>,
  );
}

function isSelected(node: { props: Record<string, unknown> }): boolean {
  const state = node.props.accessibilityState as
    | { selected?: boolean }
    | undefined;
  return state?.selected === true;
}

// The sample time entries live on 2020-04-09 (two of them), 2020-04-21,
// 2020-04-22, 2020-06-18 and 2020-06-19. The screen opens on the week of the
// first entry, so 09/04/2020 is the initial selection and carries a marker.
const FIRST_ENTRY_DAY = 'calendar-day-2020-04-09';
const SECOND_DAY = 'calendar-day-2020-04-10';

describe('TimeCalendarScreen', () => {
  it('renders the header, the range label and a seven-day grid', async () => {
    const view = await renderScreen();

    expect(view.getByTestId('calendar-title')).toHaveTextContent(
      'My Appointments',
    );
    expect(view.getByTestId('calendar-range-label')).toBeTruthy();
    expect(view.getAllByTestId(/^calendar-weekday-\d$/)).toHaveLength(7);
    expect(
      view.getAllByTestId(/^calendar-day-\d{4}-\d{2}-\d{2}$/),
    ).toHaveLength(7);
  });

  it('marks the day that carries time entries', async () => {
    const view = await renderScreen();

    expect(view.getByTestId(`${FIRST_ENTRY_DAY}-entry`)).toBeTruthy();
    expect(view.queryByTestId(`${SECOND_DAY}-entry`)).toBeNull();
  });

  it('highlights the selected day and moves the highlight on tap', async () => {
    const view = await renderScreen();

    const initiallySelected = view.getByTestId(FIRST_ENTRY_DAY);
    const otherDay = view.getByTestId(SECOND_DAY);
    expect(isSelected(initiallySelected)).toBe(true);
    expect(isSelected(otherDay)).toBe(false);

    await fireEvent.press(otherDay);

    expect(isSelected(view.getByTestId(SECOND_DAY))).toBe(true);
    expect(isSelected(view.getByTestId(FIRST_ENTRY_DAY))).toBe(false);
  });

  it('moves to the next week with the range chevron', async () => {
    const view = await renderScreen();

    expect(view.queryByTestId('calendar-day-2020-04-16')).toBeNull();

    await fireEvent.press(view.getByTestId('calendar-next-week'));

    expect(view.getByTestId('calendar-day-2020-04-16')).toBeTruthy();
  });
});
