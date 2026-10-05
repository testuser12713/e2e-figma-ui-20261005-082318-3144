import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MoneyScreen from '../screens/MoneyScreen';
import MoneyReportScreen from '../screens/MoneyReportScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import { MoneyStackParamList } from './types';

const Stack = createNativeStackNavigator<MoneyStackParamList>();

/** Money tab: list → weekly report / add expense as stacked states. */
export function MoneyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoneyList" component={MoneyScreen} />
      <Stack.Screen name="MoneyReport" component={MoneyReportScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
    </Stack.Navigator>
  );
}

export default MoneyStack;
