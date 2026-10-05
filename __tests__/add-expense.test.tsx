import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { render, fireEvent } from '@testing-library/react-native';

import { AppDataProvider, useAppData } from '../src/state/AppData';
import AddExpenseScreen from '../src/screens/AddExpenseScreen';

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

type TestStackParamList = {
  MoneyList: undefined;
  AddExpense: undefined;
};

const Stack = createNativeStackNavigator<TestStackParamList>();

/**
 * A stand-in for the money list: it shows the first transaction and the
 * running expense total so the effect of saving is observable from the test.
 */
function MoneyListProbe({
  navigation,
}: NativeStackScreenProps<TestStackParamList, 'MoneyList'>) {
  const { transactions, totals } = useAppData();
  const first = transactions[0];
  return (
    <View>
      <Text testID="probe-visible">Money List</Text>
      <Text testID="probe-count">{String(transactions.length)}</Text>
      <Text testID="probe-first-title">{first ? first.title : ''}</Text>
      <Text testID="probe-first-category">{first ? first.category : ''}</Text>
      <Text testID="probe-first-kind">{first ? first.kind : ''}</Text>
      <Text testID="probe-expenses">{String(totals.expenses)}</Text>
      <Pressable
        testID="probe-open"
        accessibilityRole="button"
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Text>Open</Text>
      </Pressable>
    </View>
  );
}

function renderSheet() {
  return render(
    <AppDataProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MoneyList" component={MoneyListProbe} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppDataProvider>,
  );
}

describe('Add Expense sheet', () => {
  it('saves a filled expense and returns to the money list with the new entry on top', async () => {
    const view = await renderSheet();
    const expensesBefore = Number(view.getByTestId('probe-expenses').props.children);

    await fireEvent.press(view.getByTestId('probe-open'));
    expect(view.getByTestId('screen-add-expense')).toBeTruthy();

    await fireEvent.changeText(view.getByTestId('add-expense-name'), 'Team Lunch');
    await fireEvent.changeText(view.getByTestId('add-expense-amount'), '24,50');

    await fireEvent.press(view.getByTestId('add-expense-date'));
    await fireEvent.press(view.getByTestId('add-expense-date-day-15'));

    await fireEvent.press(view.getByTestId('add-expense-submit'));

    expect(view.queryByTestId('screen-add-expense')).toBeNull();
    expect(view.getByTestId('probe-visible')).toBeTruthy();

    expect(view.getByTestId('probe-first-title').props.children).toBe('Team Lunch');
    expect(view.getByTestId('probe-first-category').props.children).toBe('Other');
    expect(view.getByTestId('probe-first-kind').props.children).toBe('expense');
    expect(view.getByTestId('probe-count').props.children).toBe('11');

    const expensesAfter = Number(view.getByTestId('probe-expenses').props.children);
    expect(expensesAfter - expensesBefore).toBeCloseTo(24.5, 2);
  });

  it('starts neutral and does not flag a field the user has filled in', async () => {
    const view = await renderSheet();
    await fireEvent.press(view.getByTestId('probe-open'));

    expect(view.queryByTestId('add-expense-name-error')).toBeNull();
    expect(view.queryByTestId('add-expense-amount-error')).toBeNull();
    expect(view.queryByTestId('add-expense-date-error')).toBeNull();

    await fireEvent.changeText(view.getByTestId('add-expense-name'), 'Rent');
    await fireEvent.changeText(view.getByTestId('add-expense-amount'), '12');

    expect(view.queryByTestId('add-expense-name-error')).toBeNull();
    expect(view.queryByTestId('add-expense-amount-error')).toBeNull();
    expect(view.queryByTestId('add-expense-date-error')).toBeNull();
  });

  it('reveals the missing-field errors only after a save attempt', async () => {
    const view = await renderSheet();
    await fireEvent.press(view.getByTestId('probe-open'));

    await fireEvent.press(view.getByTestId('add-expense-submit'));

    expect(view.getByTestId('add-expense-name-error')).toBeTruthy();
    expect(view.getByTestId('add-expense-amount-error')).toBeTruthy();
    expect(view.getByTestId('add-expense-date-error')).toBeTruthy();

    // The form did not save and stayed on the sheet.
    expect(view.getByTestId('screen-add-expense')).toBeTruthy();

    // Filling a field clears only that field's error.
    await fireEvent.changeText(view.getByTestId('add-expense-name'), 'Rent');
    expect(view.queryByTestId('add-expense-name-error')).toBeNull();
    expect(view.getByTestId('add-expense-amount-error')).toBeTruthy();
    expect(view.getByTestId('add-expense-date-error')).toBeTruthy();
  });
});
