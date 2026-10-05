import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render, fireEvent } from '@testing-library/react-native';

import { AppShell } from '../App';
import { AppDataProvider } from '../src/state/AppData';
import DashboardScreen from '../src/screens/DashboardScreen';
import DashboardMenuScreen from '../src/screens/DashboardMenuScreen';
import DashboardStatsScreen from '../src/screens/DashboardStatsScreen';
import MoneyScreen from '../src/screens/MoneyScreen';
import MoneyReportScreen from '../src/screens/MoneyReportScreen';
import AddExpenseScreen from '../src/screens/AddExpenseScreen';
import TimeScreen from '../src/screens/TimeScreen';
import TimeCalendarScreen from '../src/screens/TimeCalendarScreen';
import AddAppointmentScreen from '../src/screens/AddAppointmentScreen';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

function isSelected(instance: { props: Record<string, unknown> }): boolean {
  const state = instance.props.accessibilityState as
    | { selected?: boolean }
    | undefined;
  return (
    (state?.selected as boolean | undefined) ??
    (instance.props['aria-selected'] as boolean | undefined) ??
    false
  );
}

describe('app shell', () => {
  // The `tab-*` and `screen-*` testIDs are part of the scaffold's structural
  // contract: the tab bar buttons and every registered screen carry them, so a
  // tab switch can be asserted without touching any screen's placeholder copy.
  it('boots on the Dashboard and registers the three tabs', async () => {
    const view = await render(<AppShell />);

    expect(view.getByTestId('screen-dashboard-home')).toBeTruthy();
    expect(view.getByTestId('tab-dashboard')).toBeTruthy();
    expect(view.getByTestId('tab-money')).toBeTruthy();
    expect(view.getByTestId('tab-time')).toBeTruthy();
  });

  it('switches the visible view when another tab is pressed', async () => {
    const view = await render(<AppShell />);

    await fireEvent.press(view.getByTestId('tab-money'));
    expect(view.getByTestId('screen-money-list')).toBeTruthy();
    expect(view.queryByTestId('screen-dashboard-home')).toBeNull();

    await fireEvent.press(view.getByTestId('tab-time'));
    expect(view.getByTestId('screen-time-list')).toBeTruthy();
    expect(view.queryByTestId('screen-money-list')).toBeNull();

    await fireEvent.press(view.getByTestId('tab-dashboard'));
    expect(view.getByTestId('screen-dashboard-home')).toBeTruthy();
  });

  it('marks the active tab as selected', async () => {
    const view = await render(<AppShell />);

    expect(isSelected(view.getByTestId('tab-dashboard'))).toBe(true);
    expect(isSelected(view.getByTestId('tab-money'))).toBe(false);

    await fireEvent.press(view.getByTestId('tab-money'));

    expect(isSelected(view.getByTestId('tab-money'))).toBe(true);
    expect(isSelected(view.getByTestId('tab-dashboard'))).toBe(false);
  });
});

const Stack = createNativeStackNavigator();

const REGISTERED_SCREENS: Array<[string, React.ComponentType<object>]> = [
  ['DashboardHome', DashboardScreen as unknown as React.ComponentType<object>],
  ['DashboardMenu', DashboardMenuScreen as unknown as React.ComponentType<object>],
  ['DashboardStats', DashboardStatsScreen as unknown as React.ComponentType<object>],
  ['MoneyList', MoneyScreen as unknown as React.ComponentType<object>],
  ['MoneyReport', MoneyReportScreen as unknown as React.ComponentType<object>],
  ['AddExpense', AddExpenseScreen as unknown as React.ComponentType<object>],
  ['TimeList', TimeScreen as unknown as React.ComponentType<object>],
  ['TimeCalendar', TimeCalendarScreen as unknown as React.ComponentType<object>],
  ['AddAppointment', AddAppointmentScreen as unknown as React.ComponentType<object>],
];

describe.each(REGISTERED_SCREENS)('registered screen %s', (_name, Screen) => {
  it('mounts without crashing', async () => {
    const view = await render(
      <AppDataProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Route" component={Screen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppDataProvider>,
    );

    expect(view.toJSON()).toBeTruthy();
  });
});
