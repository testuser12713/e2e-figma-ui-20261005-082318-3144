import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { render } from '@testing-library/react-native';

import { AppDataProvider } from '../src/state/AppData';
import MoneyReportScreen from '../src/screens/MoneyReportScreen';
import { MoneyStackParamList } from '../src/navigation/types';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

const Stack = createNativeStackNavigator<MoneyStackParamList>();

function renderReport() {
  return render(
    <AppDataProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MoneyReport" component={MoneyReportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppDataProvider>,
  );
}

describe('MoneyReportScreen', () => {
  it('renders the weekly-report header, chart and legend', async () => {
    const view = await renderReport();

    expect(view.getByTestId('screen-money-report')).toBeTruthy();
    expect(view.getByText('weekly report')).toBeTruthy();
    expect(view.getByTestId('money-report-back')).toBeTruthy();
    expect(view.getByTestId('money-report-legend-expenses')).toBeTruthy();
    expect(view.getByTestId('money-report-legend-deposit')).toBeTruthy();

    for (let index = 0; index < 7; index += 1) {
      expect(view.getByTestId(`money-report-bar-${index}`)).toBeTruthy();
    }
  });

  it('groups the transactions by day and shows each amount', async () => {
    const view = await renderReport();

    expect(view.getByTestId('money-report-day-2020-04-02')).toBeTruthy();
    expect(view.getByTestId('money-report-day-2020-04-01')).toBeTruthy();
    expect(view.getByTestId('money-report-txn-txn-002')).toBeTruthy();

    // The day label is carried by every transaction row of that day.
    expect(view.getAllByText('02- Thursday').length).toBe(2);
    expect(view.getAllByText('01- Wednesday').length).toBe(1);

    // Each transaction shows its formatted amount.
    expect(view.getByText('23.00€')).toBeTruthy();
    expect(view.getByText('13.00€')).toBeTruthy();
    expect(view.getAllByText('Spend On Super Market').length).toBe(2);
  });
});
